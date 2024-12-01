import { DynamoDBClient, DeleteItemCommand } from '@aws-sdk/client-dynamodb'

const { CONNECTIONS_TABLE_NAME } = process.env
const ddbClient = new DynamoDBClient()

const handler = async (event) => {
  const connectionId = event.requestContext.connectionId
  const gameId = 'testing'

  const command = new DeleteItemCommand({
    TableName: CONNECTIONS_TABLE_NAME,
    Key: {
      gameId: { S: gameId },
      connectionId: { S: connectionId },
    },
  })
  await ddbClient.send(command)
  console.log('Disconnected: ', connectionId, gameId)

  return {
    statusCode: 200,
  }
}

export { handler }
