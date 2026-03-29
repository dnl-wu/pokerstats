import {
  formatCurrency,
  formatDecimal,
  formatSignedCurrency,
  formatSignedNumber,
  playerResultClass,
} from '../lib/formatters.js'
import { Avatar, LinkButton, PlayerNameCell } from './ui.jsx'

export function LeaderboardTable({ rows, onSelectPlayer, compact = false }) {
  return (
    <table className="responsive-table leaderboard-table">
      <thead>
        <tr>
          <th>Player</th>
          <th>Power Score</th>
          <th>GP</th>
          <th>Net</th>
          <th>BB</th>
          {!compact ? <th>Avg</th> : null}
          {!compact ? <th>Win %</th> : null}
          {!compact ? <th>ROI</th> : null}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <td data-label="Player">
              <PlayerNameCell name={row.player} onSelect={onSelectPlayer} rank={row.rank} />
            </td>
            <td data-label="Power Score">{formatDecimal(row.powerRanking)}</td>
            <td data-label="GP">{row.gamesPlayed}</td>
            <td data-label="Net" className={playerResultClass(row.totalProfit)}>{formatSignedCurrency(row.totalProfit)}</td>
            <td data-label="BB" className={playerResultClass(row.bbProfit)}>{formatSignedNumber(row.bbProfit)}</td>
            {!compact ? (
              <td data-label="Avg" className={playerResultClass(row.averageProfit)}>{formatSignedCurrency(row.averageProfit)}</td>
            ) : null}
            {!compact ? <td data-label="Win %">{row.winRate}</td> : null}
            {!compact ? <td data-label="ROI">{row.roi}</td> : null}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function SessionsTable({ games, onOpenGame, onSelectPlayer, compact = false }) {
  return (
    <table className={`responsive-table sessions-table${compact ? ' compact-recaps-table' : ''}`}>
      <thead>
        <tr>
          <th>Session</th>
          <th>Winner</th>
          <th>Players</th>
          <th>Total</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {games.map((game) => (
          <tr key={game.id}>
            <td data-label="Session">{game.gameName}</td>
            <td data-label="Winner">
              <div className="player-name-inline">
                {game.winner ? (
                  onSelectPlayer ? (
                    <PlayerNameCell name={game.winner.player} onSelect={onSelectPlayer} />
                  ) : (
                    <>
                      <Avatar name={game.winner.player} />
                      <span>{game.winner.player}</span>
                    </>
                  )
                ) : (
                  <span>—</span>
                )}
              </div>
            </td>
            <td data-label="Players">{game.players.length}</td>
            <td data-label="Total">{formatCurrency(game.totalBuyIn)}</td>
            <td data-label="Action">
              <LinkButton onClick={() => onOpenGame(game.id)} ariaLabel={`Open ${game.gameName}`}>
                <svg viewBox="0 0 24 24" aria-hidden="true" className="table-action-icon">
                  <path
                    d="M7 17L17 7M9 7h8v8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </LinkButton>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
