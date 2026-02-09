import {
  BaseDocumentHeaderSchema,
  BaseDocumentStateSchema,
} from "document-model";
import { z } from "zod";
import { daoDocumentType } from "./document-type.js";
import { DaoStateSchema } from "./schema/zod.js";
import type { DaoDocument, DaoPHState } from "./types.js";

/** Schema for validating the header object of a Dao document */
export const DaoDocumentHeaderSchema = BaseDocumentHeaderSchema.extend({
  documentType: z.literal(daoDocumentType),
});

/** Schema for validating the state object of a Dao document */
export const DaoPHStateSchema = BaseDocumentStateSchema.extend({
  global: DaoStateSchema(),
});

export const DaoDocumentSchema = z.object({
  header: DaoDocumentHeaderSchema,
  state: DaoPHStateSchema,
  initialState: DaoPHStateSchema,
});

/** Simple helper function to check if a state object is a Dao document state object */
export function isDaoState(state: unknown): state is DaoPHState {
  return DaoPHStateSchema.safeParse(state).success;
}

/** Simple helper function to assert that a document state object is a Dao document state object */
export function assertIsDaoState(state: unknown): asserts state is DaoPHState {
  DaoPHStateSchema.parse(state);
}

/** Simple helper function to check if a document is a Dao document */
export function isDaoDocument(document: unknown): document is DaoDocument {
  return DaoDocumentSchema.safeParse(document).success;
}

/** Simple helper function to assert that a document is a Dao document */
export function assertIsDaoDocument(
  document: unknown,
): asserts document is DaoDocument {
  DaoDocumentSchema.parse(document);
}
