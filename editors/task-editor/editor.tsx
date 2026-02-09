import { DocumentToolbar } from "@powerhousedao/design-system/connect";
import {
  useSelectedTaskDocument,
  actions,
} from "roxium-dao-vetra/document-models/task";
import {
  setTaskDetails,
  updateTaskStatus,
  assignTask,
} from "../../document-models/task/gen/creators.js";
import { useProposalDocumentsInSelectedDrive } from "../../document-models/proposal/hooks.js";
import { useDaoDocumentsInSelectedDrive } from "../../document-models/dao/hooks.js";
import { useState } from "react";

export default function Editor() {
  const [document, dispatch] = useSelectedTaskDocument();
  const state = document.state.global;
  const proposalDocuments = useProposalDocumentsInSelectedDrive();
  const daoDocuments = useDaoDocumentsInSelectedDrive();

  const [title, setTitle] = useState(state.title ?? "");
  const [description, setDescription] = useState(state.description ?? "");
  const [daoId, setDaoId] = useState(state.daoId ?? "");
  const [proposalId, setProposalId] = useState(state.proposalId ?? "");
  const [createdBy, setCreatedBy] = useState(state.createdBy ?? "");
  const [assigneeInput, setAssigneeInput] = useState(state.assignee ?? "");

  const handleSave = () => {
    if (!title.trim() || !daoId.trim() || !createdBy.trim()) return;
    dispatch(
      setTaskDetails({
        title: title.trim(),
        description: description.trim() || undefined,
        daoId: daoId.trim(),
        proposalId: proposalId.trim() || undefined,
        assignee: assigneeInput.trim() || undefined,
        createdBy: createdBy.trim(),
        createdAt: state.createdAt ?? new Date().toISOString(),
      }),
    );
  };

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "0 auto",
        padding: 24,
        fontFamily: "sans-serif",
      }}
    >
      <DocumentToolbar />

      <div style={{ marginTop: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
          Task Editor
        </h2>

        {/* Document header name */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontWeight: 500, marginBottom: 4 }}>
            Document Name
          </label>
          <input
            type="text"
            defaultValue={document.header.name}
            placeholder="Enter document name..."
            onBlur={(e) => {
              const val = e.target.value.trim();
              if (val) dispatch(actions.setName(val));
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
            }}
            style={{
              width: "100%",
              padding: "6px 8px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <hr style={{ margin: "16px 0" }} />

        {/* Link to DAO */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontWeight: 500, marginBottom: 4 }}>
            Linked DAO <span style={{ color: "red" }}>*</span>
          </label>
          {daoDocuments && daoDocuments.length > 0 ? (
            <select
              value={daoId}
              onChange={(e) => setDaoId(e.target.value)}
              style={{
                width: "100%",
                padding: "6px 8px",
                border: "1px solid #ccc",
              }}
            >
              <option value="">-- Select a DAO --</option>
              {daoDocuments.map((dao) => (
                <option key={dao.header.id} value={dao.header.id}>
                  {dao.state.global.name || dao.header.name || dao.header.id}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={daoId}
              onChange={(e) => setDaoId(e.target.value)}
              placeholder="DAO document ID"
              style={{
                width: "100%",
                padding: "6px 8px",
                border: "1px solid #ccc",
              }}
            />
          )}
        </div>

        {/* Link to Proposal */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontWeight: 500, marginBottom: 4 }}>
            Linked Proposal
          </label>
          {proposalDocuments && proposalDocuments.length > 0 ? (
            <select
              value={proposalId}
              onChange={(e) => setProposalId(e.target.value)}
              style={{
                width: "100%",
                padding: "6px 8px",
                border: "1px solid #ccc",
              }}
            >
              <option value="">-- Select a Proposal (optional) --</option>
              {proposalDocuments
                .filter((p) => !daoId || p.state.global.daoId === daoId)
                .map((p) => (
                  <option key={p.header.id} value={p.header.id}>
                    {p.state.global.title || p.header.name || p.header.id}
                  </option>
                ))}
            </select>
          ) : (
            <input
              type="text"
              value={proposalId}
              onChange={(e) => setProposalId(e.target.value)}
              placeholder="Proposal document ID (optional)"
              style={{
                width: "100%",
                padding: "6px 8px",
                border: "1px solid #ccc",
              }}
            />
          )}
        </div>

        {/* Title */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontWeight: 500, marginBottom: 4 }}>
            Title <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            style={{
              width: "100%",
              padding: "6px 8px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        {/* Description */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontWeight: 500, marginBottom: 4 }}>
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe this task..."
            rows={3}
            style={{
              width: "100%",
              padding: "6px 8px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        {/* Created By */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontWeight: 500, marginBottom: 4 }}>
            Created By <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            value={createdBy}
            onChange={(e) => setCreatedBy(e.target.value)}
            placeholder="Your name or user ID"
            style={{
              width: "100%",
              padding: "6px 8px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={!title.trim() || !daoId.trim() || !createdBy.trim()}
          style={{
            background:
              !title.trim() || !daoId.trim() || !createdBy.trim()
                ? "#9ca3af"
                : "#2563eb",
            color: "white",
            border: "none",
            padding: "8px 24px",
            cursor: "pointer",
            borderRadius: 3,
            marginBottom: 16,
          }}
        >
          Save Details
        </button>

        <hr style={{ margin: "16px 0" }} />

        {/* Status */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontWeight: 500, marginBottom: 4 }}>
            Status: <strong>{state.status ?? "TODO"}</strong>
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            {["TODO", "IN_PROGRESS", "DONE"].map((s) => (
              <button
                key={s}
                disabled={state.status === s}
                onClick={() =>
                  dispatch(
                    updateTaskStatus({
                      status: s,
                      updatedAt: new Date().toISOString(),
                    }),
                  )
                }
                style={{
                  background: state.status === s ? "#6b7280" : "#e5e7eb",
                  color: state.status === s ? "white" : "#333",
                  border: "none",
                  padding: "4px 12px",
                  cursor: state.status === s ? "default" : "pointer",
                  borderRadius: 3,
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Assignee */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontWeight: 500, marginBottom: 4 }}>
            Assignee: {state.assignee || "(none)"}
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              value={assigneeInput}
              onChange={(e) => setAssigneeInput(e.target.value)}
              placeholder="Assignee name"
              style={{ padding: "4px 8px", border: "1px solid #ccc", flex: 1 }}
            />
            <button
              onClick={() => {
                if (!assigneeInput.trim()) return;
                dispatch(
                  assignTask({
                    assignee: assigneeInput.trim(),
                    updatedAt: new Date().toISOString(),
                  }),
                );
              }}
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "4px 12px",
                cursor: "pointer",
                borderRadius: 3,
              }}
            >
              Assign
            </button>
          </div>
        </div>

        <hr style={{ margin: "16px 0" }} />

        {/* Metadata */}
        <div style={{ fontSize: 12, color: "#666" }}>
          <p>ID: {document.header.id}</p>
          <p>Type: {document.header.documentType}</p>
          <p>
            Created:{" "}
            {new Date(document.header.createdAtUtcIso).toLocaleString()}
          </p>
          <p>
            Modified:{" "}
            {new Date(document.header.lastModifiedAtUtcIso).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
