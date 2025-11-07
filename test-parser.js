// Quick test of the TQL parser
import { parseTql, writeTqlJson } from './dist/lib/parser/index.js'
import { generateTqlFromJson, writeTql } from './dist/lib/parser/generator.js'

// Parse the TQL file
console.log('Parsing examples/stablecoin.tql...')
const doc = parseTql('examples/stablecoin.tql')

// Show some stats
console.log('\nParsed TQL document:')
console.log(`- Data rows: ${doc.data.rows.length}`)
console.log(`- Meaning rows: ${doc.meaning.rows.length}`)
console.log(`- Structure rows: ${doc.structure.rows.length}`)
console.log(`- Ambiguity rows: ${doc.ambiguity.rows.length}`)
console.log(`- Intent rows: ${doc.intent.rows.length}`)
console.log(`- Context rows: ${doc.context.rows.length}`)
console.log(`- Query rows: ${doc.query.rows.length}`)
console.log(`- Tasks rows: ${doc.tasks.rows.length}`)
console.log(`- Score rows: ${doc.score.rows.length}`)

// Test: Update a meaning definition
console.log('\n\nTest: Updating meaning definition for "purpose"...')
const purposeRow = doc.meaning.rows.find(r => r.column === 'purpose')
if (purposeRow) {
  purposeRow.definition = 'Description of the transaction purpose'
  console.log(`✓ Updated definition: "${purposeRow.definition}"`)
}

// Write JSON for inspection
console.log('\nWriting examples/stablecoin.tqlj for inspection...')
writeTqlJson('examples/stablecoin.tqlj', doc)
console.log('✓ JSON written')

// Regenerate TQL
console.log('\nRegenerating TQL from modified JSON...')
writeTql('examples/stablecoin-modified.tql', doc)
console.log('✓ TQL regenerated to examples/stablecoin-modified.tql')

console.log('\nTest complete! Check:')
console.log('- examples/stablecoin.tqlj (JSON format)')
console.log('- examples/stablecoin-modified.tql (regenerated TQL with updated definition)')
