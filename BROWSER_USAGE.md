# Browser Usage Guide

This guide shows how to use `@trustquery/trace` in browser environments (Chrome extensions, web apps).

## Installation

```bash
npm install @trustquery/trace
```

## Browser-Compatible API

### Core Functions

All these functions work in the browser (no Node.js `fs` dependency):

```typescript
import {
  // Browser-safe CSV parsing
  parseCsvString,
  type CsvData,

  // TQL generation
  generateTqlDocument,
  type TqlDocument,
  type TqlConversation,

  // CRUD operations (in-memory)
  insertRowInMemory,
  updateRowInMemory,
  deleteRowInMemory,

  // Type definitions
  type GenerateTqlDocumentInput
} from '@trustquery/trace'
```

### ⚠️ Not Browser-Compatible

These functions use Node.js `fs` module and won't work in browsers:

```typescript
// ❌ Don't use in browser
import { readCsv, writeTql, parseTql } from '@trustquery/trace'
```

## Usage Example: Chrome Extension

### 1. Extract Table from HTML

```typescript
// Convert HTML table to CSV string
function tableToCSV(table: HTMLTableElement): string {
  const rows = table.querySelectorAll('tr')
  const csvRows: string[] = []

  rows.forEach(row => {
    const cells = row.querySelectorAll('th, td')
    const values: string[] = []

    cells.forEach(cell => {
      let value = cell.textContent?.trim() || ''
      // Escape quotes and wrap in quotes if contains comma
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        value = `"${value.replace(/"/g, '""')}"`
      }
      values.push(value)
    })

    csvRows.push(values.join(','))
  })

  return csvRows.join('\n')
}
```

### 2. Parse CSV String

```typescript
import { parseCsvString } from '@trustquery/trace'

// Get table element
const table = document.querySelector('table')!

// Convert to CSV string
const csvString = tableToCSV(table)

// Parse CSV string (browser-compatible!)
const csvData = parseCsvString(csvString)

console.log(csvData)
// {
//   headers: ['country', 'population', 'gdp'],
//   rows: [
//     ['USA', '331000000', '21.4T'],
//     ['China', '1400000000', '14.3T'],
//     ...
//   ]
// }
```

### 3. Generate TQL Document

```typescript
import { generateTqlDocument } from '@trustquery/trace'

const tqlDocument = generateTqlDocument({
  source: {
    format: 'csv',
    data: {
      headers: csvData.headers,
      rows: csvData.rows
    }
  },
  facet: { name: '@table' }
})

console.log(tqlDocument)
// {
//   table: { rows: [...] },
//   meaning: { rows: [...] },
//   structure: { rows: [...] },
//   ambiguity: { rows: [] },
//   intent: { rows: [] },
//   context: { rows: [] },
//   query: { rows: [] },
//   tasks: { rows: [] },
//   score: { rows: [...] }
// }
```

### 4. Create Conversation

```typescript
const conversation: TqlConversation = {
  sequence: [
    { '#document[+0]': tqlDocument }
  ]
}
```

### 5. Add Metadata (for sharing)

```typescript
import { insertRowInMemory } from '@trustquery/trace'

// Add context
insertRowInMemory(tqlDocument, 'context', {
  key: 'source_url',
  value: window.location.href
})

insertRowInMemory(tqlDocument, 'context', {
  key: 'captured_at',
  value: new Date().toISOString()
})

insertRowInMemory(tqlDocument, 'context', {
  key: 'page_title',
  value: document.title
})
```

### 6. Send to Backend

```typescript
// Send to your backend API
const response = await fetch('https://trustquery.com/api/datasets/share', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    tqlDocument,
    conversation,
    metadata: {
      title: 'GDP by Country',
      categories: ['economics', 'gdp'],
      sourceUrl: window.location.href
    }
  })
})

const { datasetId, url } = await response.json()
console.log(`Dataset shared: ${url}`)
```

## Complete Chrome Extension Example

```typescript
// content.js - runs on web pages
import { parseCsvString, generateTqlDocument } from '@trustquery/trace'

// Detect tables
function detectTables(): HTMLTableElement[] {
  return Array.from(document.querySelectorAll('table'))
}

// Convert table to TQL
async function convertTableToTQL(table: HTMLTableElement) {
  // Step 1: Extract to CSV
  const csvString = tableToCSV(table)

  // Step 2: Parse CSV (browser-compatible!)
  const csvData = parseCsvString(csvString)

  // Step 3: Generate TQL
  const tqlDocument = generateTqlDocument({
    source: { format: 'csv', data: csvData },
    facet: { name: '@table' }
  })

  // Step 4: Wrap in conversation
  const conversation = {
    sequence: [{ '#document[+0]': tqlDocument }]
  }

  return { tqlDocument, conversation, csvData }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'convertTable') {
    const tables = detectTables()
    const table = tables[request.tableIndex]

    convertTableToTQL(table).then(result => {
      sendResponse(result)
    })

    return true  // Will respond asynchronously
  }
})
```

## AI Metadata Generation Example

```typescript
// Generate metadata using AI (call from Chrome extension)
async function generateMetadata(tqlDocument: TqlDocument, context: {
  sourceUrl: string
  pageTitle: string
}) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'YOUR_API_KEY',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `
Analyze this data table and generate metadata:

SOURCE:
- URL: ${context.sourceUrl}
- Page Title: ${context.pageTitle}

TABLE PREVIEW:
Headers: ${tqlDocument.table.rows[0] ? Object.keys(tqlDocument.table.rows[0]).filter(k => k !== 'index') : []}
Rows: ${tqlDocument.table.rows.length}
Sample: ${JSON.stringify(tqlDocument.table.rows.slice(0, 3), null, 2)}

Return JSON:
{
  "title": "Concise title (max 100 chars)",
  "description": "2-3 sentence description",
  "categories": ["3-5 relevant tags"],
  "domain": "economics|sports|science|government|health|etc",
  "timeframe": "Time period if applicable",
  "geography": "Geographic scope if applicable"
}
        `
      }]
    })
  })

  const data = await response.json()
  return JSON.parse(data.content[0].text)
}
```

## TypeScript Configuration

For Chrome extensions using TypeScript:

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "lib": ["ES2022", "DOM"],
    "types": ["chrome"]
  }
}
```

## Bundling for Chrome Extension

Use a bundler like Vite or esbuild:

```bash
npm install -D vite
```

```typescript
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        content: 'src/content.ts',
        background: 'src/background.ts',
        popup: 'src/popup.ts'
      },
      output: {
        entryFileNames: '[name].js'
      }
    }
  }
})
```

## What Works in Browser

✅ **CSV Parsing**: `parseCsvString(csvContent)`
✅ **TQL Generation**: `generateTqlDocument(...)`
✅ **CRUD Operations**: `insertRowInMemory(...)`, `updateRowInMemory(...)`, etc.
✅ **Type Definitions**: All TypeScript types
✅ **In-Memory Operations**: All facet manipulation

## What Requires Backend/Node.js

❌ **File I/O**: `readCsv(path)`, `writeTql(path)`, `parseTql(path)`
❌ **CLI Commands**: `tql create`, `tql insert`, etc.

These should be done on your backend server or in Node.js environment.

## Summary

The Chrome plugin (separate repo) can:

1. Extract table HTML → CSV string
2. Use `parseCsvString()` to parse (browser-compatible)
3. Use `generateTqlDocument()` to create TQL
4. Add metadata with `insertRowInMemory()`
5. Send JSON to backend API
6. Backend stores/serves TQL files

All the core TQL logic works in the browser! 🎉
