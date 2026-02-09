// TODO: remove eslint-disable rules once refactor is done
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { StateReducer } from "document-model";
import { isDocumentAction, createReducer } from "document-model/core";
import type { TaskPHState } from "roxium-dao-vetra/document-models/task";

import { taskCoreOperations } from "../src/reducers/core.js";

import {
  SetTaskDetailsInputSchema,
  UpdateTaskStatusInputSchema,
  AssignTaskInputSchema,
} from "./schema/zod.js";

const stateReducer: StateReducer<TaskPHState> = (state, action, dispatch) => {
  if (isDocumentAction(action)) {
    return state;
  }
  switch (action.type) {
    case "SET_TASK_DETAILS": {
      SetTaskDetailsInputSchema().parse(action.input);

      taskCoreOperations.setTaskDetailsOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "UPDATE_TASK_STATUS": {
      UpdateTaskStatusInputSchema().parse(action.input);

      taskCoreOperations.updateTaskStatusOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "ASSIGN_TASK": {
      AssignTaskInputSchema().parse(action.input);

      taskCoreOperations.assignTaskOperation(
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

export const reducer = createReducer<TaskPHState>(stateReducer);
