const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const { normalizeTipoDocumento } = require('../utils/userValidation');
const sendEmail = require('../utils/sendEmail');
const crypto = require('node:crypto');
const path = require('node:path');
const fs = require('node:fs');


//roles del sistema 
const ROLES = {
  ADMIN: 'admin',
  TESORERO: 'tesorero',
  SEMINARISTA: 'seminarista',
  EXTERNO: 'externo'
};


//funcion para vcerificar permisos 
const checkpermissions  = (userRole, requiredRoles) => {
  return requiredRoles.includes(userRole);
};

//1.regustro de usuarios (SOLL ADMIN)
exports.signup = async (req, res) => {
  try {
    //valdacion manual adicional
    if (!req.body.nombre || !req.body.apellido || !req.body.correo || !req.body.telefono ||
      !req.body.tipoDocumento || !req.body.numeroDocumento || !req.body.fechaNacimiento || !req.body.password) {
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
      fechaNacimiento: req.body.fechaNacimiento,
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

    console.log('[AUTH] Intento de login para:', correo);

    // 1. Validación básica
    if (!correo || !password) {
      console.log('[AUTH] Faltan campos obligatorios');
      return res.status(400).json({
        success: false,
        message: "Email y contraseña son requeridos"
      });
    }

    // 2. Buscar usuario incluyendo el password (que normalmente está oculto)
    const user = await User.findOne({ correo }).select('+password');

    console.log('[AUTH] Usuario encontrado:', user ? 'Sí' : 'No');
    if (user) {
      console.log('[AUTH] Correo del usuario:', user.correo);
      console.log('[AUTH] Hash de password almacenado:', user.password ? 'Existe' : 'No existe');
    }

    if (!user) {
      console.log('[AUTH] Usuario no encontrado para correo:', correo);
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    // 3. Comparar contraseñas
    console.log('[AUTH] Comparando contraseñas...');
    console.log('[AUTH] Password ingresado:', password);
    const isMatch = await user.comparePassword(password);
    console.log('[AUTH] Contraseñas coinciden:', isMatch);

    if (!isMatch) {
      console.log('[AUTH] Credenciales inválidas para usuario:', correo);
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas"
      });
    }

    console.log('[AUTH] Login exitoso para usuario:', correo);

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
    for (const key of Object.keys(updates)) {
      if (allowedFields.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    };

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
    if (!checkpermissions(req.userRole, [ROLES.ADMIN])) {
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

exports.forgotPassword = async (req, res) => {
  const { correo } = req.body;
  try {
    const user = await User.findOne({ correo });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Generar código de 6 dígitos
    const code = crypto.randomInt(100000, 1000000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

    user.resetPasswordCode = code;
    user.resetPasswordExpires = expires;
    await user.save();


    // Enviar el código por email: usamos logo adjunto (CID) para asegurar la tipografía
    try {
      const subject = 'Luckas - Código de recuperación';
      const plainText = `Tu código es: ${code}`;

      // Cabecera tipográfica para el correo: usar Bebas Neue y NO incluir imágenes.
      let attachments;
      const headerHtml = `
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">
        <div style="text-align:center;margin-bottom:12px;">
          <h1 style="margin:0 auto;color:#2563eb;font-family:'Bebas Neue', Arial, Helvetica, sans-serif;font-size:56px;font-weight:400;line-height:1;letter-spacing:2px;">LUCKAS</h1>
          <div style="font-size:13px;color:#64748b;margin-top:6px;font-family:Arial, Helvetica, sans-serif;">Sistema de Gestión Integral</div>
        </div>`;

      const html = `
        <div style="font-family: Arial, Helvetica, sans-serif; color:#1f2937;">
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td align="center" style="padding:20px 0;">
                <div style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;padding:24px;box-shadow:0 6px 18px rgba(16,24,40,0.06);">
                  ${headerHtml}

                  <div style="border-top:1px solid #eef2ff;padding-top:18px;margin-top:12px;">
                    <p style="margin:0 0 12px 0;color:#334155;">Hola,</p>
                    <p style="margin:0 0 18px 0;color:#334155;">Has solicitado recuperar la contraseña. Usa el siguiente código para continuar:</p>

                    <div style="display:inline-block;padding:18px 28px;border-radius:10px;background:linear-gradient(90deg,#eef2ff,#f8fafc);border:1px solid rgba(37,99,235,0.12);margin-bottom:16px;font-weight:700;font-size:28px;letter-spacing:6px;color:#0b1220;">
                      ${code}
                    </div>

                    <p style="margin:0;color:#64748b;font-size:13px;">Este código expira en 10 minutos. Si no fuiste tú, ignora este correo.</p>

                    <div style="margin-top:20px;padding-top:18px;border-top:1px dashed #e6edf9;display:flex;gap:12px;align-items:center;">
                      <div style="font-size:13px;color:#94a3b8;">Equipo Luckas</div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </div>
      `;

      await sendEmail(user.correo, subject, plainText, html, attachments);
    } catch (err) {
      return res.status(500).json({ message: 'Error al enviar el correo', error: err.message });
    }

    res.json({ message: 'Código enviado al correo electrónico' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};

exports.resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;
  try {
    // Validar parámetros requeridos
    if (!resetToken || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Token de restablecimiento y nueva contraseña son requeridos' 
      });
    }

    // Verificar y decodificar el token temporal
    let tokenData;
    try {
      tokenData = jwt.verify(resetToken, config.secret);
      if (tokenData.purpose !== 'password-reset') {
        throw new Error('Token inválido para este propósito');
      }
    } catch (jwtError) {
      console.warn('[RESET PASSWORD] Error verificando resetToken:', jwtError && jwtError.message ? jwtError.message : jwtError);
      return res.status(400).json({ 
        success: false, 
        message: 'Token inválido o expirado' 
      });
    }

    // Buscar el usuario por ID del token
    const user = await User.findById(tokenData.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    // Asignar nueva contraseña (el middleware pre('save') se encarga del hash)
    user.password = newPassword;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log('[RESET PASSWORD] Contraseña actualizada para usuario:', user.correo);

    return res.status(200).json({ 
      success: true, 
      message: 'Contraseña actualizada correctamente' 
    });
  } catch (error) {
    console.error('[AuthController] Error resetPassword:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error en el servidor', 
      error: error.message 
    });
  }
};

// Verificar que un código de recuperación sea válido (sin cambiar la contraseña)
exports.verifyResetCode = async (req, res) => {
  const { correo, code } = req.body;
  try {
    if (!correo || !code) {
      return res.status(400).json({ success: false, message: 'Correo y código son requeridos' });
    }

    const user = await User.findOne({
      correo,
      resetPasswordCode: code,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Código inválido o expirado' });
    }

    // Generar token temporal válido por 10 minutos para resetPassword
    const resetToken = jwt.sign(
      { 
        userId: user._id, 
        correo: user.correo,
        purpose: 'password-reset'
      },
      config.secret,
      { expiresIn: '10m' }
    );

    return res.status(200).json({ 
      success: true, 
      message: 'Código válido',
      resetToken: resetToken
    });
  } catch (error) {
    console.error('[AuthController] Error verifyResetCode:', error);
    return res.status(500).json({ success: false, message: 'Error en el servidor', error: error.message });
  }
};

