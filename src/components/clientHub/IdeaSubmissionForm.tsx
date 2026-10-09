import React, { useState } from "react";
import type { IdeaCategory, IdeaSubmission } from "../../types/clientHub";
import { ClientHubService } from "../../services/clientHubService";
import {
  FaLightbulb,
  FaPaperPlane,
  FaShieldHalved,
  FaFileArrowUp,
  FaCircleCheck,
  FaRotateLeft,
  FaTriangleExclamation,
  FaLock
} from "react-icons/fa6";
import confetti from "canvas-confetti";
import "./ideaSubmissionForm.css";

interface IdeaSubmissionFormProps {
  onSubmissionSuccess?: (submission: IdeaSubmission) => void;
}

const CATEGORIES: IdeaCategory[] = [
  "Investment Opportunities",
  "FinTech & Financial Services",
  "Artificial Intelligence",
  "Cybersecurity",
  "Biometric Identity",
  "Global Intelligence & Research",
  "Strategic Partnerships",
  "Other Business Ideas"
];

export const IdeaSubmissionForm: React.FC<IdeaSubmissionFormProps> = ({
  onSubmissionSuccess
}) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "Investment Opportunities" as IdeaCategory,
    businessArea: "",
    submitterName: "",
    submitterEmail: "",
    organization: "",
    summary: "",
    description: "",
    expectedOutcome: "",
    agreedToTerms: false
  });

  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentError, setAttachmentError] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [submittedIdea, setSubmittedIdea] = useState<IdeaSubmission | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttachmentError("");
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validExtensions = [".pdf", ".docx", ".doc", ".png", ".jpg", ".zip", ".pptx"];
      const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

      if (!validExtensions.includes(ext)) {
        setAttachmentError("Supported formats: PDF, DOCX, PPTX, PNG, JPG, ZIP.");
        setAttachment(null);
        return;
      }

      if (file.size > 15 * 1024 * 1024) {
        setAttachmentError("File size exceeds the 15MB limit.");
        setAttachment(null);
        return;
      }

      setAttachment(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!formData.title.trim() || formData.title.length < 5) {
      setServerError("Please enter a comprehensive title (at least 5 characters).");
      return;
    }

    if (!formData.summary.trim() || formData.summary.length < 20) {
      setServerError("Please enter an executive summary of at least 20 characters.");
      return;
    }

    if (!formData.description.trim() || formData.description.length < 40) {
      setServerError("Please provide a detailed proposal description (at least 40 characters).");
      return;
    }

    if (!formData.submitterName.trim()) {
      setServerError("Please enter your name.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.submitterEmail.trim())) {
      setServerError("Please provide a valid professional email address.");
      return;
    }

    if (!formData.agreedToTerms) {
      setServerError("Please confirm the submission agreement and privacy acknowledgement.");
      return;
    }

    setLoading(true);

    try {
      const formattedSize = attachment
        ? `${(attachment.size / (1024 * 1024)).toFixed(1)} MB`
        : undefined;

      const res = await ClientHubService.submitIdea({
        title: formData.title,
        category: formData.category,
        summary: formData.summary,
        description: formData.description,
        businessArea: formData.businessArea || "LaxmanDeep Global Ecosystem",
        expectedOutcome: formData.expectedOutcome || "Strategic ecosystem acceleration",
        submitterName: formData.submitterName,
        submitterEmail: formData.submitterEmail,
        organization: formData.organization,
        attachmentName: attachment ? attachment.name : undefined,
        attachmentSize: formattedSize
      });

      setLoading(false);

      if (res.success && res.submission) {
        setSubmittedIdea(res.submission);
        if (onSubmissionSuccess) {
          onSubmissionSuccess(res.submission);
        }

        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore if canvas unavailable
        }
      } else {
        setServerError(res.error || "Submission failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setServerError("An unexpected network error occurred while submitting your proposal.");
    }
  };

  const handleReset = () => {
    setFormData({
      title: "",
      category: "Investment Opportunities",
      businessArea: "",
      submitterName: "",
      submitterEmail: "",
      organization: "",
      summary: "",
      description: "",
      expectedOutcome: "",
      agreedToTerms: false
    });
    setAttachment(null);
    setSubmittedIdea(null);
    setServerError("");
  };

  return (
    <div className="lxd-idea-portal-container">
      {/* INTRO HERO */}
      <div className="lxd-portal-hero">
        <div className="lxd-portal-badge">
          <FaLightbulb /> IDEA-SHARING & STRATEGIC CO-CREATION
        </div>
        <h2>Your Ideas. Our Shared Future.</h2>
        <p className="lxd-portal-lead">
          Share your business ideas, strategic requirements, partnership opportunities, and innovative
          proposals with the LaxmanDeep ecosystem.
        </p>
      </div>

      {/* SUCCESS CONFIRMATION STATE */}
      {submittedIdea ? (
        <div className="lxd-submission-success-card">
          <div className="lxd-success-icon">
            <FaCircleCheck />
          </div>
          <h3>Proposal Ingested Successfully</h3>
          <p className="lxd-success-msg">
            Thank you, <strong>{submittedIdea.submitterName}</strong>. Your proposal has been securely logged
            into the LaxmanDeep Governance queue for review.
          </p>

          <div className="lxd-success-tracking-box">
            <span>Tracking Reference ID</span>
            <div className="tracking-number">{submittedIdea.trackingNumber}</div>
            <p className="tracking-hint">
              Save this reference number. Our Investment Committee and Strategic Partnerships team
              will contact you at <strong>{submittedIdea.submitterEmail}</strong> upon moderation.
            </p>
          </div>

          <div className="lxd-success-summary-grid">
            <div>
              <span>Title:</span>
              <strong>{submittedIdea.title}</strong>
            </div>
            <div>
              <span>Category:</span>
              <strong>{submittedIdea.category}</strong>
            </div>
            <div>
              <span>Status:</span>
              <strong className="status-pending">Under Committee Review (Confidential)</strong>
            </div>
          </div>

          <div className="lxd-success-actions">
            <button className="lxd-reset-btn" onClick={handleReset}>
              <FaRotateLeft /> Submit Another Proposal
            </button>
            <a href="#board" className="lxd-view-board-btn">
              Explore Approved Community Ideas
            </a>
          </div>
        </div>
      ) : (
        /* SUBMISSION FORM */
        <form onSubmit={handleSubmit} className="lxd-idea-form">
          <div className="lxd-form-grid">
            {/* ROW 1: Title & Category */}
            <div className="lxd-form-group full-width">
              <label htmlFor="ideaTitle">
                Proposal / Idea Title <span className="req">*</span>
              </label>
              <input
                id="ideaTitle"
                type="text"
                placeholder="e.g. Sovereign Biometric Liquidity Settlement Corridor"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="lxd-form-group">
              <label htmlFor="ideaCategory">
                Category <span className="req">*</span>
              </label>
              <select
                id="ideaCategory"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as IdeaCategory })
                }
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="lxd-form-group">
              <label htmlFor="businessArea">Relevant Business Area / Unit</label>
              <input
                id="businessArea"
                type="text"
                placeholder="e.g. Swiss LaxmanDeep AI FINTECH / WiBioCard"
                value={formData.businessArea}
                onChange={(e) =>
                  setFormData({ ...formData, businessArea: e.target.value })
                }
              />
            </div>

            {/* ROW 2: Submitter info */}
            <div className="lxd-form-group">
              <label htmlFor="submitterName">
                Your Full Name <span className="req">*</span>
              </label>
              <input
                id="submitterName"
                type="text"
                placeholder="e.g. Dr. Gary Sum"
                value={formData.submitterName}
                onChange={(e) =>
                  setFormData({ ...formData, submitterName: e.target.value })
                }
                required
              />
            </div>

            <div className="lxd-form-group">
              <label htmlFor="submitterEmail">
                Professional Email Address <span className="req">*</span>
              </label>
              <input
                id="submitterEmail"
                type="email"
                placeholder="e.g. partner@institute.ch"
                value={formData.submitterEmail}
                onChange={(e) =>
                  setFormData({ ...formData, submitterEmail: e.target.value })
                }
                required
              />
            </div>

            <div className="lxd-form-group full-width">
              <label htmlFor="organization">Organization / Institution (Optional)</label>
              <input
                id="organization"
                type="text"
                placeholder="e.g. Zurich AI Research Labs / Independent Investor"
                value={formData.organization}
                onChange={(e) =>
                  setFormData({ ...formData, organization: e.target.value })
                }
              />
            </div>

            {/* ROW 3: Summary & Description */}
            <div className="lxd-form-group full-width">
              <label htmlFor="ideaSummary">
                Executive Summary <span className="req">*</span> (1-2 sentences)
              </label>
              <textarea
                id="ideaSummary"
                rows={2}
                placeholder="Concise overview of the strategic concept, core proposition, and relevance to LaxmanDeep."
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                required
              />
            </div>

            <div className="lxd-form-group full-width">
              <label htmlFor="ideaDescription">
                Detailed Proposal & Architecture <span className="req">*</span>
              </label>
              <textarea
                id="ideaDescription"
                rows={5}
                placeholder="Provide comprehensive details: technical mechanism, market need, deployment strategy, commercial structure, and technology integration."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>

            <div className="lxd-form-group full-width">
              <label htmlFor="expectedOutcome">
                Expected Outcome & Value Proposition
              </label>
              <textarea
                id="expectedOutcome"
                rows={2}
                placeholder="Projected ROI, cost reductions, risk mitigation metrics, or strategic market opportunities."
                value={formData.expectedOutcome}
                onChange={(e) =>
                  setFormData({ ...formData, expectedOutcome: e.target.value })
                }
              />
            </div>

            {/* ATTACHMENT */}
            <div className="lxd-form-group full-width">
              <label>Supporting Document or Pitch Deck (Optional, Max 15MB)</label>
              <div className="lxd-file-upload-box">
                <input
                  type="file"
                  id="ideaAttachment"
                  onChange={handleFileChange}
                  className="lxd-file-input"
                />
                <label htmlFor="ideaAttachment" className="lxd-file-dropzone">
                  <FaFileArrowUp className="upload-icon" />
                  <div>
                    {attachment ? (
                      <span className="file-selected">Selected: {attachment.name}</span>
                    ) : (
                      <span>Click or drag PDF, DOCX, PPTX, or ZIP here</span>
                    )}
                    <small>Encrypted and stored in private governance storage</small>
                  </div>
                </label>
              </div>
              {attachmentError && (
                <div className="lxd-field-error">{attachmentError}</div>
              )}
            </div>

            {/* PRIVACY ACKNOWLEDGEMENT */}
            <div className="lxd-form-group full-width">
              <div className="lxd-checkbox-card">
                <input
                  type="checkbox"
                  id="termsAgreement"
                  checked={formData.agreedToTerms}
                  onChange={(e) =>
                    setFormData({ ...formData, agreedToTerms: e.target.checked })
                  }
                  required
                />
                <label htmlFor="termsAgreement">
                  <FaLock className="lock-icon" />
                  <span>
                    I confirm this proposal is submitted for institutional evaluation by LaxmanDeep.
                    My personal contact information and confidential attachments will remain strictly
                    private and will <strong>never</strong> be published publicly without explicit authorization.
                  </span>
                </label>
              </div>
            </div>
          </div>

          {serverError && (
            <div className="lxd-form-server-error">
              <FaTriangleExclamation />
              <span>{serverError}</span>
            </div>
          )}

          <div className="lxd-form-submit-row">
            <div className="lxd-privacy-badge">
              <FaShieldHalved />
              <span>256-Bit SSL Encrypted Submission</span>
            </div>

            <button type="submit" className="lxd-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  <span>Transmitting Proposal...</span>
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  <span>Submit Proposal</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
