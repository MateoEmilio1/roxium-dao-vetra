import type { TaskCoreOperations } from "roxium-dao-vetra/document-models/task";

export const taskCoreOperations: TaskCoreOperations = {
  setTaskDetailsOperation(state, action) {
    state.daoId = action.input.daoId;
    state.title = action.input.title;
    state.description = action.input.description || null;
    state.proposalId = action.input.proposalId || null;
    state.assignee = action.input.assignee || null;
    state.createdBy = action.input.createdBy;
    state.createdAt = action.input.createdAt;
    state.budget = action.input.budget || null;
    state.deadline = action.input.deadline || null;
  },
  updateTaskStatusOperation(state, action) {
    state.status = action.input.status;
    state.updatedAt = action.input.updatedAt;
  },
  assignTaskOperation(state, action) {
    state.assignee = action.input.assignee;
    state.updatedAt = action.input.updatedAt;
  },
  addDocumentOperation(state, action) {
    const existing = state.documents.find((d) => d.id === action.input.id);
    if (existing) {
      throw new Error(
        `Document with id ${action.input.id} already exists`,
      );
    }
    const validKinds = ["IMAGE", "PDF"];
    if (!validKinds.includes(action.input.kind)) {
      throw new Error(
        `Invalid document kind: ${action.input.kind}. Must be IMAGE or PDF`,
      );
    }
    state.documents.push({
      id: action.input.id,
      url: action.input.url,
      kind: action.input.kind,
    });
  },
  removeDocumentOperation(state, action) {
    const idx = state.documents.findIndex((d) => d.id === action.input.id);
    if (idx === -1) {
      throw new Error(
        `Document with id ${action.input.id} not found`,
      );
    }
    state.documents.splice(idx, 1);
  },
};
