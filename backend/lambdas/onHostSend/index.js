import {
  DynamoDBClient,
  UpdateItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'

const { CONNECTIONS_TABLE_NAME } = process.env
const ddbClient = new DynamoDBClient()

const getGameResults = async (gameId, hostId) => {
  const command = new QueryCommand({
    TableName: CONNECTIONS_TABLE_NAME,
    KeyConditionExpression: '#gameId = :gameId',
    ExpressionAttributeNames: { '#gameId': 'gameId' },
    ExpressionAttributeValues: { ':gameId': { S: gameId } },
  })

  const { Items } = await ddbClient.send(command)

  const players = []

  Items.forEach((item) => {
    const row = unmarshall(item)

    if (hostId !== row.connectionId) {
      players.push(row.connectionId)
    }
  })

  const results = players
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
  return results
}

const handler = async (event) => {
  const connectionId = event.requestContext.connectionId
  const gameId = 'testing'

  const { host } = JSON.parse(event.body)

  const positions = host?.started
    ? await getGameResults(gameId, connectionId)
    : []
  console.log('GAME RESULTS: ', positions)

  const data = host?.started ? { positions } : host
  const command = new UpdateItemCommand({
    TableName: CONNECTIONS_TABLE_NAME,
    Key: {
      gameId: { S: gameId },
      connectionId: { S: connectionId },
    },
    UpdateExpression: 'SET #attrName = :attrValue',
    ExpressionAttributeNames: {
      '#attrName': host?.started ? 'positions' : 'host',
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
