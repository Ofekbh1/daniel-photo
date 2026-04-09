/**
 * Google Drive Service
 * Handles Google Drive API operations
 */

// Supported image MIME types
const IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif'
];

/**
 * Extract folder ID from Google Drive link
 * Supports various Google Drive URL formats
 * @param {string} link - Google Drive folder link
 * @returns {string|null} Folder ID or null
 */
const extractFolderId = (link) => {
  if (!link) return null;

  // Pattern 1: https://drive.google.com/drive/folders/FOLDER_ID
  // Pattern 2: https://drive.google.com/drive/folders/FOLDER_ID?usp=sharing
  // Pattern 3: https://drive.google.com/drive/u/0/folders/FOLDER_ID
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
};

/**
 * Get images from a Google Drive folder using server API key
 * @param {string} folderId - Google Drive folder ID
 * @returns {Array} List of image objects with URLs
 */
const getImagesFromFolder = async (folderId) => {
  const apiKey = process.env.GOOGLE_API_KEY;
  
  if (!apiKey) {
    throw new Error('API Key לא מוגדר בשרת');
  }

  try {
    // Build the Google Drive API URL
    const query = encodeURIComponent(`'${folderId}' in parents and trashed=false`);
    const fields = encodeURIComponent('files(id,name,mimeType)');
    const url = `https://www.googleapis.com/drive/v3/files?q=${query}&key=${apiKey}&fields=${fields}&pageSize=100`;

    // Fetch from Google Drive API
    const response = await fetch(url);
    const data = await response.json();

    // Handle API errors
    if (data.error) {
      console.error('Google Drive API error:', data.error);
      if (data.error.code === 404) {
        throw new Error('התיקייה לא נמצאה או לא נגישה');
      }
      if (data.error.code === 403) {
        throw new Error('גישה נדחתה. ודא שהתיקייה משותפת ציבורית וש-API Key תקין');
      }
      if (data.error.code === 400) {
        throw new Error('API Key לא תקין');
      }
      throw new Error(data.error.message || 'שגיאה בגישה ל-Google Drive');
    }

    // Filter only image files
    const files = data.files || [];
    const images = files
      .filter(file => file.mimeType && file.mimeType.startsWith('image/'))
      .map(file => ({
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        // Use proxy through our server for reliable loading
        url: `/api/image/${file.id}`,
        thumbnail: `/api/image/${file.id}`,
        // Download URL
        downloadUrl: `/api/image/${file.id}?download=true`
      }));

    return images;
  } catch (error) {
    console.error('Google Drive fetch error:', error.message);
    throw error;
  }
};

module.exports = {
  extractFolderId,
  getImagesFromFolder
};
