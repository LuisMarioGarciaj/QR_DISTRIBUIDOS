const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        // Quitamos opciones innecesarias en versiones nuevas de Mongoose
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Conectado a MongoDB Atlas (Patrol Control DB)');
    } catch (err) {
        console.error('❌ Error de conexión:', err.message);
        // Esto te dirá si el error es de "Auth" (usuario/pass) o de "Network" (IP)
    }
};

module.exports = connectDB;