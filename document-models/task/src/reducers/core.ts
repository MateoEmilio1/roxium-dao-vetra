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
  },
  updateTaskStatusOperation(state, action) {
    state.status = action.input.status;
    state.updatedAt = action.input.updatedAt;
  },
  assignTaskOperation(state, action) {
    state.assignee = action.input.assignee;
    state.updatedAt = action.input.updatedAt;
  },
};
