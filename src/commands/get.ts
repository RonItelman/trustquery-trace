import {Command, Flags} from '@oclif/core'

import {parseTql} from '../lib/parser/index.js'
import {getDocuments} from '../lib/parser/types.js'

export default class Get extends Command {
  static description = 'Get a row or facet from a TQL file'
static examples = [
    `<%= config.bin %> <%= command.id %> --file data.tql --facet context --index 1
{"index":"1","key":"user_timezone","value":"MST"}`,
    `<%= config.bin %> <%= command.id %> --file data.tql --facet meaning
[{"index":"1","column":"transfer_id","definition":""},...]`,
    `<%= config.bin %> <%= command.id %> --file data.tql --facet context --index 1 --field value
MST`,
  ]
static flags = {
    document: Flags.integer({
      char: 'd',
      default: -1,
      description: 'Document index (default: latest)',
      required: false,
    }),
    facet: Flags.string({
      char: 'f',
      description: 'Facet to read from',
      options: ['table', 'meaning', 'structure', 'ambiguity', 'intent', 'context', 'query', 'tasks', 'score'],
      required: true,
    }),
    field: Flags.string({
      description: 'Specific field to extract from the row (only with --index)',
      required: false,
    }),
    file: Flags.string({
      description: 'Path to the TQL file',
      required: true,
    }),
    index: Flags.integer({
      char: 'i',
      description: 'Index of row to get (optional, if omitted returns all rows)',
      required: false,
    }),
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(Get)

    try {
      const conversation = parseTql(flags.file)
      const documents = getDocuments(conversation)

      // Determine which document to read from
      let docIndex = flags.document
      if (docIndex === -1) {
        docIndex = documents.length - 1 // Latest document
      }

      if (docIndex < 0 || docIndex >= documents.length) {
        this.error(`Document index ${docIndex} out of range (0-${documents.length - 1})`)
      }

      const doc = documents[docIndex]

      // Get facet (with proper type handling)
      const facetName = flags.facet as keyof typeof doc
      const facet = doc[facetName]

      if (!facet || !facet.rows) {
        this.error(`Facet @${flags.facet} not found`)
      }

      if (flags.index !== undefined) {
        // Get specific row
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const row = facet.rows.find((r: any) => Number(r.index) === flags.index)

        if (!row) {
          this.error(`Row with index ${flags.index} not found in @${flags.facet}`)
        }

        if (flags.field) {
          // Return specific field
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const value = (row as any)[flags.field]
          if (value === undefined) {
            this.error(`Field "${flags.field}" not found in row`)
          }

          this.log(value)
        } else {
          // Return entire row as JSON
          this.log(JSON.stringify(row, null, 2))
        }
      } else {
        // Get all rows from facet
        this.log(JSON.stringify(facet.rows, null, 2))
      }
    } catch (error) {
      if (error instanceof Error) {
        this.error(`Failed to get data: ${error.message}`)
      }

      throw error
    }
  }
}
