import { useEffect, useContext, useCallback, useState } from 'react'
import { TextStyle } from '@pixi/text'
import { Container, Graphics, Text, useTick } from '@pixi/react'
import { useSpring } from '@react-spring/web'
import { Sprite } from '@pixi/react-animated'
import { AssetContext } from '../../Context/AssetContext'
import { formatOrdinals } from '../../utils/helper'
import { GameState } from '../../hooks/useGameState'
import type { PlayerData } from '../../types'

const TEXTURE_LOOKUP: Record<string, string> = {
  'character-1': 'penguin',
  'character-2': 'snowman',
  'character-3': 'dalek',
  'character-4': 'hippo',
  'character-5': 'reindeer',
  'character-6': 'grinch',
}

interface PlayerProps {
  gameState: GameState
  player: PlayerData
  position: { x: number; y: number }
  raceDuration: number | undefined
  numPlayers: number
}

const Player: React.FC<PlayerProps> = ({
  gameState,
  player,
  position,
  raceDuration,
  numPlayers,
}) => {
  const [offset, setOffset] = useState<number>(0)
  const [size, setSize] = useState<number>(1)
  const [timer, setTimer] = useState<number>(0)
  const [raceTimer, setRaceTimer] = useState<number | undefined>(undefined)

  useEffect(() => {
    setRaceTimer(raceDuration)
  }, [raceDuration])

  useTick((delta) => {
    if (raceTimer === undefined || raceTimer < 0) {
      if (gameState === GameState.Results) {
        setOffset(0)
      }
      return
    }

    setRaceTimer((prevRaceTimer) => {
      if (prevRaceTimer === undefined) return 0
      return prevRaceTimer - delta
    })

    // Near end of race force positions to winning ones
    if (raceTimer < Math.floor(Math.random() * 50) + 75) {
      const position = player?.position ?? 0
      let distance = 0
      if (position < 3) {
        distance = 1085 - position * 100
      } else if (position < 10) {
        distance = 800 - position * 75
      } else {
        distance = 500 - position * 50
      }
      setOffset(distance)
      return
    }

    setTimer((timer) => timer - delta)
    if (timer < 0) {
      setTimer(Math.floor(Math.random() * 60) + 40)
      const chance = Math.random() * 10
      const scalePlayer = numPlayers > 10 ? Math.floor(Math.random() * 3) : 1
      let maxDistance = 300
      if (chance > 9 && scalePlayer === 1) {
        maxDistance = 1075
      } else if (chance > 8 && scalePlayer === 1) {
        maxDistance = 875
      } else if (chance > 5 && scalePlayer === 1) {
        maxDistance = 600
      } else if (chance > 4 && scalePlayer === 1) {
        maxDistance = 450
      } else if (numPlayers > 10) {
        maxDistance = -500
      }
      setOffset(Math.floor(Math.random() * maxDistance))
    }
  })

  const { textures, assetsLoaded } = useContext(AssetContext)

  const textureName = TEXTURE_LOOKUP[`character-${player?.character ?? '0'}`]

  // Add wobble run animation
  const [springs] = useSpring(
    () => ({
      from: { x: 0, y: 0 },
      to: { x: 5, y: 3 },
      config: { tension: 30, friction: 10 },
      loop: raceDuration && raceDuration > 0,
      reset: true,
    }),
    [raceDuration],
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
          tint={player.tint}
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
            fontFamily: 'Ubuntu Sans',
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
                fontFamily: 'Ubuntu Sans',
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
