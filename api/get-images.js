/**
 * Vercel Serverless Function - Get Images from Google Drive
 * 
 * Usage: GET /api/get-images?folderId=FOLDER_ID
 * 
 * Environment Variables Required:
 * - GOOGLE_API_KEY: Your Google Drive API key
 */

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { folderId } = req.query;

  // Validate folderId
  if (!folderId) {
    return res.status(400).json({ error: 'Missing required parameter: folderId' });
  }

  // Get API key from environment
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error('GOOGLE_API_KEY not configured');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // Build Google Drive API URL
    const query = encodeURIComponent(`'${folderId}' in parents and trashed=false`);
    const fields = encodeURIComponent('files(id,name,mimeType,thumbnailLink)');
    const url = `https://www.googleapis.com/drive/v3/files?q=${query}&key=${apiKey}&fields=${fields}&pageSize=100`;

    // Fetch from Google Drive API
    const response = await fetch(url);
    const data = await response.json();

    // Handle Google API errors
    if (data.error) {
      console.error('Google Drive API error:', data.error);
      
      if (data.error.code === 404) {
        return res.status(404).json({ error: 'Folder not found or not accessible' });
      }
      if (data.error.code === 403) {
        return res.status(403).json({ error: 'Access denied. Make sure the folder is shared publicly' });
      }
      if (data.error.code === 400) {
        return res.status(400).json({ error: 'Invalid API key' });
      }
      
      return res.status(500).json({ error: data.error.message || 'Google Drive API error' });
    }

    // Filter only image files and format response
    const files = data.files || [];
    const images = files
      .filter(file => file.mimeType && file.mimeType.startsWith('image/'))
      .map(file => ({
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        thumbnailLink: file.thumbnailLink || null
      }));

    // Set cache headers for better performance
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    
    return res.status(200).json({ images });

  } catch (error) {
    console.error('Server error:', error.message);
    return res.status(500).json({ error: 'Failed to fetch images from Google Drive' });
  }
}
