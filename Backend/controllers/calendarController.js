
const getEvents = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { start_date, end_date } = req.query;
    const db = req.app.locals.db;

    let query = 'SELECT * FROM calendar_events WHERE user_id = $1';
    let params = [userId];

    if (start_date && end_date) {
      query += ' AND start_time >= $2 AND end_time <= $3';
      params.push(start_date, end_date);
    }

    query += ' ORDER BY start_time ASC';

    const events = await db.query(query, params);

    res.json(events.rows);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createEvent = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, description, start_time, end_time, location, category } = req.body;
    const db = req.app.locals.db;

    const newEvent = await db.query(
      'INSERT INTO calendar_events (user_id, title, description, start_time, end_time, location, category) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [userId, title, description, start_time, end_time, location, category || 'general']
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
    const { title, description, start_time, end_time, location, category } = req.body;
    const db = req.app.locals.db;

    const updatedEvent = await db.query(
      'UPDATE calendar_events SET title = $1, description = $2, start_time = $3, end_time = $4, location = $5, category = $6 WHERE id = $7 AND user_id = $8 RETURNING *',
      [title, description, start_time, end_time, location, category, eventId, userId]
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
      'DELETE FROM calendar_events WHERE id = $1 AND user_id = $2 RETURNING *',
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
