/**
 * Vercel Serverless Function - Image Proxy
 * 
 * Proxies images from Google Drive to avoid CORS issues
 * 
 * Usage: GET /api/image?id=FILE_ID
 */

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, download } = req.query;

  // Validate file ID
  if (!id) {
    return res.status(400).json({ error: 'Missing required parameter: id' });
  }

  try {
    // Google Drive direct image URL
    const imageUrl = `https://drive.google.com/uc?export=view&id=${id}`;
    
    // Fetch the image from Google Drive
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      redirect: 'follow'
    });

    if (!response.ok) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Get content type
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    // Set headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400'); // Cache for 24 hours
    
    if (download === 'true') {
      res.setHeader('Content-Disposition', `attachment; filename="image-${id}.jpg"`);
    }

    // Stream the image to the response
    const buffer = await response.arrayBuffer();
    return res.send(Buffer.from(buffer));
    
  } catch (error) {
    console.error('Image proxy error:', error.message);
    return res.status(500).json({ error: 'Failed to load image' });
  }
}
