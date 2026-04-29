import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import csr1Image from '../assets/csr1.png'
import '../styles/About.css'

export default function AboutSB() {
  return (
    <div className="about-page">
      <Navbar />
      <div className="about-container">
        <section className="about-hero">
          <img src={csr1Image} alt="" className="about-hero-image" />
        </section>

        <section className="about-content">
          <div className="about-section">
            <h2>Our Mission</h2>
            <p>
              We are dedicated to providing exceptional real estate services and helping our clients find their perfect
              property. Our team of experienced professionals works tirelessly to ensure every transaction is smooth and
              successful.
            </p>
          </div>

          <div className="about-section">
            <h2>Why Choose Us?</h2>
            <ul className="benefits-list">
              <li>5+ years of industry experience</li>
              <li>Extensive property portfolio across premium locations</li>
              <li>Expert negotiation and consultation services</li>
              <li>Customer-centric approach to service delivery</li>
              <li>Transparent pricing and ethical business practices</li>
              <li>Professional team of certified agents</li>
            </ul>
          </div>

          <div className="about-section">
            <h2>Our Team</h2>
            <p>
              Our team comprises highly qualified and experienced real estate professionals dedicated to delivering
              exceptional results. We believe in continuous learning and staying updated with market trends to serve you
              better.
            </p>
          </div>

          <div className="about-section">
            <h2>Contact Us</h2>
            <div className="contact-info">
              <p>
                <strong>Name:</strong> Srinivas Bollineni
              </p>
              <p>
                <strong>Phone:</strong> +91 7995088752
              </p>
              <p>
                <strong>Email:</strong> sribollineniinfradeveloper@gmail.com
              </p>
              <p>
                <strong>Address:</strong> 402 KKR HEIGHTS, Kamakshmi Street, Mahathma Gandhi Inner Ring Road, Gorantla, GUNTUR PIN: 522034
              </p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}
