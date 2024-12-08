import { useState, useCallback } from 'react'
import Annoucements from './Containers/Annoucements'
import Background from './Containers/Background'
import PixiApp from './Containers/PixiApp'
import Players from './Containers/Players'
import Hud from './Components/Hud'
import Toast from './Components/Toast'
import useGameState from './hooks/useGameState'

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
