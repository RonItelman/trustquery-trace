import {Command, Flags} from '@oclif/core'

import {applyChangesToConversation, deleteRowInMemory, deleteRowsInMemory} from '../lib/operations/crud.js'
import {parseTql} from '../lib/parser/index.js'
import {writeTql} from '../lib/parser/generator.js'
import {getDocumentCount} from '../lib/parser/types.js'

export default class Delete extends Command {
  static description = 'Delete row(s) from a TQL file facet'
static examples = [
    `<%= config.bin %> <%= command.id %> --file data.tql --facet context --index 1
✓ Deleted 1 row from @context in data.tql`,
    `<%= config.bin %> <%= command.id %> --file data.tql --facet context --indices 1,2,3
✓ Deleted 3 rows from @context in data.tql`,
  ]
static flags = {
    facet: Flags.string({
      char: 'f',
      description: 'Facet to delete from',
      options: ['data', 'meaning', 'structure', 'ambiguity', 'intent', 'context', 'query', 'tasks', 'score'],
      required: true,
    }),
    file: Flags.string({
      description: 'Path to the TQL file',
      required: true,
    }),
    index: Flags.integer({
      char: 'i',
      description: 'Index of row to delete (1-based)',
      exclusive: ['indices'],
      required: false,
    }),
    indices: Flags.string({
      description: 'Comma-separated list of indices to delete (e.g., "1,2,3")',
      exclusive: ['index'],
      required: false,
    }),
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(Delete)

    try {
      // Read conversation
      const conversation = parseTql(flags.file)
      const docCountBefore = getDocumentCount(conversation)

      if (flags.index !== undefined) {
        // Delete single row
        const updatedConversation = applyChangesToConversation(conversation, (doc) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          deleteRowInMemory(doc, flags.facet as any, flags.index!)
        })

        writeTql(flags.file, updatedConversation)

        const docCountAfter = getDocumentCount(updatedConversation)
        this.log(`✓ Deleted @${flags.facet}[${flags.index}]`)
        this.log(`  Documents: ${docCountBefore} → ${docCountAfter}`)
        this.log(`  Diff: $diff[+${docCountBefore - 1}→+${docCountAfter - 1}]`)
      } else if (flags.indices) {
        // Delete multiple rows
        const indices = flags.indices.split(',').map((idx) => Number.parseInt(idx.trim(), 10))

        if (indices.some((idx) => Number.isNaN(idx))) {
          this.error('Invalid indices format. Use comma-separated numbers (e.g., "1,2,3")')
        }

        const updatedConversation = applyChangesToConversation(conversation, (doc) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          deleteRowsInMemory(doc, flags.facet as any, indices)
        })

        writeTql(flags.file, updatedConversation)

        const docCountAfter = getDocumentCount(updatedConversation)
        this.log(`✓ Deleted ${indices.length} rows from @${flags.facet}`)
        this.log(`  Documents: ${docCountBefore} → ${docCountAfter}`)
        this.log(`  Diff: $diff[+${docCountBefore - 1}→+${docCountAfter - 1}]`)
      } else {
        this.error('Must provide either --index or --indices')
      }
    } catch (error) {
      if (error instanceof Error) {
        this.error(`Failed to delete row(s): ${error.message}`)
      }

      throw error
    }
  }
}
