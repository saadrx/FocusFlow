
const getFiles = async (req, res) => {
  try {
    const userId = req.user.userId;
    const db = req.app.locals.db;

    const files = await db.query(
      'SELECT * FROM files WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json(files.rows);
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const uploadFile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, type, size, content, category } = req.body;
    const db = req.app.locals.db;

    const newFile = await db.query(
      'INSERT INTO files (user_id, name, type, size, content, category) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [userId, name, type, size, content, category || 'general']
    );

    res.status(201).json(newFile.rows[0]);
  } catch (error) {
    console.error('Upload file error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getFile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const fileId = req.params.id;
    const db = req.app.locals.db;

    const file = await db.query(
      'SELECT * FROM files WHERE id = $1 AND user_id = $2',
      [fileId, userId]
    );

    if (file.rows.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json(file.rows[0]);
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteFile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const fileId = req.params.id;
    const db = req.app.locals.db;

    const deletedFile = await db.query(
      'DELETE FROM files WHERE id = $1 AND user_id = $2 RETURNING *',
      [fileId, userId]
    );

    if (deletedFile.rows.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getFiles, uploadFile, getFile, deleteFile };
