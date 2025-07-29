
const getEvents = async (req, res) => {
  try {
    const userId = req.user.userId;
    const db = req.app.locals.db;

    const events = await db.query(
      'SELECT * FROM events WHERE user_id = $1 ORDER BY start_time ASC',
      [userId]
    );

    res.json(events.rows);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createEvent = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, description, start, location, attendees, category } = req.body;
    const db = req.app.locals.db;

    const newEvent = await db.query(
      'INSERT INTO events (user_id, title, description, start_time, location, attendees, category) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [userId, title, description, start, location, JSON.stringify(attendees || []), category || 'work']
    );

    res.status(201).json(newEvent.rows[0]);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateEvent = async (req, res) => {
  try {
    const userId = req.user.userId;
    const eventId = req.params.id;
    const { title, description, start, location, attendees, category } = req.body;
    const db = req.app.locals.db;

    const updatedEvent = await db.query(
      'UPDATE events SET title = $1, description = $2, start_time = $3, location = $4, attendees = $5, category = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 AND user_id = $8 RETURNING *',
      [title, description, start, location, JSON.stringify(attendees || []), category, eventId, userId]
    );

    if (updatedEvent.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(updatedEvent.rows[0]);
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const userId = req.user.userId;
    const eventId = req.params.id;
    const db = req.app.locals.db;

    const deletedEvent = await db.query(
      'DELETE FROM events WHERE id = $1 AND user_id = $2 RETURNING *',
      [eventId, userId]
    );

    if (deletedEvent.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getEvents, createEvent, updateEvent, deleteEvent };
