/**
 * Gallery Routes
 * Handles all gallery-related API endpoints
 */

const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');

// POST /api/galleries - Create gallery link (returns encoded URL)
router.post('/', galleryController.createGallery);

// GET /api/galleries/:folderId/images - Get images from Google Drive folder
router.get('/:folderId/images', galleryController.getGalleryImages);

module.exports = router;
