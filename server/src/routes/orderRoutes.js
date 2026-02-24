const express = require('express');
const router = express.Router();
const { getOrders, createBulkOrder, updateOrderStatus } = require('../controllers/orderController');
const { isAuthenticated } = require('../middleware/auth');

// All order routes require authentication
router.use(isAuthenticated);

// GET /api/orders  (optional ?order_id=ORD-xxx to search)
router.get('/', getOrders);

// POST /api/orders/bulk  - place a multi-item order
router.post('/bulk', createBulkOrder);

// PATCH /api/orders/:order_id/status  - update order status
router.patch('/:order_id/status', updateOrderStatus);

module.exports = router;
