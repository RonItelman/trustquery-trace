// Type definitions for TQL document structure

export interface TqlDocument {
  data: DataFacet
  meaning: MeaningFacet
  structure: StructureFacet
  ambiguity: AmbiguityFacet
  intent: IntentFacet
  context: ContextFacet
  query: QueryFacet
  tasks: TasksFacet
  score: ScoreFacet
}

export interface DataFacet {
  rows: DataRow[]
}

export interface DataRow {
  index: number
  [key: string]: string | number  // Dynamic columns from CSV
}

export interface MeaningFacet {
  rows: MeaningRow[]
}

export interface MeaningRow {
  index: number
  column: string
  definition: string
  user_confirmed: string
}

export interface StructureFacet {
  rows: StructureRow[]
}

export interface StructureRow {
  index: number
  column: string
  nullAllowed: string
  dataType: string
  minValue: string
  maxValue: string
  format: string
  user_confirmed: string
}

export interface AmbiguityFacet {
  rows: AmbiguityRow[]
}

export interface AmbiguityRow {
  index: number
  query_trigger: string
  ambiguity_type: string
  ambiguity_risk: string
}

export interface IntentFacet {
  rows: IntentRow[]
}

export interface IntentRow {
  index: number
  query_trigger: string
  clarifying_question: string
  options: string
  user_response: string
  user_confirmed: string
}

export interface ContextFacet {
  rows: ContextRow[]
}

export interface ContextRow {
  index: number
  key: string
  value: string
}

export interface QueryFacet {
  rows: QueryRow[]
}

export interface QueryRow {
  index: number
  user_message: string
  timestamp_utc: string
}

export interface TasksFacet {
  rows: TasksRow[]
}

export interface TasksRow {
  index: number
  name: string
  description: string
  formula: string
}

export interface ScoreFacet {
  rows: ScoreRow[]
}

export interface ScoreRow {
  index: number
  measure: string
  value: string
}
