import React from "react";
import type { ClientDocument } from "../../types/clientHub";
import {
  FaFilePdf,
  FaFileWord,
  FaEye,
  FaLock,
  FaBuilding,
  FaCalendarDays,
  FaShieldHalved
} from "react-icons/fa6";
import "./documentCard.css";

interface DocumentCardProps {
  document: ClientDocument;
  onView: (doc: ClientDocument) => void;
  onRequestAccess?: (doc: ClientDocument) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document: doc,
  onView,
  onRequestAccess
}) => {
  const isPrivate = doc.visibility === "private";
  const isClientOnly = doc.visibility === "client-only";

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case "Investment Programmes":
        return "badge-gold";
      case "Strategic Meetings":
        return "badge-blue";
      case "FinTech & Biometric Identity":
        return "badge-purple";
      case "Technology & Cybersecurity":
        return "badge-cyan";
      case "Corporate & Due Diligence":
        return "badge-rose";
      default:
        return "badge-default";
    }
  };



  return (
    <div className={`lxd-doc-card ${isPrivate ? "is-private" : ""}`}>
      {/* TOP HEADER */}
      <div className="lxd-doc-card-top">
        <div className="lxd-doc-cat-wrap">
          <span className={`lxd-doc-category ${getCategoryBadgeClass(doc.category)}`}>
            {doc.category}
          </span>
          {isPrivate && (
            <span className="lxd-visibility-pill private">
              <FaLock /> Confidential
            </span>
          )}
          {isClientOnly && (
            <span className="lxd-visibility-pill client">
              <FaShieldHalved /> Client Only
            </span>
          )}
        </div>

        <div className="lxd-doc-format-badge">
          {doc.fileFormat === "PDF" ? (
            <span className="format-pdf">
              <FaFilePdf /> PDF
            </span>
          ) : (
            <span className="format-docx">
              <FaFileWord /> DOCX
            </span>
          )}
          <span className="format-size">{doc.fileSize}</span>
        </div>
      </div>

      {/* BODY */}
      <div className="lxd-doc-body">
        <h3 className="lxd-doc-title" title={doc.title}>
          {doc.title}
        </h3>

        <div className="lxd-doc-org">
          <FaBuilding className="org-icon" />
          <span>{doc.organization}</span>
        </div>

        <p className="lxd-doc-description">{doc.shortDescription}</p>

        {doc.keyHighlights && doc.keyHighlights.length > 0 && (
          <div className="lxd-doc-highlights">
            <div className="highlight-label">Key Highlights:</div>
            <ul>
              {doc.keyHighlights.slice(0, 2).map((highlight, idx) => (
                <li key={idx}>{highlight}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="lxd-doc-tags">
          {doc.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="lxd-doc-tag">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="lxd-doc-footer">
        <div className="lxd-doc-date">
          <FaCalendarDays />
          <span>{doc.publishDate}</span>
        </div>

        <div className="lxd-doc-actions">
          {isPrivate ? (
            <button
              className="lxd-doc-btn secondary"
              onClick={() =>
                onRequestAccess ? onRequestAccess(doc) : onView(doc)
              }
            >
              <FaLock /> Request / Unlock
            </button>
          ) : (
            <button
              className="lxd-doc-btn primary"
              onClick={() => onView(doc)}
            >
              <FaEye /> View Document
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
