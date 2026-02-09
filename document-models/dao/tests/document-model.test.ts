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
  daoDocumentType,
  isDaoDocument,
  assertIsDaoDocument,
  isDaoState,
  assertIsDaoState,
} from "roxium-dao-vetra/document-models/dao";
import { ZodError } from "zod";

describe("Dao Document Model", () => {
  it("should create a new Dao document", () => {
    const document = utils.createDocument();

    expect(document).toBeDefined();
    expect(document.header.documentType).toBe(daoDocumentType);
  });

  it("should create a new Dao document with a valid initial state", () => {
    const document = utils.createDocument();
    expect(document.state.global).toStrictEqual(initialGlobalState);
    expect(document.state.local).toStrictEqual(initialLocalState);
    expect(isDaoDocument(document)).toBe(true);
    expect(isDaoState(document.state)).toBe(true);
  });
  it("should reject a document that is not a Dao document", () => {
    const wrongDocumentType = utils.createDocument();
    wrongDocumentType.header.documentType = "the-wrong-thing-1234";
    try {
      expect(assertIsDaoDocument(wrongDocumentType)).toThrow();
      expect(isDaoDocument(wrongDocumentType)).toBe(false);
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
    expect(isDaoState(wrongState.state)).toBe(false);
    expect(assertIsDaoState(wrongState.state)).toThrow();
    expect(isDaoDocument(wrongState)).toBe(false);
    expect(assertIsDaoDocument(wrongState)).toThrow();
  } catch (error) {
    expect(error).toBeInstanceOf(ZodError);
  }

  const wrongInitialState = utils.createDocument();
  // @ts-expect-error - we are testing the error case
  wrongInitialState.initialState.global = {
    ...{ notWhat: "you want" },
  };
  try {
    expect(isDaoState(wrongInitialState.state)).toBe(false);
    expect(assertIsDaoState(wrongInitialState.state)).toThrow();
    expect(isDaoDocument(wrongInitialState)).toBe(false);
    expect(assertIsDaoDocument(wrongInitialState)).toThrow();
  } catch (error) {
    expect(error).toBeInstanceOf(ZodError);
  }

  const missingIdInHeader = utils.createDocument();
  // @ts-expect-error - we are testing the error case
  delete missingIdInHeader.header.id;
  try {
    expect(isDaoDocument(missingIdInHeader)).toBe(false);
    expect(assertIsDaoDocument(missingIdInHeader)).toThrow();
  } catch (error) {
    expect(error).toBeInstanceOf(ZodError);
  }

  const missingNameInHeader = utils.createDocument();
  // @ts-expect-error - we are testing the error case
  delete missingNameInHeader.header.name;
  try {
    expect(isDaoDocument(missingNameInHeader)).toBe(false);
    expect(assertIsDaoDocument(missingNameInHeader)).toThrow();
  } catch (error) {
    expect(error).toBeInstanceOf(ZodError);
  }

  const missingCreatedAtUtcIsoInHeader = utils.createDocument();
  // @ts-expect-error - we are testing the error case
  delete missingCreatedAtUtcIsoInHeader.header.createdAtUtcIso;
  try {
    expect(isDaoDocument(missingCreatedAtUtcIsoInHeader)).toBe(false);
    expect(assertIsDaoDocument(missingCreatedAtUtcIsoInHeader)).toThrow();
  } catch (error) {
    expect(error).toBeInstanceOf(ZodError);
  }

  const missingLastModifiedAtUtcIsoInHeader = utils.createDocument();
  // @ts-expect-error - we are testing the error case
  delete missingLastModifiedAtUtcIsoInHeader.header.lastModifiedAtUtcIso;
  try {
    expect(isDaoDocument(missingLastModifiedAtUtcIsoInHeader)).toBe(false);
    expect(assertIsDaoDocument(missingLastModifiedAtUtcIsoInHeader)).toThrow();
  } catch (error) {
    expect(error).toBeInstanceOf(ZodError);
  }
});
