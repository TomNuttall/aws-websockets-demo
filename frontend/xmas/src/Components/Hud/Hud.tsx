import React from 'react'
import { GameState } from '../../App'
import './Hud.scss'

interface HudProps {
  numConnections: number
  numPlayers: number
  gameState: GameState
  onConnect: () => void
  onStart: () => void
  onFinish: () => void
}

const Hud: React.FC<HudProps> = ({
  numConnections,
  numPlayers,
  gameState,
  onConnect,
  onStart,
  onFinish,
}) => {
  const onClick = () => {
    switch (gameState) {
      case GameState.CharacterSelect:
        onConnect()
        break

      case GameState.WaitPlayers:
        onStart()
        break

      case GameState.WaitGame:
        onFinish()
        break
    }
  }

  return (
    <div className="hud">
      <div>{`Connections: ${numConnections > 1 ? numConnections - 1 : 0}`}</div>
      {gameState !== GameState.Results && (
        <button onClick={onClick}>{gameState}</button>
      )}
      <div>{`Players Ready: ${numPlayers}`}</div>
    </div>
  )
}

export default Hud
