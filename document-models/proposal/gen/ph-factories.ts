/**
 * Factory methods for creating ProposalDocument instances
 */
import type { PHAuthState, PHDocumentState, PHBaseState } from "document-model";
import { createBaseState, defaultBaseState } from "document-model/core";
import type {
  ProposalDocument,
  ProposalLocalState,
  ProposalGlobalState,
  ProposalPHState,
} from "./types.js";
import { createDocument } from "./utils.js";

export function defaultGlobalState(): ProposalGlobalState {
  return {
    daoId: "",
    title: "",
    description: "",
    status: "DRAFT",
    createdBy: "",
    createdAt: null,
    closedAt: null,
  };
}

export function defaultLocalState(): ProposalLocalState {
  return {};
}

export function defaultPHState(): ProposalPHState {
  return {
    ...defaultBaseState(),
    global: defaultGlobalState(),
    local: defaultLocalState(),
  };
}

export function createGlobalState(
  state?: Partial<ProposalGlobalState>,
): ProposalGlobalState {
  return {
    ...defaultGlobalState(),
    ...(state || {}),
  } as ProposalGlobalState;
}

export function createLocalState(
  state?: Partial<ProposalLocalState>,
): ProposalLocalState {
  return {
    ...defaultLocalState(),
    ...(state || {}),
  } as ProposalLocalState;
}

export function createState(
  baseState?: Partial<PHBaseState>,
  globalState?: Partial<ProposalGlobalState>,
  localState?: Partial<ProposalLocalState>,
): ProposalPHState {
  return {
    ...createBaseState(baseState?.auth, baseState?.document),
    global: createGlobalState(globalState),
    local: createLocalState(localState),
  };
}

/**
 * Creates a ProposalDocument with custom global and local state
 * This properly handles the PHBaseState requirements while allowing
 * document-specific state to be set.
 */
export function createProposalDocument(
  state?: Partial<{
    auth?: Partial<PHAuthState>;
    document?: Partial<PHDocumentState>;
    global?: Partial<ProposalGlobalState>;
    local?: Partial<ProposalLocalState>;
  }>,
): ProposalDocument {
  const document = createDocument(
    state
      ? createState(
          createBaseState(state.auth, state.document),
          state.global,
          state.local,
        )
      : undefined,
  );

  return document;
}
