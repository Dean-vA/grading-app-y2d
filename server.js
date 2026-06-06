const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;

// Security and performance middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
app.use(compression());
app.use(cors());
app.use(express.json());

// Serve the built Vite app
const distDir = path.join(__dirname, 'dist');
app.use(express.static(distDir));

// Health check endpoint (used by the Docker/Cloud Run healthcheck)
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
  });
});

// Serve the SPA for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Demo Grading App running on port ${PORT}`);
  console.log(`📊 Access the app at: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
