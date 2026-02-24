const { query } = require('../config/db');

/**
 * Generate a unique order ID
 */
function generateOrderId() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomPart = Math.random().toString(36).substring(2, 9).toUpperCase();
  return `ORD-${timestamp}-${randomPart}`;
}

/**
 * Order Model - handles all DB operations for the orders table
 */
const Order = {
  /**
   * Create a single order item
   */
  create: async (userId, plantId, quantity, customerName, customerEmail, address, phone) => {
    const orderId = generateOrderId();
    await query(
      `INSERT INTO orders 
        (order_id, user_id, plant_id, quantity, customer_name, customer_email, address, phone, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [orderId, userId, plantId, quantity, customerName, customerEmail, address, phone]
    );
    return orderId;
  },

  /**
   * Get all orders for a specific user with plant info
   */
  getByUser: async (userId) => {
    return await query(
      `SELECT 
        o.order_id,
        o.user_id,
        o.plant_id,
        o.quantity,
        o.customer_name,
        o.customer_email,
        o.address,
        o.phone,
        o.status,
        o.order_date,
        p.name AS plant_name
      FROM orders o
      LEFT JOIN plants p ON o.plant_id = p.id
      WHERE o.user_id = ?
      ORDER BY o.order_date DESC`,
      [userId]
    );
  },

  /**
   * Search orders by order_id for a specific user
   */
  searchByOrderId: async (userId, orderId) => {
    return await query(
      `SELECT 
        o.order_id,
        o.user_id,
        o.plant_id,
        o.quantity,
        o.customer_name,
        o.customer_email,
        o.address,
        o.phone,
        o.status,
        o.order_date,
        p.name AS plant_name
      FROM orders o
      LEFT JOIN plants p ON o.plant_id = p.id
      WHERE o.user_id = ? AND o.order_id = ?
      ORDER BY o.order_date DESC`,
      [userId, orderId]
    );
  },

  /**
   * Update the status of an order
   */
  updateStatus: async (orderId, status) => {
    return await query(
      'UPDATE orders SET status = ? WHERE order_id = ?',
      [status, orderId]
    );
  },
};

module.exports = { Order, generateOrderId };
