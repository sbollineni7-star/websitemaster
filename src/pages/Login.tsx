import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/Logo.png'
import { supabase } from '../supabaseClient'
import '../styles/Auth.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email')
      return
    }

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      localStorage.setItem('token', data.session?.access_token || '')
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          firstName: data.user.user_metadata?.firstName,
          lastName: data.user.user_metadata?.lastName,
          loginTime: new Date(),
        }),
      )
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to login')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-brand">
          <img src={logo} alt="SRI BOLLINENI logo" className="auth-logo" />
        </div>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              placeholder="Enter your password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-primary">
            Login
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  )
}
