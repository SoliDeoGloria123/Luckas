const { connect } = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { normalizeTipoDocumento } = require('../utils/userValidation');
//const { use } = require('react');

//Obtener todos los usuarios (Solo Admin)
exports.getAllUsers = async (req, res) => {
    console.log('[CONTROLLER] Ejecutando getAllUsers');
    try {
        const users = await User.find().select('-password');
        console.log('[CONTROLLER] - getAllUsers Users found:', users.length);
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error('[CONTROLLER] - getAllUsers Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving users', error
        });
    }
};

//Obtener usuario espesifico
exports.getUserById = async(req, res)=>{
    try{
        console.log('[CONTROLLER] getUserById - req.userId:', req.userId);
        console.log('[CONTROLLER] getUserById - req.userRole:', req.userRole);
        console.log('[CONTROLLER] getUserById - params.id:', req.params.id);

        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        console.log('[CONTROLLER] getUserById - user._id:', user._id.toString());

        // Los administradores y tesoreros pueden ver cualquier usuario
        if (req.userRole === 'admin' || req.userRole === 'tesorero') {
            console.log('[CONTROLLER] Acceso permitido -', req.userRole, 'puede ver cualquier usuario');
            return res.status(200).json({
                success: true,
                user
            });
        }

        // Validaciones de acceso para otros roles (solo pueden ver su propio perfil)
        if (req.userRole === 'externo' && req.userId !== user._id.toString()) {
            console.log('[CONTROLLER] Acceso denegado - externo intentando ver otro usuario');
            return res.status(403).json({
                success: false,
                message: 'No puedes ver otro usuario'
            });
        }
        if (req.userRole === 'seminarista' && req.userId !== user._id.toString()) {
            console.log('[CONTROLLER] Acceso denegado - seminarista intentando ver otro usuario');
            return res.status(403).json({
                success: false,
                message: 'No puedes ver otro usuario'
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al optener usuario', error: error.message
        });
    }
};

// Obtener usuario por número de documento
exports.getUserByDocumento = async (req, res) => {
    try {
        const { numeroDocumento } = req.params;
        const user = await User.findOne({ numeroDocumento: numeroDocumento }).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al buscar usuario por documento', error: error.message });
    }
};

//Crear usurio 
exports.createUser = async (req, res) => {
    try {
        const { nombre, apellido, correo, telefono, tipoDocumento, numeroDocumento, fechaNacimiento, estado, password, role } = req.body;

        // Normalizar el tipo de documento
        const tipoDocumentoNormalizado = normalizeTipoDocumento(tipoDocumento);

        const user = new User({
            nombre,
            apellido,
            correo,
            telefono,
            tipoDocumento: tipoDocumentoNormalizado,
            numeroDocumento,
            fechaNacimiento,
            estado,
            password,
            role
        });
        const savedUser = await user.save();
        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            user: {
                id: savedUser._id,
                nombre: savedUser.nombre,
                apellido: savedUser.apellido,
                correo: savedUser.correo,
                telefono: savedUser.telefono,
                tipoDocumento: savedUser.tipoDocumento,
                numeroDocumento: savedUser.numeroDocumento,
                fechaNacimiento: savedUser.fechaNacimiento,
                estado: savedUser.estado,
                role: savedUser.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear usuario', error: error.message
        });
    }
};

// actualizar usuario (admin y coordinador)
exports.updateUser = async (req, res) => {
    try {
        // Normalizar el tipo de documento si está presente en la actualización
        if (req.body.tipoDocumento) {
            req.body.tipoDocumento = normalizeTipoDocumento(req.body.tipoDocumento);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Usuario  actualizado correcta mente',
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar usuario',
            error: error.message
        });
    }
};

// Actualizar perfil propio
exports.updateOwnProfile = async (req, res) => {
    console.log('[CONTROLLER] Ejecutando updateOwnProfile para usuario:', req.userId);
    try {
        const { nombre, apellido, telefono, correo } = req.body;
        
        // Validar que el usuario existe
        const user = await User.findById(req.userId);
        if (!user) {
            console.log('[CONTROLLER] Usuario no encontrado para actualizar perfil');
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Preparar datos de actualización (solo campos permitidos para perfil propio)
        const updateData = {};
        if (nombre) updateData.nombre = nombre;
        if (apellido) updateData.apellido = apellido;
        if (telefono) updateData.telefono = telefono;
        if (correo) updateData.correo = correo;

        console.log('[CONTROLLER] Datos a actualizar:', updateData);

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            updateData,
            { 
                new: true, 
                runValidators: true 
            }
        ).select('-password');

        if (!updatedUser) {
            console.log('[CONTROLLER] Error al actualizar perfil propio');
            return res.status(404).json({
                success: false,
                message: 'Error al actualizar perfil'
            });
        }

        console.log('[CONTROLLER] Perfil actualizado exitosamente:', updatedUser._id);
        res.status(200).json({
            success: true,
            message: 'Perfil actualizado correctamente',
            user: updatedUser
        });
    } catch (error) {
        console.error('[CONTROLLER] Error al actualizar perfil propio:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar perfil',
            error: error.message
        });
    }
};

// Cambiar contraseña propia
exports.changePassword = async (req, res) => {
    console.log('[CONTROLLER] Ejecutando changePassword para usuario:', req.userId);
    try {
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Se requieren la contraseña actual y la nueva contraseña'
            });
        }

        // Buscar usuario con contraseña incluida
        const user = await User.findById(req.userId).select('+password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Verificar contraseña actual
        const isCurrentPasswordValid = await user.comparePassword(currentPassword);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'La contraseña actual es incorrecta'
            });
        }

        // Actualizar con la nueva contraseña
        user.password = newPassword; // El middleware pre('save') se encargará del hashing
        await user.save();

        console.log('[CONTROLLER] Contraseña cambiada exitosamente para usuario:', req.userId);
        res.status(200).json({
            success: true,
            message: 'Contraseña cambiada correctamente'
        });
    } catch (error) {
        console.error('[CONTROLLER] Error al cambiar contraseña:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error al cambiar contraseña',
            error: error.message
        });
    }
};

// Eliminar usuaario (solo admin)
exports.deleteUser = async (req, res) => {
    console.log('[CONTROLLER ] Ejecutando deleteUser para ID:', req.params.id);//Diagnostico
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            console.log('[CONTROLLER] Usuario no encontrado para eliminar');//Diagnostico
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        console.log('[CONTROLLER] Usuario eliminado:', deletedUser._id);//Diagnostico
        res.status(200).json({
            success: true,
            message: 'Usuario eliminado correctamente'
        });
    } catch (error) {
        console.error('[CONTROLLER] Error al elimniar usuario', error.message);//Diagnostico
        res.status(500).json({
            success: false,
            message: 'Error al eliminar usuario'
        });
    }
};