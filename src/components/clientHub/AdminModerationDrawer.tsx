import React, { useState } from "react";
import type { IdeaSubmission, ClientDocument, DocumentVisibility } from "../../types/clientHub";
import { ClientHubService } from "../../services/clientHubService";
import {
  FaShieldHalved,
  FaCheck,
  FaXmark,
  FaStar,
  FaEyeSlash,
  FaFileLines,
  FaLightbulb,
  FaRotateLeft
} from "react-icons/fa6";
import "./adminModerationDrawer.css";

interface AdminModerationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged?: () => void;
}

export const AdminModerationDrawer: React.FC<AdminModerationDrawerProps> = ({
  isOpen,
  onClose,
  onDataChanged
}) => {
  const [activeTab, setActiveTab] = useState<"ideas" | "documents">("ideas");
  const [ideas, setIdeas] = useState<IdeaSubmission[]>(
    ClientHubService.getAllSubmissionsForAdmin()
  );
  const [documents, setDocuments] = useState<ClientDocument[]>(
    ClientHubService.getAllDocumentsForAdmin()
  );
  const [moderatorNote, setModeratorNote] = useState<{ [id: string]: string }>({});
  const [actionFeedback, setActionFeedback] = useState<string>("");

  const handleModerateIdea = (
    ideaId: string,
    action: "approve" | "reject" | "feature" | "hide"
  ) => {
    const note = moderatorNote[ideaId] || "";
    const success = ClientHubService.moderateIdea(
      ideaId,
      action,
      "Executive Investment Officer",
      note
    );

    if (success) {
      setIdeas(ClientHubService.getAllSubmissionsForAdmin());
      setActionFeedback(`Idea status updated: ${action.toUpperCase()}`);
      setTimeout(() => setActionFeedback(""), 3000);
      if (onDataChanged) onDataChanged();
    }
  };

  const handleDocVisibilityChange = (
    docId: string,
    visibility: DocumentVisibility,
    allowDownload: boolean,
    allowPrint: boolean
  ) => {
    const success = ClientHubService.updateDocumentVisibility(
      docId,
      visibility,
      allowDownload,
      allowPrint
    );

    if (success) {
      setDocuments(ClientHubService.getAllDocumentsForAdmin());
      setActionFeedback("Document access policy updated.");
      setTimeout(() => setActionFeedback(""), 3000);
      if (onDataChanged) onDataChanged();
    }
  };

  const handleResetData = () => {
    if (window.confirm("Reset all Client Hub documents and ideas to pristine initial seed state?")) {
      ClientHubService.resetToDefaultData();
      setIdeas(ClientHubService.getAllSubmissionsForAdmin());
      setDocuments(ClientHubService.getAllDocumentsForAdmin());
      setActionFeedback("System data restored to default seed state.");
      setTimeout(() => setActionFeedback(""), 3000);
      if (onDataChanged) onDataChanged();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="lxd-admin-backdrop" onClick={onClose}>
      <div className="lxd-admin-drawer" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="lxd-admin-header">
          <div className="lxd-admin-title-box">
            <div className="admin-icon-pill">
              <FaShieldHalved />
            </div>
            <div>
              <h3>Governance & Moderation Desk</h3>
              <p>Institutional Oversight & Access Management</p>
            </div>
          </div>
          <button className="lxd-admin-close" onClick={onClose}>
            <FaXmark />
          </button>
        </div>

        {/* CONTROLS */}
        <div className="lxd-admin-nav">
          <button
            className={`admin-nav-tab ${activeTab === "ideas" ? "active" : ""}`}
            onClick={() => setActiveTab("ideas")}
          >
            <FaLightbulb />
            <span>Idea Submissions ({ideas.length})</span>
          </button>
          <button
            className={`admin-nav-tab ${activeTab === "documents" ? "active" : ""}`}
            onClick={() => setActiveTab("documents")}
          >
            <FaFileLines />
            <span>Document Policies ({documents.length})</span>
          </button>
        </div>

        {actionFeedback && (
          <div className="lxd-admin-feedback">{actionFeedback}</div>
        )}

        {/* CONTENT */}
        <div className="lxd-admin-body">
          {activeTab === "ideas" ? (
            <div className="lxd-admin-ideas-list">
              {ideas.map((idea) => (
                <div key={idea.id} className="admin-idea-item">
                  <div className="admin-idea-item-header">
                    <div>
                      <span className="admin-idea-badge">{idea.category}</span>
                      <span className={`admin-status-tag ${idea.status}`}>
                        {idea.status.replace("_", " ")}
                      </span>
                      <span className="admin-tracking">{idea.trackingNumber}</span>
                    </div>
                    <span className="admin-date">
                      {new Date(idea.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="admin-idea-title">{idea.title}</h4>
                  <p className="admin-idea-summary">{idea.summary}</p>

                  <div className="admin-author-info">
                    <strong>{idea.submitterName}</strong> ({idea.submitterEmail}) •{" "}
                    <span>{idea.organization || "Individual"}</span>
                    {idea.attachmentName && (
                      <span className="admin-att">📎 {idea.attachmentName}</span>
                    )}
                  </div>

                  <div className="admin-mod-input-row">
                    <input
                      type="text"
                      placeholder="Add official review note (optional)..."
                      defaultValue={idea.moderationNotes || ""}
                      onChange={(e) =>
                        setModeratorNote({ ...moderatorNote, [idea.id]: e.target.value })
                      }
                    />
                  </div>

                  <div className="admin-mod-actions">
                    <button
                      className="mod-btn approve"
                      onClick={() => handleModerateIdea(idea.id, "approve")}
                      title="Approve & Publish Publicly"
                    >
                      <FaCheck /> Approve & Publish
                    </button>
                    <button
                      className="mod-btn feature"
                      onClick={() => handleModerateIdea(idea.id, "feature")}
                      title="Feature on Public Board"
                    >
                      <FaStar /> Feature
                    </button>
                    <button
                      className="mod-btn hide"
                      onClick={() => handleModerateIdea(idea.id, "hide")}
                      title="Hide from Public Board"
                    >
                      <FaEyeSlash /> Unpublish / Hide
                    </button>
                    <button
                      className="mod-btn reject"
                      onClick={() => handleModerateIdea(idea.id, "reject")}
                      title="Reject Submission"
                    >
                      <FaXmark /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="lxd-admin-docs-list">
              {documents.map((doc) => (
                <div key={doc.id} className="admin-doc-item">
                  <div className="admin-doc-info">
                    <span className="admin-doc-cat">{doc.category}</span>
                    <h4>{doc.title}</h4>
                    <p>{doc.organization}</p>
                  </div>

                  <div className="admin-doc-controls">
                    <div className="control-field">
                      <label>Visibility Clearance:</label>
                      <select
                        value={doc.visibility}
                        onChange={(e) =>
                          handleDocVisibilityChange(
                            doc.id,
                            e.target.value as DocumentVisibility,
                            doc.allowDownload,
                            doc.allowPrint
                          )
                        }
                      >
                        <option value="public">Public (Open)</option>
                        <option value="client-only">Client Only (Tier 1)</option>
                        <option value="private">Private / Confidential (Restricted)</option>
                      </select>
                    </div>

                    <div className="control-toggles">
                      <label>
                        <input
                          type="checkbox"
                          checked={doc.allowDownload}
                          onChange={(e) =>
                            handleDocVisibilityChange(
                              doc.id,
                              doc.visibility,
                              e.target.checked,
                              doc.allowPrint
                            )
                          }
                        />
                        Allow Downloads
                      </label>

                      <label>
                        <input
                          type="checkbox"
                          checked={doc.allowPrint}
                          onChange={(e) =>
                            handleDocVisibilityChange(
                              doc.id,
                              doc.visibility,
                              doc.allowDownload,
                              e.target.checked
                            )
                          }
                        />
                        Allow Printing
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="lxd-admin-footer">
          <button className="admin-reset-btn" onClick={handleResetData}>
            <FaRotateLeft /> Reset to Seed State
          </button>
          <button className="admin-done-btn" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
