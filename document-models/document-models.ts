import type { DocumentModelModule } from "document-model";
import { Dao } from "./dao/module.js";
import { Proposal } from "./proposal/module.js";
import { Task } from "./task/module.js";

export const documentModels: DocumentModelModule<any>[] = [Dao, Proposal, Task];
