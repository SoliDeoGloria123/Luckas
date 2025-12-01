const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Función auxiliar para verificar el token y obtener el usuario
function obtenerUsuarioDesdeToken(req) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error('Token de autenticacion requerido');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
}


exports.authenticate = async (req, res, next) => {
    try {
        const decoded = obtenerUsuarioDesdeToken(req);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message === 'Token de autenticacion requerido' ? error.message : 'Token inválido o expirado',
            error: error.message
        });
    }
};

// Middleware de autorización
exports.authorize = (roles) =>{
    return (req, res, next)=>{
        if(!roles.includes(req.user.roles)){
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para esta accion',
                requiredRoles: roles,
                currentRole: req.user.role
            });
        }
        next();
    };

};