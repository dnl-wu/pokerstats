import { HOME_LEADERBOARD_COUNT, HOME_SESSIONS_COUNT } from '../lib/constants.js'
import {
  formatBigBlind,
  formatCurrency,
  formatDecimal,
  formatSignedCurrency,
  formatSignedNumber,
  playerResultClass,
} from '../lib/formatters.js'
import { LeaderboardTable, SessionsTable } from './tables.jsx'
import {
  Avatar,
  LinkButton,
  PageHeader,
  SectionHeader,
  SessionNameButton,
  StandingsCard,
  SummaryCards,
  PlayerNameCell,
} from './ui.jsx'

export function HomeView({
  leaderboard,
  games,
  topCashout,
  topBbProfit,
  onSelectPlayer,
  onViewPlayers,
  onOpenGame,
  onViewSessions,
}) {
  return (
    <div className="main-content">
      <PageHeader title="League Standings" badge="S1 W26" badgeClassName="season-badge-red" />
      <SummaryCards topCashout={topCashout} topBbProfit={topBbProfit} onSelectPlayer={onSelectPlayer} />

      <div className="home-grid">
        <section>
          <SectionHeader title="Standings" actionLabel="View More" onAction={onViewPlayers} />
          <StandingsCard>
            <LeaderboardTable
              rows={leaderboard.slice(0, HOME_LEADERBOARD_COUNT)}
              onSelectPlayer={onSelectPlayer}
              compact
            />
          </StandingsCard>
        </section>

        <section>
          <SectionHeader title="Game Recaps" actionLabel="View All" onAction={onViewSessions} />
          {games.length ? (
            <StandingsCard>
              <SessionsTable
                games={games.slice(0, HOME_SESSIONS_COUNT)}
                onOpenGame={onOpenGame}
                onSelectPlayer={onSelectPlayer}
                compact
              />
            </StandingsCard>
          ) : (
            <div className="loading">Game recaps are not included in the players CSV.</div>
          )}
        </section>
      </div>
    </div>
  )
}

export function PlayersView({ leaderboard, onBack, onSelectPlayer }) {
  return (
    <div className="main-content">
      <LinkButton onClick={onBack}>Back to Dashboard</LinkButton>
      <PageHeader title="Full Standings" badge="Power Score" />
      <StandingsCard>
        <LeaderboardTable rows={leaderboard} onSelectPlayer={onSelectPlayer} />
      </StandingsCard>
    </div>
  )
}

export function SessionsView({ games, onBack, onOpenGame, onSelectPlayer }) {
  return (
    <div className="main-content">
      <LinkButton onClick={onBack}>Back to Dashboard</LinkButton>
      <PageHeader title="Game Recaps" />
      {games.length ? (
        <StandingsCard>
          <SessionsTable games={games} onOpenGame={onOpenGame} onSelectPlayer={onSelectPlayer} />
        </StandingsCard>
      ) : (
        <div className="loading">Game recap data is not present in the players CSV.</div>
      )}
    </div>
  )
}

export function GameView({ game, onBack, onSelectPlayer, backLabel = 'Back to Sessions' }) {
  return (
    <div className="main-content">
      <LinkButton onClick={onBack}>{backLabel}</LinkButton>
      <PageHeader title={game.gameName} badge={game.date} />
      <div className="standings-card session-summary">
        <div>
          <strong>Winner:</strong>{' '}
          {game.winner ? <PlayerNameCell name={game.winner.player} onSelect={onSelectPlayer} /> : '—'}
        </div>
        <div><strong>Top Cashout:</strong> {formatCurrency(game.topCashOut?.cashOut ?? 0)}</div>
        <div><strong>Blinds:</strong> {formatBigBlind(game.players[0]?.bigBlind)}</div>
        <div><strong>Total Buy In:</strong> {formatCurrency(game.totalBuyIn)}</div>
      </div>
      <StandingsCard>
        <table className="responsive-table game-results-table">
          <thead>
            <tr>
              <th>Player</th>
              <th>Buy In</th>
              <th>Cash Out</th>
              <th>Net</th>
              <th>Profit (BB)</th>
            </tr>
          </thead>
          <tbody>
            {game.players.map((player) => (
              <tr key={player.id}>
                <td data-label="Player">
                  <PlayerNameCell name={player.player} onSelect={onSelectPlayer} />
                </td>
                <td data-label="Buy In">{formatCurrency(player.buyIn)}</td>
                <td data-label="Cash Out">{formatCurrency(player.cashOut)}</td>
                <td data-label="Net" className={playerResultClass(player.netProfit)}>{formatSignedCurrency(player.netProfit)}</td>
                <td data-label="Profit (BB)" className={playerResultClass(player.profitBigBlind)}>{formatSignedNumber(player.profitBigBlind)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </StandingsCard>
    </div>
  )
}

export function PlayerView({ profile, onBack, onOpenGame }) {
  const { player, summary, sessions } = profile
  let streak = 0

  for (const session of sessions) {
    if (session.netProfit > 0) {
      streak += 1
      continue
    }
    break
  }

  return (
    <div className="main-content">
      <LinkButton onClick={onBack}>Back to Dashboard</LinkButton>

      <div className="player-hero">
        <Avatar name={player} large />
        <div className="player-info">
          <h2>{player}</h2>
          <div className="badge">
            Rank #{summary.powerRank} · Power Score {formatDecimal(summary.powerRanking)}
          </div>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-box">
          <div className="stat-label">Power Score</div>
          <div className="stat-value">{formatDecimal(summary.powerRanking)}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Net Winnings</div>
          <div className={`stat-value ${playerResultClass(summary.totalProfit)}`}>
            {formatSignedCurrency(summary.totalProfit)}
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Games Played</div>
          <div className="stat-value">{summary.gamesPlayed}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">BB Profit</div>
          <div className={`stat-value ${playerResultClass(summary.bbProfit)}`}>
            {formatSignedNumber(summary.bbProfit)}
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Win %</div>
          <div className="stat-value">{summary.winRate}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Streak</div>
          <div className="stat-value">{streak ? `W${streak}` : 'L1'}</div>
        </div>
      </div>

      <SectionHeader title="Session Log" />
      <StandingsCard>
        <table className="responsive-table player-session-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Session</th>
              <th>Place</th>
              <th>Buy In</th>
              <th>Cash Out</th>
              <th>Net</th>
              <th>Profit (BB)</th>
            </tr>
          </thead>
          <tbody>
            {sessions.length ? (
              sessions.map((session) => (
                <tr key={session.id}>
                  <td data-label="Date">{session.date}</td>
                  <td data-label="Session">
                    <SessionNameButton name={session.gameName} onOpen={() => onOpenGame(session.gameId)} />
                  </td>
                  <td data-label="Place">{session.placement}</td>
                  <td data-label="Buy In">{formatCurrency(session.buyIn)}</td>
                  <td data-label="Cash Out">{formatCurrency(session.cashOut)}</td>
                  <td data-label="Net" className={playerResultClass(session.netProfit)}>{formatSignedCurrency(session.netProfit)}</td>
                  <td data-label="Profit (BB)" className={playerResultClass(session.profitBigBlind)}>{formatSignedNumber(session.profitBigBlind)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">Session-level data is not included in the players CSV.</td>
              </tr>
            )}
          </tbody>
        </table>
      </StandingsCard>
    </div>
  )
}
