/**
 * Image Modal Component
 * Fullscreen image viewer with navigation and download
 */

import { useEffect, useCallback } from 'react'
import './ImageModal.css'

function ImageModal({ image, onClose, onPrev, onNext, currentIndex, totalImages }) {
  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    switch (e.key) {
      case 'Escape':
        onClose()
        break
      case 'ArrowLeft':
        onPrev()
        break
      case 'ArrowRight':
        onNext()
        break
      default:
        break
    }
  }, [onClose, onPrev, onNext])

  // Add/remove keyboard listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      onClose()
    }
  }

  // Handle download
  const handleDownload = () => {
    window.open(image.downloadUrl, '_blank')
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container">
        {/* Close button */}
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Navigation - Previous */}
        <button className="modal-nav modal-prev" onClick={onPrev} aria-label="Previous image">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        {/* Main image */}
        <div className="modal-image-container">
          <img 
            src={image.url} 
            alt={image.name}
            className="modal-image"
          />
        </div>

        {/* Navigation - Next */}
        <button className="modal-nav modal-next" onClick={onNext} aria-label="Next image">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>

        {/* Bottom bar */}
        <div className="modal-bottom-bar">
          <div className="modal-info">
            <span className="image-counter">{currentIndex + 1} / {totalImages}</span>
            <span className="image-name">{image.name}</span>
          </div>
          <button className="btn btn-secondary download-btn" onClick={handleDownload}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            הורדה
          </button>
        </div>
      </div>
    </div>
  )
}

export default ImageModal
