import logo from '../assets/Logo.png'
import VisitorCounter from './VisitorCounter'
import { contactName, whatsappHref } from '../contact'
import WhatsAppLogo from './WhatsAppLogo'
import '../styles/Footer.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section footer-about">
            <div className="footer-brand">
              <img src={logo} alt="SRI BOLLINENI logo" className="footer-logo" />
            </div>
            <p>Your trusted partner in finding the perfect property. Over 5 years of experience in real estate.</p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-nav-list">
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/about">About Us</a>
              </li>
              <li>
                <a href="/#projects">Properties</a>
              </li>
              <li>
                <a href="/about">Contact</a>
              </li>
            </ul>
          </div>

          <div className="footer-section footer-contact">
            <h4>Contact Info</h4>
            <div className="contact-list">
              <div className="contact-item">
                <span>Name</span>
                <strong>{contactName}</strong>
              </div>
              <div className="contact-item">
                <span>WhatsApp</span>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" aria-label="Open WhatsApp chat">
                  <WhatsAppLogo className="contact-whatsapp-logo" /> +91 7995088752
                </a>
              </div>
              <div className="contact-item">
                <span>Email</span>
                <a href="mailto:sribollineniinfradeveloper@gmail.com">sribollineniinfradeveloper@gmail.com</a>
              </div>
              <div className="contact-item">
                <span>Address</span>
                <strong>
                  402 KKR HEIGHTS, Kamakshmi Street, Mahathma Gandhi Inner Ring Road, Gorantla, GUNTUR PIN: 522034
                </strong>
              </div>
            </div>
          </div>

          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a
                href="https://www.facebook.com/SriBollineniOfficial"
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
              >
                <span className="social-icon facebook" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-2.9h2v-2.2c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2v1.5h2.3l-.4 2.9h-1.9v7A10 10 0 0 0 22 12Z"/>
                  </svg>
                </span>
                <span className="social-handle">@SriBollineniOfficial</span>
              </a>
              <a
                href="https://x.com/SriBollineni"
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
                title="X"
              >
                <span className="social-icon x" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M21.82 7.42c-.18.42-.57.7-1.1.82.5-.06.9.14 1.1.4-.37-.1-.77-.06-1.1.12a1.1 1.1 0 0 0-.45.64c-.1.4 0 .82.22 1.14L20 11.6l-.03.03-2.15 2.14-1.16 1.16c-.37.37-.85.57-1.35.57-.3 0-.6-.08-.86-.24l-.4-.24-3.78-2.25c-.47-.27-.64-.89-.38-1.37.27-.47.9-.64 1.37-.38l2.9 1.72 1.12-1.3-1.3 1.12 2.35-2.34c.23-.24.4-.53.46-.86L17.6 7.6c.16-.45.58-.7 1.05-.7h.01c.5 0 .92.29 1.1.82Z"/>
                  </svg>
                </span>
                <span className="social-handle">@SriBollineni</span>
              </a>
              <a
                href="https://www.instagram.com/sri.bollineni"
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
              >
                <span className="social-icon instagram" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
                    <path d="M16 11.37a4 4 0 1 1-4.9-4.9" />
                    <path d="M17.5 6.5h.01" />
                  </svg>
                </span>
                <span className="social-handle">@sri.bollineni</span>
              </a>
              <a
                href="https://www.linkedin.com/in/sri-bollineni"
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
              >
                <span className="social-icon linkedin" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M4.98 3.5a2.28 2.28 0 1 0 .02 0ZM2.5 8.5h5v13h-5ZM9.5 8.5h4.6v1.9h.1c.6-1.1 2.1-2.2 4.3-2.2 4.6 0 5.4 3 5.4 7v7.3h-5v-6.5c0-1.6 0-3.7-2.3-3.7-2.3 0-2.6 1.8-2.6 3.6v6.6h-5Z"/>
                  </svg>
                </span>
                <span className="social-handle">/in/sri-bollineni</span>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} SRI BOLLINENI. All rights reserved.</p>
          <VisitorCounter />
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
