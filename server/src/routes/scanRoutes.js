const express = require('express');
const { 
    registerScan, 
    getTodayScans, 
    getScanStatus,
    getScanHistory 
} = require('../controllers/scanController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Todas las rutas de scan requieren autenticación
router.use(protect);

router.post('/', registerScan);
router.get('/today', getTodayScans);
router.get('/status', getScanStatus);
router.get('/history', getScanHistory);

module.exports = router;