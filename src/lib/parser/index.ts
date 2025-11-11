import * as fs from 'node:fs'

import type {
  AmbiguityRow,
  ContextRow,
  IntentRow,
  MeaningRow,
  QueryRow,
  ScoreRow,
  StructureRow,
  TableRow,
  TasksRow,
  TqlDocument,
} from './types.js'

/**
 * Parse a .tql file into a JSON structure
 */
export function parseTql(filePath: string): TqlDocument {
  const content = fs.readFileSync(filePath, 'utf8')
  return parseTqlFromString(content)
}

/**
 * Parse TQL content string into a JSON structure
 */
export function parseTqlFromString(content: string): TqlDocument {
  const lines = content.split('\n')

  const doc: TqlDocument = {
    ambiguity: {rows: []},
    context: {rows: []},
    intent: {rows: []},
    meaning: {rows: []},
    query: {rows: []},
    score: {rows: []},
    structure: {rows: []},
    table: {rows: []},
    tasks: {rows: []},
  }

  let currentFacet: null | string = null
  let currentHeaders: string[] = []
  let inDataSection = false
  let headerParsed = false

  for (const line_ of lines) {
    const line = line_.trim()

    // Detect end of table section (empty line after table)
    if (line === '' && currentHeaders.length > 0) {
      currentHeaders = []
      inDataSection = false
      headerParsed = false
      continue
    }

    // Detect facet headers (e.g., @table[25]:)
    const facetName = parseFacetHeader(line)
    if (facetName) {
      currentFacet = facetName
      inDataSection = true
      headerParsed = false
      currentHeaders = []
      continue
    }

    // Skip empty lines or lines without a current facet
    if (!line || !currentFacet) continue

    // Skip separator rows (mark header as parsed)
    if (isSeparatorRow(line)) {
      headerParsed = true
      continue
    }

    // Parse table header row
    if (inDataSection && isTableRow(line) && !headerParsed && currentHeaders.length === 0) {
      currentHeaders = parseTableRow(line)
      continue
    }

    // Parse data rows (only after header is parsed)
    if (inDataSection && headerParsed && isTableRow(line)) {
      const cells = parseTableRow(line)
      const row: Record<string, string> = {}

      for (const [j, currentHeader] of currentHeaders.entries()) {
        row[currentHeader] = cells[j] || ''
      }

      addRowToFacet(doc, currentFacet, row)
    }
  }

  return doc
}

/**
 * Parse a markdown table row into an array of cell values
 */
function parseTableRow(line: string): string[] {
  // Remove leading and trailing pipes and split by pipe
  const trimmed = line.trim().slice(1, -1) // Remove first and last |
  const cells = trimmed.split('|').map((cell) => cell.trim())
  return cells
}

/**
 * Check if a line is a markdown table separator (e.g., |---|---|)
 */
function isSeparatorRow(line: string): boolean {
  return /^\|[-\s|]+\|$/.test(line)
}

/**
 * Check if a line is a table row (starts with |)
 */
function isTableRow(line: string): boolean {
  return line.startsWith('|')
}

/**
 * Parse facet header and return facet name if found
 * (e.g., @table[25]: returns 'table')
 */
function parseFacetHeader(line: string): null | string {
  const facetMatch = line.match(/^@(\w+)\[\d+\]:/)
  return facetMatch ? facetMatch[1] : null
}

/**
 * Facet registry: maps facet names to functions that add rows to the document
 * This pattern makes it easy to add new facets without modifying parser logic
 */
const FACET_REGISTRY: Record<string, (doc: TqlDocument, row: Record<string, string>) => void> = {
  ambiguity: (doc, row) => doc.ambiguity.rows.push(row as unknown as AmbiguityRow),
  context: (doc, row) => doc.context.rows.push(row as unknown as ContextRow),
  intent: (doc, row) => doc.intent.rows.push(row as unknown as IntentRow),
  meaning: (doc, row) => doc.meaning.rows.push(row as unknown as MeaningRow),
  query: (doc, row) => doc.query.rows.push(row as unknown as QueryRow),
  score: (doc, row) => doc.score.rows.push(row as unknown as ScoreRow),
  structure: (doc, row) => doc.structure.rows.push(row as unknown as StructureRow),
  table: (doc, row) => doc.table.rows.push(row as unknown as TableRow),
  tasks: (doc, row) => doc.tasks.rows.push(row as unknown as TasksRow),
}

/**
 * Add a row to the appropriate facet in the document using the registry pattern
 */
function addRowToFacet(doc: TqlDocument, facet: string, row: Record<string, string>): void {
  const addRow = FACET_REGISTRY[facet]
  if (addRow) {
    addRow(doc, row)
  }
}

/**
 * Export TQL document to JSON file (optional, for debugging)
 */
export function writeTqlJson(filePath: string, doc: TqlDocument): void {
  fs.writeFileSync(filePath, JSON.stringify(doc, null, 2), 'utf8')
}
