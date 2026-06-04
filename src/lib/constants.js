export const playersCsvPath = '/Adambasementelite-players.csv'
export const sessionsCsvPath = '/Adambasementelite-sessions.csv'
export const seasonLabel = 'S2 Summer 2026'
export const HOME_LEADERBOARD_COUNT = 8
export const HOME_SESSIONS_COUNT = 8
export const DISPLAY_SMALL_BLIND = 0.25
export const S1_CHAMPION_PLAYER = 'Aiden Jalili'

export const PLAYER_NAME_ALIASES = {
  Aiden: S1_CHAMPION_PLAYER,
}

export function isS1ChampionPlayer(name) {
  return name === S1_CHAMPION_PLAYER
}

export function playerRankTone(rank) {
  if (rank === 1) return 'rank-gold'
  if (rank === 2) return 'rank-silver'
  if (rank === 3) return 'rank-bronze'
  return ''
}

export function playerRankBadgeTone(rank, totalPlayers) {
  if (rank === 1) return 'rank-badge-gold'
  if (rank === 2) return 'rank-badge-silver'
  if (rank === 3) return 'rank-badge-bronze'
  if (!rank || !totalPlayers) return ''
  return rank <= Math.ceil(totalPlayers / 2) ? 'rank-badge-top-half' : 'rank-badge-bottom-half'
}

export const BLIND_OVERRIDES = {
  'Opening Day': 0.5,
  Bombpot: 0.5,
  'Joey L': 0.25,
  Multiverse: 0.25,
  'Wake up call': 0.25,
}

export const PLAYER_PHOTOS = {
  Derrick: '/profilephotos/Derrick.png',
  Jayden: '/profilephotos/Jayden.png',
  'Daniel Wu': '/profilephotos/DanielWu.png',
  Nathan: '/profilephotos/Nathan.png',
  Adam: '/profilephotos/Adam.png',
  'Alex N': '/profilephotos/AlexN.png',
  Harry: '/profilephotos/Harry.png',
}
