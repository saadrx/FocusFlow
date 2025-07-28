
const express = require('express');
const router = express.Router();
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/calendarController');
const { authenticateToken } = require('../middleware/auth');

// All calendar routes require authentication
router.use(authenticateToken);

router.get('/', getEvents);
router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

module.exports = router;
