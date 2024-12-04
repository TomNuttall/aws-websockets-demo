import React, { useState } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import toast, { Toaster } from 'react-hot-toast'
import Game from './containers/Game'
import CharacterSelect from './containers/CharacterSelect'
import Character from './components/Character'
import Header from './components/Header'
import WaitPanel from './components/WaitPanel'
import { formatOrdinals } from './utils/helper'

import './App.scss'

enum GameState {
  CharacterSelect = 'characterSelect',
  WaitPlayers = 'waitPlayers',
  WaitGame = 'waitGame',
  Results = 'results',
}

export interface PlayerData {
  name?: string
  character?: number
  tint?: string
}

interface GameData {
  numConnections: number
  numPlayers: number
  gameState: GameState
  position?: number
}

const SOCKET_URL = 'wss://z9ssnwmz69.execute-api.eu-west-2.amazonaws.com/dev'

const App: React.FC = () => {
  const [player, setPlayer] = useState<PlayerData>({ name: '', character: 1 })
  const [gameData, setGameData] = useState<GameData>({
    numConnections: 0,
    numPlayers: 0,
    gameState: GameState.CharacterSelect,
  })

  const onReceiveMessage = (event: any) => {
    console.log('onReceiveMessage: ', event)

    const gameData = JSON.parse(event.data)

    setGameData(gameData)
    gameData.msgs.forEach((msg: string) => {
      toast.success(msg)
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
        return (
          <CharacterSelect sendMessage={sendMessage} updatePlayer={setPlayer} />
        )

      case GameState.WaitPlayers:
        return <WaitPanel msg={'Waiting for Players'} />

      case GameState.WaitGame:
        return <WaitPanel msg={'Game in Progress'} />

      case GameState.Results:
        return (
          <WaitPanel
            msg={`You finished ${formatOrdinals(
              (gameData?.position ?? 0) + 1,
            )}`}
          />
        )
    }
  }

  return (
    <div className="app">
      <Header
        title="Santa Shuffle"
        repo="https://github.com/TomNuttall/santa-shuffle"
      />
      <Toaster reverseOrder={false} />

      {readyState === ReadyState.OPEN && (
        <>
          <Game>
            <Character width={200} height={200} player={player} />
          </Game>
          <div className="app__main">{renderGameState(gameData.gameState)}</div>
        </>
      )}
    </div>
  )
}

export default App
