const express = require('express');
const router = express.Router();
const { fetchPovertyRate } = require('../controllers/worldBankController');

// Route to fetch poverty rate for a specific country
router.get('/poverty/:country', fetchPovertyRate);

module.exports = router;