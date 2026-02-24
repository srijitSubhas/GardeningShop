const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart, clearCart } = require('../controllers/cartController');
const { isAuthenticated } = require('../middleware/auth');

// All cart routes require authentication
router.use(isAuthenticated);

// GET /api/cart
router.get('/', getCart);

// POST /api/cart
router.post('/', addToCart);

// DELETE /api/cart/:id  - remove single item
router.delete('/:id', removeFromCart);

// DELETE /api/cart  - clear entire cart
router.delete('/', clearCart);

module.exports = router;
