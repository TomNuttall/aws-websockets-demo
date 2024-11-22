import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'

const { TABLE_NAME } = process.env
const ddbClient = new DynamoDBClient()

const handler = async (event) => {
  const connectionId = event.requestContext.connectionId
  const { data } = JSON.parse(event.body)
  console.log('SEND: ', data)

  const command = new PutItemCommand({
    TableName: TABLE_NAME,
    Item: {
      gameId: { S: 'test-game' },
      connectionId: { S: connectionId },
      data: { S: JSON.stringify(data) },
    },
  })

  await ddbClient.send(command)

  return {
    statusCode: 200,
  }
}

export { handler }
