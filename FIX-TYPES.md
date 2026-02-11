# Fixing Type Errors After Schema Changes

## The Problem

The schema.graphql files were manually updated, but Powerhouse's `pnpm generate` command reads from document model documents (.phd files), not from schema files. The schema files are **generated outputs**, not inputs.

## Solution A: Use MCP to Properly Update Document Models (Recommended)

This is the correct way to update Powerhouse document models.

### Step 1: Start Vetra MCP Server

In a separate terminal:
```bash
pnpm vetra
```

This starts the MCP server on http://localhost:4001

### Step 2: Connect and Import Document Models

In another terminal:
```bash
pnpm connect
```

This should open Powerhouse Connect in your browser. Import the document models from `backup-documents/`:
- Dao.rxdao.phd
- Proposal.rxprop.phd
- Task.rxtask.phd

### Step 3: Use MCP to Update Each Model

Unfortunately, updating via MCP requires using the MCP tools through Claude Code or programmatically. Since that's complex, here's the alternative approach:

## Solution B: Manual Type File Updates (Workaround)

This is a temporary workaround until you can properly update via MCP.

### Step 1: Update DAO Generated Types

Edit `document-models/dao/gen/schema/types.ts`:

Find the `DaoState` type and update it:
```typescript
export type DaoState = {
  description: Maybe<Scalars["String"]["output"]>;
  members: Array<Member>;
  name: Maybe<Scalars["String"]["output"]>;
  ownerUserId: Maybe<Scalars["String"]["output"]>;  // ADD THIS
  createdAt: Maybe<Scalars["DateTime"]["output"]>;   // ADD THIS
};
```

Add the input type after `SetDaoNameInput`:
```typescript
export type SetDaoOwnerInput = {
  ownerUserId: Scalars["String"]["input"];
};
```

Edit `document-models/dao/gen/index.ts`:

Find the `DaoCoreOperations` type and add:
```typescript
export type DaoCoreOperations = {
  setDaoNameOperation: ReducerImplementation<...>;
  setDaoDescriptionOperation: ReducerImplementation<...>;
  setDaoOwnerOperation: ReducerImplementation<...>;  // ADD THIS
  addMemberOperation: ReducerImplementation<...>;
  // ... rest
};
```

Edit `document-models/dao/gen/creators.js`:

Add the creator function:
```javascript
export const setDaoOwner = createAction('SET_DAO_OWNER');
```

### Step 2: Update Proposal Generated Types

Edit `document-models/proposal/gen/schema/types.ts`:

Update `ProposalState`:
```typescript
export type ProposalState = {
  daoId: Maybe<Scalars["String"]["output"]>;
  title: Maybe<Scalars["String"]["output"]>;
  description: Maybe<Scalars["String"]["output"]>;
  status: Maybe<Scalars["String"]["output"]>;
  createdBy: Maybe<Scalars["String"]["output"]>;
  createdAt: Maybe<Scalars["DateTime"]["output"]>;
  closedAt: Maybe<Scalars["DateTime"]["output"]>;
  budget: Maybe<Scalars["Amount_Money"]["output"]>;    // ADD THIS
  deadline: Maybe<Scalars["DateTime"]["output"]>;      // ADD THIS
};
```

Update `SetProposalDetailsInput`:
```typescript
export type SetProposalDetailsInput = {
  daoId: Scalars["String"]["input"];
  title: Scalars["String"]["input"];
  description?: InputMaybe<Scalars["String"]["input"]>;
  createdBy: Scalars["String"]["input"];
  createdAt: Scalars["DateTime"]["input"];
  budget?: InputMaybe<Scalars["Amount_Money"]["input"]>;    // ADD THIS
  deadline?: InputMaybe<Scalars["DateTime"]["input"]>;      // ADD THIS
};
```

### Step 3: Update Task Generated Types

Edit `document-models/task/gen/schema/types.ts`:

Add TaskDocument type:
```typescript
export type TaskDocument = {
  id: Scalars["OID"]["output"];
  url: Scalars["URL"]["output"];
  kind: Scalars["String"]["output"];
};
```

Update `TaskState`:
```typescript
export type TaskState = {
  daoId: Maybe<Scalars["String"]["output"]>;
  proposalId: Maybe<Scalars["String"]["output"]>;
  title: Maybe<Scalars["String"]["output"]>;
  description: Maybe<Scalars["String"]["output"]>;
  status: Maybe<Scalars["String"]["output"]>;
  assignee: Maybe<Scalars["String"]["output"]>;
  createdBy: Maybe<Scalars["String"]["output"]>;
  createdAt: Maybe<Scalars["DateTime"]["output"]>;
  updatedAt: Maybe<Scalars["DateTime"]["output"]>;
  budget: Maybe<Scalars["Amount_Money"]["output"]>;   // ADD THIS
  deadline: Maybe<Scalars["DateTime"]["output"]>;     // ADD THIS
  documents: Array<TaskDocument>;                      // ADD THIS
};
```

Update `SetTaskDetailsInput`:
```typescript
export type SetTaskDetailsInput = {
  daoId: Scalars["String"]["input"];
  proposalId?: InputMaybe<Scalars["String"]["input"]>;
  title: Scalars["String"]["input"];
  description?: InputMaybe<Scalars["String"]["input"]>;
  assignee?: InputMaybe<Scalars["String"]["input"]>;
  createdBy: Scalars["String"]["input"];
  createdAt: Scalars["DateTime"]["input"];
  budget?: InputMaybe<Scalars["Amount_Money"]["input"]>;   // ADD THIS
  deadline?: InputMaybe<Scalars["DateTime"]["input"]>;     // ADD THIS
};
```

Add input types:
```typescript
export type AddDocumentInput = {
  id: Scalars["OID"]["input"];
  url: Scalars["URL"]["input"];
  kind: Scalars["String"]["input"];
};

export type RemoveDocumentInput = {
  id: Scalars["OID"]["input"];
};
```

Edit `document-models/task/gen/index.ts`:

Update `TaskCoreOperations` type to include:
```typescript
export type TaskCoreOperations = {
  setTaskDetailsOperation: ReducerImplementation<...>;
  updateTaskStatusOperation: ReducerImplementation<...>;
  assignTaskOperation: ReducerImplementation<...>;
  addDocumentOperation: ReducerImplementation<...>;     // ADD THIS
  removeDocumentOperation: ReducerImplementation<...>;  // ADD THIS
};
```

Edit `document-models/task/gen/creators.js`:

Add creator functions:
```javascript
export const addDocument = createAction('ADD_DOCUMENT');
export const removeDocument = createAction('REMOVE_DOCUMENT');
```

### Step 4: Update Editors to Use Generated Creators

**editors/dao-editor/editor.tsx:**

Remove the manual action creator and import the generated one:
```typescript
import {
  setDaoName,
  setDaoDescription,
  setDaoOwner,  // ADD THIS
  addMember,
  updateMemberRole,
  removeMember,
} from "../../document-models/dao/gen/creators.js";

// REMOVE the manual setDaoOwner definition
```

**editors/task-editor/editor.tsx:**

Remove manual action creators and import generated ones:
```typescript
import {
  setTaskDetails,
  updateTaskStatus,
  assignTask,
  addDocument,      // ADD THIS
  removeDocument,   // ADD THIS
} from "../../document-models/task/gen/creators.js";
import { generateId } from "document-model/core";

// REMOVE the manual addDocument and removeDocument definitions
```

### Step 5: Validate

```bash
pnpm tsc
pnpm lint:fix
```

## Solution C: Regenerate from Scratch (Nuclear Option)

If manual updates are too tedious:

1. Delete the `.ph` directory (if it exists)
2. Delete `backup-documents/` directory
3. Run `pnpm migrate` to recreate document models from scratch using the schema.graphql files
4. Run `pnpm generate`

**Warning:** This might not work as expected depending on how the project is configured.

## Recommended Path Forward

1. Try **Solution B** (manual type updates) first - it's tedious but straightforward
2. After validation passes, properly update document models via MCP when you have time
3. Commit the fixed generated files
4. In the future, always use MCP to update document models, not schema.graphql directly

## Why This Happened

In Powerhouse v5.3.0:
- Document models are stored as Powerhouse documents (.phd files)
- `schema.graphql` files are **generated from** document models, not the other way around
- The proper way to update models is via MCP operations (ADD_OPERATION, SET_STATE_SCHEMA, etc.)
- Manually editing schema.graphql bypasses this system, causing the mismatch

The implementation I did was correct for the **code layer** (reducers, editors) but should have been accompanied by **document model layer** updates via MCP.
