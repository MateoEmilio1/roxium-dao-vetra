import type { PHDocument, PHBaseState } from "document-model";
import type { ProposalAction } from "./actions.js";
import type { ProposalState as ProposalGlobalState } from "./schema/types.js";

type ProposalLocalState = Record<PropertyKey, never>;

type ProposalPHState = PHBaseState & {
  global: ProposalGlobalState;
  local: ProposalLocalState;
};
type ProposalDocument = PHDocument<ProposalPHState>;

export * from "./schema/types.js";

export type {
  ProposalGlobalState,
  ProposalLocalState,
  ProposalPHState,
  ProposalAction,
  ProposalDocument,
};
