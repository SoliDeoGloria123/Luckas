const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');
const { User } = require('../models/User.js');


// Definicion del middleware 
const verifyTokenFn = (req, res, next) => {

    try {
        const token = req.headers['x-access-token'] || req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(403).json({
                success: false,
                message: 'Token no proporcionado'
            });
        }

        const decoded = jwt.verify(token, config.secret);
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token invalido ',
            error: error.name
        });
    }
};


module.exports = {
    verifyToken: verifyTokenFn
};

