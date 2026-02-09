// TODO: remove eslint-disable rules once refactor is done
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { StateReducer } from "document-model";
import { isDocumentAction, createReducer } from "document-model/core";
import type { DaoPHState } from "roxium-dao-vetra/document-models/dao";

import { daoCoreOperations } from "../src/reducers/core.js";

import {
  SetDaoNameInputSchema,
  SetDaoDescriptionInputSchema,
  AddMemberInputSchema,
  UpdateMemberRoleInputSchema,
  RemoveMemberInputSchema,
} from "./schema/zod.js";

const stateReducer: StateReducer<DaoPHState> = (state, action, dispatch) => {
  if (isDocumentAction(action)) {
    return state;
  }
  switch (action.type) {
    case "SET_DAO_NAME": {
      SetDaoNameInputSchema().parse(action.input);

      daoCoreOperations.setDaoNameOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "SET_DAO_DESCRIPTION": {
      SetDaoDescriptionInputSchema().parse(action.input);

      daoCoreOperations.setDaoDescriptionOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "ADD_MEMBER": {
      AddMemberInputSchema().parse(action.input);

      daoCoreOperations.addMemberOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "UPDATE_MEMBER_ROLE": {
      UpdateMemberRoleInputSchema().parse(action.input);

      daoCoreOperations.updateMemberRoleOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "REMOVE_MEMBER": {
      RemoveMemberInputSchema().parse(action.input);

      daoCoreOperations.removeMemberOperation(
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

export const reducer = createReducer<DaoPHState>(stateReducer);
