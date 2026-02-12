# Quick Fix Instructions

Since you have the MCP server running via ngrok, here's the fastest way to fix the type errors:

## Option 1: Use Claude Desktop (Recommended - Easiest)

If you have Claude Desktop connected to your MCP server:

### For DAO Model:
```
Add an ownerUserId field (String type) to the DaoState schema in the DAO document model.
Then add a SET_DAO_OWNER operation that accepts ownerUserId as input and sets state.ownerUserId.
```

### For Proposal Model:
```
Add budget (Float) and deadline (DateTime) fields to the ProposalState schema.
Update the SET_PROPOSAL_DETAILS operation input to include budget and deadline as optional fields.
```

### For Task Model:
```
Add budget (Float) and deadline (DateTime) fields to the TaskState schema.
Update the SET_TASK_DETAILS operation input to include budget and deadline as optional fields.
Add ADD_DOCUMENT operation with input: id (OID!), url (URL!), kind (DocumentKind! - enum with IMAGE, PDF).
Add REMOVE_DOCUMENT operation with input: id (OID!).
Make sure documents is an array of TaskDocument in the state.
```

After making these changes in Claude Desktop, run:
```bash
pnpm generate
pnpm tsc
```

## Option 2: Manual Temporary Fix (Faster but not permanent)

If you can't use MCP right now, I can create a workaround by temporarily modifying the permission settings to edit the gen/ files directly. This is NOT recommended but will let you test immediately.

Would you like me to:
A) Wait while you use Claude Desktop to make the MCP changes (recommended)
B) Create a temporary workaround by editing gen/ files directly (not recommended)

Choose option A if possible!
