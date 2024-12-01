import { TextStyle } from '@pixi/text'
import { Container, Text } from '@pixi/react'

interface IntroProps {
  connect: () => void
}

const Intro: React.FC<IntroProps> = ({ connect }) => {
  return (
    <Container width={1280} height={600} click={connect} eventMode="static">
      <Text
        text={'START'}
        anchor={0.5}
        x={50}
        y={20}
        style={
          new TextStyle({
            align: 'center',
            fill: '0x000000',
            fontSize: 24,
          })
        }
      />
    </Container>
  )
}

export default Intro
