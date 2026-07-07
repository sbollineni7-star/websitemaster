import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import About from './pages/About'
import JobHuntOneAgent from './pages/JobHuntOneAgent'
import { whatsappHref } from './contact'
import WhatsAppLogo from './components/WhatsAppLogo'
import Chatbot from './components/Chatbot'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/jobhunt" element={<JobHuntOneAgent />} />
          <Route path="/jobhunt-one-agent" element={<JobHuntOneAgent />} />
        </Routes>
      </Router>
      <a
        href={whatsappHref}
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open chat with SRI BOLLINENI"
      >
        <WhatsAppLogo className="whatsapp-float-logo" />
      </a>
      <Chatbot />
    </>
  )
}

export default App
