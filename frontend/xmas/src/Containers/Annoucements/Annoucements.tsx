import { GameState, PlayerData } from '../../App'
import PanelText from '../../Components/PanelText'
import CountdownPanel from '../../Components/CountdownPanel'

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

  return (
    <>
      {gameState === GameState.CharacterSelect && (
        <PanelText msg={'No Connection'} showOnFinish={true} scale={2} />
      )}
      {gameState === GameState.WaitPlayers && (
        <PanelText msg={'Waiting for Players'} showOnFinish={false} scale={2} />
      )}
      {gameState === GameState.WaitGame && (
        <CountdownPanel duration={3} finishMsg={'Go !!!'} onFinish={onStart} />
      )}
      {gameState === GameState.Results && sortedPlayers.length > 0 && (
        <PanelText
          msg={`${sortedPlayers[0].name} Wins !!!`}
          showOnFinish={false}
          scale={2}
        />
      )}
    </>
  )
}

export default Annoucements
