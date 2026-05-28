const Customer = require('../models/Customer');

/**
 * Auth Controller
 * Handles signup, login, logout, and session check
 */

/**
 * POST /api/auth/signup
 * Register a new user
 */
const signup = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    // Check if email already exists
    const existing = await Customer.findByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'Email is already registered.' });
    }

    // Create new customer
    await Customer.create(name, email, password, phone || null);

    // Auto-login after signup
    const user = await Customer.findByEmail(email);
    req.session.userId = user.id;
    req.session.userEmail = user.email;
    req.session.userName = user.name;

    return req.session.save((saveErr) => {
      if (saveErr) {
        console.error('Signup session save error:', saveErr);
        return res.status(500).json({ error: 'Failed to establish session.' });
      }

      return res.status(201).json({
        message: 'Account created successfully.',
        user: { id: user.id, name: user.name, email: user.email },
      });
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Internal server error during signup.' });
  }
};

/**
 * POST /api/auth/login
 * Authenticate an existing user
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await Customer.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isValid = await Customer.verifyPassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Set session
    req.session.userId = user.id;
    req.session.userEmail = user.email;
    req.session.userName = user.name;

    return req.session.save((saveErr) => {
      if (saveErr) {
        console.error('Login session save error:', saveErr);
        return res.status(500).json({ error: 'Failed to establish session.' });
      }

      return res.json({
        message: 'Login successful.',
        user: { id: user.id, name: user.name, email: user.email },
      });
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error during login.' });
  }
};

/**
 * POST /api/auth/logout
 * Destroy the user session
 */
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Error logging out.' });
    }
    res.clearCookie('connect.sid');
    return res.json({ message: 'Logged out successfully.' });
  });
};

/**
 * GET /api/auth/me
 * Get the current logged-in user from session
 */
const me = async (req, res) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated.' });
    }
    const user = await Customer.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    return res.json({ user });
  } catch (err) {
    console.error('Me error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = { signup, login, logout, me };
