const mongoose = require('mongoose');

const ScanSchema = new mongoose.Schema({
    // Cambiar de guardId a userId para que coincida con el controlador
    userId: {  // en lugar de guardId
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    checkpointId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Checkpoint',
        required: true
    },
    // Hacer roundId opcional
    roundId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PatrolRound',
        required: false  // Cambiar a false
    },
    scanTime: {
        type: Date,
        required: true,
        default: Date.now
    },
    date: {  // Fecha del escaneo (YYYY-MM-DD)
        type: String,
        required: true
    },
    shiftDate: {  // Fecha del turno
        type: String,
        required: true
    },
    deviceInfo: {
        type: String
    },
    location: {
        lat: Number,
        lng: Number
    },
    status: {
        type: Number,
        default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { 
    collection: 'scan',
    timestamps: true 
});

// Índice compuesto para evitar escaneos duplicados por día
ScanSchema.index({ userId: 1, checkpointId: 1, shiftDate: 1 }, { unique: true });

module.exports = mongoose.model('Scan', ScanSchema);