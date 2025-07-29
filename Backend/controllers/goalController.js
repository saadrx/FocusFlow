
const getGoals = async (req, res) => {
  try {
    const userId = req.user.userId;
    const db = req.app.locals.db;

    const goals = await db.query(
      'SELECT * FROM goals WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json(goals.rows);
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createGoal = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, description, target_value, current_value, deadline, category } = req.body;
    const db = req.app.locals.db;

    const newGoal = await db.query(
      'INSERT INTO goals (user_id, title, description, target_value, current_value, deadline, category) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [userId, title, description, target_value || 100, current_value || 0, deadline, category || 'personal']
    );

    res.status(201).json(newGoal.rows[0]);
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateGoal = async (req, res) => {
  try {
    const userId = req.user.userId;
    const goalId = req.params.id;
    const { title, description, target_value, current_value, deadline, category, completed } = req.body;
    const db = req.app.locals.db;

    const updatedGoal = await db.query(
      'UPDATE goals SET title = $1, description = $2, target_value = $3, current_value = $4, deadline = $5, category = $6, completed = $7 WHERE id = $8 AND user_id = $9 RETURNING *',
      [title, description, target_value, current_value, deadline, category, completed, goalId, userId]
    );

    if (updatedGoal.rows.length === 0) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.json(updatedGoal.rows[0]);
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteGoal = async (req, res) => {
  try {
    const userId = req.user.userId;
    const goalId = req.params.id;
    const db = req.app.locals.db;

    const deletedGoal = await db.query(
      'DELETE FROM goals WHERE id = $1 AND user_id = $2 RETURNING *',
      [goalId, userId]
    );

    if (deletedGoal.rows.length === 0) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getGoals, createGoal, updateGoal, deleteGoal };
