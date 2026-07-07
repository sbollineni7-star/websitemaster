import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import logo from '../assets/Logo.png'
import { supabase } from '../supabaseClient'
import { phoneHref } from '../contact'
import '../styles/Navbar.css'

type ClockPosition = {
  x: number
  y: number
}

const CLOCK_POSITION_STORAGE_KEY = 'navbarClockPosition'
const CLOCK_MARGIN = 12
const CLOCK_DEFAULT_WIDTH = 320
const CLOCK_DEFAULT_HEIGHT = 48

const getInitialClockPosition = (): ClockPosition => {
  const defaultPosition = {
    x: Math.max(window.innerWidth - CLOCK_DEFAULT_WIDTH - 20, CLOCK_MARGIN),
    y: Math.max(window.innerHeight - CLOCK_DEFAULT_HEIGHT - 20, CLOCK_MARGIN),
  }

  try {
    const savedPosition = window.localStorage.getItem(CLOCK_POSITION_STORAGE_KEY)

    if (!savedPosition) {
      return defaultPosition
    }

    const parsedPosition = JSON.parse(savedPosition) as Partial<ClockPosition>

    if (typeof parsedPosition.x === 'number' && typeof parsedPosition.y === 'number') {
      return parsedPosition as ClockPosition
    }
  } catch {
    return defaultPosition
  }

  return defaultPosition
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [clockPosition, setClockPosition] = useState<ClockPosition>(() => getInitialClockPosition())
  const [isClockDragging, setIsClockDragging] = useState(false)
  const clockRef = useRef<HTMLDivElement>(null)
  const dragOffsetRef = useRef<ClockPosition>({ x: 0, y: 0 })
  const latestClockPositionRef = useRef<ClockPosition>(clockPosition)
  const isClockDraggingRef = useRef(false)
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const clampClockPosition = useCallback((position: ClockPosition) => {
    const clockWidth = clockRef.current?.offsetWidth ?? CLOCK_DEFAULT_WIDTH
    const clockHeight = clockRef.current?.offsetHeight ?? CLOCK_DEFAULT_HEIGHT
    const maxX = Math.max(CLOCK_MARGIN, window.innerWidth - clockWidth - CLOCK_MARGIN)
    const maxY = Math.max(CLOCK_MARGIN, window.innerHeight - clockHeight - CLOCK_MARGIN)

    return {
      x: Math.min(Math.max(position.x, CLOCK_MARGIN), maxX),
      y: Math.min(Math.max(position.y, CLOCK_MARGIN), maxY),
    }
  }, [])

  const updateClockPosition = useCallback((position: ClockPosition) => {
    const nextPosition = clampClockPosition(position)
    latestClockPositionRef.current = nextPosition
    setClockPosition(nextPosition)
    return nextPosition
  }, [clampClockPosition])

  const saveClockPosition = useCallback((position: ClockPosition) => {
    window.localStorage.setItem(CLOCK_POSITION_STORAGE_KEY, JSON.stringify(position))
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentDate(new Date())
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    updateClockPosition(latestClockPositionRef.current)

    const handleResize = () => {
      const nextPosition = updateClockPosition(latestClockPositionRef.current)
      saveClockPosition(nextPosition)
    }

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [saveClockPosition, updateClockPosition])

  const formattedDate = currentDate.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const formattedTime = currentDate.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  })

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  const handleClockPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return
    }

    const clockBounds = event.currentTarget.getBoundingClientRect()
    dragOffsetRef.current = {
      x: event.clientX - clockBounds.left,
      y: event.clientY - clockBounds.top,
    }
    isClockDraggingRef.current = true
    setIsClockDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handleClockPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isClockDraggingRef.current) {
      return
    }

    updateClockPosition({
      x: event.clientX - dragOffsetRef.current.x,
      y: event.clientY - dragOffsetRef.current.y,
    })
  }

  const handleClockPointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (!isClockDraggingRef.current) {
      return
    }

    isClockDraggingRef.current = false
    setIsClockDragging(false)
    saveClockPosition(latestClockPositionRef.current)

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const handleClockKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 30 : 10
    const keyMovement: Record<string, ClockPosition> = {
      ArrowUp: { x: 0, y: -step },
      ArrowDown: { x: 0, y: step },
      ArrowLeft: { x: -step, y: 0 },
      ArrowRight: { x: step, y: 0 },
    }
    const movement = keyMovement[event.key]

    if (!movement) {
      return
    }

    event.preventDefault()
    const nextPosition = updateClockPosition({
      x: latestClockPositionRef.current.x + movement.x,
      y: latestClockPositionRef.current.y + movement.y,
    })
    saveClockPosition(nextPosition)
  }

  return (
    <nav className="navbar">
      <div
        ref={clockRef}
        className={`navbar-time-widget ${isClockDragging ? 'dragging' : ''}`}
        style={{ transform: `translate3d(${clockPosition.x}px, ${clockPosition.y}px, 0)` }}
        tabIndex={0}
        title="Drag to move"
        aria-label="Current date and time. Drag to move."
        onPointerDown={handleClockPointerDown}
        onPointerMove={handleClockPointerMove}
        onPointerUp={handleClockPointerEnd}
        onPointerCancel={handleClockPointerEnd}
        onKeyDown={handleClockKeyDown}
      >
        <span className="navbar-time-grip" aria-hidden="true"></span>
        <time className="navbar-time" dateTime={currentDate.toISOString()}>
          {formattedDate} | {formattedTime}
        </time>
      </div>
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
          <a href="/jobhunt" className="nav-link">
            JobHunt
          </a>
          <a href={phoneHref} className="nav-link nav-call">
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
