/**
 * Vercel Serverless Function - Create Gallery
 * 
 * Creates an encoded gallery URL from title and drive link
 * 
 * Usage: POST /api/create-gallery
 * Body: { title, driveLink }
 */

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
    const folderId = extractFolderId(driveLink);
    if (!folderId) {
      return res.status(400).json({ error: 'קישור Google Drive לא תקין' });
    }

    // Verify access to the folder using API key
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Test folder access
    const query = encodeURIComponent(`'${folderId}' in parents and trashed=false`);
    const testUrl = `https://www.googleapis.com/drive/v3/files?q=${query}&key=${apiKey}&pageSize=1`;
    
    const testResponse = await fetch(testUrl);
    const testData = await testResponse.json();

    if (testData.error) {
      return res.status(400).json({ 
        error: 'לא ניתן לגשת לתיקייה. בדוק שהתיקייה משותפת ציבורית' 
      });
    }

    // Create encoded gallery data for URL
    const galleryData = Buffer.from(JSON.stringify({
      title: title.trim(),
      folderId: folderId
    })).toString('base64url');

    // Return the gallery URL
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:5173';
    
    return res.status(201).json({
      slug: galleryData,
      url: `${baseUrl}/gallery/${galleryData}`,
      title: title.trim()
    });

  } catch (error) {
    console.error('Create gallery error:', error.message);
    return res.status(500).json({ error: 'Failed to create gallery' });
  }
}

/**
 * Extract folder ID from Google Drive link
 */
function extractFolderId(link) {
  if (!link) return null;

  const patterns = [
    /\/folders\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/
  ];

  for (const pattern of patterns) {
    const match = link.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  // If the input is already just a folder ID
  if (/^[a-zA-Z0-9_-]+$/.test(link)) {
    return link;
  }

  return null;
}
