const mongoose = require('mongoose');
const dns = require('dns');

// Forzar uso de DNS de Google
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Conectado a MongoDB Atlas');
    } catch (err) {
        console.error('❌ Error de conexión:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;