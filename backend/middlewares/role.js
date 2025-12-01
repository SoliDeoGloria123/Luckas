const checkRole = (...allowedRoles) =>{
    return (req, res, next )=>{
        if(!req.userRole){
            return res.status(500).json({
                success: false,
                message: 'Error al verificar rol'
            });
        }
        if (!allowedRoles.includes(req.userRole)){
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