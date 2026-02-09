import * as z from "zod";
import type {
  ProposalState,
  SetProposalDetailsInput,
  UpdateProposalStatusInput,
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

export function ProposalStateSchema(): z.ZodObject<Properties<ProposalState>> {
  return z.object({
    __typename: z.literal("ProposalState").optional(),
    closedAt: z.iso.datetime().nullish(),
    createdAt: z.iso.datetime().nullish(),
    createdBy: z.string().nullish(),
    daoId: z.string().nullish(),
    description: z.string().nullish(),
    status: z.string().nullish(),
    title: z.string().nullish(),
  });
}

export function SetProposalDetailsInputSchema(): z.ZodObject<
  Properties<SetProposalDetailsInput>
> {
  return z.object({
    createdAt: z.iso.datetime(),
    createdBy: z.string(),
    daoId: z.string(),
    description: z.string().nullish(),
    title: z.string(),
  });
}

export function UpdateProposalStatusInputSchema(): z.ZodObject<
  Properties<UpdateProposalStatusInput>
> {
  return z.object({
    closedAt: z.iso.datetime().nullish(),
    status: z.string(),
  });
}
