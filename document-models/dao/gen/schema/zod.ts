import * as z from "zod";
import type {
  AddMemberInput,
  DaoState,
  Member,
  RemoveMemberInput,
  SetDaoDescriptionInput,
  SetDaoNameInput,
  UpdateMemberRoleInput,
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

export function AddMemberInputSchema(): z.ZodObject<
  Properties<AddMemberInput>
> {
  return z.object({
    id: z.string(),
    joinedAt: z.iso.datetime(),
    name: z.string(),
    role: z.string(),
  });
}

export function DaoStateSchema(): z.ZodObject<Properties<DaoState>> {
  return z.object({
    __typename: z.literal("DaoState").optional(),
    description: z.string().nullish(),
    members: z.array(z.lazy(() => MemberSchema())),
    name: z.string().nullish(),
  });
}

export function MemberSchema(): z.ZodObject<Properties<Member>> {
  return z.object({
    __typename: z.literal("Member").optional(),
    id: z.string(),
    joinedAt: z.iso.datetime(),
    name: z.string(),
    role: z.string(),
  });
}

export function RemoveMemberInputSchema(): z.ZodObject<
  Properties<RemoveMemberInput>
> {
  return z.object({
    id: z.string(),
  });
}

export function SetDaoDescriptionInputSchema(): z.ZodObject<
  Properties<SetDaoDescriptionInput>
> {
  return z.object({
    description: z.string(),
  });
}

export function SetDaoNameInputSchema(): z.ZodObject<
  Properties<SetDaoNameInput>
> {
  return z.object({
    name: z.string(),
  });
}

export function UpdateMemberRoleInputSchema(): z.ZodObject<
  Properties<UpdateMemberRoleInput>
> {
  return z.object({
    id: z.string(),
    role: z.string(),
  });
}
