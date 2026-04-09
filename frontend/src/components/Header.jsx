/**
 * Header Component
 * Sticky header with Daniel's Photo branding
 */

import { Link } from 'react-router-dom'
import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo">
          <svg 
            className="logo-icon"
            xmlns="http://www.w3.org/2000/svg" 
            width="28" 
            height="28" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          <span className="logo-text">Daniel's Photo</span>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">צור גלריה</Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
