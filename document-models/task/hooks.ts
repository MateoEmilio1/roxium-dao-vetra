import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import {
  useDocumentById,
  useDocumentsInSelectedDrive,
  useDocumentsInSelectedFolder,
  useSelectedDocument,
} from "@powerhousedao/reactor-browser";
import type {
  TaskAction,
  TaskDocument,
} from "roxium-dao-vetra/document-models/task";
import { assertIsTaskDocument, isTaskDocument } from "./gen/document-schema.js";

/** Hook to get a Task document by its id */
export function useTaskDocumentById(
  documentId: string | null | undefined,
): [TaskDocument, DocumentDispatch<TaskAction>] | [undefined, undefined] {
  const [document, dispatch] = useDocumentById(documentId);
  if (!isTaskDocument(document)) return [undefined, undefined];
  return [document, dispatch];
}

/** Hook to get the selected Task document */
export function useSelectedTaskDocument(): [
  TaskDocument,
  DocumentDispatch<TaskAction>,
] {
  const [document, dispatch] = useSelectedDocument();

  assertIsTaskDocument(document);
  return [document, dispatch] as const;
}

/** Hook to get all Task documents in the selected drive */
export function useTaskDocumentsInSelectedDrive() {
  const documentsInSelectedDrive = useDocumentsInSelectedDrive();
  return documentsInSelectedDrive?.filter(isTaskDocument);
}

/** Hook to get all Task documents in the selected folder */
export function useTaskDocumentsInSelectedFolder() {
  const documentsInSelectedFolder = useDocumentsInSelectedFolder();
  return documentsInSelectedFolder?.filter(isTaskDocument);
}
