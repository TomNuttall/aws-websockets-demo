import { Application } from '@pixi/react'
import AssetContextProvider from '../../context/AssetContext'

interface PixiAppProps {
  width: number
  height: number
  children: React.ReactNode
}

const PixiApp: React.FC<PixiAppProps> = ({ width, height, children }) => {
  return (
    <Application
      background={0xffffff}
      backgroundAlpha={0}
      width={width}
      height={height}
    >
      <AssetContextProvider>{children}</AssetContextProvider>
    </Application>
  )
}

export default PixiApp
