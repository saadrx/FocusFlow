
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/dashboard', analyticsController.getDashboardStats);
router.get('/tasks', analyticsController.getTaskAnalytics);
router.get('/goals', analyticsController.getGoalAnalytics);
router.get('/habits', analyticsController.getHabitAnalytics);

module.exports = router;
