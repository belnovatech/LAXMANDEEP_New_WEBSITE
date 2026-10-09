import { useState } from "react";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";
import { ClientHubHeader } from "../../components/clientHub/ClientHubHeader";
import { DocumentCard } from "../../components/clientHub/DocumentCard";
import { DocumentViewerModal } from "../../components/clientHub/DocumentViewerModal";
import { AdminModerationDrawer } from "../../components/clientHub/AdminModerationDrawer";
import { ClientHubService } from "../../services/clientHubService";
import type { ClientDocument, DocumentCategory } from "../../types/clientHub";
import {
  FaFolderOpen,
  FaMagnifyingGlass,
  FaFilter,
  FaShieldHalved,
  FaFileLines,
  FaRotateLeft,
  FaLock
} from "react-icons/fa6";
import "./documentsPage.css";

const CATEGORIES: DocumentCategory[] = [
  "All Categories",
  "Investment Programmes",
  "Strategic Meetings",
  "FinTech & Biometric Identity",
  "Technology & Cybersecurity",
  "Corporate & Due Diligence"
];

export default function DocumentsPage() {
  const authStatus = ClientHubService.getAuthStatus();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory>("All Categories");
  const [selectedDoc, setSelectedDoc] = useState<ClientDocument | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Search and filter documents
  const filteredDocs = ClientHubService.searchDocuments(
    searchQuery,
    selectedCategory,
    authStatus
  );

  const totalAllDocs = ClientHubService.getAllDocumentsForAdmin().length;

  return (
    <div className="lxd-documents-page">
      <Navbar />
      <ClientHubHeader onOpenAdminDrawer={() => setIsAdminOpen(true)} />

      <main className="lxd-docs-main">
        {/* HEADER SECTION */}
        <section className="lxd-docs-hero">
          <div className="lxd-docs-container">
            <div className="lxd-docs-badge">
              <FaFolderOpen /> CLIENT REQUIREMENTS & REPOSITORY
            </div>

            <h1 className="lxd-docs-headline">
              Official Requirements &
              <br />
              <span className="lxd-gradient-text">Institutional Documents</span>
            </h1>

            <p className="lxd-docs-subtext">
              Browse approved business plans, strategic investment programmes, technology blueprints,
              and executive partnership frameworks. Read documents directly inside our high-fidelity
              reader without leaving the website.
            </p>

            {/* SEARCH & CATEGORY FILTER BAR */}
            <div className="lxd-filter-toolbar">
              <div className="lxd-search-input-wrapper">
                <FaMagnifyingGlass className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by title, organization, topic, or tags (e.g. USD 119M, WiBioCard, XMDR)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="clear-search-btn"
                    onClick={() => setSearchQuery("")}
                    title="Clear Search"
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="lxd-category-tabs">
                <span className="category-label">
                  <FaFilter /> Category:
                </span>
                <div className="tabs-scroll">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      className={`cat-tab-btn ${
                        selectedCategory === cat ? "active" : ""
                      }`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DOCUMENTS GRID SECTION */}
        <section className="lxd-docs-library-section">
          <div className="lxd-docs-container">
            {/* TOOLBAR STATUS */}
            <div className="lxd-library-statusbar">
              <div className="status-left">
                <FaFileLines />
                <span>
                  Showing <strong>{filteredDocs.length}</strong> of{" "}
                  <strong>{totalAllDocs}</strong> institutional documents
                </span>
                {authStatus.role !== "admin" && (
                  <span className="clearance-hint">
                    (Confidential DDQ records require security clearance)
                  </span>
                )}
              </div>

              {(searchQuery || selectedCategory !== "All Categories") && (
                <button
                  className="reset-filter-btn"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All Categories");
                  }}
                >
                  <FaRotateLeft /> Reset Filters
                </button>
              )}
            </div>

            {/* GRID */}
            {filteredDocs.length > 0 ? (
              <div className="lxd-documents-grid">
                {filteredDocs.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    onView={(d) => setSelectedDoc(d)}
                  />
                ))}
              </div>
            ) : (
              /* EMPTY STATE */
              <div className="lxd-docs-empty-state">
                <div className="empty-icon-wrap">
                  <FaFolderOpen />
                </div>
                <h3>No documents match your filter criteria</h3>
                <p>
                  Try refining your search terms or select "All Categories" to view all available
                  institutional documents.
                </p>
                <button
                  className="lxd-reset-cta"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All Categories");
                  }}
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* SECURITY CLARITY ACCORDION / NOTICE */}
        <section className="lxd-docs-policy-notice">
          <div className="lxd-docs-container">
            <div className="docs-policy-card">
              <div className="policy-icon">
                <FaShieldHalved />
              </div>
              <div className="policy-content">
                <h4>Document Integrity & Governance Policy</h4>
                <p>
                  All source documents contained within this repository are verified authentic files
                  pertaining to the LaxmanDeep ecosystem, Swiss LaxmanDeep AI FINTECH, WiBioCard, and
                  Fortress Cyber. Download permissions and printing controls are enforced per document
                  classification tier. Private and due-diligence records are protected by cryptographic
                  access-control policies.
                </p>
              </div>
              <div className="policy-action">
                <span className="lock-tag">
                  <FaLock /> Protected Repository
                </span>
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

      {/* ADMIN MODERATION DRAWER */}
      <AdminModerationDrawer
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      <Footer />
    </div>
  );
}
