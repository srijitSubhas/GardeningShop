const express = require('express');
const router = express.Router();
const { getAllPlants, getPlantById } = require('../controllers/plantController');
const { isAuthenticated } = require('../middleware/auth');

// GET /api/plants  - protected: must be logged in to browse
router.get('/', getAllPlants);

// GET /api/plants/:id
router.get('/:id', getPlantById);

module.exports = router;
