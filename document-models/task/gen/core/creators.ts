import { createAction } from "document-model/core";
import {
  SetTaskDetailsInputSchema,
  UpdateTaskStatusInputSchema,
  AssignTaskInputSchema,
} from "../schema/zod.js";
import type {
  SetTaskDetailsInput,
  UpdateTaskStatusInput,
  AssignTaskInput,
} from "../types.js";
import type {
  SetTaskDetailsAction,
  UpdateTaskStatusAction,
  AssignTaskAction,
} from "./actions.js";

export const setTaskDetails = (input: SetTaskDetailsInput) =>
  createAction<SetTaskDetailsAction>(
    "SET_TASK_DETAILS",
    { ...input },
    undefined,
    SetTaskDetailsInputSchema,
    "global",
  );

export const updateTaskStatus = (input: UpdateTaskStatusInput) =>
  createAction<UpdateTaskStatusAction>(
    "UPDATE_TASK_STATUS",
    { ...input },
    undefined,
    UpdateTaskStatusInputSchema,
    "global",
  );

export const assignTask = (input: AssignTaskInput) =>
  createAction<AssignTaskAction>(
    "ASSIGN_TASK",
    { ...input },
    undefined,
    AssignTaskInputSchema,
    "global",
  );
