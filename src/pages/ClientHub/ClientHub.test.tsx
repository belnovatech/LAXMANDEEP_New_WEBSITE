import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, test, expect } from "vitest";
import ClientHub from "./ClientHub";
import DocumentsPage from "./DocumentsPage";
import IdeasPage from "./IdeasPage";

describe("Client Hub Pages", () => {
  test("renders ClientHub overview page elements", () => {
    render(
      <BrowserRouter>
        <ClientHub />
      </BrowserRouter>
    );

    expect(screen.getByText(/LAXMANDEEP STRATEGIC PORTAL/i)).toBeInTheDocument();
    expect(screen.getByText(/Client Requirements & Documents/i)).toBeInTheDocument();
    expect(screen.getByText(/Share an Idea & Co-Create/i)).toBeInTheDocument();
    expect(screen.getByText(/Public Community Ideas Board/i)).toBeInTheDocument();
  });

  test("renders DocumentsPage with search and category filters", () => {
    render(
      <BrowserRouter>
        <DocumentsPage />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText(/Search by title, organization, topic/i)).toBeInTheDocument();
    expect(screen.getAllByText("Investment Programmes").length).toBeGreaterThan(0);
    expect(screen.getAllByText("FinTech & Biometric Identity").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Corporate & Due Diligence").length).toBeGreaterThan(0);
  });

  test("renders IdeasPage with submission portal and community ideas board", () => {
    render(
      <BrowserRouter>
        <IdeasPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Your Ideas\. Our Shared Future\./i)).toBeInTheDocument();
    expect(screen.getAllByText(/Explore Community Ideas/i).length).toBeGreaterThan(0);
    expect(screen.getByLabelText(/Proposal \/ Idea Title/i)).toBeInTheDocument();
  });
});
