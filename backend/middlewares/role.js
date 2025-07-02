const checkRole = (...allowedRoles) =>{
    return (req, res, next )=>{
        if(!req.userRole){
            console.error('intento de verificar rol son token valido');
            return res.status(500).json({
                success: false,
                message: 'Error al verificar rol'
            });
        }
        if (!allowedRoles.includes(req.userRole)){
            console.log(`Acceso denegado para ${req.userEmail} (${req.userRole}) en ruta ${req.originalUrl}`);
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado'
            });
        }
        next();
    };
};

//Funciones especificas de rol
const isAdmin = (req, res, next) => checkRole('admin')(req, res, next);
const isTesorero = (req, res, next) => checkRole('tesorero')(req, res, next);
const isSeminarista = (req, res, next) => checkRole('seminarista')(req, res, next);
const isExterno = (req, res, next) => checkRole('externo')(req, res, next);

module.exports = {
  checkRole,
  isAdmin,
  isTesorero,
  isSeminarista,
  isExterno
};