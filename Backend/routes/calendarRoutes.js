const express = require('express');
const router = express.Router();

// Temporary route handlers until controllers are implemented
router.get('/', (req, res) => {
  res.json([]);
});

router.post('/', (req, res) => {
  res.json({ message: 'Event created successfully' });
});

router.put('/:id', (req, res) => {
  res.json({ message: 'Event updated successfully' });
});

router.delete('/:id', (req, res) => {
  res.json({ message: 'Event deleted successfully' });
});

module.exports = router;