import type { Action } from "document-model";
import type {
  SetTaskDetailsInput,
  UpdateTaskStatusInput,
  AssignTaskInput,
} from "../types.js";

export type SetTaskDetailsAction = Action & {
  type: "SET_TASK_DETAILS";
  input: SetTaskDetailsInput;
};
export type UpdateTaskStatusAction = Action & {
  type: "UPDATE_TASK_STATUS";
  input: UpdateTaskStatusInput;
};
export type AssignTaskAction = Action & {
  type: "ASSIGN_TASK";
  input: AssignTaskInput;
};

export type TaskCoreAction =
  | SetTaskDetailsAction
  | UpdateTaskStatusAction
  | AssignTaskAction;
