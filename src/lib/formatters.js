export function toNumber(value) {
  const normalized = String(value ?? '')
    .replace(/[$,%]/g, '')
    .replace(/,/g, '')
    .trim()

  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : 0
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatSignedCurrency(value) {
  if (value === 0) return formatCurrency(0)
  return `${value > 0 ? '+' : '-'}${formatCurrency(Math.abs(value))}`
}

export function formatSignedNumber(value) {
  if (value === 0) return '0'
  return `${value > 0 ? '+' : ''}${value}`
}

export function formatDecimal(value, digits = 2) {
  return Number(value).toFixed(digits)
}

export function formatBigBlind(value) {
  if (!value) return 'N/A'
  return `$${Number(value).toFixed(Number(value) % 1 === 0 ? 0 : 2)}/$${Number(value * 2).toFixed(
    Number(value * 2) % 1 === 0 ? 0 : 2,
  )}`
}

export function getInitials(name) {
  return String(name ?? '')
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function playerResultClass(value) {
  if (value > 0) return 'diff-positive'
  if (value < 0) return 'diff-negative'
  return ''
}
