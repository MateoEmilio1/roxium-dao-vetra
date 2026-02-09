import { baseActions } from "document-model";
import { coreActions } from "./gen/creators.js";

/** Actions for the Dao document model */

export const actions = { ...baseActions, ...coreActions };
