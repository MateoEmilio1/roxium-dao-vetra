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
  taskDocumentType,
  isTaskDocument,
  assertIsTaskDocument,
  isTaskState,
  assertIsTaskState,
} from "roxium-dao-vetra/document-models/task";
import { ZodError } from "zod";

describe("Task Document Model", () => {
  it("should create a new Task document", () => {
    const document = utils.createDocument();

    expect(document).toBeDefined();
    expect(document.header.documentType).toBe(taskDocumentType);
  });

  it("should create a new Task document with a valid initial state", () => {
    const document = utils.createDocument();
    expect(document.state.global).toStrictEqual(initialGlobalState);
    expect(document.state.local).toStrictEqual(initialLocalState);
    expect(isTaskDocument(document)).toBe(true);
    expect(isTaskState(document.state)).toBe(true);
  });
  it("should reject a document that is not a Task document", () => {
    const wrongDocumentType = utils.createDocument();
    wrongDocumentType.header.documentType = "the-wrong-thing-1234";
    try {
      expect(assertIsTaskDocument(wrongDocumentType)).toThrow();
      expect(isTaskDocument(wrongDocumentType)).toBe(false);
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
    expect(isTaskState(wrongState.state)).toBe(false);
    expect(assertIsTaskState(wrongState.state)).toThrow();
    expect(isTaskDocument(wrongState)).toBe(false);
    expect(assertIsTaskDocument(wrongState)).toThrow();
  } catch (error) {
    expect(error).toBeInstanceOf(ZodError);
  }

  const wrongInitialState = utils.createDocument();
  // @ts-expect-error - we are testing the error case
  wrongInitialState.initialState.global = {
    ...{ notWhat: "you want" },
  };
  try {
    expect(isTaskState(wrongInitialState.state)).toBe(false);
    expect(assertIsTaskState(wrongInitialState.state)).toThrow();
    expect(isTaskDocument(wrongInitialState)).toBe(false);
    expect(assertIsTaskDocument(wrongInitialState)).toThrow();
  } catch (error) {
    expect(error).toBeInstanceOf(ZodError);
  }

  const missingIdInHeader = utils.createDocument();
  // @ts-expect-error - we are testing the error case
  delete missingIdInHeader.header.id;
  try {
    expect(isTaskDocument(missingIdInHeader)).toBe(false);
    expect(assertIsTaskDocument(missingIdInHeader)).toThrow();
  } catch (error) {
    expect(error).toBeInstanceOf(ZodError);
  }

  const missingNameInHeader = utils.createDocument();
  // @ts-expect-error - we are testing the error case
  delete missingNameInHeader.header.name;
  try {
    expect(isTaskDocument(missingNameInHeader)).toBe(false);
    expect(assertIsTaskDocument(missingNameInHeader)).toThrow();
  } catch (error) {
    expect(error).toBeInstanceOf(ZodError);
  }

  const missingCreatedAtUtcIsoInHeader = utils.createDocument();
  // @ts-expect-error - we are testing the error case
  delete missingCreatedAtUtcIsoInHeader.header.createdAtUtcIso;
  try {
    expect(isTaskDocument(missingCreatedAtUtcIsoInHeader)).toBe(false);
    expect(assertIsTaskDocument(missingCreatedAtUtcIsoInHeader)).toThrow();
  } catch (error) {
    expect(error).toBeInstanceOf(ZodError);
  }

  const missingLastModifiedAtUtcIsoInHeader = utils.createDocument();
  // @ts-expect-error - we are testing the error case
  delete missingLastModifiedAtUtcIsoInHeader.header.lastModifiedAtUtcIso;
  try {
    expect(isTaskDocument(missingLastModifiedAtUtcIsoInHeader)).toBe(false);
    expect(assertIsTaskDocument(missingLastModifiedAtUtcIsoInHeader)).toThrow();
  } catch (error) {
    expect(error).toBeInstanceOf(ZodError);
  }
});
