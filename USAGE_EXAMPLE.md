# Using trustql as a Library in Your Project

## Installation

```bash
# From npm
npm install trustql

# OR from GitHub
npm install github:RonItelman/tql-cli

# OR local development
npm install /path/to/tql-cli
```

## Example: CSV Drag & Drop

```typescript
import { readCsv, generateTql } from 'trustql'
import fs from 'fs'

// When user drops a CSV file
function handleCsvDrop(csvFilePath: string) {
  // 1. Read the CSV
  const csvData = readCsv(csvFilePath)

  // 2. Generate TQL (returns a string, all in-memory)
  const tqlContent = generateTql({
    headers: csvData.headers,
    rows: csvData.rows
  })

  // 3. Save to file (optional)
  fs.writeFileSync('output.tql', tqlContent, 'utf-8')

  // OR return the string for in-memory use
  return tqlContent
}

// Usage
const tqlString = handleCsvDrop('./data/transactions.csv')
console.log('Generated TQL:', tqlString)
```

## Example: Working with TQL in Memory

```typescript
import { readCsv, generateTql, parseTql, writeTql } from 'trustql'

// Read CSV and generate TQL
const csvData = readCsv('./data.csv')
const tqlString = generateTql({
  headers: csvData.headers,
  rows: csvData.rows
})

// Save initial TQL
fs.writeFileSync('data.tql', tqlString)

// Later: Parse TQL to JSON for manipulation
const doc = parseTql('data.tql')

// Update definitions
doc.meaning.rows.find(r => r.column === 'amount')!.definition = 'Transaction amount in USD'

// Add context
doc.context.rows.push({
  index: 1,
  key: 'timezone',
  value: 'America/New_York'
})

// Save updated TQL
writeTql('data.tql', doc)
```

## Example: Generate TQL without Files

```typescript
import { generateTql } from 'trustql'

// In-memory CSV data
const data = {
  headers: ['id', 'name', 'amount'],
  rows: [
    ['1', 'Alice', '100'],
    ['2', 'Bob', '200']
  ]
}

// Generate TQL string (no file operations)
const tqlString = generateTql(data)

// Use the string however you need
sendToClient(tqlString)
// OR save it
// OR parse it
```

## TypeScript Types

```typescript
import type {
  TqlDocument,
  MeaningRow,
  StructureRow
} from 'trustql'

function processTql(doc: TqlDocument) {
  doc.meaning.rows.forEach((row: MeaningRow) => {
    console.log(`Column: ${row.column}, Definition: ${row.definition}`)
  })
}
```

## API Reference

### Core Functions

- `readCsv(filePath: string)` - Read CSV file
- `generateTql(input, options?)` - Generate TQL string from CSV data
- `parseTql(filePath: string)` - Parse TQL file to JSON
- `generateTqlFromJson(doc: TqlDocument)` - Convert JSON to TQL string
- `writeTql(filePath: string, doc: TqlDocument)` - Write TQL document to file
- `writeTqlJson(filePath: string, doc: TqlDocument)` - Export to JSON file (debugging)

### Types

All types exported: `TqlDocument`, `DataRow`, `MeaningRow`, `StructureRow`, etc.

See `src/lib/parser/types.ts` for complete type definitions.
