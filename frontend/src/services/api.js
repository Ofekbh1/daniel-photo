/**
 * API Service
 * Handles all API calls to the backend
 */

const API_BASE_URL = '/api'

/**
 * Create a new gallery
 * @param {string} title - Gallery title
 * @param {string} driveLink - Google Drive folder link
 * @returns {Promise<Object>} Created gallery data
 */
export const createGallery = async (title, driveLink) => {
  const response = await fetch(`${API_BASE_URL}/galleries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title, driveLink })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'יצירת הגלריה נכשלה')
  }

  return data
}

/**
 * Decode gallery data from URL slug
 * @param {string} slug - Encoded gallery data
 * @returns {Object} Gallery data (title, folderId)
 */
export const decodeGalleryData = (slug) => {
  try {
    // Convert base64url to base64
    const base64 = slug.replace(/-/g, '+').replace(/_/g, '/')
    // Decode base64 to bytes, then to UTF-8 string
    const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0))
    const decoded = new TextDecoder('utf-8').decode(bytes)
    return JSON.parse(decoded)
  } catch (e) {
    console.error('Decode error:', e)
    return null
  }
}

/**
 * Get gallery images
 * @param {string} folderId - Google Drive folder ID
 * @returns {Promise<Object>} Images array
 */
export const getGalleryImages = async (folderId) => {
  const response = await fetch(`${API_BASE_URL}/galleries/${folderId}/images`)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'טעינת התמונות נכשלה')
  }

  return data
}
