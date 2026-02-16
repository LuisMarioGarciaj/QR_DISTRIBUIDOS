const mongoose = require('mongoose');

const PatrolRoundSchema = new mongoose.Schema({

    routeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
        required: true
    },
    shiftId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shift',
        required: true
    },
    guardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date
    },
    status: {
        type: Number,
        default: 1
    },
    totalCheckpoints: {
        type: Number,
        default: 0
    },
    completedCheckpoints: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { collection: 'patrolRound' });

module.exports = mongoose.model('PatrolRound', PatrolRoundSchema);
