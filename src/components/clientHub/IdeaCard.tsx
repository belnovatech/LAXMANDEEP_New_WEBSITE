import React from "react";
import type { IdeaSubmission } from "../../types/clientHub";
import {
  FaLightbulb,
  FaCalendarDays,
  FaBuilding,
  FaArrowRight,
  FaStar,
  FaCircleCheck
} from "react-icons/fa6";
import "./ideaCard.css";

interface IdeaCardProps {
  idea: IdeaSubmission;
  onReadMore: (idea: IdeaSubmission) => void;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onReadMore }) => {
  const isFeatured = idea.status === "featured";

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "FinTech & Financial Services":
        return "cat-purple";
      case "Cybersecurity":
        return "cat-cyan";
      case "Biometric Identity":
        return "cat-blue";
      case "Artificial Intelligence":
        return "cat-pink";
      case "Investment Opportunities":
        return "cat-gold";
      case "Global Intelligence & Research":
        return "cat-emerald";
      default:
        return "cat-default";
    }
  };

  const formattedDate = new Date(idea.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  return (
    <div className={`lxd-idea-card ${isFeatured ? "is-featured" : ""}`}>
      {/* CARD TOP */}
      <div className="lxd-idea-top">
        <div className="lxd-idea-cat-row">
          <span className={`lxd-idea-category ${getCategoryColor(idea.category)}`}>
            {idea.category}
          </span>
          {isFeatured && (
            <span className="lxd-status-badge featured">
              <FaStar /> Featured Initiative
            </span>
          )}
          {idea.status === "approved" && (
            <span className="lxd-status-badge approved">
              <FaCircleCheck /> Approved Proposal
            </span>
          )}
        </div>

        <span className="lxd-idea-tracking" title="Tracking Number">
          {idea.trackingNumber}
        </span>
      </div>

      {/* CARD BODY */}
      <div className="lxd-idea-body">
        <h3 className="lxd-idea-title" title={idea.title}>
          {idea.title}
        </h3>

        <div className="lxd-idea-area">
          <FaBuilding className="area-icon" />
          <span>{idea.businessArea}</span>
        </div>

        <p className="lxd-idea-summary">{idea.summary}</p>

        <div className="lxd-idea-outcome">
          <strong>Strategic Value:</strong>
          <p>{idea.expectedOutcome}</p>
        </div>
      </div>

      {/* CARD FOOTER */}
      <div className="lxd-idea-footer">
        <div className="lxd-idea-meta">
          <div className="lxd-idea-author">
            <span className="author-avatar">
              <FaLightbulb />
            </span>
            <div className="author-details">
              <span className="author-name">{idea.submitterName}</span>
              <span className="author-org">{idea.organization || "Strategic Partner"}</span>
            </div>
          </div>
          <div className="lxd-idea-date">
            <FaCalendarDays />
            <span>{formattedDate}</span>
          </div>
        </div>

        <button
          className="lxd-idea-read-btn"
          onClick={() => onReadMore(idea)}
        >
          <span>Read Full Proposal</span>
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};
