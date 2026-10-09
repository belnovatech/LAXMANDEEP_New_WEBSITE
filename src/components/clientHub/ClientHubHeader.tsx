import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaFolderOpen,
  FaLightbulb,
  FaShieldHalved,
  FaCompass,
  FaKey,
  FaLock,
  FaUnlock,
  FaArrowRight
} from "react-icons/fa6";
import { ClientHubService } from "../../services/clientHubService";
import "./clientHubHeader.css";

interface ClientHubHeaderProps {
  onOpenAuthModal?: () => void;
  onOpenAdminDrawer?: () => void;
}

export const ClientHubHeader: React.FC<ClientHubHeaderProps> = ({
  onOpenAuthModal,
  onOpenAdminDrawer
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const authStatus = ClientHubService.getAuthStatus();
  const currentPath = location.pathname;

  const [authInput, setAuthInput] = useState("");
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyError, setKeyError] = useState("");
  const [keySuccess, setKeySuccess] = useState("");

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setKeyError("");
    setKeySuccess("");

    const res = ClientHubService.verifyAccessKey(authInput);
    if (res.success) {
      setKeySuccess(res.message);
      setTimeout(() => {
        setShowKeyModal(false);
        setAuthInput("");
        setKeySuccess("");
        window.location.reload();
      }, 1200);
    } else {
      setKeyError(res.message);
    }
  };

  const handleLogout = () => {
    ClientHubService.logout();
    window.location.reload();
  };

  return (
    <>
      <header className="lxd-ch-header">
        <div className="lxd-ch-header-container">
          <div className="lxd-ch-badge-row">
            <span className="lxd-ch-tag">
              <FaShieldHalved className="lxd-ch-tag-icon" /> LAXMANDEEP CLIENT HUB
            </span>
            <div className="lxd-ch-auth-pill">
              {authStatus.isAuthenticated ? (
                <div className="lxd-ch-auth-active">
                  <span className="lxd-ch-dot green"></span>
                  <span className="lxd-ch-role">
                    {authStatus.role === "admin"
                      ? "Executive Clearance (Admin)"
                      : "Client Verified (Tier 1)"}
                  </span>
                  {authStatus.role === "admin" && onOpenAdminDrawer && (
                    <button
                      className="lxd-ch-admin-btn"
                      onClick={onOpenAdminDrawer}
                      title="Open Moderation & Control Panel"
                    >
                      Governance Desk
                    </button>
                  )}
                  <button
                    className="lxd-ch-logout-btn"
                    onClick={handleLogout}
                    title="Lock / Sign Out"
                  >
                    <FaLock /> Lock
                  </button>
                </div>
              ) : (
                <button
                  className="lxd-ch-auth-btn"
                  onClick={() =>
                    onOpenAuthModal ? onOpenAuthModal() : setShowKeyModal(true)
                  }
                >
                  <FaKey />
                  <span>Access Clearance / PIN</span>
                </button>
              )}
            </div>
          </div>

          <div className="lxd-ch-nav-strip">
            <nav className="lxd-ch-nav-tabs">
              <Link
                to="/client-hub"
                className={`lxd-ch-tab ${
                  currentPath === "/client-hub" ? "active" : ""
                }`}
              >
                <FaCompass />
                <span>Overview</span>
              </Link>

              <Link
                to="/client-hub/documents"
                className={`lxd-ch-tab ${
                  currentPath.includes("/client-hub/documents") ? "active" : ""
                }`}
              >
                <FaFolderOpen />
                <span>Requirements & Documents</span>
              </Link>

              <Link
                to="/client-hub/ideas"
                className={`lxd-ch-tab ${
                  currentPath.includes("/client-hub/ideas") ? "active" : ""
                }`}
              >
                <FaLightbulb />
                <span>Idea Portal & Board</span>
              </Link>
            </nav>

            <div className="lxd-ch-quick-action">
              <button
                className="lxd-ch-submit-cta"
                onClick={() => navigate("/client-hub/ideas")}
              >
                <span>Share Proposal</span>
                <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ACCESS KEY MODAL */}
      {showKeyModal && (
        <div className="lxd-modal-backdrop" onClick={() => setShowKeyModal(false)}>
          <div
            className="lxd-clearance-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="lxd-clearance-header">
              <div className="lxd-clearance-icon-wrap">
                <FaShieldHalved />
              </div>
              <div>
                <h3>Partner Security Clearance</h3>
                <p>Enter your institutional passcode or administrator clearance PIN</p>
              </div>
              <button
                className="lxd-modal-close"
                onClick={() => setShowKeyModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="lxd-clearance-form">
              <div className="lxd-input-group">
                <label htmlFor="clearanceKey">Clearance Key / Access Passcode</label>
                <input
                  id="clearanceKey"
                  type="password"
                  placeholder="e.g. LXD-AUTH-2026 or Admin PIN (80880)"
                  value={authInput}
                  onChange={(e) => setAuthInput(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="lxd-clearance-hints">
                <p>
                  <strong>Quick Demo Keys:</strong>
                  <br />
                  • Partner Access: <code>LXD-AUTH-2026</code>
                  <br />
                  • Executive Admin: <code>80880</code> or <code>LXD-ADMIN-2026</code>
                </p>
              </div>

              {keyError && <div className="lxd-alert error">{keyError}</div>}
              {keySuccess && <div className="lxd-alert success">{keySuccess}</div>}

              <div className="lxd-clearance-actions">
                <button
                  type="button"
                  className="lxd-btn-cancel"
                  onClick={() => setShowKeyModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="lxd-btn-submit">
                  <FaUnlock /> Verify & Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
