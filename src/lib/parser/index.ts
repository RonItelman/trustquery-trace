import * as fs from 'node:fs'
import type {
  AmbiguityRow,
  ContextRow,
  DataRow,
  IntentRow,
  MeaningRow,
  QueryRow,
  ScoreRow,
  StructureRow,
  TasksRow,
  TqlDocument,
} from './types.js'

/**
 * Parse a .tql file into a JSON structure
 */
export function parseTql(filePath: string): TqlDocument {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')

  const doc: TqlDocument = {
    ambiguity: {rows: []},
    context: {rows: []},
    data: {rows: []},
    intent: {rows: []},
    meaning: {rows: []},
    query: {rows: []},
    score: {rows: []},
    structure: {rows: []},
    tasks: {rows: []},
  }

  let currentFacet: string | null = null
  let currentHeaders: string[] = []
  let inDataSection = false
  let headerParsed = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Detect end of table section (empty line after table)
    if (line === '' && currentHeaders.length > 0) {
      currentHeaders = []
      inDataSection = false
      headerParsed = false
    }

    // Detect facet headers (e.g., @data[25]:)
    const facetMatch = line.match(/^@(\w+)\[\d+\]:/)
    if (facetMatch) {
      currentFacet = facetMatch[1]
      inDataSection = true
      headerParsed = false
      currentHeaders = [] // Reset headers for new facet
      continue
    }

    // Skip empty lines
    if (!line || !currentFacet) continue

    // Skip separator rows
    if (line.match(/^\|[-\s|]+\|$/)) {
      headerParsed = true // After separator, we know header is done
      continue
    }

    // Parse table header row
    if (inDataSection && line.startsWith('|') && !headerParsed) {
      const cells = parseTableRow(line)
      if (cells.length > 0 && !currentHeaders.length) {
        // This is the header row
        currentHeaders = cells
        continue
      }
    }

    // Parse data rows (only after header is parsed)
    if (inDataSection && headerParsed && line.startsWith('|')) {
      const cells = parseTableRow(line)

      const row: Record<string, string> = {}
      for (let j = 0; j < currentHeaders.length; j++) {
        row[currentHeaders[j]] = cells[j] || ''
      }

      // Add to appropriate facet
      switch (currentFacet) {
        case 'data':
          doc.data.rows.push(row as unknown as DataRow)
          break
        case 'meaning':
          doc.meaning.rows.push(row as unknown as MeaningRow)
          break
        case 'structure':
          doc.structure.rows.push(row as unknown as StructureRow)
          break
        case 'ambiguity':
          doc.ambiguity.rows.push(row as unknown as AmbiguityRow)
          break
        case 'intent':
          doc.intent.rows.push(row as unknown as IntentRow)
          break
        case 'context':
          doc.context.rows.push(row as unknown as ContextRow)
          break
        case 'query':
          doc.query.rows.push(row as unknown as QueryRow)
          break
        case 'tasks':
          doc.tasks.rows.push(row as unknown as TasksRow)
          break
        case 'score':
          doc.score.rows.push(row as unknown as ScoreRow)
          break
      }
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
 * Export TQL document to JSON file (optional, for debugging)
 */
export function writeTqlJson(filePath: string, doc: TqlDocument): void {
  fs.writeFileSync(filePath, JSON.stringify(doc, null, 2), 'utf-8')
}
