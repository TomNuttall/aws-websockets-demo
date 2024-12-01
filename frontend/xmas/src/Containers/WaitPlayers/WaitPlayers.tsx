import { Container } from '@pixi/react'
import Player from '../../Components/Player'
import { PlayerData } from '../../App'

interface WaitPlayersProps {
  players: PlayerData[]
}

const WaitPlayers: React.FC<WaitPlayersProps> = ({ players }) => {
  const activePlayers = players.filter((player) => player.name)
  return (
    <Container>
      {activePlayers.map((player: PlayerData, index: number) => (
        <Player
          key={index}
          player={player}
          position={{ x: 50 + index * 150, y: 360 }}
        />
      ))}
    </Container>
  )
}

export default WaitPlayers
