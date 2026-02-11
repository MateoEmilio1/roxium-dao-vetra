import { useState } from "react";
import { generateId } from "document-model/core";
import { DocumentToolbar } from "@powerhousedao/design-system/connect";
import {
  useSelectedDaoDocument,
  actions,
} from "roxium-dao-vetra/document-models/dao";
import {
  setDaoName,
  setDaoDescription,
  addMember,
  updateMemberRole,
  removeMember,
} from "../../document-models/dao/gen/creators.js";

// Note: setDaoOwner will be available after running npm run generate
// For now, create the action manually
const setDaoOwner = (input: { ownerUserId: string }) => ({
  type: "SET_DAO_OWNER" as const,
  input,
});

export default function Editor() {
  const [document, dispatch] = useSelectedDaoDocument();
  const state = document.state.global;

  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("CONTRIBUTOR");

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
          DAO Editor
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

        {/* DAO Name */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontWeight: 500, marginBottom: 4 }}>
            DAO Name <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            defaultValue={state.name ?? ""}
            placeholder="e.g. Roxium DAO"
            onBlur={(e) => {
              const val = e.target.value.trim();
              if (val) dispatch(setDaoName({ name: val }));
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

        {/* DAO Description */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontWeight: 500, marginBottom: 4 }}>
            Description
          </label>
          <textarea
            defaultValue={state.description ?? ""}
            placeholder="Describe this DAO..."
            rows={3}
            onBlur={(e) => {
              const val = e.target.value.trim();
              if (val) dispatch(setDaoDescription({ description: val }));
            }}
            style={{
              width: "100%",
              padding: "6px 8px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        {/* Owner User ID */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontWeight: 500, marginBottom: 4 }}>
            Owner User ID
          </label>
          <input
            type="text"
            defaultValue={(state as any).ownerUserId ?? ""}
            placeholder="e.g. user123"
            onBlur={(e) => {
              const val = e.target.value.trim();
              if (val) dispatch(setDaoOwner({ ownerUserId: val }));
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

        {/* Members */}
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
          Members ({state.members.length})
        </h3>

        {state.members.length > 0 && (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: 12,
            }}
          >
            <thead>
              <tr style={{ borderBottom: "2px solid #ddd", textAlign: "left" }}>
                <th style={{ padding: "4px 8px" }}>Name</th>
                <th style={{ padding: "4px 8px" }}>Role</th>
                <th style={{ padding: "4px 8px" }}>Joined</th>
                <th style={{ padding: "4px 8px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {state.members.map((member) => (
                <tr key={member.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "4px 8px" }}>{member.name}</td>
                  <td style={{ padding: "4px 8px" }}>
                    <select
                      value={member.role}
                      onChange={(e) => {
                        dispatch(
                          updateMemberRole({
                            id: member.id,
                            role: e.target.value,
                          }),
                        );
                      }}
                      style={{ padding: "2px 4px" }}
                    >
                      <option value="OWNER">OWNER</option>
                      <option value="CONTRIBUTOR">CONTRIBUTOR</option>
                      <option value="VIEWER">VIEWER</option>
                    </select>
                  </td>
                  <td style={{ padding: "4px 8px", fontSize: 12 }}>
                    {member.joinedAt
                      ? new Date(member.joinedAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td style={{ padding: "4px 8px" }}>
                    <button
                      onClick={() => dispatch(removeMember({ id: member.id }))}
                      style={{
                        background: "#dc2626",
                        color: "white",
                        border: "none",
                        padding: "2px 8px",
                        cursor: "pointer",
                        borderRadius: 3,
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Add Member Form */}
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <div>
            <label style={{ display: "block", fontSize: 12, marginBottom: 2 }}>
              Member Name
            </label>
            <input
              type="text"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              placeholder="e.g. Alice"
              style={{
                padding: "4px 8px",
                border: "1px solid #ccc",
                width: 180,
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, marginBottom: 2 }}>
              Role
            </label>
            <select
              value={newMemberRole}
              onChange={(e) => setNewMemberRole(e.target.value)}
              style={{ padding: "4px 8px", border: "1px solid #ccc" }}
            >
              <option value="OWNER">OWNER</option>
              <option value="CONTRIBUTOR">CONTRIBUTOR</option>
              <option value="VIEWER">VIEWER</option>
            </select>
          </div>
          <button
            onClick={() => {
              if (!newMemberName.trim()) return;
              dispatch(
                addMember({
                  id: generateId(),
                  name: newMemberName.trim(),
                  role: newMemberRole,
                  joinedAt: new Date().toISOString(),
                }),
              );
              setNewMemberName("");
            }}
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "6px 16px",
              cursor: "pointer",
              borderRadius: 3,
            }}
          >
            Add Member
          </button>
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
