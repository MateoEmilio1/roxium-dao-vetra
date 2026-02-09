import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import {
  useDocumentById,
  useDocumentsInSelectedDrive,
  useDocumentsInSelectedFolder,
  useSelectedDocument,
} from "@powerhousedao/reactor-browser";
import type {
  ProposalAction,
  ProposalDocument,
} from "roxium-dao-vetra/document-models/proposal";
import {
  assertIsProposalDocument,
  isProposalDocument,
} from "./gen/document-schema.js";

/** Hook to get a Proposal document by its id */
export function useProposalDocumentById(
  documentId: string | null | undefined,
):
  | [ProposalDocument, DocumentDispatch<ProposalAction>]
  | [undefined, undefined] {
  const [document, dispatch] = useDocumentById(documentId);
  if (!isProposalDocument(document)) return [undefined, undefined];
  return [document, dispatch];
}

/** Hook to get the selected Proposal document */
export function useSelectedProposalDocument(): [
  ProposalDocument,
  DocumentDispatch<ProposalAction>,
] {
  const [document, dispatch] = useSelectedDocument();

  assertIsProposalDocument(document);
  return [document, dispatch] as const;
}

/** Hook to get all Proposal documents in the selected drive */
export function useProposalDocumentsInSelectedDrive() {
  const documentsInSelectedDrive = useDocumentsInSelectedDrive();
  return documentsInSelectedDrive?.filter(isProposalDocument);
}

/** Hook to get all Proposal documents in the selected folder */
export function useProposalDocumentsInSelectedFolder() {
  const documentsInSelectedFolder = useDocumentsInSelectedFolder();
  return documentsInSelectedFolder?.filter(isProposalDocument);
}
