const { Order } = require('../models/Order');

/**
 * Order Controller
 * Handles order placement, retrieval and status updates
 */

/**
 * GET /api/orders
 * Get all orders for the logged-in user
 * Optional query param: ?order_id=ORD-xxx to search a specific order
 */
const getOrders = async (req, res) => {
  try {
    const { order_id } = req.query;
    let orders;

    if (order_id && order_id.trim() !== '') {
      orders = await Order.searchByOrderId(req.session.userId, order_id.trim());
    } else {
      orders = await Order.getByUser(req.session.userId);
    }

    return res.json({ orders });
  } catch (err) {
    console.error('Get orders error:', err);
    return res.status(500).json({ error: 'Failed to fetch orders.' });
  }
};

/**
 * POST /api/orders/bulk
 * Submit a bulk order (multiple items at once)
 * Body: { customer_name, customer_email, address, phone, items: [{ plant_id, quantity }] }
 */
const createBulkOrder = async (req, res) => {
  try {
    const { customer_name, customer_email, address, phone, items } = req.body;

    if (!customer_name || !customer_email || !address || !phone) {
      return res.status(400).json({ error: 'All customer details are required.' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'At least one item is required.' });
    }

    const orderIds = [];

    for (const item of items) {
      if (!item.plant_id || !item.quantity || item.quantity < 1) {
        return res.status(400).json({ error: 'Each item must have a valid plant_id and quantity.' });
      }
      const orderId = await Order.create(
        req.session.userId,
        item.plant_id,
        item.quantity,
        customer_name,
        customer_email,
        address,
        phone
      );
      orderIds.push(orderId);
    }

    console.log(`✅ Bulk order placed by user ${req.session.userId}: ${orderIds.join(', ')}`);
    return res.status(201).json({
      message: `Order placed successfully with ${items.length} item(s).`,
      orderIds,
    });
  } catch (err) {
    console.error('Bulk order error:', err);
    return res.status(500).json({ error: 'Failed to place order.' });
  }
};

/**
 * PATCH /api/orders/:order_id/status
 * Update order status (pending, shipped, delivered)
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'shipped', 'delivered'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    await Order.updateStatus(order_id, status);
    return res.json({ message: 'Order status updated.', order_id, status });
  } catch (err) {
    console.error('Update status error:', err);
    return res.status(500).json({ error: 'Failed to update order status.' });
  }
};

module.exports = { getOrders, createBulkOrder, updateOrderStatus };
