/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */
/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { describe, it, expect } from "vitest";
import {
  utils,
  initialGlobalState,
  initialLocalState,
  proposalDocumentType,
  isProposalDocument,
  assertIsProposalDocument,
  isProposalState,
  assertIsProposalState,
} from "roxium-dao-vetra/document-models/proposal";
import { ZodError } from "zod";

describe("Proposal Document Model", () => {
  it("should create a new Proposal document", () => {
    const document = utils.createDocument();

    expect(document).toBeDefined();
    expect(document.header.documentType).toBe(proposalDocumentType);
  });

  it("should create a new Proposal document with a valid initial state", () => {
    const document = utils.createDocument();
    expect(document.state.global).toStrictEqual(initialGlobalState);
    expect(document.state.local).toStrictEqual(initialLocalState);
    expect(isProposalDocument(document)).toBe(true);
    expect(isProposalState(document.state)).toBe(true);
  });
  it("should reject a document that is not a Proposal document", () => {
    const wrongDocumentType = utils.createDocument();
    wrongDocumentType.header.documentType = "the-wrong-thing-1234";
    try {
      expect(assertIsProposalDocument(wrongDocumentType)).toThrow();
      expect(isProposalDocument(wrongDocumentType)).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(ZodError);
    }
  });
  const wrongState = utils.createDocument();
  // @ts-expect-error - we are testing the error case
  wrongState.state.global = {
    ...{ notWhat: "you want" },
  };
  try {
    expect(isProposalState(wrongState.state)).toBe(false);
    expect(assertIsProposalState(wrongState.state)).toThrow();
    expect(isProposalDocument(wrongState)).toBe(false);
    expect(assertIsProposalDocument(wrongState)).toThrow();
  } catch (error) {
    expect(error).toBeInstanceOf(ZodError);
  }

  const wrongInitialState = utils.createDocument();
  // @ts-expect-error - we are testing the error case
  wrongInitialState.initialState.global = {
    ...{ notWhat: "you want" },
  };
  try {
    expect(isProposalState(wrongInitialState.state)).toBe(false);
    expect(assertIsProposalState(wrongInitialState.state)).toThrow();
    expect(isProposalDocument(wrongInitialState)).toBe(false);
    expect(assertIsProposalDocument(wrongInitialState)).toThrow();
  } catch (error) {
    expect(error).toBeInstanceOf(ZodError);
  }

  const missingIdInHeader = utils.createDocument();
  // @ts-expect-error - we are testing the error case
  delete missingIdInHeader.header.id;
  try {
    expect(isProposalDocument(missingIdInHeader)).toBe(false);
    expect(assertIsProposalDocument(missingIdInHeader)).toThrow();
  } catch (error) {
    expect(error).toBeInstanceOf(ZodError);
  }

  const missingNameInHeader = utils.createDocument();
  // @ts-expect-error - we are testing the error case
  delete missingNameInHeader.header.name;
  try {
    expect(isProposalDocument(missingNameInHeader)).toBe(false);
    expect(assertIsProposalDocument(missingNameInHeader)).toThrow();
  } catch (error) {
    expect(error).toBeInstanceOf(ZodError);
  }

  const missingCreatedAtUtcIsoInHeader = utils.createDocument();
  // @ts-expect-error - we are testing the error case
  delete missingCreatedAtUtcIsoInHeader.header.createdAtUtcIso;
  try {
    expect(isProposalDocument(missingCreatedAtUtcIsoInHeader)).toBe(false);
    expect(assertIsProposalDocument(missingCreatedAtUtcIsoInHeader)).toThrow();
  } catch (error) {
    expect(error).toBeInstanceOf(ZodError);
  }

  const missingLastModifiedAtUtcIsoInHeader = utils.createDocument();
  // @ts-expect-error - we are testing the error case
  delete missingLastModifiedAtUtcIsoInHeader.header.lastModifiedAtUtcIso;
  try {
    expect(isProposalDocument(missingLastModifiedAtUtcIsoInHeader)).toBe(false);
    expect(
      assertIsProposalDocument(missingLastModifiedAtUtcIsoInHeader),
    ).toThrow();
  } catch (error) {
    expect(error).toBeInstanceOf(ZodError);
  }
});
