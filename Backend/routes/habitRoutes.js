
const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habitController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', habitController.getHabits);
router.post('/', habitController.createHabit);
router.put('/:id', habitController.updateHabit);
router.delete('/:id', habitController.deleteHabit);
router.post('/:id/track', habitController.trackHabit);

module.exports = router;
