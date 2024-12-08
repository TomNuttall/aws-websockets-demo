import { useCallback, useContext, useEffect, useState } from 'react'
import { Container, TilingSprite, Sprite, Graphics, useTick } from '@pixi/react'
import { AssetContext } from '../../Context/AssetContext'
import { GameState } from '../../hooks/useGameState'

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
  const [raceTimer, setRaceTimer] = useState<number | undefined>(undefined)
  const [x, setX] = useState<number>(0)

  const { textures, assetsLoaded } = useContext(AssetContext)

  useEffect(() => {
    setRaceTimer(raceDuration)
  }, [raceDuration])

  useTick((delta) => {
    if (raceTimer === undefined || raceTimer < 0) {
      if (raceDuration && gameState === GameState.WaitGame) {
        onFinish()
      }
      return
    }

    setX((x) => x - 10)

    setRaceTimer((prevRaceTimer) => {
      if (prevRaceTimer === undefined) return 0
      return prevRaceTimer - delta
    })
  })

  const drawRectangle = useCallback((g: any) => {
    g.clear()
    g.lineStyle(1, 0x000000)
    g.beginFill(0xffffff, 0.25)
    g.drawRect(0, 0, 1280, 720)
    g.endFill()
  }, [])

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
        x={12900 + x}
        y={400}
        anchor={0.5}
        width={600}
        height={400}
        texture={textures?.igloo}
      />

      {gameState !== GameState.WaitGame && <Graphics draw={drawRectangle} />}
      {gameState === GameState.WaitPlayers && (
        <Sprite
          name={'finish'}
          x={1150}
          y={475}
          anchor={0.5}
          width={200}
          height={200}
          texture={textures?.qrcode}
        />
      )}
    </Container>
  )
}

export default Background
