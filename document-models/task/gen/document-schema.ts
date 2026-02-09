import {
  BaseDocumentHeaderSchema,
  BaseDocumentStateSchema,
} from "document-model";
import { z } from "zod";
import { taskDocumentType } from "./document-type.js";
import { TaskStateSchema } from "./schema/zod.js";
import type { TaskDocument, TaskPHState } from "./types.js";

/** Schema for validating the header object of a Task document */
export const TaskDocumentHeaderSchema = BaseDocumentHeaderSchema.extend({
  documentType: z.literal(taskDocumentType),
});

/** Schema for validating the state object of a Task document */
export const TaskPHStateSchema = BaseDocumentStateSchema.extend({
  global: TaskStateSchema(),
});

export const TaskDocumentSchema = z.object({
  header: TaskDocumentHeaderSchema,
  state: TaskPHStateSchema,
  initialState: TaskPHStateSchema,
});

/** Simple helper function to check if a state object is a Task document state object */
export function isTaskState(state: unknown): state is TaskPHState {
  return TaskPHStateSchema.safeParse(state).success;
}

/** Simple helper function to assert that a document state object is a Task document state object */
export function assertIsTaskState(
  state: unknown,
): asserts state is TaskPHState {
  TaskPHStateSchema.parse(state);
}

/** Simple helper function to check if a document is a Task document */
export function isTaskDocument(document: unknown): document is TaskDocument {
  return TaskDocumentSchema.safeParse(document).success;
}

/** Simple helper function to assert that a document is a Task document */
export function assertIsTaskDocument(
  document: unknown,
): asserts document is TaskDocument {
  TaskDocumentSchema.parse(document);
}
