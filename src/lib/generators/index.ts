import {generateAmbiguityFacet} from './ambiguity.js'
import {generateContextFacet} from './context.js'
import {generateDataFacet} from './data.js'
import {generateIntentFacet} from './intent.js'
import {generateMeaningFacet} from './meaning.js'
import {generateStructureFacet} from './structure.js'

export interface TqlGeneratorInput {
  headers: string[]
  rows: string[][]
}

export interface TqlGeneratorOptions {
  facets?: ('data' | 'meaning' | 'structure' | 'ambiguity' | 'intent' | 'context')[]
}

export function generateTql(input: TqlGeneratorInput, options: TqlGeneratorOptions = {}): string {
  const {headers, rows} = input
  const facets = options.facets || ['data', 'meaning', 'structure', 'ambiguity', 'intent', 'context']

  const sections: string[] = []

  if (facets.includes('data')) {
    sections.push(generateDataFacet({headers, rows}))
  }

  if (facets.includes('meaning')) {
    sections.push(generateMeaningFacet({headers}))
  }

  if (facets.includes('structure')) {
    sections.push(generateStructureFacet({headers}))
  }

  if (facets.includes('ambiguity')) {
    sections.push(generateAmbiguityFacet())
  }

  if (facets.includes('intent')) {
    sections.push(generateIntentFacet())
  }

  if (facets.includes('context')) {
    sections.push(generateContextFacet())
  }

  return sections.join('\n\n')
}
