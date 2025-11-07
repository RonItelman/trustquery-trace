export interface MeaningFacetInput {
  headers: string[]
}

export function generateMeaningFacet(input: MeaningFacetInput): string {
  const {headers} = input

  // Define column widths for the meaning table
  const columnWidth = Math.max(...headers.map((h) => h.length), 'column'.length)
  const definitionWidth = 'definition'.length
  const userConfirmedWidth = 'user_confirmed'.length

  // Build the table
  const lines: string[] = []

  // Add prefix with row count (number of columns)
  lines.push(`@meaning[${headers.length}]:`)

  // Add header row
  const headerRow =
    '| ' +
    'column'.padEnd(columnWidth) +
    ' | ' +
    'definition'.padEnd(definitionWidth) +
    ' | ' +
    'user_confirmed'.padEnd(userConfirmedWidth) +
    ' |'
  lines.push(headerRow)

  // Add separator row
  const separator =
    '|' +
    '-'.repeat(columnWidth + 2) +
    '|' +
    '-'.repeat(definitionWidth + 2) +
    '|' +
    '-'.repeat(userConfirmedWidth + 2) +
    '|'
  lines.push(separator)

  // Add data rows (one per column, with blank definition and user_confirmed)
  for (const header of headers) {
    const dataRow =
      '| ' +
      header.padEnd(columnWidth) +
      ' | ' +
      ''.padEnd(definitionWidth) +
      ' | ' +
      ''.padEnd(userConfirmedWidth) +
      ' |'
    lines.push(dataRow)
  }

  return lines.join('\n')
}
