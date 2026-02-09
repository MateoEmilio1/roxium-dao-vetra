import { generateMock } from "@powerhousedao/codegen";
import { describe, expect, it } from "vitest";
import {
  reducer,
  utils,
  isTaskDocument,
  setTaskDetails,
  updateTaskStatus,
  assignTask,
  SetTaskDetailsInputSchema,
  UpdateTaskStatusInputSchema,
  AssignTaskInputSchema,
} from "roxium-dao-vetra/document-models/task";

describe("CoreOperations", () => {
  it("should handle setTaskDetails operation", () => {
    const document = utils.createDocument();
    const input = generateMock(SetTaskDetailsInputSchema());

    const updatedDocument = reducer(document, setTaskDetails(input));

    expect(isTaskDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "SET_TASK_DETAILS",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle updateTaskStatus operation", () => {
    const document = utils.createDocument();
    const input = generateMock(UpdateTaskStatusInputSchema());

    const updatedDocument = reducer(document, updateTaskStatus(input));

    expect(isTaskDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "UPDATE_TASK_STATUS",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle assignTask operation", () => {
    const document = utils.createDocument();
    const input = generateMock(AssignTaskInputSchema());

    const updatedDocument = reducer(document, assignTask(input));

    expect(isTaskDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "ASSIGN_TASK",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
