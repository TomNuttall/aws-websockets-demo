import { useContext } from 'react'
import { Container, Sprite } from '@pixi/react'
import { AssetContext } from '../../context/AssetContext'
import { TEXTURE_LOOKUP } from '../../defs'
import type { CharacterSelectData } from '../../types'

interface PlayerProps {
  width: number
  height: number
  player: CharacterSelectData
}

const Character: React.FC<PlayerProps> = ({ width, height, player }) => {
  const { textures, assetsLoaded } = useContext(AssetContext)
  const textureName = TEXTURE_LOOKUP[`character-${player?.character ?? '1'}`]

  return (
    <Container width={width} height={width}>
      {assetsLoaded && (
        <Sprite
          width={height}
          height={height}
          texture={textures[textureName]}
          tint={player?.tint}
        />
      )}
    </Container>
  )
}

export default Character
