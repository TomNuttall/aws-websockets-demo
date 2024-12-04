import { useState } from 'react'
import { TextStyle } from '@pixi/text'
import { Container, useTick } from '@pixi/react'
import { useSpring, config } from '@react-spring/web'
import { Text } from '@pixi/react-animated'

interface PanelTextProps {
  msg: string
  scale: number
  showOnFinish: boolean
}

const PanelText: React.FC<PanelTextProps> = ({ msg, showOnFinish, scale }) => {
  const [fontSize, setFontSize] = useState<number>(36)
  const [visible, setVisible] = useState<boolean>(true)

  const [springs] = useSpring(() => {
    return {
      from: { scale: 1 },
      to: { scale },
      config: config.gentle,
      reset: true,
      onResolve: () => {
        setTimeout(() => {
          setVisible(showOnFinish)
        }, 2000)
      },
    }
  }, [msg])

  useTick(() => {
    if (springs.scale.animation.values[0].done) return

    const scale = springs.scale.animation.values[0].getValue()
    setFontSize(36 * scale)
  })

  return (
    <Container
      name={'annoucements'}
      x={640}
      y={300}
      width={150}
      height={150}
      visible={visible}
    >
      <Text
        name={'text'}
        anchor={0.5}
        text={msg}
        style={
          new TextStyle({
            align: 'center',
            fontFamily: 'Comic Sans MS',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            fontSize,
          })
        }
      />
    </Container>
  )
}

export default PanelText
