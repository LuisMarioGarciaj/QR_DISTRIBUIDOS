const mongoose = require('mongoose');

const CheckpointSchema = new mongoose.Schema({
    siteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true },
    name: { type: String, required: true },
    description: { type: String },
    location: {
        lat: Number,
        lng: Number
    },
    qrCodeValue: { type: String, required: true, unique: true },
    status: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { collection: 'checkpoint' });

module.exports = mongoose.model('Checkpoint', CheckpointSchema);