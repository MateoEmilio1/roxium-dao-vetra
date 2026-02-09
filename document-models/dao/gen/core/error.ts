export type ErrorCode = "DuplicateMemberIdError" | "MemberNotFoundError";

export interface ReducerError {
  errorCode: ErrorCode;
}

export class DuplicateMemberIdError extends Error implements ReducerError {
  errorCode = "DuplicateMemberIdError" as ErrorCode;
  constructor(message = "DuplicateMemberIdError") {
    super(message);
  }
}

export class MemberNotFoundError extends Error implements ReducerError {
  errorCode = "MemberNotFoundError" as ErrorCode;
  constructor(message = "MemberNotFoundError") {
    super(message);
  }
}

export const errors = {
  AddMember: { DuplicateMemberIdError },
  UpdateMemberRole: { MemberNotFoundError },
  RemoveMember: { MemberNotFoundError },
};
