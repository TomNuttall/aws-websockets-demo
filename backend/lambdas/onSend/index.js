import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb'

const { CONNECTIONS_TABLE_NAME } = process.env
const ddbClient = new DynamoDBClient()

const handler = async (event) => {
  const connectionId = event.requestContext.connectionId
  const gameId = 'testing'

  const { data } = JSON.parse(event.body)
  const command = new UpdateItemCommand({
    TableName: CONNECTIONS_TABLE_NAME,
    Key: {
      gameId: { S: gameId },
      connectionId: { S: connectionId },
    },
    UpdateExpression: 'SET #attrName = :attrValue',
    ExpressionAttributeNames: {
      '#attrName': 'data',
    },
    ExpressionAttributeValues: {
      ':attrValue': { S: JSON.stringify(data) },
    },
  })

  await ddbClient.send(command)
  console.log('Sent: ', connectionId, gameId)
  console.log('Data: ', data)

  return {
    statusCode: 200,
  }
}

export { handler }
