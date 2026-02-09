import type { Action } from "document-model";
import type {
  SetDaoNameInput,
  SetDaoDescriptionInput,
  AddMemberInput,
  UpdateMemberRoleInput,
  RemoveMemberInput,
} from "../types.js";

export type SetDaoNameAction = Action & {
  type: "SET_DAO_NAME";
  input: SetDaoNameInput;
};
export type SetDaoDescriptionAction = Action & {
  type: "SET_DAO_DESCRIPTION";
  input: SetDaoDescriptionInput;
};
export type AddMemberAction = Action & {
  type: "ADD_MEMBER";
  input: AddMemberInput;
};
export type UpdateMemberRoleAction = Action & {
  type: "UPDATE_MEMBER_ROLE";
  input: UpdateMemberRoleInput;
};
export type RemoveMemberAction = Action & {
  type: "REMOVE_MEMBER";
  input: RemoveMemberInput;
};

export type DaoCoreAction =
  | SetDaoNameAction
  | SetDaoDescriptionAction
  | AddMemberAction
  | UpdateMemberRoleAction
  | RemoveMemberAction;
