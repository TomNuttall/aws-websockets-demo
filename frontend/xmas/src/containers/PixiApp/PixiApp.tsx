import { useEffect, useState, ReactNode } from 'react'
import { Application as PixiApplication } from '@pixi/app'
import { Stage } from '@pixi/react'
import AssetContextProvider from '../../context/AssetContext'

interface PixiAppProps {
  width: number
  height: number
  children: ReactNode
}

const PixiApp: React.FC<PixiAppProps> = ({ width, height, children }) => {
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
    <Stage
      width={width}
      height={height}
      onMount={(app: PixiApplication) => setApp(app)}
    >
      <AssetContextProvider>{children}</AssetContextProvider>
    </Stage>
  )
}

export default PixiApp
