const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');
const { User } = require('../models/User.js');

console.log('[AuthJWT ]Configuracion cargada: ', config.secret ? '***' + config.secret.slice(-5) : 'NO CONFIGURADO');

// Definicion del middleware 
const verifyTokenFn = (req, res, next) => {
    console.log('\n [AuthJWT] Middleware ejecutandose para ', req.originalUrl);

    try {
        const token = req.headers['x-access-token'] || req.headers.authorization?.split(' ')[1];
        console.log('[AuthJWT] Token recibido:', token ? '***' + token.slice(-8) : 'NO PROVISTO');
        if (!token) {
            console.log('[AuthJWT] Error: token np proporcionado');
            return res.status(403).json({
                success: false,
                message: 'Token no proporcionado'
            });
        }

        const decoded = jwt.verify(token, config.secret);
        req.userId = decoded.id;
        req.userRole = decoded.role;
        console.log('[AudhJWT] Token valido para usuario ID:', decoded.id, 'Role:', decoded.role);
        next();
    } catch (error) {
        console.error('[AuthJWT] Error :', error.name, '_', error.message);
        return res.status(401).json({
            success: false,
            message: 'Token invalido ',
            error: error.name
        });
    }
};

const AuthJWT = (req, res, next) => {
    console.log('[AuthJWT] Verificando token de autorización');
    
    // Intentar obtener el token de diferentes headers
    const token = 
        req.headers['x-access-token'] || 
        req.headers.authorization?.split(' ')[1] ||
        req.headers.authorization;

    if (!token) {
        console.log('[AuthJWT] No se proporcionó token');
        return res.status(401).json({
            success: false,
            message: 'No se proporcionó token de autenticación'
        });
    }

    try {
        console.log('[AuthJWT] Verificando token:', token ? '***' + token.slice(-8) : 'NO VÁLIDO');
        const decoded = jwt.verify(token, config.secret);
        req.user = decoded;
        req.userId = decoded.id;
        req.userRole = decoded.role;
        console.log('[AuthJWT] Token válido para usuario:', decoded.id, 'Role:', decoded.role);
        next();
    } catch (error) {
        console.error('[AuthJWT] Error al verificar token:', error.message);
        return res.status(401).json({
            success: false,
            message: 'Token inválido o expirado',
            error: error.name
        });
    }
};

//Validacion antes de exportar
if (typeof verifyTokenFn !== 'function') { // Corregir funtion a function
    console.error('[AuthJWT] ERROR: verifyTokenFn no es una funcion!');
    throw new Error('verifyTokenfn debe ser una funcion');
}

console.log('[AuthJWT] Middleware verifyTokenFn es una funcion: ', typeof verifyTokenFn);

module.exports = {
    verifyToken: verifyTokenFn
};

