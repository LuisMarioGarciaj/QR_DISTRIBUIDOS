const express = require('express');
const { login, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Rutas públicas
router.post('/login', login);

// Rutas protegidas
router.get('/profile', protect, getProfile);

module.exports = router;