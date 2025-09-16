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
exports.getUserById = async (req, res) => {
    try {
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
        const { nombre, apellido, correo, telefono, tipoDocumento, numeroDocumento, estado, password, role } = req.body;

        // Normalizar el tipo de documento
        const tipoDocumentoNormalizado = normalizeTipoDocumento(tipoDocumento);

        const user = new User({
            nombre,
            apellido,
            correo,
            telefono,
            tipoDocumento: tipoDocumentoNormalizado,
            numeroDocumento,
            estado,
            password: await bcrypt.hash(password, 10),
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
}

// Actualizar perfil del usuario autenticado
exports.updateProfile = async (req, res) => {
    try {
        console.log('[CONTROLLER] Actualizando perfil para usuario:', req.userId);
        console.log('[CONTROLLER] Datos recibidos:', req.body);
        console.log('[CONTROLLER] Archivo recibido:', req.file ? req.file.filename : 'No hay archivo');
        
        const { nombre, apellido, correo, telefono, direccion } = req.body;
        
        // Verificar si el correo ya existe en otro usuario
        if (correo) {
            const existingUser = await User.findOne({ 
                correo, 
                _id: { $ne: req.userId } 
            });
            
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'El correo electrónico ya está en uso'
                });
            }
        }

        const updateData = {};
        if (nombre) updateData.nombre = nombre;
        if (apellido) updateData.apellido = apellido;
        if (correo) updateData.correo = correo;
        if (telefono) updateData.telefono = telefono;
        if (direccion) updateData.direccion = direccion;

        // Si hay archivo de imagen (foto de perfil)
        if (req.file) {
            updateData.fotoPerfil = `/uploads/perfiles/${req.file.filename}`;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        console.log('[CONTROLLER] Perfil actualizado exitosamente');
        res.status(200).json({
            success: true,
            message: 'Perfil actualizado exitosamente',
            data: updatedUser
        });

    } catch (error) {
        console.error('[CONTROLLER] Error al actualizar perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar perfil'
        });
    }
}

// Cambiar contraseña del usuario autenticado
exports.changePassword = async (req, res) => {
    try {
        console.log('[CONTROLLER] Cambiando contraseña para usuario:', req.userId);
        
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Se requiere la contraseña actual y la nueva contraseña'
            });
        }

        // Buscar el usuario
        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Verificar la contraseña actual
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        
        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'La contraseña actual es incorrecta'
            });
        }

        // Validar nueva contraseña
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'La nueva contraseña debe tener al menos 6 caracteres'
            });
        }

        // Hashear la nueva contraseña
        const saltRounds = 12;
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

        // Actualizar la contraseña
        await User.findByIdAndUpdate(req.userId, {
            password: hashedNewPassword
        });

        console.log('[CONTROLLER] Contraseña actualizada exitosamente');
        res.status(200).json({
            success: true,
            message: 'Contraseña actualizada exitosamente'
        });

    } catch (error) {
        console.error('[CONTROLLER] Error al cambiar contraseña:', error);
        res.status(500).json({
            success: false,
            message: 'Error al cambiar contraseña'
        });
    }
};

// Obtener inscripciones del usuario autenticado
exports.getMyInscripciones = async (req, res) => {
    try {
        console.log('[CONTROLLER] Obteniendo inscripciones para usuario:', req.userId);
        
        const Curso = require('../models/Curso');
        const Eventos = require('../models/Eventos');
        
        // Buscar cursos donde el usuario está inscrito
        const cursos = await Curso.find({
            'inscripciones.usuario': req.userId
        }).populate('inscripciones.usuario', 'nombre apellido correo');
        
        const inscripciones = [];
        
        // Agregar cursos
        cursos.forEach(curso => {
            const inscripcion = curso.inscripciones.find(ins => 
                ins.usuario._id.toString() === req.userId
            );
            if (inscripcion) {
                inscripciones.push({
                    tipo: 'curso',
                    cursoId: curso._id,
                    eventoId: null,
                    nombre: curso.nombre,
                    descripcion: curso.descripcion,
                    fechaInscripcion: inscripcion.fechaInscripcion,
                    estado: inscripcion.estado
                });
            }
        });
        
        res.json({
            success: true,
            data: inscripciones
        });
        
    } catch (error) {
        console.error('[CONTROLLER] Error al obtener inscripciones:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};