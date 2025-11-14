import {Command, Flags} from '@oclif/core'

import {applyChangesToConversation, updateRowInMemory} from '../lib/operations/crud.js'
import {parseTql} from '../lib/parser/index.js'
import {writeTql} from '../lib/parser/generator.js'
import {getDocumentCount} from '../lib/parser/types.js'

export default class Update extends Command {
  static description = 'Update a row in a TQL file facet'
static examples = [
    `<%= config.bin %> <%= command.id %> --file data.tql --facet context --index 1 --data '{"value":"PST"}'
✓ Updated row 1 in @context in data.tql`,
    `<%= config.bin %> <%= command.id %> --file data.tql --facet meaning --index 2 --data '{"definition":"Updated definition"}'
✓ Updated row 2 in @meaning in data.tql`,
  ]
static flags = {
    data: Flags.string({
      char: 'd',
      description: 'Row data as JSON string (fields to update, without index)',
      required: true,
    }),
    facet: Flags.string({
      char: 'f',
      description: 'Facet to update',
      options: ['data', 'meaning', 'structure', 'ambiguity', 'intent', 'context', 'query', 'tasks', 'score'],
      required: true,
    }),
    file: Flags.string({
      description: 'Path to the TQL file',
      required: true,
    }),
    index: Flags.integer({
      char: 'i',
      description: 'Index of row to update (1-based)',
      required: true,
    }),
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(Update)

    try {
      // Parse row data from --data flag
      let rowData: Record<string, string>
      try {
        rowData = JSON.parse(flags.data)
      } catch {
        this.error('Invalid JSON in --data flag')
      }

      // Read conversation, apply changes, and write back with diff
      const conversation = parseTql(flags.file)
      const docCountBefore = getDocumentCount(conversation)

      const updatedConversation = applyChangesToConversation(conversation, (doc) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        updateRowInMemory(doc, flags.facet as any, flags.index, rowData as any)
      })

      writeTql(flags.file, updatedConversation)

      const docCountAfter = getDocumentCount(updatedConversation)
      this.log(`✓ Updated @${flags.facet}[${flags.index}]`)
      this.log(`  Documents: ${docCountBefore} → ${docCountAfter}`)
      this.log(`  Diff: $diff[+${docCountBefore - 1}→+${docCountAfter - 1}]`)
    } catch (error) {
      if (error instanceof Error) {
        this.error(`Failed to update row: ${error.message}`)
      }

      throw error
    }
  }
}
