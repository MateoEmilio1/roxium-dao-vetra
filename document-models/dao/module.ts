import type { DocumentModelModule } from "document-model";
import { createState } from "document-model";
import { defaultBaseState } from "document-model/core";
import type { DaoPHState } from "roxium-dao-vetra/document-models/dao";
import {
  actions,
  documentModel,
  reducer,
  utils,
} from "roxium-dao-vetra/document-models/dao";

/** Document model module for the Todo List document type */
export const Dao: DocumentModelModule<DaoPHState> = {
  version: 1,
  reducer,
  actions,
  utils,
  documentModel: createState(defaultBaseState(), documentModel),
};
