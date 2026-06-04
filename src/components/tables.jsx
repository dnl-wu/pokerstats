import {
  formatCurrency,
  formatDecimal,
  formatSignedCurrency,
  formatSignedNumber,
  playerResultClass,
} from '../lib/formatters.js'
import { Avatar, LinkButton, PlayerNameCell, PlayerNameLabel, SessionNameButton } from './ui.jsx'

function LeaderboardRows({ rows, onSelectPlayer, compact, rankTotal }) {
  return rows.map((row) => (
    <tr key={row.id}>
      <td data-label="Player">
        <PlayerNameCell name={row.player} onSelect={onSelectPlayer} rank={row.rank} rankTotal={rankTotal} />
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
  ))
}

function LeaderboardTableMarkup({ rows, onSelectPlayer, compact = false, className = '', rankTotal = rows.length }) {
  return (
    <table className={`responsive-table leaderboard-table ${className}`.trim()}>
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
        <LeaderboardRows rows={rows} onSelectPlayer={onSelectPlayer} compact={compact} rankTotal={rankTotal} />
      </tbody>
    </table>
  )
}

function PodiumCard({ row, onSelectPlayer, rankTotal }) {
  return (
    <button
      type="button"
      className={`podium-card podium-rank-${row.rank}`}
      onClick={() => onSelectPlayer(row.player)}
      aria-label={`Open ${row.player}`}
    >
      <div className="podium-rank" aria-label={`Power score ${formatDecimal(row.powerRanking)}`}>
        {formatDecimal(row.powerRanking)}
      </div>
      <Avatar name={row.player} large />
      <div className="podium-player" data-power-score={formatDecimal(row.powerRanking)}>
        <PlayerNameLabel name={row.player} rank={row.rank} rankTotal={rankTotal} />
      </div>
    </button>
  )
}

function LeaderboardPodium({ rows, onSelectPlayer, rankTotal }) {
  const podiumRows = [2, 1, 3]
    .map((rank) => rows.find((row) => row.rank === rank))
    .filter(Boolean)

  return (
    <div className="leaderboard-podium">
      {podiumRows.map((row) => (
        <PodiumCard key={row.id} row={row} onSelectPlayer={onSelectPlayer} rankTotal={rankTotal} />
      ))}
    </div>
  )
}

export function LeaderboardTable({
  rows,
  onSelectPlayer,
  compact = false,
  splitTopThree = false,
  rankTotal = rows.length,
}) {
  if (!splitTopThree) {
    return (
      <LeaderboardTableMarkup
        rows={rows}
        onSelectPlayer={onSelectPlayer}
        compact={compact}
        rankTotal={rankTotal}
      />
    )
  }

  const topRows = rows.filter((row) => row.rank <= 3)
  const remainingRows = rows.filter((row) => row.rank > 3)

  return (
    <div className="leaderboard-split">
      <div>
        <div className="leaderboard-table-label">Top 3</div>
        <LeaderboardPodium rows={topRows} onSelectPlayer={onSelectPlayer} rankTotal={rankTotal} />
      </div>
      {remainingRows.length ? (
        <div>
          <LeaderboardTableMarkup
            rows={remainingRows}
            onSelectPlayer={onSelectPlayer}
            compact={compact}
            rankTotal={rankTotal}
          />
        </div>
      ) : null}
    </div>
  )
}

export function SessionsTable({ games, onOpenGame, onSelectPlayer, compact = false, playerRanks = new Map() }) {
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
            <td data-label="Session">
              <SessionNameButton
                name={game.gameName}
                onOpen={() => onOpenGame(game.id)}
                ariaLabel={`Open ${game.gameName}`}
              />
            </td>
            <td data-label="Winner">
              <div className="player-name-inline">
                {game.winner ? (
                  onSelectPlayer ? (
                    <PlayerNameCell
                      name={game.winner.player}
                      onSelect={onSelectPlayer}
                      rank={playerRanks.get(game.winner.player)?.rank}
                      rankTotal={playerRanks.get(game.winner.player)?.total}
                    />
                  ) : (
                    <>
                      <Avatar name={game.winner.player} />
                      <PlayerNameLabel
                        name={game.winner.player}
                        rank={playerRanks.get(game.winner.player)?.rank}
                        rankTotal={playerRanks.get(game.winner.player)?.total}
                      />
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
