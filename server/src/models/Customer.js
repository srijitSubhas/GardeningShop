const { query } = require('../config/db');
const bcrypt = require('bcryptjs');

/**
 * Customer Model - handles all DB operations for the users table
 */
const Customer = {
  /**
   * Create a new user account
   */
  create: async (name, email, password, phone = null) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query(
      'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, phone]
    );
    return result;
  },

  /**
   * Find a user by email
   */
  findByEmail: async (email) => {
    const rows = await query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },

  /**
   * Find a user by ID (without password)
   */
  findById: async (id) => {
    const rows = await query(
      'SELECT id, name, email, phone FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  /**
   * Verify a plain password against the stored hash
   */
  verifyPassword: async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },
};

module.exports = Customer;
