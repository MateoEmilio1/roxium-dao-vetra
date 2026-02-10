# DAO Ops PoC — Review & Implementation Plan

## 1. Repository Structure Analysis

The repository is a Powerhouse v5.3.0 Vetra project initialized with `ph init`. Current folder usage:

| Folder | Purpose | Current State |
|---|---|---|
| `document-models/` | Holds document model definitions (schema, reducers, generated code, tests) | **3 models exist**: `dao`, `proposal`, `task` |
| `editors/` | React UI editors for each document model, displayed in Connect | **3 editors exist**: `dao-editor`, `proposal-editor`, `task-editor` |
| `processors/` | Event-driven processors (listeners/triggers) that react to document changes | Empty (index.ts only) |
| `subgraphs/` | GraphQL subgraph resolvers — runtime-generated in v5.3.0, no manual files needed | Empty (index.ts only) |
| `backup-documents/` | `.phd` backup snapshots of document model and editor definitions | 6 backups present |
| `.ph/` | Powerhouse internal runtime files | Auto-managed |

**Key observation**: Contrary to the task description stating "no document models implemented yet", three document models and three editors already exist and are registered in `powerhouse.manifest.json`. The plan below performs a **gap analysis** against the domain requirements and recommends targeted additions — not a rebuild.

---

## 2. Recommended Document Models (v1)

### 2a. Gap Analysis — What Exists vs. What Is Required

#### DAO Model (`roxium/dao`) — EXISTS, NEEDS MODIFICATIONS

**Current state schema:**
```graphql
type Member {
  id: OID!
  name: String!
  role: String!       # Free-form string
  joinedAt: DateTime!
}

type DaoState {
  name: String        # Optional
  description: String # Optional
  members: [Member!]!
}
```

**Gaps against requirements:**

| Required Field | Current State | Action Needed |
|---|---|---|
| `ownerUserId` | Missing | Add to `DaoState` — identifies the DAO owner |
| `createdAt` | Missing from state (only in document header) | Add `createdAt: DateTime` to `DaoState` |
| Member `userId` vs `name` | Members identified by `name: String!` | Change to `userId: String!` (or keep `name` and add `userId`) |
| Role enum | `role: String!` (free-form) | Strongly recommend keeping as `String` for PoC flexibility. The editor already constrains to `OWNER`/`CONTRIBUTOR`/`VIEWER` via dropdown. An enum would require a GraphQL enum type. Acceptable as-is for v1. |
| `budget` on proposals | N/A (Proposal model) | See Proposal model below |
| `deadline` on proposals | N/A (Proposal model) | See Proposal model below |

**Operations — current 5 are sound:**
- `SET_DAO_NAME` — correct
- `SET_DAO_DESCRIPTION` — correct
- `ADD_MEMBER` — correct
- `UPDATE_MEMBER_ROLE` — correct
- `REMOVE_MEMBER` — correct

**Operations needed:**
- `SET_DAO_OWNER` — sets `ownerUserId`
- Possibly `SET_DAO_CREATED_AT` or include `createdAt` in a combined `SET_DAO_DETAILS` operation

#### Proposal Model (`roxium/proposal`) — EXISTS, NEEDS MODIFICATIONS

**Current state schema:**
```graphql
type ProposalState {
  daoId: String
  title: String
  description: String
  status: String        # DRAFT/ACTIVE/CLOSED
  createdBy: String
  createdAt: DateTime
  closedAt: DateTime
}
```

**Gaps against requirements:**

| Required Field | Current State | Action Needed |
|---|---|---|
| `budget` | Missing | Add `budget: Amount_Money` (optional) |
| `deadline` | Missing | Add `deadline: DateTime` (optional) |

**Status/createdBy/closedAt**: These are reasonable additions beyond the minimal spec. They don't violate requirements and add useful lifecycle tracking. Keep them.

**Operations — current 2 exist:**
- `SET_PROPOSAL_DETAILS` — sets daoId, title, description, createdBy, createdAt
- `UPDATE_PROPOSAL_STATUS` — sets status, closedAt

**Operations needed:**
- Update `SET_PROPOSAL_DETAILS` input schema to include `budget` and `deadline`
- Or add `SET_PROPOSAL_BUDGET` and `SET_PROPOSAL_DEADLINE` as separate operations

**Recommendation:** Update `SET_PROPOSAL_DETAILS` to include optional `budget` and `deadline` fields. This avoids operation proliferation.

#### Task Model (`roxium/task`) — EXISTS, NEEDS MODIFICATIONS

**Current state schema:**
```graphql
type TaskState {
  daoId: String
  proposalId: String
  title: String
  description: String
  status: String        # TODO/IN_PROGRESS/DONE
  assignee: String
  createdBy: String
  createdAt: DateTime
  updatedAt: DateTime
}
```

**Gaps against requirements:**

| Required Field | Current State | Action Needed |
|---|---|---|
| `budget` | Missing | Add `budget: Amount_Money` (optional) |
| `deadline` | Missing | Add `deadline: DateTime` (optional) |
| `documents` (attachments) | Missing entirely | Add `documents: [TaskDocument!]!` array |

The **Document (Attachment)** entity from the domain model is the biggest gap. It requires:
```graphql
type TaskDocument {
  id: OID!
  url: URL!
  kind: String!   # "IMAGE" or "PDF"
}
```

**Operations — current 3 exist:**
- `SET_TASK_DETAILS` — sets daoId, title, description, proposalId, assignee, createdBy, createdAt
- `UPDATE_TASK_STATUS` — sets status, updatedAt
- `ASSIGN_TASK` — sets assignee, updatedAt

**Operations needed:**
- Update `SET_TASK_DETAILS` input schema to include `budget` and `deadline`
- `ADD_DOCUMENT` — adds an attachment to a task
- `REMOVE_DOCUMENT` — removes an attachment from a task

### 2b. Summary of Recommended Models

| # | Model | ID | Extension | Status | Why Needed |
|---|---|---|---|---|---|
| 1 | **Dao** | `roxium/dao` | `.rxdao` | Exists — modify | Top-level entity. Holds name, owner, members with roles. |
| 2 | **Proposal** | `roxium/proposal` | `.rxprop` | Exists — modify | Belongs to a DAO. Holds title, description, budget, deadline. |
| 3 | **Task** | `roxium/task` | `.rxtask` | Exists — modify | Belongs to a Proposal. Holds title, description, budget, deadline, attachments. |

**What is intentionally left out:**
- **User model** — No separate User document model. Users are represented by string identifiers (`userId`, `createdBy`, `assignee`). A User model would add complexity without PoC value.
- **Voting / Authorization** — Explicitly excluded per requirements.
- **Permission enforcement** — Roles exist as data only. No permission service integration.
- **Token / blockchain logic** — Not in scope.

---

## 3. Operations Per Model

### 3.1 DAO (`roxium/dao`)

| Operation | Module | Purpose | Required Inputs | Invariants |
|---|---|---|---|---|
| `SET_DAO_NAME` | core | Set/update DAO name | `name: String!` | Name cannot be empty string |
| `SET_DAO_DESCRIPTION` | core | Set/update DAO description | `description: String!` | None |
| **`SET_DAO_OWNER`** | core | **Set the owner user ID** | **`ownerUserId: String!`** | **Cannot be empty** |
| `ADD_MEMBER` | core | Add a member to the DAO | `id: OID!`, `name: String!`, `role: String!`, `joinedAt: DateTime!` | Duplicate ID check |
| `UPDATE_MEMBER_ROLE` | core | Change a member's role | `id: OID!`, `role: String!` | Member must exist |
| `REMOVE_MEMBER` | core | Remove a member | `id: OID!` | Member must exist |

**State schema change:**
```graphql
type DaoState {
  name: String
  description: String
  ownerUserId: String         # NEW
  createdAt: DateTime         # NEW
  members: [Member!]!
}
```

**New errors:** `EmptyNameError` for `SET_DAO_NAME` (name is empty), `EmptyOwnerError` for `SET_DAO_OWNER`.

### 3.2 Proposal (`roxium/proposal`)

| Operation | Module | Purpose | Required Inputs | Invariants |
|---|---|---|---|---|
| `SET_PROPOSAL_DETAILS` | core | Set/initialize all proposal fields | `daoId: String!`, `title: String!`, `createdBy: String!`, `createdAt: DateTime!`, `description: String?`, **`budget: Amount_Money?`**, **`deadline: DateTime?`** | Title cannot be empty. daoId cannot be empty. |
| `UPDATE_PROPOSAL_STATUS` | core | Transition proposal status | `status: String!`, `closedAt: DateTime?` | Status must be DRAFT, ACTIVE, or CLOSED |

**State schema change:**
```graphql
type ProposalState {
  daoId: String
  title: String
  description: String
  status: String
  createdBy: String
  createdAt: DateTime
  closedAt: DateTime
  budget: Amount_Money        # NEW
  deadline: DateTime          # NEW
}
```

**New errors:** `InvalidStatusError` for `UPDATE_PROPOSAL_STATUS`.

### 3.3 Task (`roxium/task`)

| Operation | Module | Purpose | Required Inputs | Invariants |
|---|---|---|---|---|
| `SET_TASK_DETAILS` | core | Set/initialize task fields | `daoId: String!`, `title: String!`, `createdBy: String!`, `createdAt: DateTime!`, `proposalId: String?`, `description: String?`, `assignee: String?`, **`budget: Amount_Money?`**, **`deadline: DateTime?`** | Title cannot be empty |
| `UPDATE_TASK_STATUS` | core | Change task status | `status: String!`, `updatedAt: DateTime!` | Status must be TODO, IN_PROGRESS, or DONE |
| `ASSIGN_TASK` | core | Assign/reassign task | `assignee: String!`, `updatedAt: DateTime!` | None |
| **`ADD_DOCUMENT`** | core | **Attach a document to the task** | **`id: OID!`, `url: URL!`, `kind: String!`** | **kind must be IMAGE or PDF. Duplicate ID check.** |
| **`REMOVE_DOCUMENT`** | core | **Remove an attachment** | **`id: OID!`** | **Document must exist** |

**State schema change:**
```graphql
type TaskDocument {
  id: OID!
  url: URL!
  kind: String!
}

type TaskState {
  daoId: String
  proposalId: String
  title: String
  description: String
  status: String
  assignee: String
  createdBy: String
  createdAt: DateTime
  updatedAt: DateTime
  budget: Amount_Money        # NEW
  deadline: DateTime          # NEW
  documents: [TaskDocument!]! # NEW
}
```

**New errors:** `DuplicateDocumentIdError`, `DocumentNotFoundError`, `InvalidDocumentKindError`.

---

## 4. Processor / Reactor Considerations

### Decision: No reactor needed for the PoC.

**Rationale:**
- All acceptance criteria can be satisfied purely through document models + editors + Connect UI.
- The relationships between DAO, Proposal, and Task are maintained via ID references (`daoId`, `proposalId`) stored in each document's state — no cross-document synchronization is required.
- The editors already use `useDaoDocumentsInSelectedDrive()` and `useProposalDocumentsInSelectedDrive()` hooks to resolve these references at render time. This is sufficient for the PoC.
- Adding a reactor would introduce complexity for derived state that we don't need yet.

### When a reactor WOULD be needed (future, not now):
- Cascading deletes (deleting a DAO should archive its proposals/tasks)
- Derived aggregation views (e.g., "total budget across all proposals in a DAO")
- Cross-document validation (e.g., ensuring a `proposalId` referenced in a Task actually exists)
- Notification/webhook triggers on state changes

**Verdict: Defer reactor to post-PoC.**

---

## 5. Editors / UI Scope (Minimal)

### 5.1 DAO Editor (`dao-editor`) — EXISTS, NEEDS UPDATES

**Edits:** `roxium/dao`

| Section | Fields Displayed | Operations Triggered |
|---|---|---|
| Header | Document name | `actions.setName()` |
| DAO Info | Name (required), Description, **Owner User ID (new)** | `SET_DAO_NAME`, `SET_DAO_DESCRIPTION`, **`SET_DAO_OWNER`** |
| Members | Table: Name, Role (dropdown), Joined date, Remove button | `ADD_MEMBER`, `UPDATE_MEMBER_ROLE`, `REMOVE_MEMBER` |
| Metadata | ID, type, created, modified | Read-only |

**Changes needed:**
- Add an "Owner User ID" input field that dispatches `SET_DAO_OWNER`
- No other changes required

### 5.2 Proposal Editor (`proposal-editor`) — EXISTS, NEEDS UPDATES

**Edits:** `roxium/proposal`

| Section | Fields Displayed | Operations Triggered |
|---|---|---|
| Header | Document name | `actions.setName()` |
| Link to DAO | Dropdown of DAOs in drive (or text fallback) | Part of `SET_PROPOSAL_DETAILS` |
| Details | Title (required), Description, Created By (required), **Budget (new)**, **Deadline (new)** | `SET_PROPOSAL_DETAILS` |
| Status | Status buttons: DRAFT / ACTIVE / CLOSED | `UPDATE_PROPOSAL_STATUS` |
| Metadata | ID, type, created, modified | Read-only |

**Changes needed:**
- Add Budget input field (number)
- Add Deadline input field (date/datetime picker)
- Update the `handleSave` function to include `budget` and `deadline` in the dispatched action

### 5.3 Task Editor (`task-editor`) — EXISTS, NEEDS UPDATES

**Edits:** `roxium/task`

| Section | Fields Displayed | Operations Triggered |
|---|---|---|
| Header | Document name | `actions.setName()` |
| Link to DAO | Dropdown of DAOs | Part of `SET_TASK_DETAILS` |
| Link to Proposal | Dropdown filtered by selected DAO | Part of `SET_TASK_DETAILS` |
| Details | Title (required), Description, Created By (required), **Budget (new)**, **Deadline (new)** | `SET_TASK_DETAILS` |
| Status | Status buttons: TODO / IN_PROGRESS / DONE | `UPDATE_TASK_STATUS` |
| Assignee | Text input + Assign button | `ASSIGN_TASK` |
| **Attachments (new)** | **List of documents with URL + kind. Add/Remove buttons.** | **`ADD_DOCUMENT`, `REMOVE_DOCUMENT`** |
| Metadata | ID, type, created, modified | Read-only |

**Changes needed:**
- Add Budget input field
- Add Deadline input field
- Add Attachments section: list existing docs, form to add new (URL + kind dropdown), remove button per doc
- Update `handleSave` to include `budget` and `deadline`

### Relationship Navigation

Cross-document relationships are already handled:
- **Proposal -> DAO**: Proposal editor uses `useDaoDocumentsInSelectedDrive()` to populate a DAO dropdown
- **Task -> DAO**: Task editor uses `useDaoDocumentsInSelectedDrive()`
- **Task -> Proposal**: Task editor uses `useProposalDocumentsInSelectedDrive()` filtered by selected `daoId`

No additional cross-model navigation is needed for the PoC.

---

## 6. Powerhouse v5.3.0 Constraints

| Constraint | How This Plan Complies |
|---|---|
| Runtime document model subgraphs | `subgraphs/` folder stays empty. No generated subgraph files. Runtime handles it. |
| Latest CLI behavior (`ph migrate`) | No migration needed — models are being modified via MCP `addActions`, not file edits. Run `ph migrate` only if generated code schema drifts. |
| Updated editor padding behavior | Editors use inline styles with explicit padding. No reliance on framework padding. Compatible. |
| No permission service usage | Roles are data-only strings. No permission enforcement. No permission service calls. |
| `gen/` files are auto-generated | All schema/state changes go through MCP `addActions`. Reducer source files in `src/` updated manually. Never edit `gen/`. |
| Pure deterministic reducers | All IDs, timestamps from `action.input`. No `Date.now()`, `crypto.randomUUID()`, `Math.random()` in reducers. (Note: editors legitimately use `new Date().toISOString()` and `generateId()` before dispatching — this is correct.) |

---

## 7. Missing Required Files / Config

### Currently in place (no action needed):
- `powerhouse.config.json` — correctly configured with dirs and studio/reactor ports
- `powerhouse.manifest.json` — registers all 3 models and 3 editors
- `package.json` — correct exports for document-models, editors, manifest, CSS
- `tsconfig.json` — proper module/target settings
- `.mcp.json` — reactor-mcp endpoint configured
- All `gen/` folders populated with types, creators, reducers, schemas
- React hooks auto-generated per model (`useSelected*Document`, `use*DocumentsInSelectedDrive`)
- Tests exist for all 3 models

### Strictly required for end-to-end flow to work after modifications:

| What | Why | Status |
|---|---|---|
| Update state schemas via MCP (`SET_STATE_SCHEMA`) | Add `ownerUserId`, `createdAt` to DAO; `budget`, `deadline` to Proposal; `budget`, `deadline`, `documents` to Task | **Must be done** |
| Update initial state via MCP (`SET_INITIAL_STATE`) | Include default values for new fields (`ownerUserId: ""`, `budget: null`, etc.) | **Must be done** |
| Add new operations via MCP (`ADD_OPERATION`) | `SET_DAO_OWNER` on DAO; `ADD_DOCUMENT`, `REMOVE_DOCUMENT` on Task | **Must be done** |
| Update existing operation schemas via MCP (`SET_OPERATION_SCHEMA`) | Expand `SET_PROPOSAL_DETAILS` and `SET_TASK_DETAILS` inputs to include `budget`, `deadline` | **Must be done** |
| Set reducer code via MCP (`SET_OPERATION_REDUCER`) | Define reducer logic for all new/modified operations | **Must be done** |
| Add operation errors via MCP (`ADD_OPERATION_ERROR`) | Define error types for new operations | **Must be done** |
| Run `npm run generate` after MCP changes | Regenerate `gen/` folders with updated types/creators | **Must be done** |
| Update `src/reducers/core.ts` for each model | Manually update reducer source files to match MCP-defined reducers | **Must be done** |
| Update editor `.tsx` files | Add UI for new fields (owner, budget, deadline, attachments) | **Must be done** |
| Update test files | Add tests for new operations and error cases | **Must be done** |
| Run `npm run tsc` and `npm run lint:fix` | Validate after all changes | **Must be done** |

### NOT needed (do not create):
- No new config files
- No subgraph files
- No processor files
- No new document models (existing 3 are sufficient)
- No new editors (existing 3 are sufficient)
- No `.env` or secrets files
- No Dockerfile or deployment config

---

## 8. Next Concrete Steps

Implementation should proceed in this exact order:

### Step 1: Update DAO Model
1. Use MCP `SET_STATE_SCHEMA` to add `ownerUserId: String` and `createdAt: DateTime` to `DaoState`
2. Use MCP `SET_INITIAL_STATE` to update initial state with `"ownerUserId": "", "createdAt": null`
3. Use MCP `ADD_OPERATION` to add `SET_DAO_OWNER` operation
4. Use MCP `SET_OPERATION_SCHEMA` to define `SET_DAO_OWNER` input: `{ ownerUserId: String! }`
5. Use MCP `SET_OPERATION_REDUCER` for `SET_DAO_OWNER`
6. Use MCP `ADD_OPERATION_ERROR` for `EmptyOwnerError` on `SET_DAO_OWNER`
7. Manually update `document-models/dao/src/reducers/core.ts`

### Step 2: Update Proposal Model
1. Use MCP `SET_STATE_SCHEMA` to add `budget: Amount_Money` and `deadline: DateTime`
2. Use MCP `SET_INITIAL_STATE` to update with `"budget": null, "deadline": null`
3. Use MCP `SET_OPERATION_SCHEMA` to update `SET_PROPOSAL_DETAILS` input (add optional `budget`, `deadline`)
4. Use MCP `SET_OPERATION_REDUCER` to update reducer for `SET_PROPOSAL_DETAILS`
5. Manually update `document-models/proposal/src/reducers/core.ts`

### Step 3: Update Task Model
1. Use MCP `SET_STATE_SCHEMA` to add `TaskDocument` type, `documents: [TaskDocument!]!`, `budget: Amount_Money`, `deadline: DateTime`
2. Use MCP `SET_INITIAL_STATE` to update with `"budget": null, "deadline": null, "documents": []`
3. Use MCP `SET_OPERATION_SCHEMA` to update `SET_TASK_DETAILS` input (add optional `budget`, `deadline`)
4. Use MCP `ADD_OPERATION` to add `ADD_DOCUMENT` and `REMOVE_DOCUMENT` operations
5. Use MCP `SET_OPERATION_SCHEMA` for both new operations
6. Use MCP `SET_OPERATION_REDUCER` for both new operations and updated `SET_TASK_DETAILS`
7. Use MCP `ADD_OPERATION_ERROR` for `DuplicateDocumentIdError`, `DocumentNotFoundError`, `InvalidDocumentKindError`
8. Manually update `document-models/task/src/reducers/core.ts`

### Step 4: Regenerate & Validate
1. Run `npm run generate` to regenerate all `gen/` folders
2. Run `npm run tsc` to verify type safety
3. Run `npm run lint:fix` to fix any linting issues

### Step 5: Update Editors
1. Update `editors/dao-editor/editor.tsx` — add Owner User ID field
2. Update `editors/proposal-editor/editor.tsx` — add Budget and Deadline fields
3. Update `editors/task-editor/editor.tsx` — add Budget, Deadline, and Attachments section

### Step 6: Update Tests
1. Add tests for `SET_DAO_OWNER` in `document-models/dao/tests/core.test.ts`
2. Update tests for `SET_PROPOSAL_DETAILS` with new fields
3. Add tests for `ADD_DOCUMENT` and `REMOVE_DOCUMENT` in `document-models/task/tests/core.test.ts`
4. Add error case tests for all new operations

### Step 7: Final Validation
1. Run `npm run tsc`
2. Run `npm run lint:fix`
3. Run `npm run test`
4. Verify end-to-end in `ph connect`:
   - Create a DAO with a name
   - Set an owner
   - Add members with roles
   - Create a Proposal linked to the DAO
   - Set budget and deadline on the Proposal
   - Create a Task linked to the Proposal
   - Attach a Document (IMAGE/PDF) to the Task
   - Edit fields and verify state updates

---

## Appendix: Decision Log

| Decision | Rationale |
|---|---|
| Keep roles as `String` not enum | Simpler for PoC. Editor dropdown constrains values. Avoids GraphQL enum complexity. |
| No separate User document model | Users represented by string IDs. A User model adds complexity without PoC value. |
| Embed attachments in Task state | Attachments are a simple array on Task, not a separate document model. Sufficient for URL+kind. |
| Batch budget/deadline into existing `SET_*_DETAILS` ops | Avoids operation proliferation. These are optional fields set alongside other details. |
| No reactor | All acceptance criteria met by document models + editors + Connect. Reactor deferred. |
| No subgraph files | v5.3.0 provides runtime document model subgraphs automatically. |
