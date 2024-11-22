import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'

const { TABLE_NAME } = process.env
const ddbClient = new DynamoDBClient()

const handler = async (event) => {
  const connectionId = event.requestContext.connectionId
  const command = new PutItemCommand({
    TableName: TABLE_NAME,
    Item: {
      gameId: { S: 'test-game' },
      connectionId: { S: connectionId },
    },
  })
  await ddbClient.send(command)
  console.log('Connected: ', connectionId)

  return { statusCode: 200 }
}

export { handler }
