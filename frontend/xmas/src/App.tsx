import { useEffect, useState, useCallback } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
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
  ready?: boolean
  started?: boolean
  finished?: boolean
}

export interface PlayerData {
  name?: string
  character: number
}

interface GameData {
  numConnections: number
  gameState: GameState
  players: PlayerData[]
}

const SOCKET_URL = 'wss://z9ssnwmz69.execute-api.eu-west-2.amazonaws.com/dev'

function App() {
  const [app, setApp] = useState<PixiApplication>()
  const [animate, setAnimate] = useState<boolean>(false)
  const [socketUrl, setSocketUrl] = useState<string>('')
  const [gameData, setGameData] = useState<GameData>({
    numConnections: 0,
    gameState: GameState.CharacterSelect,
    players: [],
  })
  const [_msgHistory, setMsgHistory] = useState<string[]>([])

  const onReceiveMessage = useCallback((event: any) => {
    const gameData = JSON.parse(event.data)
    console.log('onReceiveMessage: ', gameData)
    setGameData(gameData)
    setMsgHistory((prevState: string[]) => {
      prevState.push(gameData.msgs)
      return prevState
    })

    if (!animate && gameData.gameState === GameState.WaitGame) {
      setAnimate(true)
      setTimeout(() => {
        sendMessage({ finished: true })
      }, 5000)
    }
  }, [])

  const sendMessage = useCallback((hostData: HostData) => {
    console.log('onHostSendMessage: ', hostData)
    sendJsonMessage({ action: 'sendHostMessage', data: hostData })
  }, [])

  const onStart = useCallback(() => {
    sendMessage({ started: true })
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
    <Stage
      width={1280}
      height={600}
      onMount={(app: PixiApplication) => setApp(app)}
    >
      <AssetContextProvider>
        <Background raceDuration={animate ? 60 * 60 : 0} onStart={onStart} />
        {socketUrl.length === 0 && (
          <Intro connect={() => setSocketUrl(SOCKET_URL)} />
        )}
        {readyState === ReadyState.OPEN && (
          <>
            <WaitPlayers players={gameData?.players ?? []} />
            <Hud
              numConnections={gameData?.numConnections}
              numPlayers={gameData?.players?.length}
            />
          </>
        )}
      </AssetContextProvider>
    </Stage>
  )
}

export default App
