const { query } = require('../config/db');

/**
 * Cart Model - handles all DB operations for the carts table
 */
const Cart = {
  /**
   * Add an item to the cart
   */
  addItem: async (customer_id, plant_id, quantity) => {
    return await query(
      'INSERT INTO carts (customer_id, plant_id, quantity) VALUES (?, ?, ?)',
      [customer_id, plant_id, quantity]
    );
  },

  /**
   * Get all cart items for a specific customer with plant details
   */
  getByCustomer: async (customer_id) => {
    return await query(
      `SELECT 
        c.id,
        c.customer_id,
        c.plant_id,
        p.name AS plant_name,
        p.description,
        p.price,
        c.quantity,
        (p.price * c.quantity) AS total_price,
        c.created_at
      FROM carts c
      LEFT JOIN plants p ON p.id = c.plant_id
      WHERE c.customer_id = ?
      ORDER BY c.created_at DESC`,
      [customer_id]
    );
  },

  /**
   * Delete a single cart item by cart ID (only if it belongs to the user)
   */
  deleteItem: async (cartId, customer_id) => {
    return await query(
      'DELETE FROM carts WHERE id = ? AND customer_id = ?',
      [cartId, customer_id]
    );
  },

  /**
   * Clear all cart items for a customer
   */
  clearCart: async (customer_id) => {
    return await query('DELETE FROM carts WHERE customer_id = ?', [customer_id]);
  },
};

module.exports = Cart;
