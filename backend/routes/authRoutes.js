const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');
const { verify } = require('jsonwebtoken');
const verifySignUp = require('../middlewares/verifySignUp');

//Importacion de verificacion 
let verifyToken;
try{
    const authJwt = require('../middlewares/authJwt');
    verifyToken=authJwt.verifyToken;
}catch(error){
    // Si falla la carga del middleware, continuamos pero algunas rutas protegidas podrían fallar
}

// Ruta de prueba
router.get('/test', (req, res) => {
    res.json({ message: 'Servidor funcionando correctamente' });
});

// Rutas de login (sin proteccion )
router.post('/signin', authController.signin);

// Recuperar contraseña: enviar código al correo
router.post('/forgot-password', authController.forgotPassword);

// Verificar código de recuperación (no modifica contraseña)
router.post('/verify-reset-code', authController.verifyResetCode);

// Restablecer contraseña: validar código y cambiar password
router.post('/reset-password', authController.resetPassword);

// Ruta de registro
router.post('/signup',
    (req,res,next) =>{
        next();
    },
    verifySignUp.checkDuplicateEmailOrPhone,
    verifySignUp.checkRolesExisted,
    authController.signup
);

module.exports=router;