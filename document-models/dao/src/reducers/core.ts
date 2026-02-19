import type { DaoCoreOperations } from "roxium-dao-vetra/document-models/dao";
import {
  DuplicateMemberIdError,
  MemberNotFoundError,
} from "../../gen/core/error.js";

export const daoCoreOperations: DaoCoreOperations = {
  setDaoNameOperation(state, action) {
    state.name = action.input.name;
  },
  setDaoDescriptionOperation(state, action) {
    state.description = action.input.description;
  },
  setDaoOwnerOperation(state, action) {
    state.ownerUserId = action.input.ownerUserId;
  },
  addMemberOperation(state, action) {
    const existing = state.members.find((m) => m.id === action.input.id);
    if (existing) {
      throw new DuplicateMemberIdError(
        `Member with id ${action.input.id} already exists`,
      );
    }
    state.members.push({
      id: action.input.id,
      name: action.input.name,
      role: action.input.role,
      joinedAt: action.input.joinedAt,
    });
  },
  updateMemberRoleOperation(state, action) {
    const member = state.members.find((m) => m.id === action.input.id);
    if (!member) {
      throw new MemberNotFoundError(
        `Member with id ${action.input.id} not found`,
      );
    }
    member.role = action.input.role;
  },
  removeMemberOperation(state, action) {
    const idx = state.members.findIndex((m) => m.id === action.input.id);
    if (idx === -1) {
      throw new MemberNotFoundError(
        `Member with id ${action.input.id} not found`,
      );
    }
    state.members.splice(idx, 1);
  },
};
