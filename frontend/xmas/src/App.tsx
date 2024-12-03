import { useEffect, useState, useCallback } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import toast, { Toaster } from 'react-hot-toast'
import { Application as PixiApplication } from '@pixi/app'
import { Stage } from '@pixi/react'
import AssetContextProvider from './Context/AssetContext'
import Annoucements from './Containers/Annoucements'
import Background from './Containers/Background'
import Players from './Containers/Players'
import Hud from './Components/Hud'

export enum GameState {
  CharacterSelect = 'characterSelect',
  WaitPlayers = 'waitPlayers',
  WaitGame = 'waitGame',
  Results = 'results',
}

export interface HostData {
  ready?: boolean
  started?: boolean
  finished?: boolean
}

export interface PlayerData {
  name: string
  character: number
  position?: number
}

interface GameData {
  numConnections: number
  gameState: GameState
  players: PlayerData[]
}

const SOCKET_URL = 'wss://z9ssnwmz69.execute-api.eu-west-2.amazonaws.com/dev'

const App = () => {
  const [app, setApp] = useState<PixiApplication>()
  const [animate, setAnimate] = useState<boolean>(false)
  const [socketUrl, setSocketUrl] = useState<string>('')
  const [gameData, setGameData] = useState<GameData>({
    numConnections: 0,
    gameState: GameState.CharacterSelect,
    players: [],
  })

  const onReceiveMessage = useCallback((event: any) => {
    const gameData = JSON.parse(event.data)
    console.log('onReceiveMessage: ', gameData)
    setGameData(gameData)
    gameData.msgs.forEach((msg: string) => {
      toast.success(msg)
    })
  }, [])

  const sendMessage = useCallback((hostData: HostData) => {
    console.log('onHostSendMessage: ', hostData)
    sendJsonMessage({ action: 'sendHostMessage', host: hostData })
  }, [])

  const onConnect = useCallback(() => {
    setSocketUrl(SOCKET_URL)
  }, [])

  const onStart = useCallback(() => {
    sendMessage({ started: true })
  }, [])

  const onFinish = useCallback(() => {
    sendMessage({ finished: true })
    setAnimate(false)
  }, [])

  const { sendJsonMessage, readyState } = useWebSocket(socketUrl, {
    onMessage: onReceiveMessage,
  })

  useEffect(() => {
    if (!app) return

    const setup = async () => {
      //@ts-expect-error dev tools
      window.__PIXI_APP__ = app
    }

    setup()
  }, [app])

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      sendMessage({ ready: true })
    }
  }, [readyState])

  return (
    <>
      <Stage
        width={1280}
        height={600}
        onMount={(app: PixiApplication) => setApp(app)}
      >
        <AssetContextProvider>
          <Background
            gameState={gameData.gameState}
            raceDuration={animate ? 60 * 20 : undefined}
            onFinish={onFinish}
          />
          <Players
            gameState={gameData.gameState}
            animate={animate}
            players={gameData?.players ?? []}
          />
          <Annoucements
            gameState={gameData.gameState}
            players={gameData?.players ?? []}
            onStart={() => setAnimate(true)}
          />
        </AssetContextProvider>
      </Stage>
      <Hud
        numConnections={gameData?.numConnections}
        numPlayers={gameData?.players?.length}
        gameState={gameData.gameState}
        onConnect={onConnect}
        onStart={onStart}
      />
      <Toaster position="bottom-center" reverseOrder={false} />
    </>
  )
}

export default App
