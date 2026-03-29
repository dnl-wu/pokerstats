import { PLAYER_PHOTOS } from '../lib/constants.js'
import { formatCurrency, formatSignedNumber, getInitials } from '../lib/formatters.js'

export function Avatar({ name, large = false }) {
  const photoSrc = PLAYER_PHOTOS[name]

  return (
    <span className={`profile-avatar${large ? ' large' : ''}`}>
      {photoSrc ? <img src={photoSrc} alt={name} className="profile-avatar-image" /> : getInitials(name)}
    </span>
  )
}

export function PlayerNameCell({ name, onSelect, rank }) {
  return (
    <button type="button" className="player-name-button" onClick={() => onSelect(name)}>
      {typeof rank === 'number' ? <span className="rank-num">{rank}</span> : null}
      <Avatar name={name} />
      <span className="player-name-text">{name}</span>
    </button>
  )
}

export function LinkButton({ children, onClick }) {
  return (
    <button type="button" className="link-button" onClick={onClick}>
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

export function PageHeader({ title, badge }) {
  return (
    <div className="page-header">
      <h1 className="page-title">{title}</h1>
      {badge ? <div className="season-badge">{badge}</div> : null}
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
            <span>Adam&apos;s Basement Playoffs: May 1, 2026</span>
            <a
              className="announcement-link"
              href="https://www.instagram.com/p/DWcN0azj20G/"
              target="_blank"
              rel="noreferrer"
            >
              Learn More
            </a>
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

export function SummaryCards({ topCashout, topBbProfit }) {
  return (
    <div className="summary-card-grid">
      <div className="summary-stat-card">
        <div className="summary-stat-label">Top Cash Out</div>
        <div className="summary-stat-value">
          {topCashout ? `${topCashout.player} ${formatCurrency(topCashout.cashOut)}` : 'Loading'}
        </div>
      </div>
      <div className="summary-stat-card">
        <div className="summary-stat-label">Top BB Profit</div>
        <div className="summary-stat-value">
          {topBbProfit ? `${topBbProfit.player} ${formatSignedNumber(topBbProfit.bbProfit)} BB` : 'Loading'}
        </div>
      </div>
    </div>
  )
}
