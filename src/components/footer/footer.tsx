import "./footer.css";

import {
  FaLinkedin,
  FaWhatsapp,
  FaEnvelope,
  // FaInstagram,
  // FaYoutube,
  // FaXTwitter,
} from "react-icons/fa6";

import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    setTimeout(() => {
      navigate(path);
    }, 100);
  };

  return (
    <footer className="lxd-footer">
      <div className="lxd-footer-container">
        {/* BRAND */}
        <div className="lxd-footer-brand">
          <h2>LAXMANDEEP</h2>

          <p>
            Engineering Financial Futures Through
            AI-Powered Wealth Intelligence and
            Global Intelligence Ecosystems.
          </p>

          <div className="lxd-footer-contact">
            <a href="mailto:info@laxmandeep.com">
              <FaEnvelope />
              <span>info@laxmandeep.com</span>
            </a>

<a
  href="https://wa.me/919640080880"
  target="_blank"
  rel="noreferrer"
>
  <FaWhatsapp />
  <span>+91 96400 80880</span>
</a>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="lxd-footer-links">
          <h4>Quick Links</h4>

          <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate("/"); }}>
            Home
          </a>

          <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate("/about"); }}>
            About Us
          </a>

          <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate("/services"); }}>
            Services
          </a>

          <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate("/clients"); }}>
            Clients
          </a>

          <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate("/client-hub"); }}>
            Client Hub
          </a>

          <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate("/client-hub/ideas"); }}>
            Idea Portal
          </a>

          <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate("/contact"); }}>
            Contact
          </a>
        </div>

        {/* ECOSYSTEM */}
        <div className="lxd-footer-links">
          <h4>Our Ecosystem</h4>

          <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate("/services"); }}>
            LaxmanDeep Financial Services
          </a>

          <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate("/services"); }}>
            Swiss LaxmanDeep AI FINTECH
          </a>

          <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate("/services"); }}>
            World Intelligence Agency
          </a>
        </div>

        {/* CONTACT INFO */}
        <div className="lxd-footer-links">
          <h4>Contact Info</h4>

          <p>
    D.No. 1-18 ,
    <br />
    D Gollapalli,
    <br />
    Vontimitta,
    <br />
    Kadapa District,
    <br />
    Andhra Pradesh - 516213,
    <br />
    India
  </p>
          <p>📧 info@laxmandeep.com</p>
          <p>📞 +91 96400 80880</p>
          <p>🌐 Global Intelligence Network</p>
        </div>
      </div>

      {/* SOCIALS */}
      <div className="lxd-footer-social">
        <a
          href="https://www.linkedin.com/in/lakshumaiah-nanubala-5b7baa23a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
          target="_blank"
          rel="noreferrer"
        >
          <FaLinkedin />
        </a>

        <a
          href="https://wa.me/919640080880"
          target="_blank"
          rel="noreferrer"
        >
          <FaWhatsapp />
        </a>

        <a href="mailto:info@laxmandeep.com"
          target="_blank"
          rel="noreferrer"
        >
          <FaEnvelope />
        </a>

        {/* <a href="#">
          <FaInstagram />
        </a>

        <a href="#">
          <FaYoutube />
        </a>

        <a href="#">
          <FaXTwitter />
        </a> */}
      </div>

      {/* BOTTOM */}
      <div className="lxd-footer-bottom">
        <p>© 2026 LAXMANDEEP. All Rights Reserved.</p>

        <div className="lxd-footer-policies">
          <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate("/privacy-policy"); }}>
            Privacy Policy
          </a>

          <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate("/terms"); }}>
            Terms & Conditions
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;