import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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

const INTRO_LABEL = 'Season 1 Winner'
const INTRO_BRAND = 'Adams Basement'
const INTRO_NEXT_SEASON = 'Season 2'
const INTRO_WINNER = 'Aiden Jalili'
const SCRAMBLE_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&'

function getScrambledWinner(progress) {
  const lockedCharacters = Math.floor(progress * INTRO_WINNER.length)

  return [...INTRO_WINNER]
    .map((character, index) => {
      if (character === ' ') {
        return character
      }

      if (index < lockedCharacters) {
        return character
      }

      const randomIndex = Math.floor(Math.random() * SCRAMBLE_CHARACTERS.length)
      return SCRAMBLE_CHARACTERS[randomIndex]
    })
    .join('')
}

function LandingIntro({ onComplete }) {
  const [phase, setPhase] = useState('title')
  const [winnerText, setWinnerText] = useState('')
  const closeTimeoutRef = useRef()

  useEffect(() => {
    const timeouts = []
    let scrambleInterval
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    document.body.classList.add('intro-lock')

    function queue(callback, delay) {
      const timeoutId = window.setTimeout(callback, delay)
      timeouts.push(timeoutId)
    }

    function showSeasonGate(delay) {
      queue(() => setPhase('season'), delay)
    }

    if (prefersReducedMotion) {
      queue(() => {
        setWinnerText(INTRO_WINNER)
        setPhase('settled')
      }, 0)
      showSeasonGate(900)
    } else {
      queue(() => {
        setPhase('scrambling')
        const startedAt = window.performance.now()
        const duration = 1300

        scrambleInterval = window.setInterval(() => {
          const elapsed = window.performance.now() - startedAt
          const progress = Math.min(elapsed / duration, 1)

          setWinnerText(getScrambledWinner(progress))

          if (progress === 1) {
            window.clearInterval(scrambleInterval)
            setWinnerText(INTRO_WINNER)
            setPhase('settled')
            showSeasonGate(850)
          }
        }, 42)
      }, 1000)
    }

    return () => {
      document.body.classList.remove('intro-lock')
      timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId))

      if (scrambleInterval) {
        window.clearInterval(scrambleInterval)
      }

      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  function handleGo() {
    if (phase === 'closing') {
      return
    }

    setPhase('closing')
    closeTimeoutRef.current = window.setTimeout(onComplete, 760)
  }

  const isSeasonGate = phase === 'season' || phase === 'closing'

  return (
    <div
      className={`intro-overlay is-${phase}`}
      role="dialog"
      aria-modal="true"
      aria-label={isSeasonGate ? INTRO_NEXT_SEASON : `${INTRO_LABEL}: ${INTRO_WINNER}`}
    >
      <div className="intro-frame">
        <div className="intro-kicker">{INTRO_BRAND}</div>
        <div key={isSeasonGate ? 'season' : 'winner'} className="intro-title">
          {isSeasonGate ? INTRO_NEXT_SEASON : INTRO_LABEL}
        </div>
        <div className="intro-winner" aria-hidden={phase === 'title' || isSeasonGate}>
          {winnerText}
        </div>
        {phase === 'season' ? (
          <button type="button" className="intro-go-button" onClick={handleGo} autoFocus>
            Go
          </button>
        ) : null}
        <div className="intro-rule" />
      </div>
    </div>
  )
}

function App() {
  const [games, setGames] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [error, setError] = useState('')
  const [view, setView] = useState({ type: 'home' })
  const [showIntro, setShowIntro] = useState(true)

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

        const playerHeaderCounts = new Map()

        const parsedPlayers = Papa.parse(playersCsvText, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header) => {
            const normalizedHeader = header.replace(/^\uFEFF/, '').trim()
            const nextCount = (playerHeaderCounts.get(normalizedHeader) ?? 0) + 1
            playerHeaderCounts.set(normalizedHeader, nextCount)

            return nextCount === 1 ? normalizedHeader : `${normalizedHeader}_${nextCount - 1}`
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
  const playerRanks = useMemo(
    () => new Map(leaderboard.map((player) => [player.player, { rank: player.rank, total: leaderboard.length }])),
    [leaderboard],
  )
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

  const completeIntro = useCallback(() => {
    setShowIntro(false)
  }, [])

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
      return (
        <SessionsView
          games={games}
          onBack={goHome}
          onOpenGame={openGame}
          onSelectPlayer={openPlayer}
          playerRanks={playerRanks}
        />
      )
    }

    if (view.type === 'game' && activeGame) {
      return (
        <GameView
          game={activeGame}
          onBack={() => setView(view.returnTo ?? { type: 'sessions' })}
          onSelectPlayer={openPlayer}
          playerRanks={playerRanks}
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
        playerRanks={playerRanks}
        onViewPlayers={() => setView({ type: 'players' })}
        onOpenGame={openGame}
        onViewSessions={() => setView({ type: 'sessions' })}
      />
    )
  }

  return (
    <>
      <div className={`app-shell ${showIntro ? 'is-intro-active' : 'is-intro-revealed'}`}>
        <Header
          onHome={goHome}
          onOpenSessions={openSessions}
          onOpenPlayers={openPlayers}
          currentView={view.type === 'player' ? 'players' : view.type === 'game' ? 'sessions' : view.type}
        />
        {renderContent()}
      </div>
      {showIntro ? <LandingIntro onComplete={completeIntro} /> : null}
    </>
  )
}

export default App
