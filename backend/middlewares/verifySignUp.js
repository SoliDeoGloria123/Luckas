const User = require('../models/User');
const ROLES = new Set(['admin', 'tesorero', 'seminarista', 'externo']);


const checkDuplicateEmailOrPhone = async (req, res, next) => {
    try {
        // Verificar email
        const userByEmail = await User.findOne({ correo: req.body.correo });
        if (userByEmail) {
            return res.status(400).json({ 
                success: false, 
                message: "El email ya está en uso" 
            });
        }
        
        // Verificar teléfono
        const userByPhone = await User.findOne({ telefono: req.body.telefono });
        if (userByPhone) {
            return res.status(400).json({ 
                success: false, 
                message: "El teléfono ya está en uso" 
            });
        }
        
        next();
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Error al verificar email/teléfono", 
            error: error.message 
        });
    }
};

const checkRolesExisted = (req, res, next) => {
    if (req.body.role) {
        if (!ROLES.has(req.body.role)) {
            return res.status(400).json({
                success: false,
                message: `Rol ${req.body.role} no existe`
            });
        }
    }
    next();
};

module.exports = {
    checkDuplicateEmailOrPhone,
    checkRolesExisted
};