const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;

// Security and performance middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for React inline styles
}));
app.use(compression());
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API endpoint to save grading data (optional - for server-side storage)
app.post('/api/save-grades', (req, res) => {
  const { groupName, grades, comments } = req.body;
  
  // In a real application, you'd save to a database here
  console.log(`Saving grades for group: ${groupName}`);
  console.log('Grades:', grades);
  console.log('Comments:', comments);
  
  res.json({ 
    success: true, 
    message: 'Grades saved successfully',
    groupName 
  });
});

// Serve the React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Demo Grading App running on port ${PORT}`);
  console.log(`📊 Access the app at: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;