import * as fs from 'node:fs'

export interface CsvData {
  headers: string[]
  rows: string[][]
}

export function readCsv(filePath: string): CsvData {
  const content = fs.readFileSync(filePath, 'utf8')
  const parsedRows = parseCsv(content)

  if (parsedRows.length === 0) {
    throw new Error('CSV file is empty')
  }

  return {
    headers: parsedRows[0],
    rows: parsedRows.slice(1),
  }
}

function parseCsv(content: string): string[][] {
  const lines = content.trim().split('\n')
  return lines.map((line) => {
    // Simple CSV parsing (handles basic cases)
    // For more complex CSV with quotes and commas inside fields, we'd need a proper parser
    const cells: string[] = []
    let current = ''
    let inQuotes = false

    for (const char of line) {

      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        cells.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }

    cells.push(current.trim())

    return cells
  })
}
