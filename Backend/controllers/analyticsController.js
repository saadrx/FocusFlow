
// Database connection available via req.app.locals.db

const analyticsController = {
  async getDashboardStats(req, res) {
    try {
      const userId = req.user.id;
      
      // Get basic counts
      const statsQuery = `
        SELECT 
          (SELECT COUNT(*) FROM tasks WHERE user_id = $1) as total_tasks,
          (SELECT COUNT(*) FROM tasks WHERE user_id = $1 AND completed = true) as completed_tasks,
          (SELECT COUNT(*) FROM goals WHERE user_id = $1) as total_goals,
          (SELECT COUNT(*) FROM goals WHERE user_id = $1 AND status = 'completed') as completed_goals,
          (SELECT COUNT(*) FROM notes WHERE user_id = $1) as total_notes,
          (SELECT COUNT(*) FROM habits WHERE user_id = $1) as total_habits
      `;
      
      const result = await req.app.locals.db.query(statsQuery, [userId]);
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getTaskAnalytics(req, res) {
    try {
      const userId = req.user.id;
      
      const taskAnalytics = await req.app.locals.db.query(`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as tasks_created,
          COUNT(CASE WHEN completed = true THEN 1 END) as tasks_completed
        FROM tasks 
        WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE(created_at)
        ORDER BY date DESC
      `, [userId]);
      
      res.json(taskAnalytics.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getGoalAnalytics(req, res) {
    try {
      const userId = req.user.id;
      
      const goalAnalytics = await req.app.locals.db.query(`
        SELECT 
          status,
          COUNT(*) as count
        FROM goals 
        WHERE user_id = $1
        GROUP BY status
      `, [userId]);
      
      res.json(goalAnalytics.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getHabitAnalytics(req, res) {
    try {
      const userId = req.user.id;
      
      const habitAnalytics = await req.app.locals.db.query(`
        SELECT 
          h.name,
          COUNT(ht.id) as tracking_entries,
          AVG(ht.count) as avg_count
        FROM habits h
        LEFT JOIN habit_tracking ht ON h.id = ht.habit_id
        WHERE h.user_id = $1
        GROUP BY h.id, h.name
      `, [userId]);
      
      res.json(habitAnalytics.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = analyticsController;
