/**
 * Gallery Controller
 * Handles request/response logic for gallery operations
 * No database - uses URL encoding for gallery data
 */

const driveService = require('../services/driveService');

/**
 * Create a new gallery link
 * POST /api/galleries
 */
const createGallery = async (req, res, next) => {
  try {
    const { title, driveLink } = req.body;

    // Validation
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'נא להזין שם לגלריה' });
    }

    if (!driveLink || !driveLink.trim()) {
      return res.status(400).json({ error: 'נא להזין קישור לתיקיית Google Drive' });
    }

    // Extract folder ID from drive link
    const folderId = driveService.extractFolderId(driveLink);
    if (!folderId) {
      return res.status(400).json({ error: 'קישור Google Drive לא תקין' });
    }

    // Verify access to the folder using server API key
    try {
      await driveService.getImagesFromFolder(folderId);
    } catch (err) {
      return res.status(400).json({ error: err.message || 'לא ניתן לגשת לתיקייה. בדוק שהתיקייה משותפת ציבורית' });
    }

    // Create encoded gallery data for URL (title + folderId)
    const galleryData = Buffer.from(JSON.stringify({
      title: title.trim(),
      folderId: folderId
    })).toString('base64url');

    // Return the gallery URL
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.status(201).json({
      slug: galleryData,
      url: `${baseUrl}/gallery/${galleryData}`,
      title: title.trim()
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get gallery images from Google Drive
 * GET /api/galleries/:folderId/images
 */
const getGalleryImages = async (req, res, next) => {
  try {
    const { folderId } = req.params;

    // Fetch images from Google Drive using server API key
    const images = await driveService.getImagesFromFolder(folderId);

    res.json({ images });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGallery,
  getGalleryImages
};
