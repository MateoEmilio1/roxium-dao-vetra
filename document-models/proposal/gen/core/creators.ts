import { createAction } from "document-model/core";
import {
  SetProposalDetailsInputSchema,
  UpdateProposalStatusInputSchema,
} from "../schema/zod.js";
import type {
  SetProposalDetailsInput,
  UpdateProposalStatusInput,
} from "../types.js";
import type {
  SetProposalDetailsAction,
  UpdateProposalStatusAction,
} from "./actions.js";

export const setProposalDetails = (input: SetProposalDetailsInput) =>
  createAction<SetProposalDetailsAction>(
    "SET_PROPOSAL_DETAILS",
    { ...input },
    undefined,
    SetProposalDetailsInputSchema,
    "global",
  );

export const updateProposalStatus = (input: UpdateProposalStatusInput) =>
  createAction<UpdateProposalStatusAction>(
    "UPDATE_PROPOSAL_STATUS",
    { ...input },
    undefined,
    UpdateProposalStatusInputSchema,
    "global",
  );
