/**
 * Slug Generator Utility
 * Generates URL-friendly slugs from titles
 */

const { v4: uuidv4 } = require('uuid');

/**
 * Generate a URL-friendly slug from a title
 * @param {string} title - The gallery title
 * @returns {string} URL-friendly slug
 */
const generateSlug = (title) => {
  // Convert to lowercase
  let slug = title.toLowerCase();

  // Replace Hebrew/special characters with transliteration or remove
  slug = slug
    // Remove special characters
    .replace(/[^\w\s-]/g, '')
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove multiple consecutive hyphens
    .replace(/-+/g, '-')
    // Trim hyphens from start and end
    .replace(/^-+|-+$/g, '');

  // If slug is empty or too short, use random string
  if (slug.length < 3) {
    slug = 'gallery';
  }

  // Add random suffix for uniqueness
  const randomSuffix = uuidv4().split('-')[0];
  slug = `${slug}-${randomSuffix}`;

  // Limit length
  return slug.substring(0, 50);
};

module.exports = {
  generateSlug
};
