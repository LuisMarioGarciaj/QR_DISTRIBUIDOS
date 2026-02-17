const mongoose = require('mongoose');

const SiteSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String },
    description: { type: String },
    status: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { collection: 'site' });

module.exports = mongoose.model('Site', SiteSchema);