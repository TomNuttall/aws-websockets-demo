import { useCallback, useContext } from 'react'
import { TextStyle } from '@pixi/text'
import { Container, Graphics, Sprite, Text } from '@pixi/react'
import { AssetContext } from '../../Context/AssetContext'
import { PlayerData } from '../../App'

interface PlayerProps {
  player: PlayerData
  position: { x: number; y: number }
}

const TEXTURE_LOOKUP: Record<string, string> = {
  'character-1': 'penguin',
  'character-2': 'snowman',
  'character-3': 'dalek',
}

const Player: React.FC<PlayerProps> = ({ player, position }) => {
  const { textures, assetsLoaded } = useContext(AssetContext)

  const textureName = TEXTURE_LOOKUP[`character-${player?.character ?? '0'}`]

  const draw = useCallback((g: any) => {
    g.clear()
    g.beginFill(0xff700b, 1)
    g.drawRect(50, 250, 120, 120)
    g.endFill()
  }, [])

  return (
    <Container x={position.x} y={position.y} width={150} height={150}>
      {assetsLoaded && (
        <Sprite width={150} height={150} texture={textures[textureName]} />
      )}
      <Graphics draw={draw} />
      <Text
        anchor={0.5}
        x={75}
        y={125}
        text={player.name}
        style={
          new TextStyle({
            align: 'center',
            fill: '0x000000',
            fontSize: 12,
          })
        }
      />
    </Container>
  )
}

export default Player
