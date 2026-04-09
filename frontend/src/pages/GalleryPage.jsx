/**
 * Gallery Page Component
 * Displays images from a gallery
 */

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { decodeGalleryData, getGalleryImages } from '../services/api'
import ImageModal from '../components/ImageModal'
import './GalleryPage.css'

function GalleryPage() {
  const { slug } = useParams()
  const [gallery, setGallery] = useState(null)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)

  // Fetch gallery data and images
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError('')

        // Decode gallery info from URL
        const galleryData = decodeGalleryData(slug)
        if (!galleryData || !galleryData.folderId) {
          throw new Error('קישור לגלריה לא תקין')
        }
        setGallery(galleryData)

        // Fetch images from Google Drive
        const imagesData = await getGalleryImages(galleryData.folderId)
        setImages(imagesData.images || [])
      } catch (err) {
        setError(err.message || 'טעינת הגלריה נכשלה')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [slug])

  // Handle image click - open modal
  const handleImageClick = (image, index) => {
    setSelectedImage({ ...image, index })
  }

  // Close modal
  const handleCloseModal = () => {
    setSelectedImage(null)
  }

  // Navigate to previous/next image in modal
  const handleNavigate = (direction) => {
    if (!selectedImage) return

    const currentIndex = selectedImage.index
    let newIndex

    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1
    } else {
      newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0
    }

    setSelectedImage({ ...images[newIndex], index: newIndex })
  }

  // Loading state
  if (loading) {
    return (
      <div className="gallery-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>טוען גלריה...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="gallery-page">
        <div className="container">
          <div className="error-container fade-in">
            <div className="error-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            <h2>הגלריה לא נמצאה</h2>
            <p>{error}</p>
            <a href="/" className="btn btn-primary">חזרה לדף הבית</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="gallery-page">
      <div className="container">
        {/* Gallery Header - only show if there are images */}
        {images.length > 0 && (
          <div className="gallery-header fade-in">
            <h1>{gallery?.title}</h1>
            <p className="gallery-info">
              {images.length} {images.length === 1 ? 'תמונה' : 'תמונות'}
            </p>
          </div>
        )}

        {/* Image Grid */}
        {images.length > 0 ? (
          <div className="image-grid">
            {images.map((image, index) => (
              <div 
                key={image.id} 
                className="image-card fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => handleImageClick(image, index)}
              >
                <div className="image-wrapper">
                  <img 
                    src={image.thumbnail} 
                    alt={image.name}
                    loading="lazy"
                  />
                  <div className="image-overlay">
                    <button className="overlay-btn">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        <line x1="11" y1="8" x2="11" y2="14"/>
                        <line x1="8" y1="11" x2="14" y2="11"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-gallery fade-in">
            <h3>הקישור לא זמין במערכת</h3>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={handleCloseModal}
          onPrev={() => handleNavigate('prev')}
          onNext={() => handleNavigate('next')}
          currentIndex={selectedImage.index}
          totalImages={images.length}
        />
      )}
    </div>
  )
}

export default GalleryPage
