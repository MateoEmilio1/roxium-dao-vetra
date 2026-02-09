import { baseActions } from "document-model";
import { coreActions } from "./gen/creators.js";

/** Actions for the Task document model */

export const actions = { ...baseActions, ...coreActions };
