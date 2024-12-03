import { useEffect, useContext, useCallback, useState } from 'react'
import { TextStyle } from '@pixi/text'
import { Container, Graphics, Text, useTick } from '@pixi/react'
import { useSpring } from '@react-spring/web'
import { Sprite } from '@pixi/react-animated'
import { AssetContext } from '../../Context/AssetContext'
import { GameState, PlayerData } from '../../App'
import { formatOrdinals } from '../../utils/helper'

const TEXTURE_LOOKUP: Record<string, string> = {
  'character-1': 'penguin',
  'character-2': 'snowman',
  'character-3': 'dalek',
}

interface PlayerProps {
  gameState: GameState
  player: PlayerData
  position: { x: number; y: number }
  animate: boolean
}

const Player: React.FC<PlayerProps> = ({
  gameState,
  player,
  position,
  animate,
}) => {
  const [offset, setOffset] = useState<number>(0)
  const [size, setSize] = useState<number>(1)
  const [timer, setTimer] = useState<number>(0)
  useTick((delta) => {
    if (!animate) return

    setTimer((timer) => timer - delta)
    if (timer < 0) {
      setTimer(Math.floor(Math.random() * 30) + 40)
      setOffset(Math.floor(Math.random() * 1000))
    }
  })

  const { textures, assetsLoaded } = useContext(AssetContext)

  const textureName = TEXTURE_LOOKUP[`character-${player?.character ?? '0'}`]

  // Add wobble run animation
  const [springs] = useSpring(
    () => ({
      from: { x: 0, y: 0 },
      to: { x: 5, y: 1 },
      config: { tension: 30, friction: 10 },
      loop: animate,
      reset: true,
    }),
    [animate],
  )

  useEffect(() => {
    setSize(gameState === GameState.WaitGame ? 2 : 1)
  }, [gameState])

  const drawRectangle = useCallback(
    (g: any) => {
      g.clear()
      g.lineStyle(1, 0x000000)
      g.beginFill(0xffffff)
      g.drawRoundedRect(-40 * size, -80 * size, 80 * size, 18 * size, 5 * size)
      g.endFill()
    },
    [size],
  )

  const drawCircle = useCallback(
    (g: any) => {
      g.clear()
      g.lineStyle(1, 0x000000)
      g.beginFill(0xffcccb)
      g.drawCircle(0, 0, 20 * size)
      g.endFill()
    },
    [size],
  )

  return (
    <Container
      name={player.name}
      x={position.x + offset}
      y={position.y}
      width={100 * size}
      height={100 * size}
    >
      {assetsLoaded && (
        <Sprite
          name={'character'}
          width={100 * size}
          height={100 * size}
          anchor={0.5}
          texture={textures[textureName]}
          {...springs}
        />
      )}
      <Graphics draw={drawRectangle} name={'textBkgd'} />
      <Text
        name={'text'}
        anchor={0.5}
        x={0}
        y={-70 * size}
        text={player.name}
        style={
          new TextStyle({
            align: 'center',
            fill: '0x000000',
            fontSize: 12 * size,
          })
        }
      />
      {gameState === GameState.Results && (
        <>
          <Graphics draw={drawCircle} name={'textBkgd'} />
          <Text
            name={'text'}
            anchor={0.5}
            x={0}
            y={0}
            text={`${formatOrdinals((player?.position ?? 0) + 1)}`}
            style={
              new TextStyle({
                align: 'center',
                fill: '0x000000',
                fontSize: 18,
              })
            }
          />
        </>
      )}
    </Container>
  )
}

export default Player
