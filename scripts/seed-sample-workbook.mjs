/**
 * Generates public/Adambasementelite.xlsx for local dev / demo.
 * Replace this file with your real export; keep sheet names Sessions + Players.
 */
import XLSX from 'xlsx'
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outPath = join(__dirname, '..', 'public', 'Adambasementelite.xlsx')

const sessions = [
  {
    Player: 'Mike',
    'Game name': 'Opening Day',
    Date: '2026-03-20',
    'Buy in': 100,
    'Cash out': 180,
    'Net profit': 80,
    'Big Blind': 0.5,
    'Profit(BB)': 160,
  },
  {
    Player: 'Sarah',
    'Game name': 'Opening Day',
    Date: '2026-03-20',
    'Buy in': 100,
    'Cash out': 90,
    'Net profit': -10,
    'Big Blind': 0.5,
    'Profit(BB)': -20,
  },
  {
    Player: 'Mike',
    'Game name': 'Bombpot',
    Date: '2026-03-27',
    'Buy in': 200,
    'Cash out': 260,
    'Net profit': 60,
    'Big Blind': 0.5,
    'Profit(BB)': 120,
  },
]

const players = [
  {
    Player: 'Mike',
    'Total Profit': 140,
    'Games played': 2,
    'Average profit': 70,
    'Win Rate': '100%',
    ROI: '35%',
    'BB Profit': 280,
    Player_1: 'Mike',
    'Power Score': 95,
  },
  {
    Player: 'Sarah',
    'Total Profit': -10,
    'Games played': 1,
    'Average profit': -10,
    'Win Rate': '0%',
    ROI: '-10%',
    'BB Profit': -20,
    Player_1: 'Sarah',
    'Power Score': 72,
  },
]

const workbook = XLSX.utils.book_new()
XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(sessions), 'Sessions')
XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(players), 'Players')

writeFileSync(outPath, XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }))
console.log('Wrote', outPath)
