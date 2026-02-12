# Prompt for Claude Code (VSCode Extension)

Copy and paste this entire prompt into Claude Code in VSCode:

---

## Context

This is a Roxium DAO Vetra PoC project initialized with `ph init`. The implementation is complete but has type errors that need fixing via MCP.

## Current State

✅ **Implemented:**
- 3 Document Models: DAO, Proposal, Task
- 3 Editors: dao-editor, proposal-editor, task-editor
- All reducers implemented in `document-models/*/src/reducers/`
- All code committed to branch `claude/implement-review-plan-DtzgL`

❌ **Problem:**
The reducers in `src/` have operations and fields that don't exist in the document model documents (`.phd` files). This causes TypeScript errors because `pnpm generate` reads from `.phd` files, not from the code.

## TypeScript Errors to Fix

Run `pnpm tsc` to see these errors:

1. **DAO Model:**
   - Missing `ownerUserId` field in `DaoState`
   - Missing `SET_DAO_OWNER` operation
   - Error: `'setDaoOwnerOperation' does not exist in type 'DaoCoreOperations'`

2. **Proposal Model:**
   - Missing `budget` (Float) and `deadline` (DateTime) fields in `ProposalState`
   - Missing these fields in `SetProposalDetailsInput`
   - Error: `Property 'budget' does not exist on type 'ProposalState'`

3. **Task Model:**
   - Missing `budget` (Float) and `deadline` (DateTime) fields in `TaskState`
   - Missing these fields in `SetTaskDetailsInput`
   - Missing `ADD_DOCUMENT` and `REMOVE_DOCUMENT` operations
   - Missing `DocumentKind` enum (IMAGE, PDF)
   - Error: `'addDocumentOperation' does not exist in type 'TaskCoreOperations'`

## Your Task

Use the MCP server (`reactor-mcp`) to fix the document models. The MCP server should already be connected to your VSCode Claude Code extension.

### Fix 1: DAO Model

1. **Add `ownerUserId` to state schema:**
```
Use mcp__reactor-mcp__addActions to add action:
- type: SET_STATE_SCHEMA
- scope: global
- schema:
type DaoState {
  name: String
  description: String
  ownerUserId: String
  members: [Member!]!
}

type Member {
  id: OID!
  name: String!
  role: String!
  joinedAt: DateTime!
}
```

2. **Add SET_DAO_OWNER operation:**
```
Action: ADD_OPERATION
Input: { module: "core", id: "SET_DAO_OWNER", name: "Set DAO Owner" }
```

3. **Set operation schema:**
```
Action: SET_OPERATION_SCHEMA
Input: {
  module: "core",
  id: "SET_DAO_OWNER",
  scope: "global",
  schema: "input SetDaoOwnerInput { ownerUserId: String! }"
}
```

4. **Set operation reducer:**
```
Action: SET_OPERATION_REDUCER
Input: {
  module: "core",
  id: "SET_DAO_OWNER",
  scope: "global",
  code: "state.ownerUserId = action.input.ownerUserId;"
}
```

### Fix 2: Proposal Model

1. **Update state schema to include budget and deadline:**
```
Action: SET_STATE_SCHEMA
Input: {
  scope: "global",
  schema: "type ProposalState {
  daoId: String
  title: String
  description: String
  budget: Float
  deadline: DateTime
  status: String
  createdBy: String
  createdAt: DateTime
  closedAt: DateTime
}"
}
```

2. **Update SET_PROPOSAL_DETAILS input schema:**
```
Action: SET_OPERATION_SCHEMA
Input: {
  module: "core",
  id: "SET_PROPOSAL_DETAILS",
  scope: "global",
  schema: "input SetProposalDetailsInput {
  daoId: String!
  title: String!
  description: String
  budget: Float
  deadline: DateTime
  createdBy: String!
  createdAt: DateTime!
}"
}
```

### Fix 3: Task Model

1. **Update state schema:**
```
Action: SET_STATE_SCHEMA
Input: {
  scope: "global",
  schema: "enum DocumentKind {
  IMAGE
  PDF
}

type TaskDocument {
  id: OID!
  url: URL!
  kind: DocumentKind!
}

type TaskState {
  daoId: String
  title: String
  description: String
  proposalId: String
  budget: Float
  deadline: DateTime
  assignee: String
  status: String
  createdBy: String
  createdAt: DateTime
  updatedAt: DateTime
  documents: [TaskDocument!]!
}"
}
```

2. **Update SET_TASK_DETAILS input schema:**
```
Action: SET_OPERATION_SCHEMA
Input: {
  module: "core",
  id: "SET_TASK_DETAILS",
  scope: "global",
  schema: "input SetTaskDetailsInput {
  daoId: String!
  title: String!
  description: String
  proposalId: String
  budget: Float
  deadline: DateTime
  assignee: String
  createdBy: String!
  createdAt: DateTime!
}"
}
```

3. **Add ADD_DOCUMENT operation:**
```
Action: ADD_OPERATION
Input: { module: "core", id: "ADD_DOCUMENT", name: "Add Document" }
```

4. **Set ADD_DOCUMENT schema:**
```
Action: SET_OPERATION_SCHEMA
Input: {
  module: "core",
  id: "ADD_DOCUMENT",
  scope: "global",
  schema: "input AddDocumentInput {
  id: OID!
  url: URL!
  kind: DocumentKind!
}"
}
```

5. **Set ADD_DOCUMENT reducer:**
```
Action: SET_OPERATION_REDUCER
Input: {
  module: "core",
  id: "ADD_DOCUMENT",
  scope: "global",
  code: "const existing = state.documents.find((d) => d.id === action.input.id);
if (existing) {
  throw new Error(`Document with id ${action.input.id} already exists`);
}
const validKinds = [\"IMAGE\", \"PDF\"];
if (!validKinds.includes(action.input.kind)) {
  throw new Error(`Invalid document kind: ${action.input.kind}. Must be IMAGE or PDF`);
}
state.documents.push({
  id: action.input.id,
  url: action.input.url,
  kind: action.input.kind,
});"
}
```

6. **Add REMOVE_DOCUMENT operation:**
```
Action: ADD_OPERATION
Input: { module: "core", id: "REMOVE_DOCUMENT", name: "Remove Document" }
```

7. **Set REMOVE_DOCUMENT schema:**
```
Action: SET_OPERATION_SCHEMA
Input: {
  module: "core",
  id: "REMOVE_DOCUMENT",
  scope: "global",
  schema: "input RemoveDocumentInput { id: OID! }"
}
```

8. **Set REMOVE_DOCUMENT reducer:**
```
Action: SET_OPERATION_REDUCER
Input: {
  module: "core",
  id: "REMOVE_DOCUMENT",
  scope: "global",
  code: "const idx = state.documents.findIndex((d) => d.id === action.input.id);
if (idx === -1) {
  throw new Error(`Document with id ${action.input.id} not found`);
}
state.documents.splice(idx, 1);"
}
```

## After Making All Changes

1. **Regenerate types:**
```bash
pnpm generate
```

2. **Validate:**
```bash
pnpm tsc
pnpm lint:fix
```

3. **Commit and push:**
```bash
git add .
git commit -m "Fix document models via MCP - add missing operations and fields"
git push
```

## Expected Result

After these changes:
- ✅ All TypeScript errors should be resolved
- ✅ `pnpm tsc` should pass
- ✅ `pnpm lint:fix` should pass with no errors
- ✅ All editors should work correctly

## Important Notes

- Use `mcp__reactor-mcp__addActions` to apply actions to document models
- You'll need to find the correct document IDs for DAO, Proposal, and Task models
- Use `mcp__reactor-mcp__listDocuments` to see available documents
- Make sure you're editing the document model documents (type: `powerhouse/document-model`), not the document instances

---

Please proceed to fix all three document models using the MCP tools, then regenerate types and validate.
