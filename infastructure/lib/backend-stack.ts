import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as logs from 'aws-cdk-lib/aws-logs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as lambdaevents from 'aws-cdk-lib/aws-lambda-event-sources'
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2'
import * as apigwv2integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations'

interface BackendStackProps extends cdk.StackProps {
  repoName: string
  connectionsTable: cdk.aws_dynamodb.ITable
  hostsTable: cdk.aws_dynamodb.ITable
}

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: BackendStackProps) {
    super(scope, id, props)

    const onConnectHandler = this.createRouteLambda('onConnect', [
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['dynamodb:PutItem'],
        resources: [props.connectionsTable.tableArn],
      }),
    ])
    onConnectHandler.addEnvironment(
      'CONNECTIONS_TABLE_NAME',
      props.connectionsTable.tableName,
    )

    const onDisconnectHandler = this.createRouteLambda('onDisconnect', [
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['dynamodb:DeleteItem'],
        resources: [props.connectionsTable.tableArn],
      }),
    ])
    onDisconnectHandler.addEnvironment(
      'CONNECTIONS_TABLE_NAME',
      props.connectionsTable.tableName,
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

    const onSendHandler = this.createRouteLambda('onSend', [
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['dynamodb:PutItem'],
        resources: [props.connectionsTable.tableArn],
      }),
    ])
    onSendHandler.addEnvironment(
      'CONNECTIONS_TABLE_NAME',
      props.connectionsTable.tableName,
    )
    webSocketApi.addRoute('sendMessage', {
      integration: new apigwv2integrations.WebSocketLambdaIntegration(
        'SendMessageIntegration',
        onSendHandler,
      ),
    })

    const onHostSendHandler = this.createRouteLambda('onHostSend', [
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['dynamodb:PutItem'],
        resources: [props.connectionsTable.tableArn],
      }),
    ])
    onHostSendHandler.addEnvironment(
      'CONNECTIONS_TABLE_NAME',
      props.connectionsTable.tableName,
    )
    webSocketApi.addRoute('sendHostMessage', {
      integration: new apigwv2integrations.WebSocketLambdaIntegration(
        'SendHostMessageIntegration',
        onHostSendHandler,
      ),
    })

    const onGameStateChangeHandler = this.createRouteLambda(
      'onGameStateChange',
      [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            'dynamodb:GetRecords',
            'dynamodb:GetShardIterator',
            'dynamodb:DescribeStream',
            'dynamodb:ListStreams',
            'dynamodb:Query',
          ],
          resources: [props.connectionsTable.tableArn],
        }),
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['execute-api:Invoke', 'execute-api:ManageConnections'],
          resources: [webSocketApi.arnForExecuteApi()],
        }),
      ],
    )

    onGameStateChangeHandler.addEventSource(
      new lambdaevents.DynamoEventSource(props.connectionsTable, {
        startingPosition: lambda.StartingPosition.LATEST,
        batchSize: 5,
        enabled: true,
        retryAttempts: 3,
      }),
    )
    onGameStateChangeHandler.addEnvironment(
      'API_ENDPOINT',
      webSocketApi.apiEndpoint,
    )
    onGameStateChangeHandler.addEnvironment(
      'CONNECTIONS_TABLE_NAME',
      props.connectionsTable.tableName,
    )

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
          onHostSendHandler.functionArn,
          onGameStateChangeHandler.functionArn,
        ],
      }),
    )
  }

  private createRouteLambda(
    lambdaName: string,
    permissionsPolicies: iam.PolicyStatement[],
  ): cdk.aws_lambda.Function {
    const code = lambda.Code.fromInline(`
      exports.handler = async function(event) {
        return {
          statusCode: 200,
        };
      };
    `)

    const logGroup = new logs.LogGroup(this, `lambda${lambdaName}LogGroup`, {
      logGroupName: `/aws/lambda/santas-lambda-${lambdaName}`,
      retention: logs.RetentionDays.TWO_WEEKS,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    })

    const role = new iam.Role(this, `roleLambda${lambdaName}`, {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    })
    permissionsPolicies.forEach((policy) => role.addToPolicy(policy))

    role.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'logs:CreateLogGroup',
          'logs:CreateLogStream',
          'logs:PutLogEvents',
        ],
        resources: [logGroup.logGroupArn],
      }),
    )

    return new lambda.Function(this, lambdaName, {
      functionName: `santas-lambda-${lambdaName}`,
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code,
      logGroup,
      role,
    })
  }
}
