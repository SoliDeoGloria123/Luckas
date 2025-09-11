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
    console.log ('[AuthRoutes] verifyToken importado correctamente', typeof verifyToken);

}catch(error){
    console.log('[AuthRoutes] ERROR al importar verifyToken ', error);
    throw error;
}

//Moddleware de diagnostico
router.use((req, res, next)=> {
    console.log('\n[AuthRoutes] Peticion recibida: ', {
        method: req.method,
        path: req.path,
        Headers:{
            authorization: req.headers.authorization ?  '***' : 'NO', 
            'x-access-token': req.headers
            ['x-access-token']? '***' : 'NO'
        }
    });
    next();
});


//Rutas de login (sin proteccion )
router.post('/signin', authController.signin);

// Rutas de recuperación de contraseña (sin protección)
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Ruta de registro
router.post('/signup',
    (req,res,next) =>{
        console.log('[AuthRoutes] middlewares de verificacion de registro ');
        next();
    },
    verifySignUp.checkDuplicateEmailOrPhone,
    verifySignUp.checkRolesExisted,
    authController.signup
);

//verificacion final de rutas
console.log('[AuthRoutes] Rutas configuradas: ', router.stack.map(layer =>{
    return {
        path: layer.router?.path,
        method: layer.router?.method
    };
}));

module.exports=router;