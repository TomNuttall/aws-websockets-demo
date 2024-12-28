import { useState, useCallback } from 'react'
import Annoucements from './containers/Annoucements'
import Background from './containers/Background'
import PixiApp from './containers/PixiApp'
import Players from './containers/Players'
import Hud from './components/Hud'
import Toast from './components/Toast'
import JoinLink from './components/JoinLink'
import useGameState, { GameState } from './hooks/useGameState'

const App = () => {
  const [animate, setAnimate] = useState<boolean>(false)
  const { gameData, sendMessage, onConnect } = useGameState()

  const onStart = useCallback(() => {
    sendMessage({ started: true })
  }, [])

  const onFinish = useCallback(() => {
    sendMessage({ finished: true })
    setAnimate(false)
  }, [])

  return (
    <>
      <PixiApp width={1280} height={600}>
        <Background
          gameState={gameData.gameState}
          raceDuration={animate ? 60 * 20 : undefined}
          onFinish={onFinish}
        />
        <Players
          gameState={gameData.gameState}
          raceDuration={animate ? 60 * 20 : undefined}
          players={gameData?.players ?? []}
        />
        <Annoucements
          gameState={gameData.gameState}
          players={gameData?.players ?? []}
          onStart={() => setAnimate(true)}
        />
      </PixiApp>
      {[GameState.CharacterSelect, GameState.WaitPlayers].includes(
        gameData.gameState,
      ) && <JoinLink url="https://tomnuttall.dev/projects/game" id="testing" />}
      <Hud
        numConnections={gameData.numConnections}
        numPlayers={gameData.numPlayers}
        gameState={gameData.gameState}
        onConnect={onConnect}
        onStart={onStart}
      />
      <Toast msgs={gameData.msgs} />
    </>
  )
}

export default App
