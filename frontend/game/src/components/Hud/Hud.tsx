import React from 'react'
import { Toaster } from 'react-hot-toast'

interface HudProps {
  numConnections: number
  numPlayers: number
}

const Hud: React.FC<HudProps> = ({ numConnections, numPlayers }) => {
  return (
    <div>
      <div className="flex flex-row gap-4">
        <p>{`Connected: ${numConnections}`}</p>
        <p>{`Players: ${numPlayers}`}</p>
      </div>
      <Toaster position="bottom-center" reverseOrder={false} />
    </div>
  )
}

export default Hud
