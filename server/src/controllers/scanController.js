const Scan = require('../models/Scan');
const Checkpoint = require('../models/Checkpoint');
const User = require('../models/User');

// @desc    Registrar escaneo de QR
// @route   POST /api/scan
// @access  Private
const registerScan = async (req, res) => {
    try {
        const { qrCodeValue, location, deviceInfo } = req.body;

        // Validar que el QR existe y está activo
        const checkpoint = await Checkpoint.findOne({ 
            qrCodeValue, 
            status: 1 
        });

        if (!checkpoint) {
            return res.status(404).json({ 
                success: false, 
                message: 'Código QR no válido o punto de control inactivo' 
            });
        }

        // Obtener fecha actual en formato YYYY-MM-DD para Bolivia (UTC-4)
        const now = new Date();
        const boliviaTime = new Date(now.getTime() - (4 * 60 * 60 * 1000));
        const shiftDate = boliviaTime.toISOString().split('T')[0];
        
        const scanTime = new Date();

        // Verificar si ya escaneó este checkpoint hoy
        const existingScan = await Scan.findOne({
            userId: req.user.id,
            checkpointId: checkpoint._id,
            shiftDate: shiftDate
        });

        if (existingScan) {
            return res.status(400).json({ 
                success: false, 
                message: 'Ya escaneaste este punto hoy',
                lastScan: existingScan.scanTime
            });
        }

        // Registrar el escaneo
        const scan = await Scan.create({
            userId: req.user.id,
            checkpointId: checkpoint._id,
            scanTime: scanTime,
            date: shiftDate,
            shiftDate: shiftDate,
            location,
            deviceInfo
        });

        // Obtener el usuario para el nombre completo
        const user = await User.findById(req.user.id);

        // Obtener todos los checkpoints escaneados hoy
        const todaysScans = await Scan.find({
            userId: req.user.id,
            shiftDate: shiftDate
        }).populate('checkpointId', 'name description location');

        // Obtener total de checkpoints activos en el sitio
        const totalCheckpoints = await Checkpoint.countDocuments({ 
            siteId: checkpoint.siteId,
            status: 1 
        });

        res.json({
            success: true,
            message: 'Escaneo registrado exitosamente',
            data: {
                scan: {
                    id: scan._id,
                    guardia: {
                        id: user._id,
                        nombre: user.name,
                        apellidos: `${user.lastname} ${user.secondLastname || ''}`.trim(),
                        nombreCompleto: `${user.name} ${user.lastname} ${user.secondLastname || ''}`.trim()
                    },
                    checkpoint: {
                        id: checkpoint._id,
                        name: checkpoint.name,
                        description: checkpoint.description,
                        location: checkpoint.location
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
        console.error('Error en registerScan:', error);
        
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                message: 'Ya escaneaste este punto hoy' 
            });
        }

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
        .populate('checkpointId', 'name description location')
        .populate('userId', 'name lastname secondLastname')
        .sort({ scanTime: 1 });

        // Obtener total de checkpoints
        let totalCheckpoints = 0;
        let siteId = null;
        
        if (scans.length > 0 && scans[0].checkpointId) {
            siteId = scans[0].checkpointId.siteId;
            totalCheckpoints = await Checkpoint.countDocuments({ 
                siteId: siteId,
                status: 1 
            });
        }

        // Formatear respuesta
        const formattedScans = scans.map(scan => ({
            id: scan._id,
            scanTime: scan.scanTime,
            hora: scan.scanTime.toLocaleTimeString('es-BO'),
            checkpoint: {
                id: scan.checkpointId._id,
                name: scan.checkpointId.name,
                description: scan.checkpointId.description
            },
            location: scan.location,
            guardia: {
                id: scan.userId._id,
                nombreCompleto: `${scan.userId.name} ${scan.userId.lastname} ${scan.userId.secondLastname || ''}`.trim()
            }
        }));

        res.json({
            success: true,
            date: today,
            fechaFormateada: new Date(today).toLocaleDateString('es-BO', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            scans: formattedScans,
            progress: {
                scanned: scans.length,
                total: totalCheckpoints,
                completed: scans.length === totalCheckpoints,
                remaining: totalCheckpoints - scans.length
            }
        });

    } catch (error) {
        console.error(error);
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
                nombre: user.name,
                apellidos: `${user.lastname} ${user.secondLastname || ''}`.trim(),
                nombreCompleto: `${user.name} ${user.lastname} ${user.secondLastname || ''}`.trim()
            },
            status: {
                scanned: scannedCount,
                total: totalCheckpoints,
                completed: scannedCount === totalCheckpoints,
                remaining: totalCheckpoints - scannedCount,
                percentage: Math.round((scannedCount / totalCheckpoints) * 100) || 0
            },
            message: scannedCount === totalCheckpoints 
                ? '🎉 ¡Felicidades! Has completado todos los puntos de control hoy' 
                : `📋 Te faltan ${totalCheckpoints - scannedCount} puntos por escanear`
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: 'Error en el servidor' 
        });
    }
};

// @desc    Obtener historial de escaneos por fecha
// @route   GET /api/scan/history
// @access  Private
const getScanHistory = async (req, res) => {
    try {
        const { date, startDate, endDate, limit = 50 } = req.query;
        
        let query = { userId: req.user.id };
        
        if (date) {
            query.shiftDate = date;
        } else if (startDate && endDate) {
            query.shiftDate = {
                $gte: startDate,
                $lte: endDate
            };
        }

        const scans = await Scan.find(query)
            .populate('checkpointId', 'name description')
            .populate('userId', 'name lastname secondLastname')
            .sort({ scanTime: -1 })
            .limit(parseInt(limit));

        // Agrupar por fecha
        const groupedByDate = scans.reduce((acc, scan) => {
            const date = scan.shiftDate;
            if (!acc[date]) {
                acc[date] = {
                    date,
                    fechaFormateada: new Date(date).toLocaleDateString('es-BO'),
                    count: 0,
                    scans: []
                };
            }
            
            acc[date].count++;
            acc[date].scans.push({
                id: scan._id,
                hora: scan.scanTime.toLocaleTimeString('es-BO'),
                scanTime: scan.scanTime,
                checkpoint: {
                    name: scan.checkpointId.name,
                    description: scan.checkpointId.description
                },
                location: scan.location
            });
            
            return acc;
        }, {});

        res.json({
            success: true,
            total: scans.length,
            grouped: Object.values(groupedByDate)
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: 'Error en el servidor' 
        });
    }
};

module.exports = {
    registerScan,
    getTodayScans,
    getScanStatus,
    getScanHistory
};