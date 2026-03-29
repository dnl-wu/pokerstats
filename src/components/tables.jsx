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
    <table>
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
            <td>
              <PlayerNameCell name={row.player} onSelect={onSelectPlayer} rank={row.rank} />
            </td>
            <td>{formatDecimal(row.powerRanking)}</td>
            <td>{row.gamesPlayed}</td>
            <td className={playerResultClass(row.totalProfit)}>{formatSignedCurrency(row.totalProfit)}</td>
            <td className={playerResultClass(row.bbProfit)}>{formatSignedNumber(row.bbProfit)}</td>
            {!compact ? (
              <td className={playerResultClass(row.averageProfit)}>{formatSignedCurrency(row.averageProfit)}</td>
            ) : null}
            {!compact ? <td>{row.winRate}</td> : null}
            {!compact ? <td>{row.roi}</td> : null}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function SessionsTable({ games, onOpenGame, onSelectPlayer, compact = false }) {
  return (
    <table className={compact ? 'compact-recaps-table' : ''}>
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
            <td>{game.gameName}</td>
            <td>
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
            <td>{game.players.length}</td>
            <td>{formatCurrency(game.totalBuyIn)}</td>
            <td>
              <LinkButton onClick={() => onOpenGame(game.id)}>
                {compact ? 'View' : 'View Session'}
              </LinkButton>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
