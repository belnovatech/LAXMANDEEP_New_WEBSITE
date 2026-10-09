import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home/home";
import About from "./pages/Home/About/about";
import Services from "./pages/Services/services";
import Contact from "./pages/contact/contact";
import Clients from "./pages/clients/clients";
import ClientDetails from "./pages/clients/clientdetails/clientdetails";
import ClientHub from "./pages/ClientHub/ClientHub";
import DocumentsPage from "./pages/ClientHub/DocumentsPage";
import IdeasPage from "./pages/ClientHub/IdeasPage";
import ScrollToTop from "./ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/client/:id" element={<ClientDetails />} />
        <Route path="/contact" element={<Contact />} />

        {/* CLIENT HUB ROUTES */}
        <Route path="/client-hub" element={<ClientHub />} />
        <Route path="/client-hub/documents" element={<DocumentsPage />} />
        <Route path="/client-hub/ideas" element={<IdeasPage />} />

        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;