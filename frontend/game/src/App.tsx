import React, { useState } from 'react'
import useGameState from './hooks/useGameState'
import PixiApp from './containers/PixiApp'
import CharacterSelect from './containers/CharacterSelect'
import Character from './components/Character'
import Header from './components/Header'
import Toast from './components/Toast'
import WaitPanel from './components/WaitPanel'
import { formatOrdinals } from './utils/helper'
import { CharacterSelectData } from './types'
import { GameState } from './hooks/useGameState'

import './App.scss'

const App: React.FC = () => {
  const [player, setPlayer] = useState<CharacterSelectData>({
    name: '',
    character: 1,
  })
  const { gameData, sendMessage } = useGameState()

  const renderGameState = (state: GameState) => {
    switch (state) {
      case GameState.CharacterSelect:
      default:
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
      {gameData && (
        <>
          <Toast msgs={gameData.msgs} />
          <div className="app__pixi">
            <PixiApp width={200} height={200}>
              <Character width={200} height={200} player={player} />
            </PixiApp>
          </div>
          <div className="app__main">{renderGameState(gameData.gameState)}</div>
        </>
      )}
    </div>
  )
}

export default App
