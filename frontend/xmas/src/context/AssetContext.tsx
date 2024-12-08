import { useState, useEffect, createContext, ReactNode } from 'react'
import { Assets, Texture } from 'pixi.js'
import { manifest } from '../assets/manifest'

export interface AssetContextProps {
  assetsLoaded: boolean
  textures: Record<string, Texture>
}

export const AssetContext = createContext<AssetContextProps>({
  assetsLoaded: false,
  textures: {},
})

interface UserContextProviderProps {
  children: ReactNode
}

const AssetContextProvider: React.FC<UserContextProviderProps> = ({
  children,
}) => {
  const [textures, setTextures] = useState<Record<string, Texture>>({})
  const [assetsLoaded, setAssetsLoaded] = useState<boolean>(false)

  useEffect(() => {
    const loadAssets = async () => {
      await Assets.init({ manifest: manifest })
      const sceneAssets = await Assets.loadBundle('gameScene')

      setTextures((textures) => {
        for (let key in sceneAssets) {
          for (let textureKey in sceneAssets[key]?.textures) {
            textures[textureKey] = sceneAssets[key]?.textures[textureKey]
          }
        }
        return textures
      })
      setAssetsLoaded(true)
    }

    loadAssets()
  }, [])

  return (
    <AssetContext.Provider value={{ textures, assetsLoaded }}>
      {children}
    </AssetContext.Provider>
  )
}

export default AssetContextProvider
