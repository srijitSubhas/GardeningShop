const Plant = require('../models/Plant');

/**
 * Plant Controller
 * Handles reading plant data
 */

/**
 * GET /api/plants
 * Get all plants
 */
const getAllPlants = async (req, res) => {
  try {
    const plants = await Plant.getAll();
    return res.json({ plants });
  } catch (err) {
    console.error('Get plants error:', err);
    return res.status(500).json({ error: 'Failed to fetch plants.' });
  }
};

/**
 * GET /api/plants/:id
 * Get a single plant by ID
 */
const getPlantById = async (req, res) => {
  try {
    const plant = await Plant.getById(req.params.id);
    if (!plant) {
      return res.status(404).json({ error: 'Plant not found.' });
    }
    return res.json({ plant });
  } catch (err) {
    console.error('Get plant error:', err);
    return res.status(500).json({ error: 'Failed to fetch plant.' });
  }
};

module.exports = { getAllPlants, getPlantById };
