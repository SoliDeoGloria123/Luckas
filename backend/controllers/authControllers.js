const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const { normalizeTipoDocumento } = require('../utils/userValidation');


//roles del sistema 
const ROLES = {
  ADMIN: 'admin',
  TESORERO: 'tesorero',
  SEMINARISTA: 'seminarista',
  EXTERNO: 'externo'
};


//funcion para vcerificar permisos 
const checkpermissions = (userRole, requiredRoles) => {
  return requiredRoles.includes(userRole);
};

//1.regustro de usuarios (SOLL ADMIN)
exports.signup = async (req, res) => {
  try {
    //valdacion manual adicional
    if (!req.body.nombre || !req.body.apellido || !req.body.correo || !req.body.telefono ||
      !req.body.tipoDocumento || !req.body.numeroDocumento || !req.body.password) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos obligatorios para el registro"
      });
    }

    // Normalizar el tipo de documento
    const tipoDocumentoNormalizado = normalizeTipoDocumento(req.body.tipoDocumento);

    // Crear instancia de usuario
    const user = new User({
      nombre: req.body.nombre.trim(),
      apellido: req.body.apellido.trim(),
      correo: req.body.correo.toLowerCase().trim(),
      telefono: req.body.telefono.trim(),
      tipoDocumento: tipoDocumentoNormalizado,
      numeroDocumento: req.body.numeroDocumento.trim(),
      password: req.body.password,
      role: req.body.role || 'externo'
    });
    // Guardar usuario en la base de datos
    const savedUser = await user.save();

    // Generar token JWT
    const token = jwt.sign(
      {
        id: savedUser._id,
        role: savedUser.role
      },
      config.secret,
      { expiresIn: config.jwtExpiration }
    );

    // Preparar respuesta sin datos sensibles
    const userData = savedUser.toObject();
    delete userData.password;

    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      token: token,
      user: userData
    });

  } catch (error) {
    console.error('[AuthController] Error en registro:', error);

    // Manejo especial de errores de MongoDB
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `El ${field} ya está en uso`,
        field: field
      });
    }

    // Manejo de otros errores de validación
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
        errors: error.errors
      });
    }

    res.status(500).json({
      success: false,
      message: "Error al registrar usuario",
      error: error.message
    });
  }
};

exports.signin = async (req, res) => {
  console.log('[SIGNIN] Iniciando proceso de signin...');
  console.log('[SIGNIN] Body recibido:', req.body);
  
  try {
    const { correo, password } = req.body;
    console.log('[SIGNIN] Credenciales extraídas:', { correo, password: password ? '***' : 'VACÍO' });

    // 1. Validación básica
    if (!correo || !password) {
      console.log('[SIGNIN] ❌ Validación falló - campos vacíos');
      return res.status(400).json({
        success: false,
        message: "Email y contraseña son requeridos"
      });
    }

    console.log('[SIGNIN] ✅ Validación básica pasada');

    // 2. Buscar usuario incluyendo el password (que normalmente está oculto)
    console.log('[SIGNIN] 🔍 Buscando usuario con email:', correo);
    const user = await User.findOne({ correo }).select('+password');

    if (!user) {
      console.log('[SIGNIN] ❌ Usuario no encontrado');
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    console.log('[SIGNIN] ✅ Usuario encontrado:', user.nombre, user.apellido);

    // 3. Comparar contraseñas
    console.log('[SIGNIN] 🔐 Comparando contraseñas...');
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      console.log('[SIGNIN] ❌ Contraseña incorrecta');
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas"
      });
    }

    console.log('[SIGNIN] ✅ Contraseña correcta');

    // 4. Generar token JWT
    console.log('[SIGNIN] 🎫 Generando token...');
    console.log('[SIGNIN] Configuración JWT:', { 
      secret: config.secret ? '***' + config.secret.slice(-5) : 'NO CONFIG',
      expiration: config.jwtExpiration 
    });
    
    const token = jwt.sign(
      { id: user._id, role: user.role },
      config.secret,
      { expiresIn: config.jwtExpiration }
    );

    console.log('[SIGNIN] ✅ Token generado con expiración:', config.jwtExpiration);

    // 5. Preparar respuesta sin datos sensibles
    const userData = user.toObject();
    delete userData.password;

    console.log('[SIGNIN] 🎉 Login exitoso para:', userData.correo);
    
    return res.status(200).json({
      success: true,
      message: "Autenticación exitosa",
      token,
      user: userData
    });

  } catch (error) {
    console.error('[SIGNIN] ❌ Error en login:', error);
    return res.status(500).json({
      success: false,
      message: "Error en el servidor",
      error: error.message
    });
  }
};
// 5. Actualizar usuario (Admin puede actualizar todos, Coordinador solo auxiliares, Auxiliar solo sí mismo)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const currentUserRole = req.userRole;
    const currentUserId = req.userId;

    // Buscar usuario a actualizar
    const userToUpdate = await User.findById(id);
    if (!userToUpdate) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Solo el admin puede modificar cualquier usuario
    // Los demás roles solo pueden modificar su propio perfil
    const allowedSelfRoles = [
      ROLES.TESORERO,
      ROLES.SEMINARISTA,
      ROLES.EXTERNO
    ];

    if (
      currentUserRole !== ROLES.ADMIN &&
      (
        !allowedSelfRoles.includes(currentUserRole) ||
        userToUpdate._id.toString() !== currentUserId
      )
    ) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para modificar este usuario'
      });
    }

    // Determinar campos permitidos para actualizar
    const allowedFields = ['nombre', 'apellido', 'correo', 'telefono'];
    if (currentUserRole === ROLES.ADMIN) {
      allowedFields.push('role'); // solo el admin puede cambiar roles
    }

    // Filtrar actualizaciones
    const filteredUpdates = {};
    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    // Si se actualiza password, hacer hash
    if (updates.password) {
      filteredUpdates.password = bcrypt.hashSync(updates.password, 8);
    }

    // Ejecutar actualización
    const updatedUser = await User.findByIdAndUpdate(id, filteredUpdates, { new: true }).select('-password -__v');

    return res.status(200).json({
      success: true,
      message: 'Usuario actualizado',
      data: updatedUser
    });

  } catch (error) {
    console.error('Error en updateUser:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar usuario'
    });
  }
};
// 6. Eliminar usuario (SOLO ADMIN)
exports.deleteUser = async (req, res) => {
  try {
    // Verificar que sea admin
    if (!checkPermission(req.userRole, [ROLES.ADMIN])) {
      return res.status(403).json({
        success: false,
        message: 'Solo administradores pueden eliminar usuarios'
      });
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Usuario eliminado correctamente'
    });

  } catch (error) {
    console.error('Error en deleteUser:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar usuario'
    });
  }
};
