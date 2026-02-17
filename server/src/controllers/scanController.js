const Scan = require('../models/Scan');
const Checkpoint = require('../models/Checkpoint');
const User = require('../models/User');

// @desc    Registrar escaneo de QR
// @route   POST /api/scan
// @access  Private
const registerScan = async (req, res) => {
    try {
        const { qrCodeValue, location, deviceInfo } = req.body;

        // Validar que el QR existe
        const checkpoint = await Checkpoint.findOne({ 
            qrCodeValue, 
            status: 1 
        });

        if (!checkpoint) {
            return res.status(404).json({ 
                success: false, 
                message: 'Código QR no válido' 
            });
        }

        // Obtener fecha actual
        const now = new Date();
        const boliviaTime = new Date(now.getTime() - (4 * 60 * 60 * 1000));
        const shiftDate = boliviaTime.toISOString().split('T')[0];

        // Verificar si ya escaneó este checkpoint hoy
        const existingScan = await Scan.findOne({
            userId: req.user.id,
            checkpointId: checkpoint._id,
            shiftDate: shiftDate
        });

        if (existingScan) {
            return res.status(400).json({ 
                success: false, 
                message: 'Ya escaneaste este punto hoy' 
            });
        }

        // Registrar el escaneo
        const scan = await Scan.create({
            userId: req.user.id,
            checkpointId: checkpoint._id,
            scanTime: now,
            date: shiftDate,
            shiftDate: shiftDate,
            location: location || null,
            deviceInfo: deviceInfo || 'Dispositivo móvil',
            status: 1
        });

        const user = await User.findById(req.user.id);
        const todaysScans = await Scan.find({
            userId: req.user.id,
            shiftDate: shiftDate
        });
        const totalCheckpoints = await Checkpoint.countDocuments({ status: 1 });

        res.json({
            success: true,
            message: 'Escaneo registrado exitosamente',
            data: {
                scan: {
                    id: scan._id,
                    guardia: {
                        id: user._id,
                        nombreCompleto: `${user.name} ${user.lastname} ${user.secondLastname || ''}`.trim()
                    },
                    checkpoint: {
                        id: checkpoint._id,
                        name: checkpoint.name,
                        description: checkpoint.description
                    },
                    scanTime: scan.scanTime,
                    location: scan.location,
                    fecha: scan.date
                },
                progress: {
                    scanned: todaysScans.length,
                    total: totalCheckpoints,
                    completed: todaysScans.length === totalCheckpoints,
                    remaining: totalCheckpoints - todaysScans.length
                },
                today: shiftDate
            }
        });

    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error en el servidor' 
        });
    }
};

// @desc    Obtener escaneos del día actual
// @route   GET /api/scan/today
// @access  Private
const getTodayScans = async (req, res) => {
    try {
        const now = new Date();
        const boliviaTime = new Date(now.getTime() - (4 * 60 * 60 * 1000));
        const today = boliviaTime.toISOString().split('T')[0];

        const scans = await Scan.find({
            userId: req.user.id,
            shiftDate: today
        })
        .populate('checkpointId', 'name description')
        .sort({ scanTime: 1 });

        res.json({
            success: true,
            scans: scans
        });

    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error en el servidor' 
        });
    }
};

// @desc    Verificar estado del día
// @route   GET /api/scan/status
// @access  Private
const getScanStatus = async (req, res) => {
    try {
        const now = new Date();
        const boliviaTime = new Date(now.getTime() - (4 * 60 * 60 * 1000));
        const today = boliviaTime.toISOString().split('T')[0];

        const scannedCount = await Scan.countDocuments({
            userId: req.user.id,
            shiftDate: today
        });

        const totalCheckpoints = await Checkpoint.countDocuments({ status: 1 });
        const user = await User.findById(req.user.id);

        res.json({
            success: true,
            date: today,
            guardia: {
                id: user._id,
                nombreCompleto: `${user.name} ${user.lastname} ${user.secondLastname || ''}`.trim()
            },
            status: {
                scanned: scannedCount,
                total: totalCheckpoints,
                completed: scannedCount === totalCheckpoints,
                remaining: totalCheckpoints - scannedCount,
                percentage: Math.round((scannedCount / totalCheckpoints) * 100) || 0
            }
        });

    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error en el servidor' 
        });
    }
};

// @desc    Obtener historial de escaneos
// @route   GET /api/scan/history
// @access  Private
const getScanHistory = async (req, res) => {
    try {
        const { limit = 50 } = req.query;
        
        const scans = await Scan.find({ userId: req.user.id })
            .populate('checkpointId', 'name description')
            .sort({ scanTime: -1 })
            .limit(parseInt(limit));

        res.json({
            success: true,
            total: scans.length,
            scans: scans
        });

    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error en el servidor' 
        });
    }
};

// Exportar todas las funciones
module.exports = {
    registerScan,
    getTodayScans,
    getScanStatus,
    getScanHistory
};