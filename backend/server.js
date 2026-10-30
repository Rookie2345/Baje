require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
const chatRoutes = require('./routes/chat');
app.use('/api', chatRoutes);

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'BAJE AI',
    tagline: 'बाजेसँग गफ गरौँ!',
    aiConfigured: !!(process.env.AI_API_KEY && process.env.AI_PROVIDER),
    aiProvider: process.env.AI_PROVIDER || 'none (local engine active)',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()) + 's'
  });
});

// Catch-all: serve index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('🇳🇵 ===================================');
  console.log('   BAJE AI — बाजेसँग गफ गरौँ!');
  console.log(`   Running on: http://localhost:${PORT}`);
  console.log(`   AI Provider: ${process.env.AI_PROVIDER || 'Local Engine'}`);
  console.log('🇳🇵 ===================================');
  console.log('');
});

module.exports = app;
