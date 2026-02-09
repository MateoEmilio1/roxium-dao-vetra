import type { DocumentModelGlobalState } from "document-model";

export const documentModel: DocumentModelGlobalState = {
  author: {
    name: "Roxium Labs",
    website: "https://roxium.io",
  },
  description:
    "Represents a DAO with members and roles (OWNER/CONTRIBUTOR/VIEWER). Data-only, no authorization enforcement.",
  extension: "rxdao",
  id: "roxium/dao",
  name: "Dao",
  specifications: [
    {
      changeLog: [],
      modules: [
        {
          description: "Core DAO operations",
          id: "dao_core_module",
          name: "core",
          operations: [
            {
              description: "Sets the DAO name",
              errors: [],
              examples: [],
              id: "dao_op_set_name",
              name: "SET_DAO_NAME",
              reducer: "state.name = action.input.name;",
              schema: "input SetDaoNameInput {\n  name: String!\n}",
              scope: "global",
              template: "Sets the DAO name",
            },
            {
              description: "Sets the DAO description",
              errors: [],
              examples: [],
              id: "dao_op_set_desc",
              name: "SET_DAO_DESCRIPTION",
              reducer: "state.description = action.input.description;",
              schema:
                "input SetDaoDescriptionInput {\n  description: String!\n}",
              scope: "global",
              template: "Sets the DAO description",
            },
            {
              description: "Adds a new member to the DAO",
              errors: [
                {
                  id: "dao_err_dup_member",
                  name: "DuplicateMemberIdError",
                  code: "DUPLICATE_MEMBER_ID",
                  description:
                    "A member with this ID already exists in the DAO",
                  template: "",
                },
              ],
              examples: [],
              id: "dao_op_add_member",
              name: "ADD_MEMBER",
              reducer:
                "const existing = state.members.find(m => m.id === action.input.id);\nif (existing) {\n  throw new DuplicateMemberIdError(`Member with id ${action.input.id} already exists`);\n}\nstate.members.push({\n  id: action.input.id,\n  name: action.input.name,\n  role: action.input.role,\n  joinedAt: action.input.joinedAt,\n});",
              schema:
                "input AddMemberInput {\n  id: OID!\n  name: String!\n  role: String!\n  joinedAt: DateTime!\n}",
              scope: "global",
              template: "Adds a new member to the DAO",
            },
            {
              description: "Updates the role of an existing member",
              errors: [
                {
                  id: "dao_err_member_not_found_1",
                  name: "MemberNotFoundError",
                  code: "MEMBER_NOT_FOUND",
                  description: "The specified member was not found in the DAO",
                  template: "",
                },
              ],
              examples: [],
              id: "dao_op_update_role",
              name: "UPDATE_MEMBER_ROLE",
              reducer:
                "const member = state.members.find(m => m.id === action.input.id);\nif (!member) {\n  throw new MemberNotFoundError(`Member with id ${action.input.id} not found`);\n}\nmember.role = action.input.role;",
              schema:
                "input UpdateMemberRoleInput {\n  id: OID!\n  role: String!\n}",
              scope: "global",
              template: "Updates the role of an existing member",
            },
            {
              description: "Removes a member from the DAO",
              errors: [
                {
                  id: "dao_err_member_not_found_2",
                  name: "MemberNotFoundError",
                  code: "MEMBER_NOT_FOUND",
                  description: "The specified member was not found in the DAO",
                  template: "",
                },
              ],
              examples: [],
              id: "dao_op_remove_member",
              name: "REMOVE_MEMBER",
              reducer:
                "const idx = state.members.findIndex(m => m.id === action.input.id);\nif (idx === -1) {\n  throw new MemberNotFoundError(`Member with id ${action.input.id} not found`);\n}\nstate.members.splice(idx, 1);",
              schema: "input RemoveMemberInput {\n  id: OID!\n}",
              scope: "global",
              template: "Removes a member from the DAO",
            },
          ],
        },
      ],
      state: {
        global: {
          examples: [],
          initialValue: '{"name":"","description":"","members":[]}',
          schema:
            "type Member {\n  id: OID!\n  name: String!\n  role: String!\n  joinedAt: DateTime!\n}\n\ntype DaoState {\n  name: String\n  description: String\n  members: [Member!]!\n}",
        },
        local: {
          examples: [],
          initialValue: "",
          schema: "",
        },
      },
      version: 1,
    },
  ],
};
