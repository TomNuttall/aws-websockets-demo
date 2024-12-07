import { GameState } from './hooks/useGameState'

export type CharacterSelectData = {
  name?: string
  character?: number
  tint?: string
}

export type GameData = {
  numConnections: number
  numPlayers: number
  gameState: GameState
  position?: number
  msgs: string[]
}
