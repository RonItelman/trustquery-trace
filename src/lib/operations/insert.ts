import type {
  AmbiguityRow,
  ContextRow,
  DataRow,
  IntentRow,
  MeaningRow,
  QueryRow,
  ScoreRow,
  StructureRow,
  TasksRow,
} from '../parser/types.js'

import {writeTql} from '../parser/generator.js'
import {parseTql} from '../parser/index.js'

type FacetName = 'ambiguity' | 'context' | 'data' | 'intent' | 'meaning' | 'query' | 'score' | 'structure' | 'tasks'

type FacetRowType<T extends FacetName> = T extends 'data'
  ? DataRow
  : T extends 'meaning'
    ? MeaningRow
    : T extends 'structure'
      ? StructureRow
      : T extends 'ambiguity'
        ? AmbiguityRow
        : T extends 'intent'
          ? IntentRow
          : T extends 'context'
            ? ContextRow
            : T extends 'query'
              ? QueryRow
              : T extends 'tasks'
                ? TasksRow
                : T extends 'score'
                  ? ScoreRow
                  : never

/**
 * Insert a row into a TQL file facet
 * @param filePath - Path to the .tql file
 * @param facet - The facet to insert into
 * @param data - Row data (without index, will be auto-assigned)
 */
export function insertRow<T extends FacetName>(
  filePath: string,
  facet: T,
  data: Omit<FacetRowType<T>, 'index'>,
): void {
  // Parse the TQL file
  const doc = parseTql(filePath)

  // Get the next index
  const currentRows = doc[facet].rows
  const nextIndex = currentRows.length + 1

  // Add index to the data
  const rowWithIndex = {
    index: nextIndex,
    ...data,
  } as FacetRowType<T>

  // Insert the row
  // @ts-expect-error - TypeScript can't infer the row type correctly
  currentRows.push(rowWithIndex)

  // Write back to file
  writeTql(filePath, doc)
}

/**
 * Insert multiple rows into a TQL file facet
 * @param filePath - Path to the .tql file
 * @param facet - The facet to insert into
 * @param dataArray - Array of row data (without index)
 */
export function insertRows<T extends FacetName>(
  filePath: string,
  facet: T,
  dataArray: Array<Omit<FacetRowType<T>, 'index'>>,
): void {
  // Parse the TQL file
  const doc = parseTql(filePath)

  // Get current rows
  const currentRows = doc[facet].rows
  let nextIndex = currentRows.length + 1

  // Add each row with auto-incrementing index
  for (const data of dataArray) {
    const rowWithIndex = {
      index: nextIndex++,
      ...data,
    } as FacetRowType<T>

    // @ts-expect-error - TypeScript can't infer the row type correctly
    currentRows.push(rowWithIndex)
  }

  // Write back to file
  writeTql(filePath, doc)
}
