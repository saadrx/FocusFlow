
const getNotes = async (req, res) => {
  try {
    const userId = req.user.userId;
    const db = req.app.locals.db;

    const notes = await db.query(
      'SELECT * FROM notes WHERE user_id = $1 ORDER BY updated_at DESC',
      [userId]
    );

    res.json(notes.rows);
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createNote = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, content, category, tags } = req.body;
    const db = req.app.locals.db;

    const newNote = await db.query(
      'INSERT INTO notes (user_id, title, content, category, tags) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, title, content, category || 'general', tags || []]
    );

    res.status(201).json(newNote.rows[0]);
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateNote = async (req, res) => {
  try {
    const userId = req.user.userId;
    const noteId = req.params.id;
    const { title, content, category, tags } = req.body;
    const db = req.app.locals.db;

    const updatedNote = await db.query(
      'UPDATE notes SET title = $1, content = $2, category = $3, tags = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 AND user_id = $6 RETURNING *',
      [title, content, category, tags, noteId, userId]
    );

    if (updatedNote.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(updatedNote.rows[0]);
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteNote = async (req, res) => {
  try {
    const userId = req.user.userId;
    const noteId = req.params.id;
    const db = req.app.locals.db;

    const deletedNote = await db.query(
      'DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING *',
      [noteId, userId]
    );

    if (deletedNote.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getNotes, createNote, updateNote, deleteNote };
