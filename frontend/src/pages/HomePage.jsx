/**
 * Home Page Component
 * Gallery creation form
 */

import { useState } from 'react'
import { createGallery } from '../services/api'
import './HomePage.css'

function HomePage() {
  const [title, setTitle] = useState('')
  const [driveLink, setDriveLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState(false)

  // Validate Google Drive link
  const isValidDriveLink = (link) => {
    const patterns = [
      /drive\.google\.com\/drive\/folders\//,
      /drive\.google\.com\/drive\/u\/\d+\/folders\//,
      /drive\.google\.com\/open\?id=/
    ]
    return patterns.some(pattern => pattern.test(link))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setResult(null)

    // Validation
    if (!title.trim()) {
      setError('נא להזין שם לגלריה')
      return
    }

    if (!driveLink.trim()) {
      setError('נא להזין קישור לתיקיית Google Drive')
      return
    }

    if (!isValidDriveLink(driveLink)) {
      setError('נא להזין קישור תקין לתיקיית Google Drive')
      return
    }

    setLoading(true)

    try {
      const data = await createGallery(title, driveLink)
      setResult(data)
      // Clear form
      setTitle('')
      setDriveLink('')
    } catch (err) {
      setError(err.message || 'יצירת הגלריה נכשלה. נסה שוב.')
    } finally {
      setLoading(false)
    }
  }

  // Copy link to clipboard
  const handleCopyLink = async () => {
    if (result?.url) {
      try {
        await navigator.clipboard.writeText(result.url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }

  return (
    <div className="home-page">
      <div className="container">
        <div className="hero-section fade-in">
          <h1>צור גלריות מרהיבות</h1>
          <p className="hero-subtitle">
            שתף את הרגעים היקרים שלך עם גלריות תמונות מדהימות.
            פשוט הדבק קישור ל-Google Drive וקבל דף שיתוף יפהפה.
          </p>
        </div>

        <div className="form-card fade-in-up">
          <form onSubmit={handleSubmit} className="gallery-form">
            <div className="form-group">
              <label htmlFor="title" className="form-label">שם הגלריה</label>
              <input
                type="text"
                id="title"
                className="input"
                placeholder="לדוגמה: החתונה של שרה ויוחנן"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="driveLink" className="form-label">קישור לתיקיית Google Drive</label>
              <input
                type="url"
                id="driveLink"
                className="input"
                placeholder="https://drive.google.com/drive/folders/..."
                value={driveLink}
                onChange={(e) => setDriveLink(e.target.value)}
                disabled={loading}
              />
              <p className="form-hint">
                וודא שהתיקייה משותפת כציבורית או "כל מי שיש לו את הקישור יכול לצפות"
              </p>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="btn-spinner"></span>
                  יוצר...
                </>
              ) : (
                <>
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  צור גלריה
                </>
              )}
            </button>
          </form>

          {result && (
            <div className="result-section fade-in">
              <div className="result-card">
                <div className="result-icon">
                  <svg 
                    width="32" 
                    height="32" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <h3>הגלריה נוצרה בהצלחה!</h3>
                <p>הגלריה "{result.title}" מוכנה לשיתוף.</p>
                
                <div className="link-box">
                  <input 
                    type="text" 
                    className="input link-input" 
                    value={result.url} 
                    readOnly 
                  />
                  <button 
                    className="btn btn-secondary copy-btn"
                    onClick={handleCopyLink}
                  >
                    {copied ? (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        הועתק!
                      </>
                    ) : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                        העתק קישור
                      </>
                    )}
                  </button>
                </div>

                <a 
                  href={result.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-primary view-btn"
                >
                  צפה בגלריה
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="features-section fade-in-up">
          <div className="feature">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
            <h3>גלריות מרהיבות</h3>
            <p>עיצוב רספונסיבי מדהים שגורם לתמונות שלך לזרוח</p>
          </div>
          <div className="feature">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3"/>
                <circle cx="6" cy="12" r="3"/>
                <circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
            </div>
            <h3>שיתוף קל</h3>
            <p>קישור אחד לשתף את כל התמונות עם הלקוחות</p>
          </div>
          <div className="feature">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </div>
            <h3>מוכן להורדה</h3>
            <p>לקוחות יכולים להוריד בקלות את התמונות האהובות עליהם</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
