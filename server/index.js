const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Conectar a DB
connectDB();

// Importar rutas - Verifica que estas rutas sean correctas
const authRoutes = require('./src/routes/authRoutes');
const scanRoutes = require('./src/routes/scanRoutes');
const metricsRoutes = require("./src/routes/metricsRoutes");

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/metrics', metricsRoutes);

// Ruta de prueba/bienvenida
app.get('/', (req, res) => {
    res.json({
        message: 'API de Control de Patrullajes',
        version: '1.0.0',
        endpoints: [
            'POST /api/auth/login',
            'GET /api/auth/profile',
            'POST /api/scan',
            'GET /api/scan/today',
            'GET /api/scan/status',
            'GET /api/scan/history',

            'GET /api/metrics/dashboard',
            'GET /api/metrics/scans'
        ]
    });
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});