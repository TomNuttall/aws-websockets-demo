import { useCallback, useState } from 'react'
import useWebSocket from 'react-use-websocket'
import type { CharacterSelectData, GameData } from '../types'

export enum GameState {
  CharacterSelect = 'characterSelect',
  WaitPlayers = 'waitPlayers',
  WaitGame = 'waitGame',
  Results = 'results',
}

const SOCKET_URL = 'wss://z9ssnwmz69.execute-api.eu-west-2.amazonaws.com/dev'

const useGameState = () => {
  const [gameData, setGameData] = useState<GameData>({
    numConnections: 0,
    numPlayers: 0,
    gameState: GameState.CharacterSelect,
    msgs: [],
  })

  const onReceiveMessage = useCallback((event: any) => {
    const gameData = JSON.parse(event.data)
    setGameData(gameData)
  }, [])

  const sendMessage = useCallback((data: CharacterSelectData) => {
    sendJsonMessage({ action: 'sendMessage', data })
  }, [])

  const { sendJsonMessage } = useWebSocket(SOCKET_URL, {
    onMessage: onReceiveMessage,
  })

  return { gameData, sendMessage }
}

export default useGameState
