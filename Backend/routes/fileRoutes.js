const express = require('express');
const router = express.Router();

// Temporary route handlers until controllers are implemented
router.get('/', (req, res) => {
  res.json([]);
});

router.get('/recent', (req, res) => {
  res.json([]);
});

router.post('/upload', (req, res) => {
  res.json({ message: 'File uploaded successfully' });
});

router.delete('/:id', (req, res) => {
  res.json({ message: 'File deleted successfully' });
});

module.exports = router;