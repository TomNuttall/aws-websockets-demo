import { useContext, useEffect, useState } from 'react'
import { Container, TilingSprite, Sprite, useTick } from '@pixi/react'
import { AssetContext } from '../../Context/AssetContext'
import { GameState } from '../../App'

interface BackgroundProps {
  gameState: GameState
  raceDuration: number | undefined
  onFinish: () => void
}

const Background: React.FC<BackgroundProps> = ({
  gameState,
  raceDuration,
  onFinish,
}) => {
  const [timer, setTimer] = useState<number | undefined>(undefined)
  const [x, setX] = useState<number>(0)

  const { textures, assetsLoaded } = useContext(AssetContext)

  useEffect(() => {
    setTimer(raceDuration)
  }, [raceDuration])

  useTick((delta) => {
    if (!timer || timer < 0) {
      if (raceDuration && gameState === GameState.WaitGame) {
        onFinish()
      }
      return
    }

    setX((x) => x - 1.85)
    setTimer((timer) => timer - delta)
  })

  if (!assetsLoaded) return <></>

  return (
    <Container width={1280} height={600} name={'background'}>
      <TilingSprite
        name={'snow'}
        width={1280}
        height={600}
        texture={textures?.background}
        tilePosition={{ x, y: 0 }}
        tileScale={{ x: 2, y: 2 }}
      />
      <Sprite
        name={'start'}
        x={150 + x}
        y={400}
        anchor={0.5}
        width={600}
        height={400}
        texture={textures?.igloo}
      />

      <Sprite
        name={'finish'}
        x={3000 + x}
        y={400}
        anchor={0.5}
        width={600}
        height={400}
        texture={textures?.igloo}
      />

      {/* <Graphics width={1280} height={720} isMask={true}></Graphics>  */}
    </Container>
  )
}

export default Background
