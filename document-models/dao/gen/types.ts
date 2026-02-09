import type { PHDocument, PHBaseState } from "document-model";
import type { DaoAction } from "./actions.js";
import type { DaoState as DaoGlobalState } from "./schema/types.js";

type DaoLocalState = Record<PropertyKey, never>;

type DaoPHState = PHBaseState & {
  global: DaoGlobalState;
  local: DaoLocalState;
};
type DaoDocument = PHDocument<DaoPHState>;

export * from "./schema/types.js";

export type {
  DaoGlobalState,
  DaoLocalState,
  DaoPHState,
  DaoAction,
  DaoDocument,
};
