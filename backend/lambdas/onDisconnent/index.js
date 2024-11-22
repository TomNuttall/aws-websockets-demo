import { DynamoDBClient, DeleteItemCommand } from '@aws-sdk/client-dynamodb'

const { TABLE_NAME } = process.env
const ddbClient = new DynamoDBClient()

const handler = async (event) => {
  const connectionId = event.requestContext.connectionId
  const command = new DeleteItemCommand({
    TableName: TABLE_NAME,
    Key: {
      gameId: { S: 'test-game' },
      connectionId: { S: connectionId },
    },
  })
  await ddbClient.send(command)
  console.log('Disconnected: ', connectionId)

  return {
    statusCode: 200,
  }
}

export { handler }
