import { useEffect, useMemo, useState } from 'react'
import './App.css'
import Papa from 'papaparse'
import {
  Header,
  HomeView,
  PlayerView,
  PlayersView,
  SessionsView,
  GameView,
} from './components/index.js'
import { playersCsvPath, sessionsCsvPath } from './lib/constants'
import {
  buildGames,
  buildLeaderboard,
  buildPlayerProfiles,
  normalizeSessions,
} from './lib/data'

function App() {
  const [games, setGames] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [error, setError] = useState('')
  const [view, setView] = useState({ type: 'home' })

  useEffect(() => {
    async function loadWorkbook() {
      try {
        const [playersResponse, sessionsResponse] = await Promise.all([
          fetch(playersCsvPath),
          fetch(sessionsCsvPath),
        ])

        if (!playersResponse.ok) {
          throw new Error(`Failed to load players CSV: HTTP ${playersResponse.status}`)
        }

        if (!sessionsResponse.ok) {
          throw new Error(`Failed to load sessions CSV: HTTP ${sessionsResponse.status}`)
        }

        const [playersCsvText, sessionsCsvText] = await Promise.all([
          playersResponse.text(),
          sessionsResponse.text(),
        ])

        const parsedPlayers = Papa.parse(playersCsvText, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header, index) => {
            if (header === 'Player' && index === 17) return 'Player_1'
            return header
          },
        })

        const parsedSessions = Papa.parse(sessionsCsvText, {
          header: true,
          skipEmptyLines: true,
        })

        if (parsedPlayers.errors?.length) {
          throw new Error(parsedPlayers.errors[0].message || 'Unable to parse players CSV.')
        }

        if (parsedSessions.errors?.length) {
          throw new Error(parsedSessions.errors[0].message || 'Unable to parse sessions CSV.')
        }

        setLeaderboard(buildLeaderboard(parsedPlayers.data))
        setGames(buildGames(normalizeSessions(parsedSessions.data)))
      } catch (loadError) {
        setError(loadError.message || 'Unable to load data.')
      }
    }

    loadWorkbook()
  }, [])

  const profiles = useMemo(() => buildPlayerProfiles(games, leaderboard), [games, leaderboard])
  const activeGame = view.type === 'game' ? games.find((game) => game.id === view.gameId) : null
  const activePlayer = view.type === 'player' ? profiles.get(view.playerName) : null
  const topBbProfit = useMemo(() => [...leaderboard].sort((a, b) => b.bbProfit - a.bbProfit)[0], [leaderboard])
  const topCashout = useMemo(() => {
    if (games.length) {
      return games.flatMap((game) => game.players).sort((a, b) => b.cashOut - a.cashOut)[0]
    }

    return [...leaderboard]
      .sort((a, b) => b.totalProfit - a.totalProfit)[0]
      ? {
          player: [...leaderboard].sort((a, b) => b.totalProfit - a.totalProfit)[0].player,
          cashOut: [...leaderboard].sort((a, b) => b.totalProfit - a.totalProfit)[0].totalProfit,
        }
      : null
  }, [games, leaderboard])

  function goHome() {
    setView({ type: 'home' })
  }

  function openPlayer(playerName) {
    setView({ type: 'player', playerName })
  }

  function openGame(gameId) {
    setView({ type: 'game', gameId })
  }

  function openPlayers() {
    setView({ type: 'players' })
  }

  function openSessions() {
    setView({ type: 'sessions' })
  }

  function renderContent() {
    if (!games.length && !leaderboard.length && !error) {
      return (
        <div className="main-content">
          <div className="loading">Loading Standings...</div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="main-content">
          <div className="loading">Error loading workbook: {error}</div>
        </div>
      )
    }

    if (view.type === 'players') {
      return <PlayersView leaderboard={leaderboard} onBack={goHome} onSelectPlayer={openPlayer} />
    }

    if (view.type === 'sessions') {
      return <SessionsView games={games} onBack={goHome} onOpenGame={openGame} onSelectPlayer={openPlayer} />
    }

    if (view.type === 'game' && activeGame) {
      return (
        <GameView
          game={activeGame}
          onBack={() => setView(view.returnTo ?? { type: 'sessions' })}
          onSelectPlayer={openPlayer}
          backLabel={view.returnTo?.type === 'player' ? 'Back to Player' : 'Back to Sessions'}
        />
      )
    }

    if (view.type === 'player' && activePlayer) {
      return (
        <PlayerView
          profile={activePlayer}
          onBack={goHome}
          onOpenGame={(gameId) => setView({ type: 'game', gameId, returnTo: { type: 'player', playerName: activePlayer.player } })}
        />
      )
    }

    return (
      <HomeView
        leaderboard={leaderboard}
        games={games}
        topCashout={topCashout}
        topBbProfit={topBbProfit}
        onSelectPlayer={openPlayer}
        onViewPlayers={() => setView({ type: 'players' })}
        onOpenGame={openGame}
        onViewSessions={() => setView({ type: 'sessions' })}
      />
    )
  }

  return (
    <>
      <Header
        onHome={goHome}
        onOpenSessions={openSessions}
        onOpenPlayers={openPlayers}
        currentView={view.type === 'player' ? 'players' : view.type === 'game' ? 'sessions' : view.type}
      />
      {renderContent()}
    </>
  )
}

export default App
