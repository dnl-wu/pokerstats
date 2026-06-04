import {
  PLAYER_PHOTOS,
  isS1ChampionPlayer,
  playerRankBadgeTone,
  playerRankTone,
} from '../lib/constants.js'
import { formatCurrency, formatSignedNumber, getInitials } from '../lib/formatters.js'

export function Avatar({ name, large = false }) {
  const photoSrc = PLAYER_PHOTOS[name]

  return (
    <span className={`profile-avatar${large ? ' large' : ''}`}>
      {photoSrc ? <img src={photoSrc} alt={name} className="profile-avatar-image" /> : getInitials(name)}
    </span>
  )
}

export function PlayerRankBadge({ rank, rankTotal }) {
  if (typeof rank !== 'number') {
    return null
  }

  const badgeClassName = ['rank-num', playerRankBadgeTone(rank, rankTotal)].filter(Boolean).join(' ')

  return <span className={badgeClassName}>{rank}</span>
}

export function PlayerNameLabel({ name, rank, rankTotal }) {
  const champion = isS1ChampionPlayer(name)
  const nameClassName = [
    'player-name-text',
    champion ? 'player-name-champion' : playerRankTone(rank),
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      <span className={nameClassName}>{name}</span>
      {champion ? <span className="champion-tag">S1 Champion</span> : null}
      <PlayerRankBadge rank={rank} rankTotal={rankTotal} />
    </>
  )
}

export function PlayerNameCell({ name, onSelect, rank, rankTotal }) {
  return (
    <button type="button" className="player-name-button" onClick={() => onSelect(name)}>
      <Avatar name={name} />
      <PlayerNameLabel name={name} rank={rank} rankTotal={rankTotal} />
    </button>
  )
}

export function PlayerNameInlineButton({ name, onSelect, rank, rankTotal }) {
  return (
    <button type="button" className="player-inline-button" onClick={() => onSelect(name)}>
      <PlayerNameLabel name={name} rank={rank} rankTotal={rankTotal} />
    </button>
  )
}

export function SessionNameButton({ name, onOpen, ariaLabel }) {
  return (
    <LinkButton onClick={onOpen} ariaLabel={ariaLabel}>
      {name}
    </LinkButton>
  )
}

export function LinkButton({ children, onClick, ariaLabel }) {
  return (
    <button type="button" className="link-button" onClick={onClick} aria-label={ariaLabel}>
      {children}
    </button>
  )
}

export function SectionHeader({ title, actionLabel, onAction }) {
  return (
    <div className="section-header">
      <div className="section-title-row">
        <h2 className="section-title">{title}</h2>
        {actionLabel ? (
          <button
            type="button"
            className="section-icon-button"
            onClick={onAction}
            aria-label={actionLabel}
            title={actionLabel}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M7 17L17 7M9 7h8v8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : null}
      </div>
    </div>
  )
}

export function PageHeader({ title, badge, badgeClassName = '' }) {
  return (
    <div className="page-header">
      <h1 className="page-title">{title}</h1>
      {badge ? <div className={`season-badge ${badgeClassName}`.trim()}>{badge}</div> : null}
    </div>
  )
}

export function StandingsCard({ children }) {
  return (
    <div className="standings-card">
      <div className="table-responsive">{children}</div>
    </div>
  )
}

export function Header({ onHome, onOpenSessions, onOpenPlayers, currentView = 'home' }) {
  return (
    <>
      <header>
        <div className="nav-container">
          <button type="button" className="logo" onClick={onHome}>
            <img src="/adams-basement-logo.png" alt="" className="logo-image" />
            <span>Adam&apos;s Basement</span>
          </button>
          <a
            className="instagram-link"
            href="https://www.instagram.com/adamsbasementelite/"
            target="_blank"
            rel="noreferrer"
            aria-label="Adam's Basement Instagram"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5a4.25 4.25 0 0 0 4.25 4.25h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5Zm8.88 1.12a.88.88 0 1 1 0 1.76.88.88 0 0 1 0-1.76ZM12 6.5A5.5 5.5 0 1 1 6.5 12 5.51 5.51 0 0 1 12 6.5Zm0 1.5A4 4 0 1 0 16 12a4 4 0 0 0-4-4Z" />
            </svg>
          </a>
        </div>
      </header>
      <div className="announcement-bar" aria-label="League announcement">
        <div className="announcement-inner">
          <div className="announcement-text">
            <span>Adam&apos;s Basement S2 Playoffs: Open for Qualification</span>
          </div>
        </div>
      </div>
      <div className="sub-nav">
        <div className="sub-nav-container">
          <button
            type="button"
            className={`sub-nav-link ${currentView === 'home' ? 'active' : ''}`}
            onClick={onHome}
          >
            Standings
          </button>
          <button
            type="button"
            className={`sub-nav-link ${currentView === 'sessions' ? 'active' : ''}`}
            onClick={onOpenSessions}
          >
            Game Recaps
          </button>
          <button
            type="button"
            className={`sub-nav-link ${currentView === 'players' ? 'active' : ''}`}
            onClick={onOpenPlayers}
          >
            Stat Leaders
          </button>
        </div>
      </div>
    </>
  )
}

export function SummaryCards({ topCashout, topBbProfit, onSelectPlayer, playerRanks = new Map() }) {
  return (
    <div className="summary-card-grid">
      <div className="summary-stat-card">
        <div className="summary-stat-label">Top Cash Out</div>
        <div className="summary-stat-value">
          {topCashout ? (
            <>
              <PlayerNameInlineButton
                name={topCashout.player}
                onSelect={onSelectPlayer}
                rank={playerRanks.get(topCashout.player)?.rank}
                rankTotal={playerRanks.get(topCashout.player)?.total}
              />{' '}
              <span className="summary-stat-metric">{formatCurrency(topCashout.cashOut)}</span>
            </>
          ) : (
            'Loading'
          )}
        </div>
      </div>
      <div className="summary-stat-card">
        <div className="summary-stat-label">Top BB Profit</div>
        <div className="summary-stat-value">
          {topBbProfit ? (
            <>
              <PlayerNameInlineButton
                name={topBbProfit.player}
                onSelect={onSelectPlayer}
                rank={playerRanks.get(topBbProfit.player)?.rank}
                rankTotal={playerRanks.get(topBbProfit.player)?.total}
              />{' '}
              <span className="summary-stat-metric">{formatSignedNumber(topBbProfit.bbProfit)} BB</span>
            </>
          ) : (
            'Loading'
          )}
        </div>
      </div>
    </div>
  )
}
