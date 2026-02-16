const mongoose = require('mongoose');

const ScanSchema = new mongoose.Schema({

    roundId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PatrolRound',
        required: true
    },
    checkpointId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Checkpoint',
        required: true
    },
    guardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    scanTime: {
        type: Date,
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
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { collection: 'scan' });

module.exports = mongoose.model('Scan', ScanSchema);
