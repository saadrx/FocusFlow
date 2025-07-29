
const pool = () => require('../server').locals.db;

const habitController = {
  async getHabits(req, res) {
    try {
      const result = await req.app.locals.db.query(
        'SELECT * FROM habits WHERE user_id = $1 ORDER BY created_at DESC',
        [req.user.id]
      );
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async createHabit(req, res) {
    try {
      const { name, description, frequency, target_count } = req.body;
      const result = await req.app.locals.db.query(
        'INSERT INTO habits (user_id, name, description, frequency, target_count) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [req.user.id, name, description, frequency, target_count]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateHabit(req, res) {
    try {
      const { id } = req.params;
      const { name, description, frequency, target_count } = req.body;
      const result = await req.app.locals.db.query(
        'UPDATE habits SET name = $1, description = $2, frequency = $3, target_count = $4 WHERE id = $5 AND user_id = $6 RETURNING *',
        [name, description, frequency, target_count, id, req.user.id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Habit not found' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteHabit(req, res) {
    try {
      const { id } = req.params;
      const result = await req.app.locals.db.query(
        'DELETE FROM habits WHERE id = $1 AND user_id = $2 RETURNING *',
        [id, req.user.id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Habit not found' });
      }
      
      res.json({ message: 'Habit deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async trackHabit(req, res) {
    try {
      const { id } = req.params;
      const { date, count } = req.body;
      
      const result = await req.app.locals.db.query(
        'INSERT INTO habit_tracking (habit_id, user_id, date, count) VALUES ($1, $2, $3, $4) ON CONFLICT (habit_id, date) DO UPDATE SET count = $4 RETURNING *',
        [id, req.user.id, date, count]
      );
      
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = habitController;
