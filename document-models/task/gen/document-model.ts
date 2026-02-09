import type { DocumentModelGlobalState } from "document-model";

export const documentModel: DocumentModelGlobalState = {
  author: {
    name: "Roxium Labs",
    website: "https://roxium.io",
  },
  description:
    "Represents a task linked to a DAO and optionally a proposal. Status: TODO/IN_PROGRESS/DONE.",
  extension: "rxtask",
  id: "roxium/task",
  name: "Task",
  specifications: [
    {
      changeLog: [],
      modules: [
        {
          description: "Core Task operations",
          id: "task_core_module",
          name: "core",
          operations: [
            {
              description: "Sets or initializes the task details",
              errors: [],
              examples: [],
              id: "task_op_set_details",
              name: "SET_TASK_DETAILS",
              reducer:
                "state.daoId = action.input.daoId;\nstate.title = action.input.title;\nstate.description = action.input.description || null;\nstate.proposalId = action.input.proposalId || null;\nstate.assignee = action.input.assignee || null;\nstate.createdBy = action.input.createdBy;\nstate.createdAt = action.input.createdAt;",
              schema:
                "input SetTaskDetailsInput {\n  daoId: String!\n  proposalId: String\n  title: String!\n  description: String\n  assignee: String\n  createdBy: String!\n  createdAt: DateTime!\n}",
              scope: "global",
              template: "Sets or initializes the task details",
            },
            {
              description: "Updates the task status (TODO, IN_PROGRESS, DONE)",
              errors: [],
              examples: [],
              id: "task_op_update_status",
              name: "UPDATE_TASK_STATUS",
              reducer:
                "state.status = action.input.status;\nstate.updatedAt = action.input.updatedAt;",
              schema:
                "input UpdateTaskStatusInput {\n  status: String!\n  updatedAt: DateTime!\n}",
              scope: "global",
              template: "Updates the task status (TODO, IN_PROGRESS, DONE)",
            },
            {
              description: "Assigns or reassigns the task to a member",
              errors: [],
              examples: [],
              id: "task_op_assign",
              name: "ASSIGN_TASK",
              reducer:
                "state.assignee = action.input.assignee;\nstate.updatedAt = action.input.updatedAt;",
              schema:
                "input AssignTaskInput {\n  assignee: String!\n  updatedAt: DateTime!\n}",
              scope: "global",
              template: "Assigns or reassigns the task to a member",
            },
          ],
        },
      ],
      state: {
        global: {
          examples: [],
          initialValue:
            '{"daoId":"","proposalId":"","title":"","description":"","status":"TODO","assignee":"","createdBy":"","createdAt":null,"updatedAt":null}',
          schema:
            "type TaskState {\n  daoId: String\n  proposalId: String\n  title: String\n  description: String\n  status: String\n  assignee: String\n  createdBy: String\n  createdAt: DateTime\n  updatedAt: DateTime\n}",
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
