
// Database connection available via req.app.locals.db
const bcrypt = require('bcryptjs');

const userController = {
  async getProfile(req, res) {
    try {
      const result = await req.app.locals.db.query(
        'SELECT id, username, email, first_name, last_name, created_at FROM users WHERE id = $1',
        [req.user.id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateProfile(req, res) {
    try {
      const { first_name, last_name, email } = req.body;
      const result = await req.app.locals.db.query(
        'UPDATE users SET first_name = $1, last_name = $2, email = $3 WHERE id = $4 RETURNING id, username, email, first_name, last_name',
        [first_name, last_name, email, req.user.id]
      );
      
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getSettings(req, res) {
    try {
      const result = await req.app.locals.db.query(
        'SELECT settings FROM user_settings WHERE user_id = $1',
        [req.user.id]
      );
      
      if (result.rows.length === 0) {
        // Return default settings
        return res.json({
          theme: 'light',
          notifications: true,
          email_notifications: true,
          language: 'en'
        });
      }
      
      res.json(result.rows[0].settings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateSettings(req, res) {
    try {
      const settings = req.body;
      const result = await req.app.locals.db.query(
        'INSERT INTO user_settings (user_id, settings) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET settings = $2 RETURNING settings',
        [req.user.id, JSON.stringify(settings)]
      );
      
      res.json(result.rows[0].settings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = userController;
