# Fix Document Models via MCP

This guide will help you add the missing operations and fields to the document models using MCP.

## Prerequisites

1. Start the MCP server: `pnpm vetra`
2. Keep it running in a separate terminal

## Fix 1: DAO Model - Add SET_DAO_OWNER Operation

The DAO model is missing the `SET_DAO_OWNER` operation and `ownerUserId` field in state.

### Steps:

```bash
# You'll need to use a MCP client (like Claude Desktop connected to your server)
# or use the ph-cli commands if available

# 1. Add ownerUserId to state schema
# Use MCP to call: addActions on the DAO document model
# Action: SET_STATE_SCHEMA
# Input:
{
  "scope": "global",
  "schema": "type DaoState {\n  name: String\n  description: String\n  ownerUserId: String\n  members: [Member!]!\n}\n\ntype Member {\n  id: OID!\n  name: String!\n  role: String!\n  joinedAt: DateTime!\n}"
}

# 2. Add SET_DAO_OWNER operation
# Action: ADD_OPERATION
# Input:
{
  "module": "core",
  "id": "SET_DAO_OWNER",
  "name": "Set DAO Owner"
}

# 3. Set operation schema
# Action: SET_OPERATION_SCHEMA
# Input:
{
  "module": "core",
  "id": "SET_DAO_OWNER",
  "scope": "global",
  "schema": "input SetDaoOwnerInput {\n  ownerUserId: String!\n}"
}

# 4. Set operation reducer
# Action: SET_OPERATION_REDUCER
# Input:
{
  "module": "core",
  "id": "SET_DAO_OWNER",
  "scope": "global",
  "code": "state.ownerUserId = action.input.ownerUserId;"
}
```

## Fix 2: Proposal Model - Add budget and deadline fields

### Steps:

```bash
# 1. Update state schema to include budget and deadline
# Action: SET_STATE_SCHEMA
# Input:
{
  "scope": "global",
  "schema": "type ProposalState {\n  daoId: String\n  title: String\n  description: String\n  budget: Float\n  deadline: DateTime\n  status: String\n  createdBy: String\n  createdAt: DateTime\n  closedAt: DateTime\n}"
}

# 2. Update SET_PROPOSAL_DETAILS operation input schema
# Action: SET_OPERATION_SCHEMA
# Input:
{
  "module": "core",
  "id": "SET_PROPOSAL_DETAILS",
  "scope": "global",
  "schema": "input SetProposalDetailsInput {\n  daoId: String!\n  title: String!\n  description: String\n  budget: Float\n  deadline: DateTime\n  createdBy: String!\n  createdAt: DateTime!\n}"
}
```

## Fix 3: Task Model - Add budget, deadline fields and document operations

### Steps:

```bash
# 1. Update state schema
# Action: SET_STATE_SCHEMA
# Input:
{
  "scope": "global",
  "schema": "enum DocumentKind {\n  IMAGE\n  PDF\n}\n\ntype TaskDocument {\n  id: OID!\n  url: URL!\n  kind: DocumentKind!\n}\n\ntype TaskState {\n  daoId: String\n  title: String\n  description: String\n  proposalId: String\n  budget: Float\n  deadline: DateTime\n  assignee: String\n  status: String\n  createdBy: String\n  createdAt: DateTime\n  updatedAt: DateTime\n  documents: [TaskDocument!]!\n}"
}

# 2. Update SET_TASK_DETAILS input schema
# Action: SET_OPERATION_SCHEMA
# Input:
{
  "module": "core",
  "id": "SET_TASK_DETAILS",
  "scope": "global",
  "schema": "input SetTaskDetailsInput {\n  daoId: String!\n  title: String!\n  description: String\n  proposalId: String\n  budget: Float\n  deadline: DateTime\n  assignee: String\n  createdBy: String!\n  createdAt: DateTime!\n}"
}

# 3. Add ADD_DOCUMENT operation
# Action: ADD_OPERATION
# Input:
{
  "module": "core",
  "id": "ADD_DOCUMENT",
  "name": "Add Document"
}

# 4. Set ADD_DOCUMENT schema
# Action: SET_OPERATION_SCHEMA
# Input:
{
  "module": "core",
  "id": "ADD_DOCUMENT",
  "scope": "global",
  "schema": "input AddDocumentInput {\n  id: OID!\n  url: URL!\n  kind: DocumentKind!\n}"
}

# 5. Set ADD_DOCUMENT reducer
# Action: SET_OPERATION_REDUCER
# Input:
{
  "module": "core",
  "id": "ADD_DOCUMENT",
  "scope": "global",
  "code": "const existing = state.documents.find((d) => d.id === action.input.id);\nif (existing) {\n  throw new Error(`Document with id ${action.input.id} already exists`);\n}\nconst validKinds = [\"IMAGE\", \"PDF\"];\nif (!validKinds.includes(action.input.kind)) {\n  throw new Error(`Invalid document kind: ${action.input.kind}. Must be IMAGE or PDF`);\n}\nstate.documents.push({\n  id: action.input.id,\n  url: action.input.url,\n  kind: action.input.kind,\n});"
}

# 6. Add REMOVE_DOCUMENT operation
# Action: ADD_OPERATION
# Input:
{
  "module": "core",
  "id": "REMOVE_DOCUMENT",
  "name": "Remove Document"
}

# 7. Set REMOVE_DOCUMENT schema
# Action: SET_OPERATION_SCHEMA
# Input:
{
  "module": "core",
  "id": "REMOVE_DOCUMENT",
  "scope": "global",
  "schema": "input RemoveDocumentInput {\n  id: OID!\n}"
}

# 8. Set REMOVE_DOCUMENT reducer
# Action: SET_OPERATION_REDUCER
# Input:
{
  "module": "core",
  "id": "REMOVE_DOCUMENT",
  "scope": "global",
  "code": "const idx = state.documents.findIndex((d) => d.id === action.input.id);\nif (idx === -1) {\n  throw new Error(`Document with id ${action.input.id} not found`);\n}\nstate.documents.splice(idx, 1);"
}
```

## After Making Changes

Once you've made all the changes via MCP:

```bash
# Regenerate the TypeScript types
pnpm generate

# Validate
pnpm tsc
pnpm lint:fix
```

## Alternative: Use Claude Desktop

If you have Claude Desktop connected to your MCP server (via ngrok), you can ask Claude to make these changes using natural language. For example:

"Add a SET_DAO_OWNER operation to the DAO document model that sets the ownerUserId field"

"Add budget and deadline fields to the Proposal state schema and update SET_PROPOSAL_DETAILS input to include them"

etc.
