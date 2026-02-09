import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import {
  useDocumentById,
  useDocumentsInSelectedDrive,
  useDocumentsInSelectedFolder,
  useSelectedDocument,
} from "@powerhousedao/reactor-browser";
import type {
  DaoAction,
  DaoDocument,
} from "roxium-dao-vetra/document-models/dao";
import { assertIsDaoDocument, isDaoDocument } from "./gen/document-schema.js";

/** Hook to get a Dao document by its id */
export function useDaoDocumentById(
  documentId: string | null | undefined,
): [DaoDocument, DocumentDispatch<DaoAction>] | [undefined, undefined] {
  const [document, dispatch] = useDocumentById(documentId);
  if (!isDaoDocument(document)) return [undefined, undefined];
  return [document, dispatch];
}

/** Hook to get the selected Dao document */
export function useSelectedDaoDocument(): [
  DaoDocument,
  DocumentDispatch<DaoAction>,
] {
  const [document, dispatch] = useSelectedDocument();

  assertIsDaoDocument(document);
  return [document, dispatch] as const;
}

/** Hook to get all Dao documents in the selected drive */
export function useDaoDocumentsInSelectedDrive() {
  const documentsInSelectedDrive = useDocumentsInSelectedDrive();
  return documentsInSelectedDrive?.filter(isDaoDocument);
}

/** Hook to get all Dao documents in the selected folder */
export function useDaoDocumentsInSelectedFolder() {
  const documentsInSelectedFolder = useDocumentsInSelectedFolder();
  return documentsInSelectedFolder?.filter(isDaoDocument);
}
