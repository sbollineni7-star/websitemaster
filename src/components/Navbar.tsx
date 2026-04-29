import { useState } from 'react'
import logo from '../assets/Logo.png'
import { supabase } from '../supabaseClient'
import '../styles/Navbar.css'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <a href="/" aria-label="Go to home page">
            <img src={logo} alt="SRI BOLLINENI logo" className="navbar-logo" />
          </a>
        </div>

        <button
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <a href="/" className="nav-link">
            Home
          </a>
          <a href="/#projects" className="nav-link">
            Projects
          </a>
          <a href="/about" className="nav-link">
            About Us
          </a>
          <a href="tel:+917995088752" className="nav-link nav-call">
            Call Now
          </a>
          <div className="nav-auth">
            {user.email ? (
              <>
                <button onClick={handleLogout} className="nav-link logout">
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="/login" className="nav-link">
                  Login
                </a>
                <a href="/register" className="nav-link btn-register">
                  Register
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
