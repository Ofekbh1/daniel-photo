/**
 * Image Routes
 * Proxy for Google Drive images
 */

const express = require('express');
const router = express.Router();

/**
 * GET /api/image/:fileId
 * Proxy to fetch images from Google Drive
 */
router.get('/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    const { download } = req.query;
    
    // Google Drive direct image URL
    const imageUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
    
    // Fetch the image from Google Drive
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      redirect: 'follow'
    });

    if (!response.ok) {
      return res.status(404).send('Image not found');
    }

    // Get content type
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    // Set headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    
    if (download === 'true') {
      res.setHeader('Content-Disposition', `attachment; filename="image-${fileId}.jpg"`);
    }

    // Stream the image to the response
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
    
  } catch (error) {
    console.error('Image proxy error:', error.message);
    res.status(500).send('Failed to load image');
  }
});

module.exports = router;
