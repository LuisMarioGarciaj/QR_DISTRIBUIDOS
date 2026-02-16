const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-passwordHash');
            
            if (!req.user) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Usuario no encontrado' 
                });
            }
            
            if (req.user.status !== 1) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Usuario inactivo' 
                });
            }
            
            next();
        } catch (error) {
            return res.status(401).json({ 
                success: false, 
                message: 'Token inválido' 
            });
        }
    }

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'No autorizado - Token no proporcionado' 
        });
    }
};

module.exports = { protect };