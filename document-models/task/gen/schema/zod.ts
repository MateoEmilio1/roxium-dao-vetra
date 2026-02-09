import * as z from "zod";
import type {
  AssignTaskInput,
  SetTaskDetailsInput,
  TaskState,
  UpdateTaskStatusInput,
} from "./types.js";

type Properties<T> = Required<{
  [K in keyof T]: z.ZodType<T[K]>;
}>;

type definedNonNullAny = {};

export const isDefinedNonNullAny = (v: any): v is definedNonNullAny =>
  v !== undefined && v !== null;

export const definedNonNullAnySchema = z
  .any()
  .refine((v) => isDefinedNonNullAny(v));

export function AssignTaskInputSchema(): z.ZodObject<
  Properties<AssignTaskInput>
> {
  return z.object({
    assignee: z.string(),
    updatedAt: z.iso.datetime(),
  });
}

export function SetTaskDetailsInputSchema(): z.ZodObject<
  Properties<SetTaskDetailsInput>
> {
  return z.object({
    assignee: z.string().nullish(),
    createdAt: z.iso.datetime(),
    createdBy: z.string(),
    daoId: z.string(),
    description: z.string().nullish(),
    proposalId: z.string().nullish(),
    title: z.string(),
  });
}

export function TaskStateSchema(): z.ZodObject<Properties<TaskState>> {
  return z.object({
    __typename: z.literal("TaskState").optional(),
    assignee: z.string().nullish(),
    createdAt: z.iso.datetime().nullish(),
    createdBy: z.string().nullish(),
    daoId: z.string().nullish(),
    description: z.string().nullish(),
    proposalId: z.string().nullish(),
    status: z.string().nullish(),
    title: z.string().nullish(),
    updatedAt: z.iso.datetime().nullish(),
  });
}

export function UpdateTaskStatusInputSchema(): z.ZodObject<
  Properties<UpdateTaskStatusInput>
> {
  return z.object({
    status: z.string(),
    updatedAt: z.iso.datetime(),
  });
}
