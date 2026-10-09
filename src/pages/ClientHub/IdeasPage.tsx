import { useState, useMemo } from "react";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";
import { ClientHubHeader } from "../../components/clientHub/ClientHubHeader";
import { IdeaSubmissionForm } from "../../components/clientHub/IdeaSubmissionForm";
import { IdeaCard } from "../../components/clientHub/IdeaCard";
import { IdeaDetailModal } from "../../components/clientHub/IdeaDetailModal";
import { AdminModerationDrawer } from "../../components/clientHub/AdminModerationDrawer";
import { ClientHubService } from "../../services/clientHubService";
import type { IdeaCategory, IdeaSubmission } from "../../types/clientHub";
import {
  FaLightbulb,
  FaMagnifyingGlass,
  FaFilter,
  FaUsers,
  FaRotateLeft,
  FaShieldHalved,
  FaArrowDown
} from "react-icons/fa6";
import "./ideasPage.css";

const FILTER_CATEGORIES: (IdeaCategory | "All Categories")[] = [
  "All Categories",
  "Investment Opportunities",
  "FinTech & Financial Services",
  "Artificial Intelligence",
  "Cybersecurity",
  "Biometric Identity",
  "Global Intelligence & Research",
  "Strategic Partnerships",
  "Other Business Ideas"
];

export default function IdeasPage() {
  const [selectedCategory, setSelectedCategory] = useState<IdeaCategory | "All Categories">("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIdea, setSelectedIdea] = useState<IdeaSubmission | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch approved public ideas
  const publicIdeas = useMemo(() => {
    return ClientHubService.getPublicIdeas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  // Filter ideas
  const filteredIdeas = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return publicIdeas.filter((idea) => {
      const matchesCategory =
        selectedCategory === "All Categories" || idea.category === selectedCategory;
      const matchesQuery =
        !q ||
        idea.title.toLowerCase().includes(q) ||
        idea.summary.toLowerCase().includes(q) ||
        idea.description.toLowerCase().includes(q) ||
        idea.businessArea.toLowerCase().includes(q) ||
        idea.submitterName.toLowerCase().includes(q);

      return matchesCategory && matchesQuery;
    });
  }, [publicIdeas, searchQuery, selectedCategory]);

  return (
    <div className="lxd-ideas-page">
      <Navbar />
      <ClientHubHeader onOpenAdminDrawer={() => setIsAdminOpen(true)} />

      <main className="lxd-ideas-main">
        {/* HERO / JUMP BAR */}
        <section className="lxd-ideas-hero">
          <div className="lxd-ideas-container">
            <div className="lxd-ideas-badge">
              <FaLightbulb /> CO-CREATION & STRATEGIC INNOVATION
            </div>

            <h1 className="lxd-ideas-headline">
              Idea Submission &
              <br />
              <span className="lxd-gradient-text">Public Ideas Board</span>
            </h1>

            <p className="lxd-ideas-subtext">
              Submit your strategic requirements, investment proposals, and innovative concepts.
              Explore community-driven proposals approved by the LaxmanDeep Investment Committee.
            </p>

            <div className="lxd-jump-buttons">
              <a href="#submit-portal" className="lxd-jump-btn primary">
                <span>Submit a New Proposal</span>
                <FaArrowDown />
              </a>
              <a href="#board" className="lxd-jump-btn secondary">
                <FaUsers />
                <span>Explore Community Ideas ({publicIdeas.length})</span>
              </a>
            </div>
          </div>
        </section>

        {/* SECTION 1: IDEA SUBMISSION FORM */}
        <section id="submit-portal" className="lxd-submission-section">
          <div className="lxd-ideas-container">
            <IdeaSubmissionForm
              onSubmissionSuccess={() => setRefreshKey((prev) => prev + 1)}
            />
          </div>
        </section>

        {/* SECTION 2: PUBLIC COMMUNITY IDEAS BOARD */}
        <section id="board" className="lxd-board-section">
          <div className="lxd-ideas-container">
            <div className="lxd-board-header">
              <div className="lxd-board-title-box">
                <span className="section-eyebrow">COMMUNITY PROPOSALS</span>
                <h2>Explore Community Ideas</h2>
                <p>
                  Browse verified strategic ideas approved for public collaboration and ecosystem
                  alignment. Read the full approved description by clicking on any card.
                </p>
              </div>

              {/* SEARCH & FILTER CONTROLS */}
              <div className="lxd-board-toolbar">
                <div className="board-search-input">
                  <FaMagnifyingGlass className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search ideas by title, keyword, or author..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      className="clear-search-btn"
                      onClick={() => setSearchQuery("")}
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="board-category-tabs">
                  <span className="cat-label">
                    <FaFilter /> Topic:
                  </span>
                  <div className="cat-tabs-scroll">
                    {FILTER_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        className={`board-cat-btn ${
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

            {/* STATUS COUNTER */}
            <div className="lxd-board-statusbar">
              <div>
                Showing <strong>{filteredIdeas.length}</strong> approved public{" "}
                {filteredIdeas.length === 1 ? "idea" : "ideas"}
              </div>
              {(searchQuery || selectedCategory !== "All Categories") && (
                <button
                  className="reset-filter-btn"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All Categories");
                  }}
                >
                  <FaRotateLeft /> Clear Filters
                </button>
              )}
            </div>

            {/* IDEAS CARDS GRID */}
            {filteredIdeas.length > 0 ? (
              <div className="lxd-board-grid">
                {filteredIdeas.map((idea) => (
                  <IdeaCard
                    key={idea.id}
                    idea={idea}
                    onReadMore={(i) => setSelectedIdea(i)}
                  />
                ))}
              </div>
            ) : (
              /* EMPTY STATE */
              <div className="lxd-board-empty">
                <div className="empty-bulb-icon">
                  <FaLightbulb />
                </div>
                <h3>No approved ideas match your search</h3>
                <p>
                  Try selecting another category or clear your search to explore all community proposals.
                </p>
                <button
                  className="lxd-clear-filter-btn"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All Categories");
                  }}
                >
                  Reset Filter Selection
                </button>
              </div>
            )}
          </div>
        </section>

        {/* MODERATION TRANSPARENCY BANNER */}
        <section className="lxd-moderation-notice-section">
          <div className="lxd-ideas-container">
            <div className="mod-notice-card">
              <div className="notice-icon">
                <FaShieldHalved />
              </div>
              <div className="notice-text">
                <h4>LaxmanDeep Governance & Moderation Standards</h4>
                <p>
                  Every idea submitted through the Client Hub undergoes rigorous review by our
                  technology and investment committees before being granted public visibility.
                  Contact details, proprietary intellectual property, and confidential attachments
                  are strictly shielded and never made public without submitter authorization.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* IDEA DETAIL MODAL */}
      <IdeaDetailModal
        idea={selectedIdea}
        onClose={() => setSelectedIdea(null)}
      />

      {/* ADMIN MODERATION DRAWER */}
      <AdminModerationDrawer
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onDataChanged={() => setRefreshKey((prev) => prev + 1)}
      />

      <Footer />
    </div>
  );
}
