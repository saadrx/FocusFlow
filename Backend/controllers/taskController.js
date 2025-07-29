
const getTasks = async (req, res) => {
  try {
    const userId = req.user.userId;
    const db = req.app.locals.db;

    const tasks = await db.query(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json(tasks.rows);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createTask = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, description, due_date, priority } = req.body;
    const db = req.app.locals.db;

    const newTask = await db.query(
      'INSERT INTO tasks (user_id, title, description, due_date, priority) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, title, description, due_date, priority || 'medium']
    );

    res.status(201).json(newTask.rows[0]);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateTask = async (req, res) => {
  try {
    const userId = req.user.userId;
    const taskId = req.params.id;
    const { title, description, due_date, priority, completed } = req.body;
    const db = req.app.locals.db;

    const updatedTask = await db.query(
      'UPDATE tasks SET title = $1, description = $2, due_date = $3, priority = $4, completed = $5 WHERE id = $6 AND user_id = $7 RETURNING *',
      [title, description, due_date, priority, completed, taskId, userId]
    );

    if (updatedTask.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(updatedTask.rows[0]);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const userId = req.user.userId;
    const taskId = req.params.id;
    const db = req.app.locals.db;

    const deletedTask = await db.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *',
      [taskId, userId]
    );

    if (deletedTask.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
