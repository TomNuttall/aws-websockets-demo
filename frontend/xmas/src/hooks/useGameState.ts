import { useCallback, useEffect, useState } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { HostData, GameData } from '../types'

const SOCKET_URL = 'wss://z9ssnwmz69.execute-api.eu-west-2.amazonaws.com/dev'

export enum GameState {
  CharacterSelect = 'characterSelect',
  WaitPlayers = 'waitPlayers',
  WaitGame = 'waitGame',
  Results = 'results',
}

const useGameState = () => {
  const [socketUrl, setSocketUrl] = useState<string>('')
  const [gameData, setGameData] = useState<GameData>({
    numConnections: 0,
    numPlayers: 0,
    gameState: GameState.CharacterSelect,
    players: [],
    msgs: [],
  })

  const onReceiveMessage = useCallback((event: any) => {
    const gameData = JSON.parse(event.data)
    setGameData(gameData)
  }, [])

  const sendMessage = useCallback((hostData: HostData) => {
    sendJsonMessage({ action: 'sendHostMessage', host: hostData })
  }, [])

  const { sendJsonMessage, readyState } = useWebSocket(socketUrl, {
    onMessage: onReceiveMessage,
  })

  const onConnect = useCallback(() => {
    setSocketUrl(SOCKET_URL)
  }, [])

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      sendMessage({ ready: true })
    }
  }, [readyState])

  return { gameData, sendMessage, onConnect }
}

export default useGameState
