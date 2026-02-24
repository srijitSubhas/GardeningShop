const { query } = require('../config/db');

/**
 * Plant Model - handles all DB operations for the plants table
 */
const Plant = {
  /**
   * Get all plants ordered by name
   */
  getAll: async () => {
    return await query('SELECT * FROM plants ORDER BY name ASC');
  },

  /**
   * Get a single plant by ID
   */
  getById: async (id) => {
    const rows = await query('SELECT * FROM plants WHERE id = ?', [id]);
    return rows[0] || null;
  },
};

module.exports = Plant;
