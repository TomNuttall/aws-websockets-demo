import { TextStyle } from '@pixi/text'
import { Container, Text } from '@pixi/react'

interface HudProps {
  numConnections: number
  numPlayers: number
}

const Hud: React.FC<HudProps> = ({ numConnections, numPlayers }) => {
  const msg = `Connections: ${
    numConnections > 1 ? numConnections - 1 : 0
  } Players Ready: ${numPlayers}`
  const newMsg = `... Joined`

  return (
    <Container width={1280} height={600}>
      <Text
        text={msg}
        anchor={0.5}
        x={100}
        y={580}
        style={
          new TextStyle({
            align: 'center',
            fill: '0x000000',
            fontSize: 12,
          })
        }
      />
      <Text
        text={newMsg}
        anchor={0.5}
        x={900}
        y={580}
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

export default Hud
