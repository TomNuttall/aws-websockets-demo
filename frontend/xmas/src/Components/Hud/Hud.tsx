import React from 'react'
import './Hud.scss'

interface HudProps {
  numConnections: number
  numPlayers: number
  connect: () => void | undefined
}

const Hud: React.FC<HudProps> = ({ numConnections, numPlayers, connect }) => {
  return (
    <div className="hud">
      <div>{`Connections: ${numConnections > 1 ? numConnections - 1 : 0}`}</div>
      {connect !== undefined && (
        <button onClick={() => connect()}>Ready</button>
      )}
      <div>{`Players Ready: ${numPlayers}`}</div>
    </div>
  )
}

export default Hud
