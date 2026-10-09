export type DocumentVisibility = "public" | "client-only" | "private";

export type DocumentCategory =
  | "Investment Programmes"
  | "Strategic Meetings"
  | "FinTech & Biometric Identity"
  | "Technology & Cybersecurity"
  | "Corporate & Due Diligence"
  | "All Categories";

export interface ClientDocument {
  id: string;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  category: DocumentCategory;
  organization: string;
  fileFormat: "PDF" | "DOCX";
  fileUrl: string;
  fileSize: string;
  visibility: DocumentVisibility;
  allowDownload: boolean;
  allowPrint: boolean;
  publishDate: string;
  disclaimer?: string;
  tags: string[];
  keyHighlights: string[];
}

export type IdeaCategory =
  | "Investment Opportunities"
  | "FinTech & Financial Services"
  | "Artificial Intelligence"
  | "Cybersecurity"
  | "Biometric Identity"
  | "Global Intelligence & Research"
  | "Strategic Partnerships"
  | "Other Business Ideas";

export type IdeaStatus = "pending_review" | "approved" | "rejected" | "featured";

export interface IdeaSubmission {
  id: string;
  trackingNumber: string;
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
  status: IdeaStatus;
  isPublic: boolean;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  moderationNotes?: string;
}

export interface ClientHubAuthStatus {
  isAuthenticated: boolean;
  role: "guest" | "client" | "admin";
  userEmail?: string;
  clearanceLevel: "public" | "tier1" | "executive";
}
