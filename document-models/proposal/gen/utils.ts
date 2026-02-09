import type { DocumentModelUtils } from "document-model";
import {
  baseCreateDocument,
  baseSaveToFileHandle,
  baseLoadFromInput,
  defaultBaseState,
  generateId,
} from "document-model/core";
import type { ProposalGlobalState, ProposalLocalState } from "./types.js";
import type { ProposalPHState } from "./types.js";
import { reducer } from "./reducer.js";
import { proposalDocumentType } from "./document-type.js";
import {
  isProposalDocument,
  assertIsProposalDocument,
  isProposalState,
  assertIsProposalState,
} from "./document-schema.js";

export const initialGlobalState: ProposalGlobalState = {
  daoId: "",
  title: "",
  description: "",
  status: "DRAFT",
  createdBy: "",
  createdAt: null,
  closedAt: null,
};
export const initialLocalState: ProposalLocalState = {};

export const utils: DocumentModelUtils<ProposalPHState> = {
  fileExtension: "rxprop",
  createState(state) {
    return {
      ...defaultBaseState(),
      global: { ...initialGlobalState, ...state?.global },
      local: { ...initialLocalState, ...state?.local },
    };
  },
  createDocument(state) {
    const document = baseCreateDocument(utils.createState, state);

    document.header.documentType = proposalDocumentType;

    // for backwards compatibility, but this is NOT a valid signed document id
    document.header.id = generateId();

    return document;
  },
  saveToFileHandle(document, input) {
    return baseSaveToFileHandle(document, input);
  },
  loadFromInput(input) {
    return baseLoadFromInput(input, reducer);
  },
  isStateOfType(state) {
    return isProposalState(state);
  },
  assertIsStateOfType(state) {
    return assertIsProposalState(state);
  },
  isDocumentOfType(document) {
    return isProposalDocument(document);
  },
  assertIsDocumentOfType(document) {
    return assertIsProposalDocument(document);
  },
};

export const createDocument = utils.createDocument;
export const createState = utils.createState;
export const saveToFileHandle = utils.saveToFileHandle;
export const loadFromInput = utils.loadFromInput;
export const isStateOfType = utils.isStateOfType;
export const assertIsStateOfType = utils.assertIsStateOfType;
export const isDocumentOfType = utils.isDocumentOfType;
export const assertIsDocumentOfType = utils.assertIsDocumentOfType;
