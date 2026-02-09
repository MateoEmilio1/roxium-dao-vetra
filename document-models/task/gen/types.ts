import type { PHDocument, PHBaseState } from "document-model";
import type { TaskAction } from "./actions.js";
import type { TaskState as TaskGlobalState } from "./schema/types.js";

type TaskLocalState = Record<PropertyKey, never>;

type TaskPHState = PHBaseState & {
  global: TaskGlobalState;
  local: TaskLocalState;
};
type TaskDocument = PHDocument<TaskPHState>;

export * from "./schema/types.js";

export type {
  TaskGlobalState,
  TaskLocalState,
  TaskPHState,
  TaskAction,
  TaskDocument,
};
