import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi'
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'

const callbackUrl = `https://7mmhehm6rl.execute-api.eu-west-2.amazonaws.com/dev/`
const apiClient = new ApiGatewayManagementApiClient({ endpoint: callbackUrl })
const ddbClient = new DynamoDBClient()

const getPlayersState = async (gameId) => {
  const command = new QueryCommand({
    TableName: 'connections-table',
    KeyConditionExpression: '#gameId = :gameId',
    ExpressionAttributeNames: { '#gameId': 'gameId' },
    ExpressionAttributeValues: { ':gameId': { S: gameId } },
  })

  const { Items } = await ddbClient.send(command)
  return Items.map((item) => {
    const row = unmarshall(item)

    const data = row?.data ? JSON.parse(row.data) : {}
    return { id: row.connectionId, data }
  })
}

const getGameState = (state, playersState) => {
  let gameState = 'characterSelect'
  if (playersState.every((state) => state?.data?.finished)) {
    gameState = 'results'
  } else if (playersState.every((state) => state?.data?.ready)) {
    gameState = 'waitGame'
  } else if (state?.data?.ready) {
    gameState = 'waitPlayers'
  }

  const gameData = {
    numPlayers: playersState.length,
    gameState,
    players: playersState.map((state) => state?.data),
  }

  return JSON.stringify(gameData)
}

export const handler = async (event) => {
  const gameId = 'testing'
  const playersState = await getPlayersState(gameId)

  const promises = playersState.map(async (state) => {
    const data = getGameState(state, playersState)

    const requestParams = {
      ConnectionId: state.id,
      Data: data,
    }
    const command = new PostToConnectionCommand(requestParams)
    await apiClient.send(command)
  })

  await Promise.all(promises)

  return {
    statusCode: 200,
  }
}
