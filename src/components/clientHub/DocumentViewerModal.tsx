import React, { useState, useEffect } from "react";
import type { ClientDocument } from "../../types/clientHub";
import { ClientHubService } from "../../services/clientHubService";
import {
  FaXmark,
  FaFilePdf,
  FaFileWord,
  FaPrint,
  FaExpand,
  FaCompress,
  FaMagnifyingGlassPlus,
  FaMagnifyingGlassMinus,
  FaRotateRight,
  FaLock,
  FaShieldHalved,
  FaBuilding,
  FaTriangleExclamation,
  FaArrowLeft,
  FaShareNodes,
  FaCheck
} from "react-icons/fa6";
import mammoth from "mammoth";
import "./documentViewerModal.css";

interface DocumentViewerModalProps {
  document: ClientDocument | null;
  onClose: () => void;
  onClearanceSuccess?: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  document: doc,
  onClose,
  onClearanceSuccess
}) => {
  const authStatus = ClientHubService.getAuthStatus();
  const isDocConfidential = doc?.visibility === "private" && authStatus.role !== "admin";

  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [docxHtml, setDocxHtml] = useState<string>("");
  const [docxLoading, setDocxLoading] = useState(false);
  const [docxError, setDocxError] = useState<string>("");

  // Clearance Gate State for Confidential Documents
  const [clearancePin, setClearancePin] = useState("");
  const [clearanceError, setClearanceError] = useState("");
  const [clearanceSuccess, setClearanceSuccess] = useState("");

  // Convert DOCX to HTML if it's a docx file and unlocked
  useEffect(() => {
    if (!doc) return;
    if (doc.fileFormat === "DOCX" && !isDocConfidential) {
      let active = true;
      fetch(doc.fileUrl)
        .then((res) => {
          if (!res.ok) throw new Error("Document file could not be loaded.");
          return res.arrayBuffer();
        })
        .then((arrayBuffer) => {
          return mammoth.convertToHtml({ arrayBuffer });
        })
        .then((result) => {
          if (active) {
            setDocxHtml(result.value);
            setDocxLoading(false);
          }
        })
        .catch((err) => {
          console.error("DOCX load error", err);
          if (active) {
            setDocxError("Failed to convert document for online viewing. Please verify clearance.");
            setDocxLoading(false);
          }
        });

      return () => {
        active = false;
      };
    }
  }, [doc, isDocConfidential]);

  if (!doc) return null;

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 15, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 15, 60));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };



  const handlePrint = () => {
    if (!doc.allowPrint) return;
    const printWindow = window.open(doc.fileUrl, "_blank");
    if (printWindow) {
      printWindow.focus();
      printWindow.print();
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/client-hub/documents`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleUnlockConfidential = (e: React.FormEvent) => {
    e.preventDefault();
    setClearanceError("");
    setClearanceSuccess("");

    const res = ClientHubService.verifyAccessKey(clearancePin);
    if (res.success) {
      setClearanceSuccess("Clearance Verified. Decrypting document...");
      setTimeout(() => {
        setClearanceSuccess("");
        if (onClearanceSuccess) onClearanceSuccess();
        window.location.reload();
      }, 1000);
    } else {
      setClearanceError(res.message);
    }
  };

  return (
    <div className={`lxd-viewer-overlay ${isFullscreen ? "is-fullscreen" : ""}`}>
      <div className="lxd-viewer-container">
        {/* VIEWER HEADER TOOLBAR */}
        <div className="lxd-viewer-topbar">
          <div className="lxd-viewer-meta">
            <button className="lxd-viewer-back-btn" onClick={onClose}>
              <FaArrowLeft />
              <span>Back to Library</span>
            </button>
            <div className="lxd-viewer-title-box">
              <div className="lxd-viewer-doc-format">
                {doc.fileFormat === "PDF" ? (
                  <span className="pdf-icon"><FaFilePdf /> PDF</span>
                ) : (
                  <span className="docx-icon"><FaFileWord /> DOCX</span>
                )}
                <span className="lxd-viewer-doc-cat">{doc.category}</span>
              </div>
              <h2 className="lxd-viewer-doc-title">{doc.title}</h2>
            </div>
          </div>

          <div className="lxd-viewer-controls">
            {!isDocConfidential && (
              <>
                <div className="lxd-control-group zoom-group">
                  <button
                    className="lxd-v-btn"
                    onClick={handleZoomOut}
                    title="Zoom Out"
                    disabled={zoom <= 60}
                  >
                    <FaMagnifyingGlassMinus />
                  </button>
                  <span className="lxd-zoom-label">{zoom}%</span>
                  <button
                    className="lxd-v-btn"
                    onClick={handleZoomIn}
                    title="Zoom In"
                    disabled={zoom >= 200}
                  >
                    <FaMagnifyingGlassPlus />
                  </button>
                </div>

                <button
                  className="lxd-v-btn"
                  onClick={handleRotate}
                  title="Rotate Document 90°"
                >
                  <FaRotateRight />
                </button>

                <button
                  className="lxd-v-btn"
                  onClick={toggleFullscreen}
                  title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Reading Mode"}
                >
                  {isFullscreen ? <FaCompress /> : <FaExpand />}
                </button>
              </>
            )}

            {doc.allowPrint && !isDocConfidential && (
              <button
                className="lxd-v-btn"
                onClick={handlePrint}
                title="Print Document"
              >
                <FaPrint />
              </button>
            )}

            <span className="lxd-v-tag restricted" title="In-browser reading protected by governance">
              <FaLock /> In-Browser Reader
            </span>

            <button
              className="lxd-v-btn share-btn"
              onClick={handleShare}
              title="Copy Reference Link"
            >
              {copiedLink ? <FaCheck /> : <FaShareNodes />}
            </button>

            <button
              className="lxd-v-btn close-btn"
              onClick={onClose}
              title="Close Reader"
            >
              <FaXmark />
            </button>
          </div>
        </div>

        {/* VIEWER CONTENT AREA */}
        <div className="lxd-viewer-body">
          {/* CONFIDENTIAL ACCESS GATE */}
          {isDocConfidential ? (
            <div className="lxd-clearance-gate">
              <div className="lxd-gate-card">
                <div className="lxd-gate-icon">
                  <FaShieldHalved />
                </div>
                <h3>Restricted Institutional Document</h3>
                <p className="lxd-gate-subtitle">
                  This document contains confidential corporate governance and compliance data.
                  Access is restricted to authorized partners, institutional investors, and compliance officers.
                </p>

                <div className="lxd-gate-doc-summary">
                  <div className="gate-item">
                    <span>Document:</span>
                    <strong>{doc.title}</strong>
                  </div>
                  <div className="gate-item">
                    <span>Organization:</span>
                    <strong>{doc.organization}</strong>
                  </div>
                  <div className="gate-item">
                    <span>Classification:</span>
                    <strong className="status-confidential">RESTRICTED / PRIVATE</strong>
                  </div>
                </div>

                <form onSubmit={handleUnlockConfidential} className="lxd-gate-form">
                  <label htmlFor="gatePin">Enter Security Clearance Passcode or Admin PIN:</label>
                  <div className="lxd-gate-input-wrap">
                    <input
                      id="gatePin"
                      type="password"
                      placeholder="e.g. LXD-AUTH-2026 or PIN (80880)"
                      value={clearancePin}
                      onChange={(e) => setClearancePin(e.target.value)}
                      required
                    />
                    <button type="submit" className="lxd-gate-unlock-btn">
                      Unlock Document
                    </button>
                  </div>

                  <div className="lxd-gate-hints">
                    <span>Demo Key: <code>LXD-AUTH-2026</code> or Master Admin PIN: <code>80880</code></span>
                  </div>

                  {clearanceError && (
                    <div className="lxd-gate-alert error">{clearanceError}</div>
                  )}
                  {clearanceSuccess && (
                    <div className="lxd-gate-alert success">{clearanceSuccess}</div>
                  )}
                </form>

                <div className="lxd-gate-contact">
                  Need official credentials? Contact LaxmanDeep Governance at{" "}
                  <a href="mailto:info@laxmandeep.com">info@laxmandeep.com</a>
                </div>
              </div>
            </div>
          ) : (
            /* UNLOCKED DOCUMENT READER */
            <div className="lxd-document-canvas-wrapper">
              {/* SIDEBAR METADATA DRAWER (COLLAPSED/EXPANDED) */}
              <div className="lxd-viewer-sidebar">
                <div className="sidebar-section">
                  <h4>Document Overview</h4>
                  <p>{doc.detailedDescription}</p>
                </div>

                <div className="sidebar-section">
                  <h4>Organization / Entity</h4>
                  <div className="sidebar-org">
                    <FaBuilding />
                    <span>{doc.organization}</span>
                  </div>
                </div>

                {doc.disclaimer && (
                  <div className="sidebar-section disclaimer-box">
                    <div className="disclaimer-title">
                      <FaTriangleExclamation /> Official Notice
                    </div>
                    <p>{doc.disclaimer}</p>
                  </div>
                )}

                {doc.keyHighlights && doc.keyHighlights.length > 0 && (
                  <div className="sidebar-section highlights-box">
                    <h4>Executive Highlights</h4>
                    <ul>
                      {doc.keyHighlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="sidebar-section tags-box">
                  <h4>Taxonomy</h4>
                  <div className="lxd-v-tags">
                    {doc.tags.map((tag, i) => (
                      <span key={i} className="lxd-v-tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* MAIN DOCUMENT VIEWPORT */}
              <div className="lxd-viewport-stage">
                {doc.fileFormat === "PDF" ? (
                  <div
                    className="lxd-pdf-embed-wrapper"
                    style={{
                      transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                      transformOrigin: "top center",
                      transition: "transform 0.2s ease"
                    }}
                  >
                    <object
                      data={`${doc.fileUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                      type="application/pdf"
                      className="lxd-pdf-object"
                    >
                      <div className="lxd-pdf-fallback">
                        <FaFilePdf className="fallback-icon" />
                        <h3>Direct PDF Preview</h3>
                        <p>
                          Your browser does not support inline PDF rendering.
                          You can view the document directly using the viewer below.
                        </p>
                        <iframe
                          src={doc.fileUrl}
                          title={doc.title}
                          className="lxd-pdf-fallback-iframe"
                        />
                      </div>
                    </object>
                  </div>
                ) : (
                  /* DOCX VIEWER */
                  <div
                    className="lxd-docx-reader-wrapper"
                    style={{
                      transform: `scale(${zoom / 100})`,
                      transformOrigin: "top center"
                    }}
                  >
                    {docxLoading && (
                      <div className="lxd-docx-loading">
                        <div className="lxd-spinner"></div>
                        <p>Loading & formatting institutional document...</p>
                      </div>
                    )}
                    {docxError && (
                      <div className="lxd-docx-error">
                        <FaTriangleExclamation />
                        <p>{docxError}</p>
                      </div>
                    )}
                    {!docxLoading && !docxError && docxHtml && (
                      <div
                        className="lxd-docx-content"
                        dangerouslySetInnerHTML={{ __html: docxHtml }}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
