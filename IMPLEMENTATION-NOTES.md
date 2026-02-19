# DAO Ops PoC — Implementation Notes

This document describes the changes made to implement the requirements from REVIEW-PLAN.md.

## Summary of Changes

All three document models (DAO, Proposal, Task) and their editors have been updated to meet the domain requirements. The implementation follows the plan outlined in REVIEW-PLAN.md sections 8 (Next Concrete Steps).

## ✅ Completed Changes

### 1. DAO Model Updates

#### Schema Changes (`document-models/dao/schema.graphql`)
- Added `ownerUserId: String` to `DaoState`
- Added `createdAt: DateTime` to `DaoState`
- Added `SetDaoOwnerInput` input type with `ownerUserId: String!`

#### Reducer Changes (`document-models/dao/src/reducers/core.ts`)
- Added `setDaoOwnerOperation` to set the `ownerUserId` field

#### Editor Changes (`editors/dao-editor/editor.tsx`)
- Added "Owner User ID" input field
- Field dispatches `SET_DAO_OWNER` operation on blur
- Temporary manual action creator added (will be replaced after `npm run generate`)

### 2. Proposal Model Updates

#### Schema Changes (`document-models/proposal/schema.graphql`)
- Added `budget: Amount_Money` to `ProposalState`
- Added `deadline: DateTime` to `ProposalState`
- Updated `SetProposalDetailsInput` to include optional `budget` and `deadline` fields

#### Reducer Changes (`document-models/proposal/src/reducers/core.ts`)
- Updated `setProposalDetailsOperation` to handle `budget` and `deadline` fields
- Uses `|| null` pattern for optional fields to match `Maybe<T>` type

#### Editor Changes (`editors/proposal-editor/editor.tsx`)
- Added "Budget" number input field
- Added "Deadline" datetime-local input field
- Updated `handleSave` to include budget and deadline in dispatched action
- Budget is parsed as float; deadline is stored as ISO string

### 3. Task Model Updates

#### Schema Changes (`document-models/task/schema.graphql`)
- Added `TaskDocument` type with fields: `id: OID!`, `url: URL!`, `kind: String!`
- Added `budget: Amount_Money` to `TaskState`
- Added `deadline: DateTime` to `TaskState`
- Added `documents: [TaskDocument!]!` to `TaskState`
- Updated `SetTaskDetailsInput` to include optional `budget` and `deadline` fields
- Added `AddDocumentInput` with `id`, `url`, and `kind` fields
- Added `RemoveDocumentInput` with `id` field

#### Reducer Changes (`document-models/task/src/reducers/core.ts`)
- Updated `setTaskDetailsOperation` to handle `budget` and `deadline` fields
- Added `addDocumentOperation` with validation:
  - Checks for duplicate document IDs
  - Validates `kind` must be "IMAGE" or "PDF"
  - Throws appropriate errors
- Added `removeDocumentOperation` with validation:
  - Checks document exists before removal
  - Throws error if document not found

#### Editor Changes (`editors/task-editor/editor.tsx`)
- Added "Budget" number input field
- Added "Deadline" datetime-local input field
- Added "Attachments" section showing list of documents
- Added document table with URL (as clickable link), Type, and Remove button
- Added form to add new documents with URL input, Kind dropdown (IMAGE/PDF), and Add button
- Temporary manual action creators added for `ADD_DOCUMENT` and `REMOVE_DOCUMENT`

## ⚠️ Known Issues & Next Steps

### 1. JSR Registry Authentication Issue

**Problem:** Installation of dependencies fails with 403 Forbidden error when accessing the JSR (JavaScript Registry) for packages like `@jsr/tmpl__core` and `@jsr/std__yaml`.

**Error:**
```
npm error code E403
npm error 403 403 Forbidden - GET https://npm.jsr.io/~/11/@jsr/tmpl__core/0.6.3.tgz
```

**Impact:** Unable to run `npm install` or `pnpm install`, which blocks running `npm run generate` to regenerate TypeScript types.

**Workaround Applied:**
- Schema files (`.graphql`) have been manually updated with all new fields and input types
- Reducer files (`src/reducers/core.ts`) have been manually updated with operation implementations
- Editor files have temporary manual action creators that match the expected operation signatures

**Required Action:**
Run the following commands in an environment with proper JSR registry access:
```bash
npm install  # or pnpm install
npm run generate
```

This will:
1. Install all dependencies
2. Regenerate `gen/` folders with updated TypeScript types matching the new schemas
3. Create proper action creators for the new operations (`setDaoOwner`, `addDocument`, `removeDocument`)

After generation, you can remove the temporary manual action creators from the editor files.

### 2. Type Safety Workarounds

Due to the inability to regenerate types, the editors use `(state as any)` to access new fields like:
- `state.ownerUserId` in DAO editor
- `state.budget` and `state.deadline` in Proposal and Task editors
- `state.documents` in Task editor

**After running `npm run generate`:**
1. These fields will have proper TypeScript types
2. Remove `as any` casts
3. Import any missing types from `gen/schema/types.ts`

### 3. Tests Have Not Been Updated

Per the original plan (Step 6), tests need to be updated:
- `document-models/dao/tests/core.test.ts` - Add tests for `SET_DAO_OWNER`
- `document-models/proposal/tests/core.test.ts` - Update tests for `SET_PROPOSAL_DETAILS` with new fields
- `document-models/task/tests/core.test.ts` - Add tests for `ADD_DOCUMENT` and `REMOVE_DOCUMENT`
- Add error case tests for new operations

### 4. Validation Has Not Been Run

The following validation steps from the plan need to be completed:
```bash
npm run tsc          # TypeScript compilation check
npm run lint:fix     # ESLint check and fixes
npm run test         # Run test suite
```

### 5. Error Types Not Defined

According to the REVIEW-PLAN.md, the following error types should be defined for Task operations:
- `DuplicateDocumentIdError`
- `DocumentNotFoundError`
- `InvalidDocumentKindError`

Currently, the reducer uses generic `Error` class. After MCP/generation is available, these should be properly defined using `ADD_OPERATION_ERROR` via MCP.

## 📋 Recommended Next Steps

### Immediate (Required for Functionality)

1. **Resolve JSR Authentication:**
   - Check network/firewall settings
   - Verify npm/pnpm registry configuration
   - Consider using npm registry mirror if JSR is blocked

2. **Install Dependencies:**
   ```bash
   npm install  # or pnpm install
   ```

3. **Regenerate Types:**
   ```bash
   npm run generate
   ```

4. **Clean Up Editor Code:**
   - Remove manual action creator definitions
   - Remove `as any` type casts
   - Import generated action creators and types

### Validation

5. **Run Type Checking:**
   ```bash
   npm run tsc
   ```

6. **Fix Linting Issues:**
   ```bash
   npm run lint:fix
   ```

7. **Update and Run Tests:**
   - Update existing tests for modified operations
   - Add new tests for new operations
   ```bash
   npm run test
   ```

### End-to-End Testing

8. **Manual Testing in Powerhouse Connect:**
   ```bash
   npm run connect
   ```

   Test the following workflows:
   - **DAO:** Create a DAO, set name, set owner, add members
   - **Proposal:** Create proposal, link to DAO, set budget and deadline, change status
   - **Task:** Create task, link to DAO and Proposal, set budget and deadline, add/remove documents

## 📁 Files Modified

### Schema Files
- `document-models/dao/schema.graphql`
- `document-models/proposal/schema.graphql`
- `document-models/task/schema.graphql`

### Reducer Files
- `document-models/dao/src/reducers/core.ts`
- `document-models/proposal/src/reducers/core.ts`
- `document-models/task/src/reducers/core.ts`

### Editor Files
- `editors/dao-editor/editor.tsx`
- `editors/proposal-editor/editor.tsx`
- `editors/task-editor/editor.tsx`

### Configuration Files
- `.npmrc` (modified then emptied due to JSR issues)

### Documentation
- `IMPLEMENTATION-NOTES.md` (this file)

## 🔍 Implementation Details

### Design Decisions

1. **No Reactor/Processor:** As per REVIEW-PLAN.md section 4, no reactor is needed for the PoC. Cross-document relationships are maintained via ID references.

2. **Optional Fields:** Budget and deadline are optional (nullable) to support creating incomplete documents and filling them in progressively.

3. **Document Kinds:** Limited to "IMAGE" and "PDF" as specified in the requirements. The reducer validates this constraint.

4. **Manual Action Creators:** Temporary workaround for missing `npm run generate`. These follow the exact signature expected by the generated creators.

5. **Reducer Error Handling:** Currently uses generic `Error` class. Should be replaced with specific error types after generation.

### Schema Patterns Followed

- Used `Amount_Money` scalar for budget (number type)
- Used `DateTime` scalar for timestamps and deadlines
- Used `URL` scalar for document URLs
- Followed `Maybe<T>` (T | null) pattern for optional state fields
- Used `InputMaybe<T>` for optional input fields

### Reducer Patterns Followed

- Pure functions with no side effects
- All IDs and timestamps come from `action.input` (not generated in reducer)
- Used `|| null` for optional input values to match `Maybe<T>` type
- Mutative-style code (Mutative library wraps reducers)
- Validation before state mutation with appropriate error messages

## 📖 References

- **Review Plan:** `REVIEW-PLAN.md` - Original analysis and implementation plan
- **Project Instructions:** `CLAUDE.md` - Powerhouse development guidelines
- **Powerhouse Version:** 5.3.0
- **Key Sections:**
  - REVIEW-PLAN.md Section 8 (Next Concrete Steps) - Step-by-step implementation order
  - REVIEW-PLAN.md Section 3 (Operations Per Model) - Operation specifications
  - CLAUDE.md Reducer Implementation Guidelines - Pure function requirements

## ✅ Acceptance Criteria Coverage

Referencing the original domain requirements, the implementation covers:

- ✅ DAO entity with owner tracking (`ownerUserId`, `createdAt`)
- ✅ Proposal entity with budget and deadline
- ✅ Task entity with budget, deadline, and document attachments
- ✅ Member management with roles
- ✅ Cross-document relationships (DAO → Proposal → Task via IDs)
- ✅ Document attachment support (IMAGE/PDF with URL)
- ✅ UI editors for all three entities with all required fields

## 🚀 Ready for Review

The core implementation is complete and ready for:
1. Dependency installation in a compatible environment
2. Type generation via `npm run generate`
3. Validation (tsc, lint, test)
4. End-to-end testing in Powerhouse Connect

All changes follow the architecture and patterns outlined in REVIEW-PLAN.md and adhere to the Powerhouse v5.3.0 development guidelines in CLAUDE.md.
