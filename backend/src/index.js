/**
 * Daniel Photo - Main Server Entry Point
 * Express server (no database needed)
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const galleryRoutes = require('./routes/galleryRoutes');
const imageRoutes = require('./routes/imageRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/galleries', galleryRoutes);
app.use('/api/image', imageRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Daniel Photo API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Daniel Photo server running on port ${PORT}`);
});
