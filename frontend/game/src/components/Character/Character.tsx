import { useContext } from 'react'
import { Container, Sprite } from '@pixi/react'
import { AssetContext } from '../../context/AssetContext'
import { PlayerData } from '../../App'

interface PlayerProps {
  width: number
  height: number
  player: PlayerData
}

const TEXTURE_LOOKUP: Record<string, string> = {
  'character-1': 'penguin',
  'character-2': 'snowman',
  'character-3': 'dalek',
  'character-4': 'hippo',
  'character-5': 'reindeer',
  'character-6': 'grinch',
}

const Character: React.FC<PlayerProps> = ({ width, height, player }) => {
  const { textures, assetsLoaded } = useContext(AssetContext)
  const textureName = TEXTURE_LOOKUP[`character-${player?.character ?? '0'}`]

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
