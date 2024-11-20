import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as logs from 'aws-cdk-lib/aws-logs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2'
import * as apigwv2integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations'

interface BackendStackProps extends cdk.StackProps {
  repoName: string
}

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: BackendStackProps) {
    super(scope, id, props)

    const onConnectHandler = this.createRouteLambda(
      'lambdaOnConnectLogGroup',
      'santas-lambda-on-connect',
      'lambdaOnConnect',
    )

    const onDisconnectHandler = this.createRouteLambda(
      'lambdaOnDisconnectLogGroup',
      'santas-lambda-on-disconnect',
      'lambdaOnDisconnect',
    )

    const onSendHandler = this.createRouteLambda(
      'lambdaOnSendLogGroup',
      'santas-lambda-on-send',
      'lambdaOnSend',
    )

    const onBroadcastHandler = this.createRouteLambda(
      'lambdaOnBroadcastLogGroup',
      'santas-lambda-on-broadcast',
      'lambdaOnBroadcast',
    )

    const webSocketApi = new apigwv2.WebSocketApi(
      this,
      'demo-santas-websocket-api',
      {
        connectRouteOptions: {
          integration: new apigwv2integrations.WebSocketLambdaIntegration(
            'OnConnectIntegration',
            onConnectHandler,
          ),
        },
        disconnectRouteOptions: {
          integration: new apigwv2integrations.WebSocketLambdaIntegration(
            'OnDisconnectIntegration',
            onDisconnectHandler,
          ),
        },
      },
    )

    new apigwv2.WebSocketStage(this, 'DevStage', {
      webSocketApi,
      stageName: 'dev',
      autoDeploy: true,
    })
    webSocketApi.addRoute('sendMessage', {
      integration: new apigwv2integrations.WebSocketLambdaIntegration(
        'SendMessageIntegration',
        onSendHandler,
      ),
    })

    const githubRole = new iam.Role(this, 'roleGithub', {
      assumedBy: new iam.FederatedPrincipal(
        `arn:aws:iam::${props.env?.account}:oidc-provider/token.actions.githubusercontent.com`,
        {
          StringEquals: {
            'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
          },
          StringLike: {
            'token.actions.githubusercontent.com:sub': `repo:${props.repoName}:*`,
          },
        },
        'sts:AssumeRoleWithWebIdentity',
      ),
      description: 'Role assumed by GitHub Actions to deploy backend lanbdas',
    })

    githubRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['lambda:UpdateFunctionCode'],
        resources: [
          onConnectHandler.functionArn,
          onDisconnectHandler.functionArn,
          onSendHandler.functionArn,
          onBroadcastHandler.functionArn,
        ],
      }),
    )
  }

  private createRouteLambda(
    logGroupName: string,
    logGroupPath: string,
    lambdaName: string,
  ): cdk.aws_lambda.Function {
    const code = lambda.Code.fromInline(`
      exports.handler = async function(event) {
        return {
          statusCode: 200,
        };
      };
    `)

    const onBroadcastHandlerLogs = new logs.LogGroup(this, logGroupName, {
      logGroupName: `/aws/lambda/${logGroupPath}`,
      retention: logs.RetentionDays.TWO_WEEKS,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    })

    return new lambda.Function(this, lambdaName, {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code,
      logGroup: onBroadcastHandlerLogs,
    })
  }
}
