// Test using tql-cli as a library (simulating another project)
import { generateTql, readCsv } from './dist/index.js'

console.log('Testing tql-cli as a library...\n')

// Simulate CSV drag & drop
function handleCsvDrop(csvFilePath) {
  console.log(`📁 Processing: ${csvFilePath}`)

  // Read CSV
  const csvData = readCsv(csvFilePath)
  console.log(`✓ Read ${csvData.rows.length} rows, ${csvData.headers.length} columns`)

  // Generate TQL (in-memory, returns string)
  const tqlContent = generateTql({
    headers: csvData.headers,
    rows: csvData.rows
  })

  console.log(`✓ Generated TQL (${tqlContent.length} characters)`)
  console.log('\nFirst 500 characters of TQL:')
  console.log(tqlContent.slice(0, 500) + '...\n')

  return tqlContent
}

// Test it
handleCsvDrop('examples/stablecoin.csv')

console.log('✅ SUCCESS! You can now use tql-cli in your project!')
console.log('\nTo use in your project:')
console.log('1. npm install /path/to/tql-cli')
console.log('2. import { readCsv, generateTql } from "tql-cli"')
console.log('3. Use the functions as shown in USAGE_EXAMPLE.md')
