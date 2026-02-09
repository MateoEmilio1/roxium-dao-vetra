
import type { EditorModule } from "document-model";
import { lazy } from "react";

/** Document editor module for the "["roxium/task"]" document type */
export const TaskEditor: EditorModule = {
    Component: lazy(() => import("./editor.js")),
    documentTypes: ["roxium/task"],
    config: {
        id: "task-editor",
        name: "TaskEditor",
    },
};
