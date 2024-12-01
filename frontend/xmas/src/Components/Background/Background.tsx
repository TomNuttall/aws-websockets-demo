import { useContext, useEffect, useState } from 'react'
import { Container, TilingSprite, Sprite, useTick } from '@pixi/react'
import { AssetContext } from '../../Context/AssetContext'

interface BackgroundProps {
  raceDuration: number
  onStart: () => void
}

const Background: React.FC<BackgroundProps> = ({ raceDuration, onStart }) => {
  const [timer, setTimer] = useState<number>(raceDuration)
  const [x, setX] = useState<number>(0)

  const { textures, assetsLoaded } = useContext(AssetContext)

  useEffect(() => {
    setTimer(raceDuration)
  }, [raceDuration])

  useTick((delta) => {
    if (timer < 0) return

    setX((x) => x - 0.45)
    setTimer((timer) => timer - delta)

    //far.tilePosition.x -= 0.128;
    //mid.tilePosition.x -= 0.64;
  })

  if (!assetsLoaded) return <></>

  // wait players show igloo

  // animate updates background parrallax scroll
  // animate igloo off

  // animate finish line on
  // stop tiling sprite

  return (
    <Container width={1280} height={600} click={onStart} eventMode="static">
      <TilingSprite
        width={1280}
        height={600}
        texture={textures?.background}
        tilePosition={{ x, y: 0 }}
        tileScale={{ x: 2, y: 2 }}
      />
      <Sprite
        x={x + 640}
        y={400}
        anchor={0.5}
        width={600}
        height={400}
        texture={textures?.igloo}
        click={onStart}
      />
      {/* {x + 2560 < 1280 && (
        <Sprite
          x={x}
          y={200}
          width={600}
          height={400}
          texture={textures?.igloo}
        />
      )}
      <Graphics width={1280} height={720} isMask={true}></Graphics> */}
    </Container>
  )
}

export default Background
