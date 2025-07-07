const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');
const { User } = require('../models/User.js');

console.log('[AuthJWT ]Configuracion cargada: ', config.secret ? '***' + config.secret.slice(-5) : 'NO CONFIGURADO');

// Definicion del middleware 
const verifyTokenFn = (req, res, next) => {
    console.log('\n [AuthJWT] Middleware ejecutandose para ', req.originalUrl);

    try {
        // Soporta tanto x-access-token como Authorization: Bearer
        const token = req.headers['x-access-token'] || req.headers.authorization?.split(' ')[1];
        console.log('[AuthJWT] Token recibido:', token ? '***' + token.slice(-8) : 'NO PROVISTO');
        if (!token) {
            console.log('[AuthJWT] Error: token no proporcionado');
            return res.status(403).json({
                success: false,
                message: 'Token no proporcionado'
            });
        }

        // Verifica el JWT
        const decoded = jwt.verify(token, config.secret);

        // Asigna los datos del usuario decodificado
        req.userId = decoded.id;
        req.userRole = decoded.role;
        // CLAVE: agrega el objeto user para que los controllers lo encuentren
        req.user = {
            id: decoded.id,
            role: decoded.role,
            // agrega otros campos del payload si tu JWT los tiene (ej: nombre, correo)
        };

        console.log('[AudhJWT] Token valido para usuario ID:', decoded.id, 'Role:', decoded.role);
        next();
    } catch (error) {
        console.error('[AuthJWT] Error :', error.name, '_', error.message);
        return res.status(401).json({
            success: false,
            message: 'Token invalido',
            error: error.name
        });
    }
};

// Validacion antes de exportar
if (typeof verifyTokenFn !== 'function') {
    console.error('[AuthJWT] ERROR: verifyTokenFn no es una funcion!');
    throw new Error('verifyTokenfn debe ser una funcion');
}

console.log('[AuthJWT] Middleware verifyTokenFn es una funcion: ', typeof verifyTokenFn);

module.exports = {
    verifyToken: verifyTokenFn
};

