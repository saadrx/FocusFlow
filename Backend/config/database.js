
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'focusflow_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'focusflow',
  password: process.env.DB_PASSWORD || 'focusflow_password',
  port: process.env.DB_PORT || 5432,
});

// Test the connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

module.exports = pool;
