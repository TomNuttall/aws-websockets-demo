import { useContext } from 'react'
import { TextStyle } from '@pixi/text'
import { Container, Graphics, Sprite, Text } from '@pixi/react'
import { AssetContext } from '../../Context/AssetContext'
import { PlayerData } from '../../App'

interface PlayerProps {
  player: PlayerData
  position: { x: number; y: number }
}

const Player: React.FC<PlayerProps> = ({ player, position }) => {
  const { textures, assetsLoaded } = useContext(AssetContext)

  const character = `character-${player?.character ?? '0'}`
  return (
    <Container x={position.x} y={position.y} width={150} height={150}>
      {assetsLoaded && (
        <Sprite width={150} height={150} texture={textures[character]} />
      )}
      <Graphics anchor={0.5} x={75} y={125} />
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
