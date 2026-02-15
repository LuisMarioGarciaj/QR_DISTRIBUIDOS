const mongoose = require('mongoose');

const CheckpointSchema = new mongoose.Schema({
    name: { type: String, required: true },
    qrCodeValue: { type: String, required: true },
    location: {
        lat: Number,
        lng: Number
    }
}, { 
    collection: 'checkpoint', // Importante: fuerza el nombre de la colección en singular
    timestamps: true 
});

module.exports = mongoose.model('Checkpoint', CheckpointSchema);