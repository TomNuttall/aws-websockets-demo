import React from 'react'

interface HudProps {
  numPlayers: number
  msgHistory: string[]
}

const Hud: React.FC<HudProps> = ({ numPlayers, msgHistory }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{`NumPlayers: ${numPlayers}`}</h1>
      <ul>
        {msgHistory.map((msg: string, index: number) => {
          return <li key={index}>{msg}</li>
        })}
      </ul>
    </div>
  )
}

export default Hud
