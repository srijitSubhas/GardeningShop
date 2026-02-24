const express = require('express');
const router = express.Router();
const { signup, login, logout, me } = require('../controllers/authController');

// POST /api/auth/signup
router.post('/signup', signup);

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/logout
router.post('/logout', logout);

// GET /api/auth/me  - check current session
router.get('/me', me);

module.exports = router;
