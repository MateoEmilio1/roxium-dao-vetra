/**
 * Factory methods for creating TaskDocument instances
 */
import type { PHAuthState, PHDocumentState, PHBaseState } from "document-model";
import { createBaseState, defaultBaseState } from "document-model/core";
import type {
  TaskDocument,
  TaskLocalState,
  TaskGlobalState,
  TaskPHState,
} from "./types.js";
import { createDocument } from "./utils.js";

export function defaultGlobalState(): TaskGlobalState {
  return {
    daoId: "",
    proposalId: "",
    title: "",
    description: "",
    status: "TODO",
    assignee: "",
    createdBy: "",
    createdAt: null,
    updatedAt: null,
  };
}

export function defaultLocalState(): TaskLocalState {
  return {};
}

export function defaultPHState(): TaskPHState {
  return {
    ...defaultBaseState(),
    global: defaultGlobalState(),
    local: defaultLocalState(),
  };
}

export function createGlobalState(
  state?: Partial<TaskGlobalState>,
): TaskGlobalState {
  return {
    ...defaultGlobalState(),
    ...(state || {}),
  } as TaskGlobalState;
}

export function createLocalState(
  state?: Partial<TaskLocalState>,
): TaskLocalState {
  return {
    ...defaultLocalState(),
    ...(state || {}),
  } as TaskLocalState;
}

export function createState(
  baseState?: Partial<PHBaseState>,
  globalState?: Partial<TaskGlobalState>,
  localState?: Partial<TaskLocalState>,
): TaskPHState {
  return {
    ...createBaseState(baseState?.auth, baseState?.document),
    global: createGlobalState(globalState),
    local: createLocalState(localState),
  };
}

/**
 * Creates a TaskDocument with custom global and local state
 * This properly handles the PHBaseState requirements while allowing
 * document-specific state to be set.
 */
export function createTaskDocument(
  state?: Partial<{
    auth?: Partial<PHAuthState>;
    document?: Partial<PHDocumentState>;
    global?: Partial<TaskGlobalState>;
    local?: Partial<TaskLocalState>;
  }>,
): TaskDocument {
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
