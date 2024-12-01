import { useEffect, useState } from 'react'
import useWebSocket /*, { ReadyState } */ from 'react-use-websocket'
import { Application as PixiApplication } from '@pixi/app'
import { Stage } from '@pixi/react'
import AssetContextProvider from './Context/AssetContext'
import Background from './Components/Background'
import Hud from './Components/Hud'
import Intro from './Containers/Intro'
import WaitPlayers from './Containers/WaitPlayers'

enum GameState {
  CharacterSelect = 'characterSelect',
  WaitPlayers = 'waitPlayers',
  WaitGame = 'waitGame',
  Results = 'waitResults',
}

export interface HostData {
  event: string
}

export interface PlayerData {
  name?: string
  character: number
}

interface GameData {
  numPlayers: number
  gameState: GameState
  players: PlayerData[]
}

const SOCKET_URL = 'wss://7mmhehm6rl.execute-api.eu-west-2.amazonaws.com/dev'

function App() {
  const [app, setApp] = useState<PixiApplication>()
  const [animate, setAnimate] = useState<boolean>(false)
  const [socketUrl, setSocketUrl] = useState<string>('')
  const [gameData, setGameData] = useState<GameData>({
    numPlayers: 0,
    gameState: GameState.CharacterSelect,
    players: [],
  })

  useEffect(() => {
    if (!app) return

    const setup = async () => {
      //@ts-expect-error dev tools
      window.__PIXI_APP__ = app
    }

    setup()
  }, [app])

  const onReceiveMessage = (event: any) => {
    const gameData = JSON.parse(event.data)
    console.log('onReceiveMessage: ', gameData)
    setGameData(gameData)
  }

  const sendMessage = (hostData: HostData) => {
    console.log('onSendMessage: ', hostData)
    sendJsonMessage({ action: 'sendHostMessage', data: hostData })
  }

  const { sendJsonMessage /*, readyState*/ } = useWebSocket(socketUrl, {
    onMessage: onReceiveMessage,
  })

  const onStart = () => {
    //sendMessage({ event: 'startRace' })
    console.log('START: ')
    setAnimate(true)
  }

  const renderGameState = (state: GameState) => {
    console.log('STATE: ', state)
    switch (state) {
      case GameState.CharacterSelect:
        return <Intro connect={() => setSocketUrl(SOCKET_URL)} />

      case GameState.WaitPlayers:
      case GameState.WaitGame:
        return <WaitPlayers players={gameData.players} />

      // case GameState.WaitGame:
      //   return <></>

      case GameState.Results:
        return <></>
    }
  }

  return (
    <Stage
      width={1280}
      height={600}
      onMount={(app: PixiApplication) => setApp(app)}
    >
      <AssetContextProvider>
        <Background raceDuration={animate ? 60 * 60 : 0} onStart={onStart} />
        {renderGameState(gameData.gameState)}
        <Hud
          numConnections={gameData.numPlayers}
          numPlayers={gameData.players.filter((player) => player?.name).length}
        />
      </AssetContextProvider>
    </Stage>
  )
}

export default App
