import { Container } from '@pixi/react'
import Player from '../../Components/Player'
import { GameState, PlayerData } from '../../App'

interface PlayersProps {
  gameState: GameState
  raceDuration: number | undefined
  players: PlayerData[]
}

const Players: React.FC<PlayersProps> = ({
  gameState,
  raceDuration,
  players,
}) => {
  const sortedPlayers =
    gameState === GameState.Results
      ? players.sort((a, b) => (a?.position ?? 0) - (b?.position ?? 0))
      : players

  return (
    <Container name={'players'}>
      {sortedPlayers.map((player: PlayerData, index: number) => {
        const row = Math.floor(index / 10)
        let x = 0
        let y = 0

        switch (gameState) {
          case GameState.WaitPlayers:
          case GameState.Results:
            x = 150 + (index % 10) * ((1280 - 150) / 10)
            y = 150 + row * ((720 - 200) / 3)
            break

          case GameState.WaitGame: {
            x = 200 + index * 5
            y = 475
            break
          }
        }

        return (
          <Player
            key={player.name}
            gameState={gameState}
            player={player}
            position={{ x, y }}
            raceDuration={raceDuration}
          />
        )
      })}
    </Container>
  )
}

export default Players
