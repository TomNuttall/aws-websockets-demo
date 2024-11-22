import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'

export class StorageStack extends cdk.Stack {
  public readonly connectionsTable

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props)

    this.connectionsTable = new dynamodb.TableV2(this, 'ddbConnectionsTable', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      tableName: 'connections-table',
      partitionKey: {
        name: 'gameId',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'connectionId',
        type: dynamodb.AttributeType.STRING,
      },
      billing: dynamodb.Billing.onDemand(),
      tableClass: dynamodb.TableClass.STANDARD,
      dynamoStream: dynamodb.StreamViewType.KEYS_ONLY,
    })
  }
}
