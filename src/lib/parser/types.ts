// Type definitions for TQL document structure

export interface TqlDocument {
  ambiguity: AmbiguityFacet
  context: ContextFacet
  data: DataFacet
  intent: IntentFacet
  meaning: MeaningFacet
  query: QueryFacet
  score: ScoreFacet
  structure: StructureFacet
  tasks: TasksFacet
}

export interface DataFacet {
  rows: DataRow[]
}

export interface DataRow {
  [key: string]: number | string  // Dynamic columns from CSV
  index: number
}

export interface MeaningFacet {
  rows: MeaningRow[]
}

export interface MeaningRow {
  column: string
  definition: string
  index: number
  user_confirmed: string
}

export interface StructureFacet {
  rows: StructureRow[]
}

export interface StructureRow {
  column: string
  dataType: string
  format: string
  index: number
  maxValue: string
  minValue: string
  nullAllowed: string
  user_confirmed: string
}

export interface AmbiguityFacet {
  rows: AmbiguityRow[]
}

export interface AmbiguityRow {
  ambiguity_risk: string
  ambiguity_type: string
  index: number
  query_trigger: string
}

export interface IntentFacet {
  rows: IntentRow[]
}

export interface IntentRow {
  clarifying_question: string
  index: number
  options: string
  query_trigger: string
  user_confirmed: string
  user_response: string
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
  timestamp_utc: string
  user_message: string
}

export interface TasksFacet {
  rows: TasksRow[]
}

export interface TasksRow {
  description: string
  formula: string
  index: number
  name: string
}

export interface ScoreFacet {
  rows: ScoreRow[]
}

export interface ScoreRow {
  index: number
  measure: string
  value: string
}
