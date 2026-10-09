import type {
  ClientDocument,
  DocumentCategory,
  DocumentVisibility,
  IdeaCategory,
  IdeaStatus,
  IdeaSubmission,
  ClientHubAuthStatus
} from "../types/clientHub";
import { INITIAL_DOCUMENTS, INITIAL_APPROVED_IDEAS } from "../data/clientHubData";

const STORAGE_KEYS = {
  DOCUMENTS: "lxd_client_hub_documents_v1",
  IDEAS: "lxd_client_hub_ideas_v1",
  AUTH: "lxd_client_hub_auth_v1"
};

// Seed storage safely
function getStoredDocuments(): ClientDocument[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Could not read stored documents", e);
  }
  return INITIAL_DOCUMENTS;
}

function saveDocuments(docs: ClientDocument[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));
  } catch (e) {
    console.warn("Could not save documents", e);
  }
}

function getStoredIdeas(): IdeaSubmission[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.IDEAS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Could not read stored ideas", e);
  }
  return INITIAL_APPROVED_IDEAS;
}

function saveIdeas(ideas: IdeaSubmission[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(ideas));
  } catch (e) {
    console.warn("Could not save ideas", e);
  }
}

export const ClientHubService = {
  // === DOCUMENTS ===
  getDocuments(userAuth?: ClientHubAuthStatus): ClientDocument[] {
    const allDocs = getStoredDocuments();
    const role = userAuth?.role || "guest";

    if (role === "admin") {
      return allDocs;
    }

    if (role === "client") {
      return allDocs.filter(
        (doc) => doc.visibility === "public" || doc.visibility === "client-only"
      );
    }

    // Guests only see public documents
    return allDocs.filter((doc) => doc.visibility === "public");
  },

  getAllDocumentsForAdmin(): ClientDocument[] {
    return getStoredDocuments();
  },

  getDocumentById(id: string): ClientDocument | undefined {
    const allDocs = getStoredDocuments();
    return allDocs.find((doc) => doc.id === id);
  },

  updateDocumentVisibility(
    docId: string,
    visibility: DocumentVisibility,
    allowDownload: boolean,
    allowPrint: boolean
  ): boolean {
    const docs = getStoredDocuments();
    const index = docs.findIndex((d) => d.id === docId);
    if (index === -1) return false;

    docs[index] = {
      ...docs[index],
      visibility,
      allowDownload,
      allowPrint
    };
    saveDocuments(docs);
    return true;
  },

  searchDocuments(
    query: string,
    category: DocumentCategory,
    userAuth?: ClientHubAuthStatus
  ): ClientDocument[] {
    const availableDocs = this.getDocuments(userAuth);
    const q = query.toLowerCase().trim();

    return availableDocs.filter((doc) => {
      const matchesCategory =
        category === "All Categories" || doc.category === category;
      const matchesQuery =
        !q ||
        doc.title.toLowerCase().includes(q) ||
        doc.shortDescription.toLowerCase().includes(q) ||
        doc.detailedDescription.toLowerCase().includes(q) ||
        doc.organization.toLowerCase().includes(q) ||
        doc.tags.some((tag) => tag.toLowerCase().includes(q));

      return matchesCategory && matchesQuery;
    });
  },

  // === IDEAS & SUBMISSIONS ===
  getPublicIdeas(): IdeaSubmission[] {
    const allIdeas = getStoredIdeas();
    // Only return ideas that are explicitly approved and marked public
    return allIdeas.filter(
      (idea) => (idea.status === "approved" || idea.status === "featured") && idea.isPublic
    );
  },

  getAllSubmissionsForAdmin(): IdeaSubmission[] {
    return getStoredIdeas();
  },

  submitIdea(payload: {
    title: string;
    category: IdeaCategory;
    summary: string;
    description: string;
    businessArea: string;
    expectedOutcome: string;
    submitterName: string;
    submitterEmail: string;
    organization?: string;
    attachmentName?: string;
    attachmentSize?: string;
  }): Promise<{ success: boolean; submission?: IdeaSubmission; error?: string }> {
    return new Promise((resolve) => {
      // Simulate real server-side validation and secure ingestion
      setTimeout(() => {
        if (!payload.title || !payload.category || !payload.summary || !payload.description) {
          resolve({ success: false, error: "Please fill in all required fields." });
          return;
        }

        const trackingNumber = `LXD-IDEA-${Math.floor(1000 + Math.random() * 9000)}`;
        const newSubmission: IdeaSubmission = {
          id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          trackingNumber,
          title: payload.title.trim(),
          category: payload.category,
          summary: payload.summary.trim(),
          description: payload.description.trim(),
          businessArea: payload.businessArea.trim() || "LaxmanDeep Global Ecosystem",
          expectedOutcome: payload.expectedOutcome.trim() || "Strategic growth and value generation.",
          submitterName: payload.submitterName.trim(),
          submitterEmail: payload.submitterEmail.trim(),
          organization: payload.organization?.trim() || "Independent Strategic Partner",
          attachmentName: payload.attachmentName,
          attachmentSize: payload.attachmentSize,
          status: "pending_review",
          isPublic: false, // strictly false until admin reviews and approves
          createdAt: new Date().toISOString()
        };

        const ideas = getStoredIdeas();
        ideas.unshift(newSubmission);
        saveIdeas(ideas);

        resolve({ success: true, submission: newSubmission });
      }, 600);
    });
  },

  moderateIdea(
    ideaId: string,
    action: "approve" | "reject" | "feature" | "hide",
    reviewerName: string,
    moderationNotes?: string
  ): boolean {
    const ideas = getStoredIdeas();
    const index = ideas.findIndex((i) => i.id === ideaId);
    if (index === -1) return false;

    const current = ideas[index];
    let newStatus: IdeaStatus = current.status;
    let isPublic = current.isPublic;

    if (action === "approve") {
      newStatus = "approved";
      isPublic = true;
    } else if (action === "feature") {
      newStatus = "featured";
      isPublic = true;
    } else if (action === "reject") {
      newStatus = "rejected";
      isPublic = false;
    } else if (action === "hide") {
      isPublic = false;
    }

    ideas[index] = {
      ...current,
      status: newStatus,
      isPublic,
      reviewedAt: new Date().toISOString(),
      reviewedBy: reviewerName || "LaxmanDeep Governance Reviewer",
      moderationNotes: moderationNotes || current.moderationNotes
    };

    saveIdeas(ideas);
    return true;
  },

  // === AUTHENTICATION & ACCESS CONTROL ===
  getAuthStatus(): ClientHubAuthStatus {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Could not read auth status", e);
    }
    return {
      isAuthenticated: false,
      role: "guest",
      clearanceLevel: "public"
    };
  },

  setAuthStatus(status: ClientHubAuthStatus): void {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(status));
    } catch (e) {
      console.warn("Could not save auth status", e);
    }
  },

  logout(): void {
    this.setAuthStatus({
      isAuthenticated: false,
      role: "guest",
      clearanceLevel: "public"
    });
  },

  verifyAccessKey(key: string): { success: boolean; role?: "admin" | "client"; message: string } {
    const trimmed = key.trim();
    // Admin Master Pin
    if (trimmed === "80880" || trimmed === "LXD-ADMIN-2026" || trimmed === "admin123") {
      const auth: ClientHubAuthStatus = {
        isAuthenticated: true,
        role: "admin",
        userEmail: "compliance@laxmandeep.com",
        clearanceLevel: "executive"
      };
      this.setAuthStatus(auth);
      return { success: true, role: "admin", message: "Executive Clearance Verified. Full Administrative and Confidential Access Granted." };
    }

    // Client Strategic Passcode
    if (trimmed === "LXD-PARTNER-2026" || trimmed === "LXD-AUTH-2026" || trimmed === "client777") {
      const auth: ClientHubAuthStatus = {
        isAuthenticated: true,
        role: "client",
        userEmail: "partner@client.laxmandeep.com",
        clearanceLevel: "tier1"
      };
      this.setAuthStatus(auth);
      return { success: true, role: "client", message: "Client Security Passcode Verified. Tier-1 Documents Unlocked." };
    }

    return {
      success: false,
      message: "Invalid clearance key or security passcode. Please check credentials or contact info@laxmandeep.com."
    };
  },

  resetToDefaultData(): void {
    saveDocuments(INITIAL_DOCUMENTS);
    saveIdeas(INITIAL_APPROVED_IDEAS);
  }
};
