import type { Action } from "document-model";
import type {
  SetProposalDetailsInput,
  UpdateProposalStatusInput,
} from "../types.js";

export type SetProposalDetailsAction = Action & {
  type: "SET_PROPOSAL_DETAILS";
  input: SetProposalDetailsInput;
};
export type UpdateProposalStatusAction = Action & {
  type: "UPDATE_PROPOSAL_STATUS";
  input: UpdateProposalStatusInput;
};

export type ProposalCoreAction =
  | SetProposalDetailsAction
  | UpdateProposalStatusAction;
