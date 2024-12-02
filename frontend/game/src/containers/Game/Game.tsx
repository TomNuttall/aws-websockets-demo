import { useEffect, useState, ReactNode } from 'react'
import { Application as PixiApplication } from '@pixi/app'
import { Stage } from '@pixi/react'
import AssetContextProvider from '../../context/AssetContext'
import './Game.scss'

interface GameProps {
  children: ReactNode
}

const Game: React.FC<GameProps> = ({ children }) => {
  const [app, setApp] = useState<PixiApplication>()

  useEffect(() => {
    if (!app) return

    const setup = async () => {
      //@ts-expect-error dev tools
      window.__PIXI_APP__ = app
    }

    setup()
  }, [app])

  return (
    <div className="game">
      <Stage
        width={200}
        height={200}
        onMount={(app: PixiApplication) => setApp(app)}
        options={{ background: 0xffffff, backgroundAlpha: 0 }}
      >
        <AssetContextProvider>{children}</AssetContextProvider>
      </Stage>
    </div>
  )
}

export default Game
