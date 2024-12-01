import React from 'react'

interface WaitPlayersProps {
  numPlayers: number
}

const WaitPlayers: React.FC<WaitPlayersProps> = ({ numPlayers }) => {
  return (
    <div>
      <h1>{`${numPlayers} Ready`}</h1>
    </div>
  )
}

export default WaitPlayers
