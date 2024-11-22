import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi'
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'

const { API_ENDPOINT, TABLE_NAME } = process.env
const apiClient = new ApiGatewayManagementApiClient({ endpoint: API_ENDPOINT })
const ddbClient = new DynamoDBClient()

const getPlayerState = async () => {
  const command = new ScanCommand({
    TableName: TABLE_NAME,
  })

  const { Items } = await ddbClient.send(command)
  return Items.map((item) => unmarshall(item))
}

export const handler = async (event) => {
  const changedIds = event.Records.map((event) => {
    const item = unmarshall(event.dynamodb.Keys)
    return item.connectionId
  })

  const playerState = await getPlayerState()
  const ids = playerState.map((state) => state.connectionId)
  console.log('Changed ids: ', changedIds)
  const changedItems = playerState
    .filter((state) => changedIds.includes(state.connectionId))
    .map((state) => {
      const item = JSON.parse(state.data)
      return item?.name
    })

  const msg = {
    numPlayers: ids.length,
    change: `Players ${changedItems.join(' ')}`,
  }

  const promises = ids.map(async (id) => {
    const requestParams = {
      ConnectionId: id,
      Data: JSON.stringify(msg),
    }
    const command = new PostToConnectionCommand(requestParams)
    await apiClient.send(command)
  })

  await Promise.all(promises)

  return {
    statusCode: 200,
  }
}
