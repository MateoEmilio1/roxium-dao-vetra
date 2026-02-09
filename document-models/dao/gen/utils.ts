import type { DocumentModelUtils } from "document-model";
import {
  baseCreateDocument,
  baseSaveToFileHandle,
  baseLoadFromInput,
  defaultBaseState,
  generateId,
} from "document-model/core";
import type { DaoGlobalState, DaoLocalState } from "./types.js";
import type { DaoPHState } from "./types.js";
import { reducer } from "./reducer.js";
import { daoDocumentType } from "./document-type.js";
import {
  isDaoDocument,
  assertIsDaoDocument,
  isDaoState,
  assertIsDaoState,
} from "./document-schema.js";

export const initialGlobalState: DaoGlobalState = {
  name: "",
  description: "",
  members: [],
};
export const initialLocalState: DaoLocalState = {};

export const utils: DocumentModelUtils<DaoPHState> = {
  fileExtension: "rxdao",
  createState(state) {
    return {
      ...defaultBaseState(),
      global: { ...initialGlobalState, ...state?.global },
      local: { ...initialLocalState, ...state?.local },
    };
  },
  createDocument(state) {
    const document = baseCreateDocument(utils.createState, state);

    document.header.documentType = daoDocumentType;

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
    return isDaoState(state);
  },
  assertIsStateOfType(state) {
    return assertIsDaoState(state);
  },
  isDocumentOfType(document) {
    return isDaoDocument(document);
  },
  assertIsDocumentOfType(document) {
    return assertIsDaoDocument(document);
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
