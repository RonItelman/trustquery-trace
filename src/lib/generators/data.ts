export interface DataFacetInput {
  headers: string[]
  rows: string[][]
}

export function generateDataFacet(input: DataFacetInput): string {
  const {headers, rows} = input
  const numDataRows = rows.length

  // Calculate column widths
  const colWidths = headers.map((header, colIndex) => {
    const maxDataWidth = Math.max(...rows.map((row) => (row[colIndex] || '').length))
    return Math.max(header.length, maxDataWidth)
  })

  // Build the table
  const lines: string[] = []

  // Add prefix
  lines.push(`@data[${numDataRows}]:`)

  // Add header row
  const headerRow = '| ' + headers.map((h, i) => h.padEnd(colWidths[i])).join(' | ') + ' |'
  lines.push(headerRow)

  // Add separator row
  const separator = '|' + colWidths.map((w) => '-'.repeat(w + 2)).join('|') + '|'
  lines.push(separator)

  // Add data rows
  for (const row of rows) {
    const dataRow = '| ' + row.map((cell, i) => (cell || '').padEnd(colWidths[i])).join(' | ') + ' |'
    lines.push(dataRow)
  }

  return lines.join('\n')
}
