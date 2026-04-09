/**
 * Gallery Service
 * Handles business logic for gallery operations
 */

const db = require('../config/database');
const { generateSlug } = require('../utils/slugGenerator');

/**
 * Create a new gallery
 * @param {string} title - Gallery title
 * @param {string} folderId - Google Drive folder ID
 * @returns {Object} Created gallery
 */
const createGallery = async (title, folderId) => {
  // Generate unique slug
  let slug = generateSlug(title);
  
  // Check if slug exists and make it unique
  let slugExists = true;
  let attempts = 0;
  while (slugExists && attempts < 10) {
    const existing = await db.query(
      'SELECT id FROM galleries WHERE slug = $1',
      [slug]
    );
    if (existing.rows.length === 0) {
      slugExists = false;
    } else {
      slug = generateSlug(title);
      attempts++;
    }
  }

  // Insert into database
  const result = await db.query(
    `INSERT INTO galleries (title, slug, drive_folder_id) 
     VALUES ($1, $2, $3) 
     RETURNING *`,
    [title, slug, folderId]
  );

  return result.rows[0];
};

/**
 * Get gallery by slug
 * @param {string} slug - Gallery slug
 * @returns {Object|null} Gallery data or null
 */
const getGalleryBySlug = async (slug) => {
  const result = await db.query(
    'SELECT * FROM galleries WHERE slug = $1',
    [slug]
  );
  return result.rows[0] || null;
};

module.exports = {
  createGallery,
  getGalleryBySlug
};
