import type { EditorModule } from "document-model";
import { DaoEditor } from "./dao-editor/module.js";
import { ProposalEditor } from "./proposal-editor/module.js";
import { TaskEditor } from "./task-editor/module.js";

export const editors: EditorModule[] = [
  DaoEditor,
  ProposalEditor,
  TaskEditor,
];
