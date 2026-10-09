import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";
import { ClientHubHeader } from "../../components/clientHub/ClientHubHeader";
import { DocumentCard } from "../../components/clientHub/DocumentCard";
import { IdeaCard } from "../../components/clientHub/IdeaCard";
import { DocumentViewerModal } from "../../components/clientHub/DocumentViewerModal";
import { IdeaDetailModal } from "../../components/clientHub/IdeaDetailModal";
import { AdminModerationDrawer } from "../../components/clientHub/AdminModerationDrawer";
import { ClientHubService } from "../../services/clientHubService";
import type { ClientDocument, IdeaSubmission } from "../../types/clientHub";
import {
  FaFolderOpen,
  FaLightbulb,
  FaShieldHalved,
  FaArrowRight,
  FaFileContract,
  FaUsers,
  FaGlobe,
  FaChartPie
} from "react-icons/fa6";
import "./clientHub.css";

export default function ClientHub() {
  const navigate = useNavigate();
  const authStatus = ClientHubService.getAuthStatus();

  const [selectedDoc, setSelectedDoc] = useState<ClientDocument | null>(null);
  const [selectedIdea, setSelectedIdea] = useState<IdeaSubmission | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Fetch approved public documents & featured ideas
  const allDocs = ClientHubService.getDocuments(authStatus);
  const publicIdeas = ClientHubService.getPublicIdeas();

  return (
    <div className="lxd-client-hub-page">
      <Navbar />
      <ClientHubHeader onOpenAdminDrawer={() => setIsAdminOpen(true)} />

      <main className="lxd-hub-main">
        {/* HERO SECTION */}
        <section className="lxd-hub-hero">
          <div className="lxd-hub-container">
            <div className="lxd-hero-tag">
              <FaShieldHalved /> LAXMANDEEP STRATEGIC PORTAL
            </div>

            <h1 className="lxd-hub-headline">
              Client Hub &
              <br />
              <span className="lxd-gradient-text">Strategic Partnership Portal</span>
            </h1>

            <p className="lxd-hub-subtext">
              The central gateway for LaxmanDeep clients, institutional investors, and strategic partners.
              Access approved investment programmes, read business requirements directly in-browser,
              and contribute innovative proposals to shape our shared ecosystem.
            </p>

            <div className="lxd-hero-stats-strip">
              <div className="hub-stat-item">
                <span className="stat-num">$119M</span>
                <span className="stat-label">Strategic Investment Plan</span>
              </div>
              <div className="hub-stat-item">
                <span className="stat-num">100%</span>
                <span className="stat-label">Verified Source Documents</span>
              </div>
              <div className="hub-stat-item">
                <span className="stat-num">Tier-1</span>
                <span className="stat-label">Institutional Governance</span>
              </div>
              <div className="hub-stat-item">
                <span className="stat-num">24/7</span>
                <span className="stat-label">Global Idea Co-Creation</span>
              </div>
            </div>
          </div>
        </section>

        {/* THREE CORE PILLARS LAUNCHER */}
        <section className="lxd-hub-pillars-section">
          <div className="lxd-hub-container">
            <div className="lxd-section-header">
              <span className="section-eyebrow">ECOSYSTEM GATEWAYS</span>
              <h2>Explore the Client Hub Capabilities</h2>
            </div>

            <div className="lxd-pillars-grid">
              {/* CARD 1 */}
              <div
                className="lxd-pillar-card"
                onClick={() => navigate("/client-hub/documents")}
              >
                <div className="pillar-icon-box gold">
                  <FaFolderOpen />
                </div>
                <h3>Client Requirements & Documents</h3>
                <p>
                  Browse official investment programmes, systems integration plans, and strategic
                  due-diligence records with in-browser reading.
                </p>
                <div className="pillar-link">
                  <span>Browse Document Library</span>
                  <FaArrowRight />
                </div>
              </div>

              {/* CARD 2 */}
              <div
                className="lxd-pillar-card"
                onClick={() => navigate("/client-hub/ideas")}
              >
                <div className="pillar-icon-box blue">
                  <FaLightbulb />
                </div>
                <h3>Share an Idea & Co-Create</h3>
                <p>
                  Submit your strategic proposals, partnership opportunities, and technical
                  requirements directly to our Investment & Technology Committees.
                </p>
                <div className="pillar-link">
                  <span>Submit Strategic Proposal</span>
                  <FaArrowRight />
                </div>
              </div>

              {/* CARD 3 */}
              <div
                className="lxd-pillar-card"
                onClick={() => navigate("/client-hub/ideas#board")}
              >
                <div className="pillar-icon-box purple">
                  <FaUsers />
                </div>
                <h3>Public Community Ideas Board</h3>
                <p>
                  Discover verified proposals approved by our governance committee across AI,
                  FinTech, biometric identity, and cybersecurity.
                </p>
                <div className="pillar-link">
                  <span>Explore Approved Ideas</span>
                  <FaArrowRight />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED APPROVED SOURCE DOCUMENTS */}
        <section className="lxd-featured-docs-section">
          <div className="lxd-hub-container">
            <div className="lxd-section-header-flex">
              <div>
                <span className="section-eyebrow">DOCUMENTATION VAULT</span>
                <h2>Official Source Documents & Business Plans</h2>
                <p>
                  Real uploaded files covering investment models, strategic meeting agendas, and
                  technical architecture.
                </p>
              </div>

              <button
                className="lxd-view-all-btn"
                onClick={() => navigate("/client-hub/documents")}
              >
                <span>View Full Library ({allDocs.length})</span>
                <FaArrowRight />
              </button>
            </div>

            <div className="lxd-docs-grid">
              {allDocs.slice(0, 3).map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  onView={(d) => setSelectedDoc(d)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED COMMUNITY IDEAS BOARD */}
        <section className="lxd-featured-ideas-section">
          <div className="lxd-hub-container">
            <div className="lxd-section-header-flex">
              <div>
                <span className="section-eyebrow">COMMUNITY INTELLIGENCE</span>
                <h2>Approved Strategic Proposals</h2>
                <p>
                  Browse innovative contributions actively evaluated and approved by the
                  LaxmanDeep Governance Desk.
                </p>
              </div>

              <button
                className="lxd-view-all-btn"
                onClick={() => navigate("/client-hub/ideas")}
              >
                <span>Explore All Ideas ({publicIdeas.length})</span>
                <FaArrowRight />
              </button>
            </div>

            <div className="lxd-ideas-grid">
              {publicIdeas.slice(0, 2).map((idea) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  onReadMore={(i) => setSelectedIdea(i)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* SECURITY & GOVERNANCE COMPLIANCE BANNER */}
        <section className="lxd-hub-governance-banner">
          <div className="lxd-hub-container">
            <div className="governance-card">
              <div className="gov-left">
                <div className="gov-badge">
                  <FaShieldHalved /> INSTITUTIONAL ACCESS & CONFIDENTIALITY
                </div>
                <h3>Enterprise Security & Document Access Policies</h3>
                <p>
                  LaxmanDeep enforces strict role-based access control (RBAC) across all institutional
                  materials. Due-diligence records and proprietary compliance disclosures are
                  classified as Private and restricted to authenticated partners with authorized clearance.
                </p>
                <div className="gov-tags">
                  <span><FaChartPie /> Risk-Adjusted Modeling</span>
                  <span><FaGlobe /> Cross-Border Adherence</span>
                  <span><FaFileContract /> NDA & Fiduciary Safeguards</span>
                </div>
              </div>

              <div className="gov-right">
                <button
                  className="gov-clearance-cta"
                  onClick={() => navigate("/client-hub/documents")}
                >
                  <span>Explore Document Clearance</span>
                  <FaArrowRight />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* DOCUMENT VIEWER MODAL */}
      <DocumentViewerModal
        document={selectedDoc}
        onClose={() => setSelectedDoc(null)}
      />

      {/* IDEA DETAIL MODAL */}
      <IdeaDetailModal
        idea={selectedIdea}
        onClose={() => setSelectedIdea(null)}
      />

      {/* ADMIN MODERATION DRAWER */}
      <AdminModerationDrawer
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      <Footer />
    </div>
  );
}
