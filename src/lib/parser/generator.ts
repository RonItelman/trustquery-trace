import * as fs from 'node:fs'
import type {TqlDocument} from './types.js'

/**
 * Generate a .tql file from a TqlDocument JSON structure
 */
export function generateTqlFromJson(doc: TqlDocument): string {
  const sections: string[] = []

  // Generate each facet in logical order
  if (doc.data.rows.length > 0) {
    sections.push(generateDataSection(doc))
  }

  if (doc.meaning.rows.length > 0) {
    sections.push(generateMeaningSection(doc))
  }

  if (doc.structure.rows.length > 0) {
    sections.push(generateStructureSection(doc))
  }

  if (doc.ambiguity.rows.length > 0) {
    sections.push(generateAmbiguitySection(doc))
  }

  if (doc.intent.rows.length > 0) {
    sections.push(generateIntentSection(doc))
  }

  if (doc.context.rows.length > 0) {
    sections.push(generateContextSection(doc))
  }

  if (doc.query.rows.length > 0) {
    sections.push(generateQuerySection(doc))
  }

  if (doc.tasks.rows.length > 0) {
    sections.push(generateTasksSection(doc))
  }

  if (doc.score.rows.length > 0) {
    sections.push(generateScoreSection(doc))
  }

  return sections.join('\n\n')
}

/**
 * Write TQL document to file
 */
export function writeTql(filePath: string, doc: TqlDocument): void {
  const content = generateTqlFromJson(doc)
  fs.writeFileSync(filePath, content, 'utf-8')
}

// Helper function to generate a table section
function generateTable(headers: string[], rows: Record<string, any>[], rowCount: number, facetName: string): string {
  const lines: string[] = []

  // Add facet header
  lines.push(`@${facetName}[${rowCount}]:`)

  // Calculate column widths
  const colWidths: number[] = headers.map((header) => {
    const headerWidth = header.length
    const maxDataWidth = Math.max(...rows.map((row) => String(row[header] || '').length))
    return Math.max(headerWidth, maxDataWidth)
  })

  // Add header row
  const headerRow = '| ' + headers.map((h, i) => h.padEnd(colWidths[i])).join(' | ') + ' |'
  lines.push(headerRow)

  // Add separator row
  const separator = '|' + colWidths.map((w) => '-'.repeat(w + 2)).join('|') + '|'
  lines.push(separator)

  // Add data rows
  for (const row of rows) {
    const dataRow = '| ' + headers.map((h, i) => String(row[h] || '').padEnd(colWidths[i])).join(' | ') + ' |'
    lines.push(dataRow)
  }

  return lines.join('\n')
}

function generateDataSection(doc: TqlDocument): string {
  if (doc.data.rows.length === 0) return ''

  // Get all column names from the first row (excluding index)
  const firstRow = doc.data.rows[0]
  const headers = Object.keys(firstRow)

  return generateTable(headers, doc.data.rows, doc.data.rows.length, 'data')
}

function generateMeaningSection(doc: TqlDocument): string {
  const headers = ['index', 'column', 'definition', 'user_confirmed']
  return generateTable(headers, doc.meaning.rows, doc.meaning.rows.length, 'meaning')
}

function generateStructureSection(doc: TqlDocument): string {
  const headers = ['index', 'column', 'nullAllowed', 'dataType', 'minValue', 'maxValue', 'format', 'user_confirmed']
  return generateTable(headers, doc.structure.rows, doc.structure.rows.length, 'structure')
}

function generateAmbiguitySection(doc: TqlDocument): string {
  const headers = ['index', 'query_trigger', 'ambiguity_type', 'ambiguity_risk']
  return generateTable(headers, doc.ambiguity.rows, doc.ambiguity.rows.length, 'ambiguity')
}

function generateIntentSection(doc: TqlDocument): string {
  const headers = ['index', 'query_trigger', 'clarifying_question', 'options', 'user_response', 'user_confirmed']
  return generateTable(headers, doc.intent.rows, doc.intent.rows.length, 'intent')
}

function generateContextSection(doc: TqlDocument): string {
  const headers = ['index', 'key', 'value']
  return generateTable(headers, doc.context.rows, doc.context.rows.length, 'context')
}

function generateQuerySection(doc: TqlDocument): string {
  const headers = ['index', 'user_message', 'timestamp_utc']
  return generateTable(headers, doc.query.rows, doc.query.rows.length, 'query')
}

function generateTasksSection(doc: TqlDocument): string {
  const headers = ['index', 'name', 'description', 'formula']
  return generateTable(headers, doc.tasks.rows, doc.tasks.rows.length, 'tasks')
}

function generateScoreSection(doc: TqlDocument): string {
  const headers = ['index', 'measure', 'value']
  return generateTable(headers, doc.score.rows, doc.score.rows.length, 'score')
}
