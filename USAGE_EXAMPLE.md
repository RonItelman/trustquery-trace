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
import { readCsv, generateTql, parseTqlFromString, writeTqlJson } from 'trustql'
import fs from 'fs'

// When user drops a CSV file
function handleCsvDrop(csvFilePath: string, format: 'tql' | 'json' = 'tql') {
  // 1. Read the CSV
  const csvData = readCsv(csvFilePath)

  // 2. Generate TQL (returns a string, all in-memory)
  const tqlContent = generateTql({
    headers: csvData.headers,
    rows: csvData.rows
  })

  // 3. Choose output format
  if (format === 'json') {
    // Convert TQL string to JSON
    const tqlDoc = parseTqlFromString(tqlContent)
    writeTqlJson('output.json', tqlDoc)
    return tqlDoc
  } else {
    // Save as TQL
    fs.writeFileSync('output.tql', tqlContent, 'utf-8')
    return tqlContent
  }
}

// Usage - TQL format
const tqlString = handleCsvDrop('./data/transactions.csv', 'tql')

// Usage - JSON format
const tqlJson = handleCsvDrop('./data/transactions.csv', 'json')
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

## Example: Insert Rows Programmatically

```typescript
import { insertRow, insertRows } from 'trustql'

// Insert a single row to @context facet
insertRow('data.tql', 'context', {
  key: 'user-timezone',
  value: 'MST'
})

// Insert multiple rows at once
insertRows('data.tql', 'tasks', [
  {
    name: 'total_transferred',
    description: 'Sum of all completed transfers',
    formula: 'SUM(amount_usd WHERE status=completed)'
  },
  {
    name: 'avg_settlement',
    description: 'Average settlement time',
    formula: 'AVG(settlement_time_mins)'
  }
])

// Index is auto-assigned based on current row count
```

## CLI: Create Command

```bash
# Create TQL file from CSV (default format)
tql create --source csv --in data.csv

# Create JSON file from CSV
tql create --source csv --in data.csv --format json

# Specify custom output path
tql create --source csv --in data.csv --format json --out output.json
```

## CLI: Insert Command

```bash
# Insert using key/value flags (for @context facet)
tql insert --file data.tql --facet context --key user-timezone --value MST

# Insert using JSON data (for any facet)
tql insert --file data.tql --facet tasks --data '{"name":"total_transferred","description":"Sum of all completed transfers","formula":"SUM(amount_usd WHERE status=completed)"}'
```

## API Reference

### Core Functions

- `readCsv(filePath: string)` - Read CSV file
- `generateTql(input, options?)` - Generate TQL string from CSV data (in-memory)
- `parseTql(filePath: string)` - Parse TQL file to JSON
- `parseTqlFromString(content: string)` - Parse TQL content string to JSON (in-memory)
- `generateTqlFromJson(doc: TqlDocument)` - Convert JSON to TQL string
- `writeTql(filePath: string, doc: TqlDocument)` - Write TQL document to .tql file
- `writeTqlJson(filePath: string, doc: TqlDocument)` - Write TQL document to .json file
- `insertRow(filePath, facet, data)` - Insert a single row into a facet
- `insertRows(filePath, facet, dataArray)` - Insert multiple rows into a facet

### Types

All types exported: `TqlDocument`, `DataRow`, `MeaningRow`, `StructureRow`, etc.

See `src/lib/parser/types.ts` for complete type definitions.
