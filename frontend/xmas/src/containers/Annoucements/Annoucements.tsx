import PanelText from '../../Components/PanelText'
import CountdownPanel from '../../Components/CountdownPanel'
import { GameState } from '../../hooks/useGameState'
import type { PlayerData } from '../../types'

interface AnnoucementsProps {
  gameState: GameState
  players: PlayerData[]
  onStart: () => void
}

const Annoucements: React.FC<AnnoucementsProps> = ({
  gameState,
  players,
  onStart,
}) => {
  const sortedPlayers = players.sort(
    (a, b) => (a.position ?? 0) - (b.position ?? 0),
  )

  switch (gameState) {
    case GameState.CharacterSelect:
    default:
      return <PanelText msg={'No Connection'} showOnFinish={true} scale={2} />

    case GameState.WaitPlayers:
      return (
        <PanelText msg={'Waiting for Players'} showOnFinish={false} scale={2} />
      )

    case GameState.WaitGame:
      return (
        <CountdownPanel duration={3} finishMsg={'Go !!!'} onFinish={onStart} />
      )

    case GameState.Results: {
      if (sortedPlayers.length > 0) {
        return (
          <PanelText
            msg={`${sortedPlayers[0].name} Wins !!!`}
            showOnFinish={false}
            scale={2}
          />
        )
      }
      return <></>
    }
  }
}

export default Annoucements
