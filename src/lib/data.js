import { BLIND_OVERRIDES } from './constants.js'
import { toNumber } from './formatters.js'

export function normalizeSessions(rows) {
  return rows
    .filter((row) => row.Player && row['Game name'])
    .map((row, index) => {
      const gameName = row['Game name']
      const bigBlind = BLIND_OVERRIDES[gameName] ?? toNumber(row['Big Blind'])

      return {
        id: `${gameName}-${row.Date}-${row.Player}-${index}`,
        player: row.Player,
        gameName,
        date: row.Date || 'Unknown date',
        buyIn: toNumber(row['Buy in']),
        cashOut: toNumber(row['Cash out']),
        netProfit: toNumber(row['Net profit']),
        bigBlind,
        profitBigBlind: toNumber(row['Profit(BB)']),
        order: index,
      }
    })
}

export function buildGames(sessionRows) {
  const games = new Map()

  sessionRows.forEach((row) => {
    const key = `${row.gameName}__${row.date}`

    if (!games.has(key)) {
      games.set(key, {
        id: key,
        gameName: row.gameName,
        date: row.date,
        order: row.order,
        players: [],
      })
    }

    games.get(key).players.push(row)
  })

  return [...games.values()]
    .sort((a, b) => b.order - a.order)
    .map((game) => {
      const players = [...game.players].sort((a, b) => b.netProfit - a.netProfit)
      return {
        ...game,
        players,
        winner: players[0],
        biggestLoss: [...players].sort((a, b) => a.netProfit - b.netProfit)[0],
        totalBuyIn: players.reduce((sum, player) => sum + player.buyIn, 0),
        topCashOut: [...players].sort((a, b) => b.cashOut - a.cashOut)[0],
      }
    })
}

export function buildLeaderboard(rows) {
  const playerStats = new Map()
  const powerList = []

  rows.forEach((row, index) => {
    if (row.Player) {
      playerStats.set(row.Player, {
        id: `${row.Player}-${index}`,
        player: row.Player,
        totalProfit: toNumber(row['Total Profit']),
        gamesPlayed: toNumber(row['Games played']),
        averageProfit: toNumber(row['Average profit']),
        winRate: row['Win Rate'] || '0%',
        roi: row.ROI || '0%',
        bbProfit: toNumber(row['BB Profit']),
      })
    }

    if (row.Player_1) {
      powerList.push({
        player: row.Player_1,
        powerRanking: toNumber(row['Power Score']),
      })
    }
  })

  const leaderboard = powerList.map((powerRow, index) => ({
    ...(playerStats.get(powerRow.player) ?? {
      id: `${powerRow.player}-power-${index}`,
      player: powerRow.player,
      totalProfit: 0,
      gamesPlayed: 0,
      averageProfit: 0,
      winRate: '0%',
      roi: '0%',
      bbProfit: 0,
    }),
    powerRanking: powerRow.powerRanking,
    rank: index + 1,
  }))

  const rankedNames = new Set(leaderboard.map((row) => row.player))

  playerStats.forEach((stats, player) => {
    if (!rankedNames.has(player)) {
      leaderboard.push({
        ...stats,
        powerRanking: 0,
        rank: leaderboard.length + 1,
      })
    }
  })

  return leaderboard
}

export function buildPlayerProfiles(games, leaderboard) {
  const profiles = new Map()

  games.forEach((game) => {
    game.players.forEach((session) => {
      const existing = profiles.get(session.player) ?? { player: session.player, sessions: [] }
      existing.sessions.push({
        ...session,
        placement: game.players.findIndex((player) => player.id === session.id) + 1,
      })
      profiles.set(session.player, existing)
    })
  })

  leaderboard.forEach((row) => {
    const existing = profiles.get(row.player) ?? { player: row.player, sessions: [] }
    existing.leaderboard = row
    profiles.set(row.player, existing)
  })

  profiles.forEach((profile) => {
    const sessions = [...profile.sessions].sort((a, b) => b.order - a.order)
    const totalBuyIn = sessions.reduce((sum, session) => sum + session.buyIn, 0)
    const totalCashOut = sessions.reduce((sum, session) => sum + session.cashOut, 0)
    const totalProfit = sessions.reduce((sum, session) => sum + session.netProfit, 0)
    const wins = sessions.filter((session) => session.placement === 1).length

    profile.sessions = sessions
    profile.summary = {
      gamesPlayed: profile.leaderboard?.gamesPlayed ?? sessions.length,
      totalProfit: profile.leaderboard?.totalProfit ?? totalProfit,
      averageProfit: profile.leaderboard?.averageProfit ?? (sessions.length ? totalProfit / sessions.length : 0),
      winRate: profile.leaderboard?.winRate ?? `${sessions.length ? Math.round((wins / sessions.length) * 100) : 0}%`,
      roi: profile.leaderboard?.roi ?? `${totalBuyIn ? Math.round(((totalCashOut - totalBuyIn) / totalBuyIn) * 100) : 0}%`,
      bbProfit: profile.leaderboard?.bbProfit ?? sessions.reduce((sum, session) => sum + session.profitBigBlind, 0),
      powerRanking: profile.leaderboard?.powerRanking ?? 0,
      powerRank: profile.leaderboard?.rank ?? 0,
    }
  })

  return profiles
}

export function buildProfilesFromLeaderboard(leaderboard) {
  const profiles = new Map()

  leaderboard.forEach((row) => {
    profiles.set(row.player, {
      player: row.player,
      sessions: [],
      leaderboard: row,
      summary: {
        gamesPlayed: row.gamesPlayed,
        totalProfit: row.totalProfit,
        averageProfit: row.averageProfit,
        winRate: row.winRate,
        roi: row.roi,
        bbProfit: row.bbProfit,
        powerRanking: row.powerRanking,
        powerRank: row.rank,
      },
    })
  })

  return profiles
}
