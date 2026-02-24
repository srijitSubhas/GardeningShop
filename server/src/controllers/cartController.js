const Cart = require('../models/Cart');

/**
 * Cart Controller
 * Handles cart CRUD for authenticated users
 */

/**
 * GET /api/cart
 * Get all cart items for the logged-in user
 */
const getCart = async (req, res) => {
  try {
    const items = await Cart.getByCustomer(req.session.userId);
    return res.json({ items });
  } catch (err) {
    console.error('Get cart error:', err);
    return res.status(500).json({ error: 'Failed to fetch cart.' });
  }
};

/**
 * POST /api/cart
 * Add an item to the cart
 */
const addToCart = async (req, res) => {
  try {
    const { plant_id, quantity } = req.body;

    if (!plant_id || !quantity || quantity < 1) {
      return res.status(400).json({ error: 'plant_id and quantity (>= 1) are required.' });
    }

    await Cart.addItem(req.session.userId, plant_id, quantity);
    return res.status(201).json({ message: 'Item added to cart.' });
  } catch (err) {
    console.error('Add to cart error:', err);
    return res.status(500).json({ error: 'Failed to add item to cart.' });
  }
};

/**
 * DELETE /api/cart/:id
 * Remove a cart item by cart row ID
 */
const removeFromCart = async (req, res) => {
  try {
    const cartId = req.params.id;
    await Cart.deleteItem(cartId, req.session.userId);
    return res.json({ message: 'Item removed from cart.' });
  } catch (err) {
    console.error('Remove cart item error:', err);
    return res.status(500).json({ error: 'Failed to remove item.' });
  }
};

/**
 * DELETE /api/cart
 * Clear the entire cart for the logged-in user
 */
const clearCart = async (req, res) => {
  try {
    await Cart.clearCart(req.session.userId);
    return res.json({ message: 'Cart cleared.' });
  } catch (err) {
    console.error('Clear cart error:', err);
    return res.status(500).json({ error: 'Failed to clear cart.' });
  }
};

module.exports = { getCart, addToCart, removeFromCart, clearCart };
