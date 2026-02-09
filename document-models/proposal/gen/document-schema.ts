import {
  BaseDocumentHeaderSchema,
  BaseDocumentStateSchema,
} from "document-model";
import { z } from "zod";
import { proposalDocumentType } from "./document-type.js";
import { ProposalStateSchema } from "./schema/zod.js";
import type { ProposalDocument, ProposalPHState } from "./types.js";

/** Schema for validating the header object of a Proposal document */
export const ProposalDocumentHeaderSchema = BaseDocumentHeaderSchema.extend({
  documentType: z.literal(proposalDocumentType),
});

/** Schema for validating the state object of a Proposal document */
export const ProposalPHStateSchema = BaseDocumentStateSchema.extend({
  global: ProposalStateSchema(),
});

export const ProposalDocumentSchema = z.object({
  header: ProposalDocumentHeaderSchema,
  state: ProposalPHStateSchema,
  initialState: ProposalPHStateSchema,
});

/** Simple helper function to check if a state object is a Proposal document state object */
export function isProposalState(state: unknown): state is ProposalPHState {
  return ProposalPHStateSchema.safeParse(state).success;
}

/** Simple helper function to assert that a document state object is a Proposal document state object */
export function assertIsProposalState(
  state: unknown,
): asserts state is ProposalPHState {
  ProposalPHStateSchema.parse(state);
}

/** Simple helper function to check if a document is a Proposal document */
export function isProposalDocument(
  document: unknown,
): document is ProposalDocument {
  return ProposalDocumentSchema.safeParse(document).success;
}

/** Simple helper function to assert that a document is a Proposal document */
export function assertIsProposalDocument(
  document: unknown,
): asserts document is ProposalDocument {
  ProposalDocumentSchema.parse(document);
}
