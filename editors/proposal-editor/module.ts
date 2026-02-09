import type { EditorModule } from "document-model";
import { lazy } from "react";

/** Document editor module for the "["roxium/proposal"]" document type */
export const ProposalEditor: EditorModule = {
  Component: lazy(() => import("./editor.js")),
  documentTypes: ["roxium/proposal"],
  config: {
    id: "proposal-editor",
    name: "ProposalEditor",
  },
};
