/**
 * Factory methods for creating DaoDocument instances
 */
import type { PHAuthState, PHDocumentState, PHBaseState } from "document-model";
import { createBaseState, defaultBaseState } from "document-model/core";
import type {
  DaoDocument,
  DaoLocalState,
  DaoGlobalState,
  DaoPHState,
} from "./types.js";
import { createDocument } from "./utils.js";

export function defaultGlobalState(): DaoGlobalState {
  return { name: "", description: "", members: [] };
}

export function defaultLocalState(): DaoLocalState {
  return {};
}

export function defaultPHState(): DaoPHState {
  return {
    ...defaultBaseState(),
    global: defaultGlobalState(),
    local: defaultLocalState(),
  };
}

export function createGlobalState(
  state?: Partial<DaoGlobalState>,
): DaoGlobalState {
  return {
    ...defaultGlobalState(),
    ...(state || {}),
  } as DaoGlobalState;
}

export function createLocalState(
  state?: Partial<DaoLocalState>,
): DaoLocalState {
  return {
    ...defaultLocalState(),
    ...(state || {}),
  } as DaoLocalState;
}

export function createState(
  baseState?: Partial<PHBaseState>,
  globalState?: Partial<DaoGlobalState>,
  localState?: Partial<DaoLocalState>,
): DaoPHState {
  return {
    ...createBaseState(baseState?.auth, baseState?.document),
    global: createGlobalState(globalState),
    local: createLocalState(localState),
  };
}

/**
 * Creates a DaoDocument with custom global and local state
 * This properly handles the PHBaseState requirements while allowing
 * document-specific state to be set.
 */
export function createDaoDocument(
  state?: Partial<{
    auth?: Partial<PHAuthState>;
    document?: Partial<PHDocumentState>;
    global?: Partial<DaoGlobalState>;
    local?: Partial<DaoLocalState>;
  }>,
): DaoDocument {
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
