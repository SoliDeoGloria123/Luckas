const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const { normalizeTipoDocumento } = require('../utils/userValidation');
const crypto = require('crypto');

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
  try {
    const { correo, password } = req.body;

    // 1. Validación básica
    if (!correo || !password) {
      return res.status(400).json({
        success: false,
        message: "Email y contraseña son requeridos"
      });
    }

    // 2. Buscar usuario incluyendo el password (que normalmente está oculto)
    const user = await User.findOne({ correo }).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    // 3. Comparar contraseñas
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas"
      });
    }

    // 4. Generar token JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      config.secret,
      { expiresIn: config.jwtExpiration }
    );

    // 5. Preparar respuesta sin datos sensibles
    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({
      success: true,
      message: "Autenticación exitosa",
      token,
      user: userData
    });

  } catch (error) {
    console.error('[AuthController] Error en login:', error);
    res.status(500).json({
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

// 7. Solicitar recuperación de contraseña
exports.forgotPassword = async (req, res) => {
  try {
    const { correo } = req.body;

    if (!correo) {
      return res.status(400).json({
        success: false,
        message: "El correo electrónico es requerido"
      });
    }

    // Buscar usuario por correo
    const user = await User.findOne({ correo: correo.toLowerCase().trim() });

    if (!user) {
      // Por seguridad, no revelar si el email existe o no
      return res.status(200).json({
        success: true,
        message: "Si el correo existe en nuestro sistema, recibirás un token de recuperación"
      });
    }

    // Generar token temporal para reset
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora

    // Guardar token en el usuario
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetTokenExpiry;
    await user.save();

    // En un entorno real, aquí enviarías un email
    // Por ahora, devolvemos el token en la respuesta para testing
    console.log(`🔐 Token de reset para ${correo}: ${resetToken}`);
    
    res.status(200).json({
      success: true,
      message: "Token de recuperación generado exitosamente",
      // ⚠️ En producción, NO incluir el token en la respuesta
      resetToken: resetToken, // Solo para testing
      instructions: "En un entorno de producción, este token sería enviado por email"
    });

  } catch (error) {
    console.error('[AuthController] Error en forgotPassword:', error);
    res.status(500).json({
      success: false,
      message: "Error en el servidor"
    });
  }
};

// 8. Resetear contraseña con token
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token y nueva contraseña son requeridos"
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "La contraseña debe tener al menos 6 caracteres"
      });
    }

    // Buscar usuario con token válido y no expirado
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Token inválido o expirado"
      });
    }

    // Actualizar contraseña y limpiar tokens
    user.password = newPassword; // El middleware se encarga del hash
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Contraseña actualizada exitosamente"
    });

  } catch (error) {
    console.error('[AuthController] Error en resetPassword:', error);
    res.status(500).json({
      success: false,
      message: "Error en el servidor"
    });
  }
};
