import { generateMock } from "@powerhousedao/codegen";
import { describe, expect, it } from "vitest";
import {
  reducer,
  utils,
  isProposalDocument,
  setProposalDetails,
  updateProposalStatus,
  SetProposalDetailsInputSchema,
  UpdateProposalStatusInputSchema,
} from "roxium-dao-vetra/document-models/proposal";

describe("CoreOperations", () => {
  it("should handle setProposalDetails operation", () => {
    const document = utils.createDocument();
    const input = generateMock(SetProposalDetailsInputSchema());

    const updatedDocument = reducer(document, setProposalDetails(input));

    expect(isProposalDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "SET_PROPOSAL_DETAILS",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle updateProposalStatus operation", () => {
    const document = utils.createDocument();
    const input = generateMock(UpdateProposalStatusInputSchema());

    const updatedDocument = reducer(document, updateProposalStatus(input));

    expect(isProposalDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "UPDATE_PROPOSAL_STATUS",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
