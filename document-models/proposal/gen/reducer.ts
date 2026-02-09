// TODO: remove eslint-disable rules once refactor is done
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { StateReducer } from "document-model";
import { isDocumentAction, createReducer } from "document-model/core";
import type { ProposalPHState } from "roxium-dao-vetra/document-models/proposal";

import { proposalCoreOperations } from "../src/reducers/core.js";

import {
  SetProposalDetailsInputSchema,
  UpdateProposalStatusInputSchema,
} from "./schema/zod.js";

const stateReducer: StateReducer<ProposalPHState> = (
  state,
  action,
  dispatch,
) => {
  if (isDocumentAction(action)) {
    return state;
  }
  switch (action.type) {
    case "SET_PROPOSAL_DETAILS": {
      SetProposalDetailsInputSchema().parse(action.input);

      proposalCoreOperations.setProposalDetailsOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "UPDATE_PROPOSAL_STATUS": {
      UpdateProposalStatusInputSchema().parse(action.input);

      proposalCoreOperations.updateProposalStatusOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    default:
      return state;
  }
};

export const reducer = createReducer<ProposalPHState>(stateReducer);
