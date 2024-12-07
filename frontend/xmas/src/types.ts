import { GameState } from './hooks/useGameState'

export type HostData = {
  ready?: boolean
  started?: boolean
  finished?: boolean
}

export type PlayerData = {
  name: string
  character: number
  tint: string
  position?: number
}

export type GameData = {
  numConnections: number
  numPlayers: number
  gameState: GameState
  players: PlayerData[]
  msgs: string[]
}
