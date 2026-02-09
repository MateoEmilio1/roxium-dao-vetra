import type { DocumentModelUtils } from "document-model";
import {
  baseCreateDocument,
  baseSaveToFileHandle,
  baseLoadFromInput,
  defaultBaseState,
  generateId,
} from "document-model/core";
import type { TaskGlobalState, TaskLocalState } from "./types.js";
import type { TaskPHState } from "./types.js";
import { reducer } from "./reducer.js";
import { taskDocumentType } from "./document-type.js";
import {
  isTaskDocument,
  assertIsTaskDocument,
  isTaskState,
  assertIsTaskState,
} from "./document-schema.js";

export const initialGlobalState: TaskGlobalState = {
  daoId: "",
  proposalId: "",
  title: "",
  description: "",
  status: "TODO",
  assignee: "",
  createdBy: "",
  createdAt: null,
  updatedAt: null,
};
export const initialLocalState: TaskLocalState = {};

export const utils: DocumentModelUtils<TaskPHState> = {
  fileExtension: "rxtask",
  createState(state) {
    return {
      ...defaultBaseState(),
      global: { ...initialGlobalState, ...state?.global },
      local: { ...initialLocalState, ...state?.local },
    };
  },
  createDocument(state) {
    const document = baseCreateDocument(utils.createState, state);

    document.header.documentType = taskDocumentType;

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
    return isTaskState(state);
  },
  assertIsStateOfType(state) {
    return assertIsTaskState(state);
  },
  isDocumentOfType(document) {
    return isTaskDocument(document);
  },
  assertIsDocumentOfType(document) {
    return assertIsTaskDocument(document);
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
