# Facet Registry Pattern

The TQL parser uses a **facet registry pattern** for extensibility and maintainability.

## Architecture

Instead of a hard-coded switch statement, facet handling is data-driven:

```typescript
const FACET_REGISTRY: Record<string, (doc: TqlDocument, row: Record<string, string>) => void> = {
  ambiguity: (doc, row) => doc.ambiguity.rows.push(row as unknown as AmbiguityRow),
  context: (doc, row) => doc.context.rows.push(row as unknown as ContextRow),
  table: (doc, row) => doc.table.rows.push(row as unknown as TableRow),
  // ... all 9 facets
}
```

## Benefits

1. **Reduced Complexity**: Eliminated 27-complexity function down to <20
2. **Extensibility**: Add new facets without modifying parser logic
3. **Maintainability**: Each facet is a single line in the registry
4. **Testability**: Registry can be tested independently
5. **Documentation**: Registry serves as a map of all supported facets

## How to Add a New Facet

To add a new facet (e.g., `@validation`):

### Step 1: Add type definition (src/lib/parser/types.ts)
```typescript
export interface ValidationRow {
  index: number
  rule: string
  severity: string
}

export interface ValidationFacet {
  rows: ValidationRow[]
}

export interface TqlDocument {
  // ... existing facets
  validation: ValidationFacet  // Add this
}
```

### Step 2: Add to registry (src/lib/parser/index.ts)
```typescript
const FACET_REGISTRY = {
  // ... existing facets
  validation: (doc, row) => doc.validation.rows.push(row as unknown as ValidationRow),
}
```

### Step 3: Initialize in parser (src/lib/parser/index.ts)
```typescript
const doc: TqlDocument = {
  // ... existing facets
  validation: {rows: []},
}
```

### Step 4: Create generator (src/lib/generators/validation.ts)
```typescript
export function generateValidationFacet(): string {
  // Generate @validation[0]: table
}
```

That's it! No switch statements to modify, no complex control flow changes.

## Trade-offs

**Pros:**
- Easy to extend
- Lower complexity
- Self-documenting

**Cons:**
- Slightly less type-safe (registry entries not statically validated)
- Runtime lookup instead of compile-time dispatch (negligible performance impact)

## Performance

The registry pattern has no measurable performance impact for TQL files:
- Registry lookup is O(1) hash table access
- Only happens once per row during parsing
- Typical TQL files have <1000 rows

## Complexity Reduction

**Before registry pattern:**
```
Function 'parseTqlFromString' has a complexity of 27
Maximum allowed is 20
```

**After registry pattern:**
```
✅ No complexity warnings
```

Complexity reduced by:
1. Extracting switch statement → separate function
2. Creating helper functions (isSeparatorRow, isTableRow, parseFacetHeader)
3. Replacing switch with registry lookup
