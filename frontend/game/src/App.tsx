import { useState } from 'react'
import useGameState from './hooks/useGameState'
import PixiApp from './containers/PixiApp'
import CharacterSelect from './containers/CharacterSelect'
import GameMessage from './containers/GameMessage'
import Character from './components/Character'
import Header from './components/Header'
import Toast from './components/Toast'
import { CharacterSelectData } from './types'
import { GameState } from './hooks/useGameState'

import './App.scss'

const App: React.FC = () => {
  const [player, setPlayer] = useState<CharacterSelectData>({
    name: '',
    character: 1,
  })
  const { gameData, sendMessage } = useGameState()

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
            <h2>
              {player.name && player?.name?.length > 0 ? player.name : '-'}
            </h2>
          </div>
          <div className="app__main">
            {gameData.gameState === GameState.CharacterSelect ? (
              <CharacterSelect
                sendMessage={sendMessage}
                updatePlayer={setPlayer}
              />
            ) : (
              <GameMessage
                gameState={gameData.gameState}
                position={gameData?.position ?? 0}
              />
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default App
