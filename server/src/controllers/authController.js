const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// @desc    Login de usuario
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Por favor ingrese email y contraseña' 
            });
        }

        const user = await User.findOne({ email, status: 1 });
        
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Credenciales inválidas' 
            });
        }

        const isMatch = await user.comparePassword(password);
        
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: 'Credenciales inválidas' 
            });
        }

        const token = generateToken(user._id);

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                lastname: user.lastname,
                secondLastname: user.secondLastname,
                fullName: `${user.name} ${user.lastname} ${user.secondLastname || ''}`.trim(),
                email: user.email,
                ci: user.ci,
                phone: user.phone,
                role: user.role
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

// @desc    Obtener perfil del usuario
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-passwordHash');
        
        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                lastname: user.lastname,
                secondLastname: user.secondLastname,
                fullName: `${user.name} ${user.lastname} ${user.secondLastname || ''}`.trim(),
                email: user.email,
                ci: user.ci,
                phone: user.phone,
                role: user.role
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

module.exports = {
    login,
    getProfile
};