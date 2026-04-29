import logo from '../assets/Logo.png'
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
                <strong>Srinivas Bollineni</strong>
              </div>
              <div className="contact-item">
                <span>Phone</span>
                <a href="tel:+917995088752">+91 7995088752</a>
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
              <a href="#" className="social-link" title="Facebook">
                <span className="social-icon">f</span>
              </a>
              <a href="#" className="social-link" title="X">
                <span className="social-icon">X</span>
              </a>
              <a href="#" className="social-link" title="Instagram">
                <span className="social-icon">IG</span>
              </a>
              <a href="#" className="social-link" title="LinkedIn">
                <span className="social-icon">in</span>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} SRI BOLLINENI. All rights reserved.</p>
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
