const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const Checkpoint = require('./src/models/Checkpoint');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// Ruta para validar el escaneo
app.post('/api/scan', async (req, res) => {
    const { qrCodeValue } = req.body;
    try {
        const point = await Checkpoint.findOne({ qrCodeValue });
        if (point) {
            res.json({ success: true, message: `Punto validado: ${point.name}`, data: point });
        } else {
            res.status(404).json({ success: false, message: "QR no registrado" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Servidor en http://localhost:${PORT}`));