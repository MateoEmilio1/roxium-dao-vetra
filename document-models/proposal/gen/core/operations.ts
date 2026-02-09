import { type SignalDispatch } from "document-model";
import type {
  SetProposalDetailsAction,
  UpdateProposalStatusAction,
} from "./actions.js";
import type { ProposalState } from "../types.js";

export interface ProposalCoreOperations {
  setProposalDetailsOperation: (
    state: ProposalState,
    action: SetProposalDetailsAction,
    dispatch?: SignalDispatch,
  ) => void;
  updateProposalStatusOperation: (
    state: ProposalState,
    action: UpdateProposalStatusAction,
    dispatch?: SignalDispatch,
  ) => void;
}
