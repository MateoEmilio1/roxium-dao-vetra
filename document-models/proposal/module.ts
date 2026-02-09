import type { DocumentModelModule } from "document-model";
import { createState } from "document-model";
import { defaultBaseState } from "document-model/core";
import type { ProposalPHState } from "roxium-dao-vetra/document-models/proposal";
import {
  actions,
  documentModel,
  reducer,
  utils,
} from "roxium-dao-vetra/document-models/proposal";

/** Document model module for the Todo List document type */
export const Proposal: DocumentModelModule<ProposalPHState> = {
  version: 1,
  reducer,
  actions,
  utils,
  documentModel: createState(defaultBaseState(), documentModel),
};
