
import type { EditorModule } from "document-model";
import { lazy } from "react";

/** Document editor module for the "["roxium/dao"]" document type */
export const DaoEditor: EditorModule = {
    Component: lazy(() => import("./editor.js")),
    documentTypes: ["roxium/dao"],
    config: {
        id: "dao-editor",
        name: "DaoEditor",
    },
};
