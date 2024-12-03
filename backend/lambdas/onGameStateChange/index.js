import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi'
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'

const { CONNECTIONS_TABLE_NAME, API_ENDPOINT } = process.env

const apiClient = new ApiGatewayManagementApiClient({ endpoint: API_ENDPOINT })
const ddbClient = new DynamoDBClient()

const getPlayersState = async (gameId) => {
  const command = new QueryCommand({
    TableName: CONNECTIONS_TABLE_NAME,
    KeyConditionExpression: '#gameId = :gameId',
    ExpressionAttributeNames: { '#gameId': 'gameId' },
    ExpressionAttributeValues: { ':gameId': { S: gameId } },
  })

  const { Items } = await ddbClient.send(command)

  const playersState = []
  let hostState = {}

  Items.forEach((item) => {
    const row = unmarshall(item)

    if (row?.host) {
      hostState = { id: row.connectionId, data: JSON.parse(row.host) }
    }

    if (row?.results) {
      hostState['results'] = JSON.parse(row.results)
    }

    const data = row?.data ? JSON.parse(row.data) : undefined
    playersState.push({ id: row.connectionId, data })
  })

  return { playersState, hostState }
}

const getGameState = (state, playersState, hostState) => {
  let gameState = 'characterSelect'
  if (hostState?.results?.positions?.length > 0 && hostState?.data?.finished) {
    gameState = 'results'
  } else if (
    playersState.every((state) => state?.data || state.id === hostState.id) &&
    hostState?.results?.positions?.length > 0
  ) {
    gameState = 'waitGame'
  } else if (state?.data || state.id === hostState.id) {
    gameState = 'waitPlayers'
  }

  let playerData = playersState.filter((state) => state?.data !== undefined)
  let position = undefined

  const positions = hostState?.results?.positions
    ? hostState?.results?.positions
    : undefined
  if (state.id === hostState.id) {
    playerData = playerData.map((player) => {
      position = positions?.indexOf(player.id)
      return { ...player.data, position }
    })
  } else if (hostState?.data?.finished) {
    position = positions?.indexOf(state.id)
  }

  const gameData = {
    numConnections: playersState.length,
    numPlayers: playerData.length,
    gameState,
    position,
    // Only for host
    players: state.id === hostState.id ? playerData : undefined,
  }

  return gameData
}

const getMsgs = (events) => {
  const msgs = []
  events?.forEach((record) => {
    console.log('STREAM: ', record.eventName, record.dynamodb)
    const newImage = record.dynamodb.NewImage
      ? unmarshall(record.dynamodb.NewImage)
      : {}
    const oldImage = record.dynamodb.OldImage
      ? unmarshall(record.dynamodb.OldImage)
      : {}

    switch (record.eventName) {
      case 'INSERT':
        break

      case 'MODIFY': {
        if (oldImage?.data === undefined && newImage?.data) {
          const data = JSON.parse(newImage?.data)
          msgs.push(`${data?.name} joined`)
        }
        break
      }

      case 'REMOVE': {
        if (oldImage?.data) {
          const data = JSON.parse(oldImage?.data)
          msgs.push(`${data?.name} left`)
        }
        break
      }
    }
  })

  return msgs
}

export const handler = async (event) => {
  const gameId = 'testing'
  const { playersState, hostState } = await getPlayersState(gameId)
  const msgs = getMsgs(event?.Records)

  const promises = playersState.map(async (state) => {
    const gameData = getGameState(state, playersState, hostState)
    const data = JSON.stringify({ ...gameData, msgs })
    const requestParams = {
      ConnectionId: state.id,
      Data: data,
    }
    const command = new PostToConnectionCommand(requestParams)
    await apiClient.send(command)

    console.log('ConnectionId: ', state.id)
    console.log('Data: ', data)
  })

  await Promise.all(promises)

  return {
    statusCode: 200,
  }
}
