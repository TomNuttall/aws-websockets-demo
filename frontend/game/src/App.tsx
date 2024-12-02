import React, { useState } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import CharacterSelect from './containers/CharacterSelect'
import WaitPlayers from './containers/WaitPlayers'
import WaitGame from './containers/WaitGame'
import Results from './containers/Results'
import Hud from './components/Hud'
import toast from 'react-hot-toast'
import './App.css'

enum GameState {
  CharacterSelect = 'characterSelect',
  WaitPlayers = 'waitPlayers',
  WaitGame = 'waitGame',
  Results = 'waitResults',
}

export interface PlayerData {
  name?: string
  ready?: boolean
}

interface GameData {
  numConnections: number
  gameState: GameState
  players: PlayerData[]
}

const SOCKET_URL = 'wss://z9ssnwmz69.execute-api.eu-west-2.amazonaws.com/dev'

const App: React.FC = () => {
  const [gameData, setGameData] = useState<GameData>({
    numConnections: 0,
    gameState: GameState.CharacterSelect,
    players: [],
  })

  const onReceiveMessage = (event: any) => {
    console.log('onReceiveMessage: ', event)

    const gameData = JSON.parse(event.data)

    setGameData(gameData)
    gameData.msgs.forEach((msg: string) => {
      toast(msg)
    })
  }

  const sendMessage = (playerData: PlayerData) => {
    console.log('onSendMessage: ', playerData)
    sendJsonMessage({ action: 'sendMessage', data: playerData })
  }

  const { sendJsonMessage, readyState } = useWebSocket(SOCKET_URL, {
    onMessage: onReceiveMessage,
  })

  const renderGameState = (state: GameState) => {
    switch (state) {
      case GameState.CharacterSelect:
        return <CharacterSelect sendMessage={sendMessage} />

      case GameState.WaitPlayers:
        return <WaitPlayers numPlayers={gameData.players.length} />

      case GameState.WaitGame:
        return <WaitGame />

      case GameState.Results:
        return (
          <Results names={gameData.players.map((state) => state.name || '')} />
        )
    }
  }

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center">
        {readyState === ReadyState.OPEN && renderGameState(gameData.gameState)}
        <Hud
          numPlayers={gameData.players.length}
          numConnections={gameData.numConnections}
        />
      </div>
    </div>
  )
}

export default App
