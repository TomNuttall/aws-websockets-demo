import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'

const { CONNECTIONS_TABLE_NAME } = process.env
const ddbClient = new DynamoDBClient()

const handler = async (event) => {
  const connectionId = event.requestContext.connectionId
  const gameId = 'testing'

  const { host } = JSON.parse(event.body)
  const command = new PutItemCommand({
    TableName: CONNECTIONS_TABLE_NAME,
    Item: {
      gameId: { S: gameId },
      connectionId: { S: connectionId },
      host: { S: JSON.stringify(host) },
    },
  })

  await ddbClient.send(command)
  console.log('Sent: ', connectionId, gameId)
  console.log('Data: ', host)

  return {
    statusCode: 200,
  }
}

export { handler }
