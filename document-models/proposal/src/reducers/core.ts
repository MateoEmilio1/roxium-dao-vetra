import type { ProposalCoreOperations } from "roxium-dao-vetra/document-models/proposal";

export const proposalCoreOperations: ProposalCoreOperations = {
  setProposalDetailsOperation(state, action) {
    state.daoId = action.input.daoId;
    state.title = action.input.title;
    state.description = action.input.description || null;
    state.createdBy = action.input.createdBy;
    state.createdAt = action.input.createdAt;
  },
  updateProposalStatusOperation(state, action) {
    state.status = action.input.status;
    state.closedAt = action.input.closedAt || null;
  },
};
