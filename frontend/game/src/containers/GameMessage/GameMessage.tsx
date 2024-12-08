import WaitPanel from '../../components/WaitPanel'
import { formatOrdinals } from '../../utils/helper'
import { GameState } from '../../hooks/useGameState'

interface GameMessageProps {
  gameState: GameState
  position: number
}

const GameMessage: React.FC<GameMessageProps> = ({ gameState, position }) => {
  switch (gameState) {
    case GameState.WaitPlayers:
      return <WaitPanel msg={'Waiting for Players'} />

    case GameState.WaitGame:
      return <WaitPanel msg={'Game in Progress'} />

    case GameState.Results:
      return <WaitPanel msg={`You finished ${formatOrdinals(position + 1)}`} />
  }
}

export default GameMessage
