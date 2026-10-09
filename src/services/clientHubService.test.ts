import { describe, test, expect, beforeEach } from "vitest";
import { ClientHubService } from "./clientHubService";

describe("ClientHubService", () => {
  beforeEach(() => {
    localStorage.clear();
    ClientHubService.resetToDefaultData();
  });

  test("returns public documents for guest user", () => {
    const docs = ClientHubService.getDocuments({
      isAuthenticated: false,
      role: "guest",
      clearanceLevel: "public"
    });

    expect(docs.length).toBeGreaterThan(0);
    // Guest should not see private documents by default
    const hasPrivate = docs.some((d) => d.visibility === "private");
    expect(hasPrivate).toBe(false);
  });

  test("verifies admin master PIN correctly", () => {
    const res = ClientHubService.verifyAccessKey("80880");
    expect(res.success).toBe(true);
    expect(res.role).toBe("admin");

    const auth = ClientHubService.getAuthStatus();
    expect(auth.isAuthenticated).toBe(true);
    expect(auth.role).toBe("admin");
  });

  test("verifies partner clearance passcode correctly", () => {
    const res = ClientHubService.verifyAccessKey("LXD-AUTH-2026");
    expect(res.success).toBe(true);
    expect(res.role).toBe("client");
  });

  test("submits an idea and retrieves it in pending state", async () => {
    const res = await ClientHubService.submitIdea({
      title: "Novel Quantum Biometric Mesh",
      category: "Biometric Identity",
      summary: "Executive summary for quantum biometric mesh testing.",
      description: "Detailed architecture covering cryptography and decentralized sensors.",
      businessArea: "WiBioCard",
      expectedOutcome: "Significant reduction in verification latency.",
      submitterName: "Test Researcher",
      submitterEmail: "researcher@example.com"
    });

    expect(res.success).toBe(true);
    expect(res.submission).toBeDefined();
    expect(res.submission?.trackingNumber).toMatch(/^LXD-IDEA-\d{4}$/);
    expect(res.submission?.isPublic).toBe(false);

    // Should not be in public ideas until approved
    const publicIdeas = ClientHubService.getPublicIdeas();
    const isPubliclyVisible = publicIdeas.some((i) => i.id === res.submission?.id);
    expect(isPubliclyVisible).toBe(false);

    // Admin should be able to see it and approve it
    ClientHubService.moderateIdea(res.submission!.id, "approve", "Admin Reviewer", "Great concept");
    const updatedPublicIdeas = ClientHubService.getPublicIdeas();
    const isNowVisible = updatedPublicIdeas.some((i) => i.id === res.submission?.id);
    expect(isNowVisible).toBe(true);
  });

  test("searches documents by category and query", () => {
    const results = ClientHubService.searchDocuments("119M", "All Categories");
    expect(results.length).toBe(1);
    expect(results[0].title).toContain("119M");
  });
});
