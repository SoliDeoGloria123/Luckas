const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');
const { User } = require('../models/User.js');

console.log('[AuthJWT ]Configuracion cargada: ', config.secret ? '***' + config.secret.slice(-5) : 'NO CONFIGURADO');

// Definicion del middleware 
const verifyTokenFn = (req, res, next) => {
    console.log('\n [AuthJWT] Middleware ejecutandose para ', req.originalUrl);
    console.log('[AuthJWT] Method:', req.method);
    console.log('[AuthJWT] Headers recibidos:', {
        'x-access-token': req.headers['x-access-token'] ? '***' + req.headers['x-access-token'].slice(-8) : 'NO PRESENTE',
        'authorization': req.headers.authorization ? '***' + req.headers.authorization.slice(-10) : 'NO PRESENTE'
    });

    try {
        // Soporta tanto x-access-token como Authorization: Bearer
        let token = req.headers['x-access-token'];
        
        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7); // Remover 'Bearer ' prefix
                console.log('[AuthJWT] Token extraído de Authorization header');
            }
        }
        
        console.log('[AuthJWT] Token final recibido:', token ? '***' + token.slice(-8) : 'NO PROVISTO');
        
        if (!token) {
            console.log('[AuthJWT] ❌ Error: token no proporcionado');
            return res.status(403).json({
                success: false,
                message: 'Token no proporcionado'
            });
        }

        // Verifica el JWT
        console.log('[AuthJWT] Verificando token con secret:', config.secret ? '***' + config.secret.slice(-5) : 'NO CONFIG');
        const decoded = jwt.verify(token, config.secret);

        // Asigna los datos del usuario decodificado
        req.userId = decoded.id;
        req.userRole = decoded.role;
        req.userEmail = decoded.email || 'no-email';
        
        // CLAVE: agrega el objeto user para que los controllers lo encuentren
        req.user = {
            id: decoded.id,
            role: decoded.role,
            email: decoded.email || 'no-email'
        };

        console.log('[AuthJWT] ✅ Token valido para usuario ID:', decoded.id, 'Role:', decoded.role);
        next();
    } catch (error) {
        console.error('[AuthJWT] ❌ Error :', error.name, '_', error.message);
        console.error('[AuthJWT] Stack:', error.stack);
        return res.status(401).json({
            success: false,
            message: 'Token invalido',
            error: error.name,
            details: error.message
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