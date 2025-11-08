import {Command, Flags} from '@oclif/core'
import * as fs from 'node:fs'
import {basename, dirname, extname, join} from 'node:path'

import {generateTql} from '../lib/generators/index.js'
import {parseTqlFromString, writeTqlJson} from '../lib/parser/index.js'
import {readCsv} from '../lib/readers/csv.js'

export default class Create extends Command {
  static description = 'Create a TQL file from a data source'
static examples = [
    `<%= config.bin %> <%= command.id %> --source csv --in data.csv
✓ Created data.tql`,
    `<%= config.bin %> <%= command.id %> --source csv --in data.csv --format json
✓ Created data.json`,
    `<%= config.bin %> <%= command.id %> --source csv --in data.csv --format json --out output.json
✓ Created output.json`,
  ]
static flags = {
    facets: Flags.string({
      description: 'Comma-separated list of facets to generate (data,meaning,structure,ambiguity,intent,context,query,tasks,score)',
      required: false,
    }),
    format: Flags.string({
      description: 'Output format',
      options: ['tql', 'json'],
      required: false,
    }),
    in: Flags.string({
      description: 'Input file path',
      required: true,
    }),
    out: Flags.string({
      description: 'Output file path (defaults to input path with .tql or .json extension)',
      required: false,
    }),
    source: Flags.string({
      description: 'Source data format',
      options: ['csv'],
      required: true,
    }),
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(Create)

    if (flags.source === 'csv') {
      await this.createFromCsv(flags.in, flags.out, flags.facets, flags.format as 'json' | 'tql' | undefined)
    }
  }

  private async createFromCsv(inputPath: string, outputPath?: string, facetsFlag?: string, format?: 'json' | 'tql'): Promise<void> {
    try {
      // Read the CSV file
      const csvData = readCsv(inputPath)

      // Parse facets flag
      const facets = facetsFlag
        ? (facetsFlag.split(',').map((f) => f.trim()) as ('ambiguity' | 'context' | 'data' | 'intent' | 'meaning' | 'query' | 'score' | 'structure' | 'tasks')[])
        : undefined

      // Generate TQL content (always generate TQL first)
      const tqlContent = generateTql(
        {
          headers: csvData.headers,
          rows: csvData.rows,
        },
        {facets},
      )

      // Determine format (default to tql)
      const outputFormat = format || 'tql'

      // Determine output path
      const output = outputPath || this.getDefaultOutputPath(inputPath, outputFormat)

      // Write based on format
      if (outputFormat === 'json') {
        // Parse TQL string to JSON and write
        const tqlDoc = parseTqlFromString(tqlContent)
        writeTqlJson(output, tqlDoc)
      } else {
        // Write TQL directly
        fs.writeFileSync(output, tqlContent, 'utf8')
      }

      const facetList = facets || ['data', 'meaning', 'structure', 'ambiguity', 'intent', 'context', 'query', 'tasks', 'score']
      const facetNames = facetList.map((f) => `@${f}`).join(', ')

      this.log(`✓ Created ${output}`)
      this.log(`  Format: ${outputFormat.toUpperCase()}`)
      this.log(`  Facets: ${facetNames}`)
      this.log(`  Data rows: ${csvData.rows.length}`)
      this.log(`  Columns: ${csvData.headers.length}`)
    } catch (error) {
      if (error instanceof Error) {
        this.error(`Failed to create file: ${error.message}`)
      }

      throw error
    }
  }

  private getDefaultOutputPath(inputPath: string, format: 'json' | 'tql'): string {
    const dir = dirname(inputPath)
    const base = basename(inputPath, extname(inputPath))
    const ext = format === 'json' ? '.json' : '.tql'
    return join(dir, `${base}${ext}`)
  }
}
