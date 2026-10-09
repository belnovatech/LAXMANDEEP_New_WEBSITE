import React from "react";
import type { IdeaSubmission } from "../../types/clientHub";
import {
  FaXmark,
  FaCalendarDays,
  FaBuilding,
  FaUser,
  FaCircleCheck,
  FaStar,
  FaRocket,
  FaEnvelope,
  FaShieldHalved
} from "react-icons/fa6";
import "./ideaDetailModal.css";

interface IdeaDetailModalProps {
  idea: IdeaSubmission | null;
  onClose: () => void;
  onContactAuthor?: (idea: IdeaSubmission) => void;
}

export const IdeaDetailModal: React.FC<IdeaDetailModalProps> = ({
  idea,
  onClose
}) => {
  if (!idea) return null;

  const formattedDate = new Date(idea.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return (
    <div className="lxd-modal-backdrop" onClick={onClose}>
      <div
        className="lxd-idea-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="lxd-idm-header">
          <div className="lxd-idm-cat-row">
            <span className="lxd-idm-cat">{idea.category}</span>
            {idea.status === "featured" && (
              <span className="lxd-idm-pill featured">
                <FaStar /> Featured Strategic Proposal
              </span>
            )}
            {idea.status === "approved" && (
              <span className="lxd-idm-pill approved">
                <FaCircleCheck /> Approved Public Submission
              </span>
            )}
            <span className="lxd-idm-tracking">{idea.trackingNumber}</span>
          </div>

          <button className="lxd-idm-close" onClick={onClose} title="Close Modal">
            <FaXmark />
          </button>
        </div>

        {/* TITLE & META */}
        <div className="lxd-idm-heading">
          <h2>{idea.title}</h2>
          <div className="lxd-idm-meta-bar">
            <div className="meta-unit">
              <FaBuilding className="meta-icon" />
              <span>{idea.businessArea}</span>
            </div>
            <div className="meta-unit">
              <FaCalendarDays className="meta-icon" />
              <span>{formattedDate}</span>
            </div>
            <div className="meta-unit">
              <FaUser className="meta-icon" />
              <span>
                {idea.submitterName} ({idea.organization || "Strategic Contributor"})
              </span>
            </div>
          </div>
        </div>

        {/* CONTENT SECTIONS */}
        <div className="lxd-idm-body">
          <div className="lxd-idm-section">
            <h3>
              <FaRocket /> Executive Summary
            </h3>
            <p className="summary-lead">{idea.summary}</p>
          </div>

          <div className="lxd-idm-section">
            <h3>Detailed Proposal & Strategic Architecture</h3>
            <div className="description-content">
              <p>{idea.description}</p>
            </div>
          </div>

          <div className="lxd-idm-section outcome-section">
            <h3>Expected Impact, Value & Deliverables</h3>
            <div className="outcome-box">
              <p>{idea.expectedOutcome}</p>
            </div>
          </div>

          {idea.attachmentName && (
            <div className="lxd-idm-section attachment-section">
              <h3>Supporting Documentation</h3>
              <div className="attachment-badge">
                <span>📎 {idea.attachmentName}</span>
                {idea.attachmentSize && <span className="att-size">({idea.attachmentSize})</span>}
                <span className="att-verified">✓ Verified by LaxmanDeep Moderation</span>
              </div>
            </div>
          )}

          {idea.moderationNotes && (
            <div className="lxd-idm-section review-section">
              <div className="review-box">
                <div className="review-title">
                  <FaShieldHalved /> LaxmanDeep Governance Review Note
                </div>
                <p>"{idea.moderationNotes}"</p>
                {idea.reviewedBy && (
                  <span className="reviewer-tag">— Reviewed by {idea.reviewedBy}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="lxd-idm-footer">
          <div className="lxd-idm-notice">
            <span>🛡️ Verified Public Submission under LaxmanDeep Community Governance.</span>
          </div>
          <div className="lxd-idm-actions">
            <a
              href={`mailto:info@laxmandeep.com?subject=Strategic Discussion: ${encodeURIComponent(idea.title)} (${idea.trackingNumber})`}
              className="lxd-idm-collab-btn"
            >
              <FaEnvelope />
              <span>Discuss Partnership on this Idea</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
