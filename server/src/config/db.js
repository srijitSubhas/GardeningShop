const mysql = require('mysql2/promise');
const dbConfig = require('./database');

const pool = mysql.createPool(dbConfig);

// Test connection on startup
pool.getConnection()
  .then((conn) => {
    console.log('✅ Connected to MySQL database');
    conn.release();
  })
  .catch((err) => {
    console.error('❌ MySQL connection error:', err.message);
  });

/**
 * Execute a SQL query with optional parameters
 * @param {string} sql - SQL query string
 * @param {Array} params - Query parameters
 * @returns {Promise<Array>} - Query results
 */
async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

module.exports = { pool, query };
