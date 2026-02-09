import { generateMock } from "@powerhousedao/codegen";
import { describe, expect, it } from "vitest";
import {
  reducer,
  utils,
  isDaoDocument,
  setDaoName,
  setDaoDescription,
  addMember,
  updateMemberRole,
  removeMember,
  SetDaoNameInputSchema,
  SetDaoDescriptionInputSchema,
  AddMemberInputSchema,
  UpdateMemberRoleInputSchema,
  RemoveMemberInputSchema,
} from "roxium-dao-vetra/document-models/dao";

describe("CoreOperations", () => {
  it("should handle setDaoName operation", () => {
    const document = utils.createDocument();
    const input = generateMock(SetDaoNameInputSchema());

    const updatedDocument = reducer(document, setDaoName(input));

    expect(isDaoDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "SET_DAO_NAME",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle setDaoDescription operation", () => {
    const document = utils.createDocument();
    const input = generateMock(SetDaoDescriptionInputSchema());

    const updatedDocument = reducer(document, setDaoDescription(input));

    expect(isDaoDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "SET_DAO_DESCRIPTION",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle addMember operation", () => {
    const document = utils.createDocument();
    const input = generateMock(AddMemberInputSchema());

    const updatedDocument = reducer(document, addMember(input));

    expect(isDaoDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe("ADD_MEMBER");
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle updateMemberRole operation", () => {
    const document = utils.createDocument();
    const input = generateMock(UpdateMemberRoleInputSchema());

    const updatedDocument = reducer(document, updateMemberRole(input));

    expect(isDaoDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "UPDATE_MEMBER_ROLE",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle removeMember operation", () => {
    const document = utils.createDocument();
    const input = generateMock(RemoveMemberInputSchema());

    const updatedDocument = reducer(document, removeMember(input));

    expect(isDaoDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "REMOVE_MEMBER",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
