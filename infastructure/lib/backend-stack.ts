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

    const code = lambda.Code.fromInline(`
      exports.handler = async function(event) {
        return {
          statusCode: 200,
        };
      };
    `)

    const onConnectHandlerLogs = new logs.LogGroup(
      this,
      'lambdaOnConnectLogGroup',
      {
        logGroupName: `/aws/lambda/santas-lambda-on-connect`,
        retention: logs.RetentionDays.TWO_WEEKS,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      },
    )

    const onConnectHandler = new lambda.Function(this, 'lambdaOnConnect', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code,
      logGroup: onConnectHandlerLogs,
    })

    const onDisconnectHandlerLogs = new logs.LogGroup(
      this,
      'lambdaOnDisconnectLogGroup',
      {
        logGroupName: `/aws/lambda/santas-lambda-on-disconnect`,
        retention: logs.RetentionDays.TWO_WEEKS,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      },
    )

    const onDisconnectHandler = new lambda.Function(
      this,
      'lambdaOnDisconnect',
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'index.handler',
        code,
        logGroup: onDisconnectHandlerLogs,
      },
    )

    const onSendHandlerLogs = new logs.LogGroup(this, 'lambdaOnSendLogGroup', {
      logGroupName: `/aws/lambda/santas-lambda-on-send`,
      retention: logs.RetentionDays.TWO_WEEKS,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    })

    const onSendHandler = new lambda.Function(this, 'lambdaOnSend', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code,
      logGroup: onSendHandlerLogs,
    })

    const onBroadcastHandlerLogs = new logs.LogGroup(
      this,
      'lambdaOnBroadcastLogGroup',
      {
        logGroupName: `/aws/lambda/santas-lambda-on-broadcast`,
        retention: logs.RetentionDays.TWO_WEEKS,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      },
    )

    const onBroadcastHandler = new lambda.Function(this, 'lambdaOnBroadcast', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code,
      logGroup: onBroadcastHandlerLogs,
    })

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
}
