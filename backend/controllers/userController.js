const { connect } = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { normalizeTipoDocumento } = require('../utils/userValidation');

//Obtener todos los usuarios (Admin tesorero)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving users', error
        });
    }
};

//Obtener usuario espesifico
exports.getUserById = async (req, res) => {
    try {

        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }


        // Los administradores y tesoreros pueden ver cualquier usuario
        if (req.userRole === 'admin' || req.userRole === 'tesorero') {
            return res.status(200).json({
                success: true,
                user
            });
        }

        // Validaciones de acceso para otros roles (solo pueden ver su propio perfil)
        if (req.userRole === 'externo' && req.userId !== user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'No puedes ver otro usuario'
            });
        }
        if (req.userRole === 'seminarista' && req.userId !== user._id.toString()) {
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

// actualizar usuario (admin y tesorero)
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

// Actualizar perfil propio usuarios
exports.updateOwnProfile = async (req, res) => {
    try {
        const {
            nombre,
            apellido,
            telefono,
            correo,
            tipoDocumento,
            numeroDocumento,
            fechaNacimiento,
            direccion,
            nivelAcademico,
            directorEspiritual,
            idiomas,
            especialidad
        } = req.body;

        // Validar que el usuario existe
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Preparar datos de actualización (solo campos permitidos para perfil propio)
        const updateData = {};
        if (nombre !== undefined) updateData.nombre = nombre;
        if (apellido !== undefined) updateData.apellido = apellido;
        if (telefono !== undefined) updateData.telefono = telefono;
        if (correo !== undefined) updateData.correo = correo;
        if (tipoDocumento !== undefined) updateData.tipoDocumento = tipoDocumento;
        if (numeroDocumento !== undefined) updateData.numeroDocumento = numeroDocumento;
        if (fechaNacimiento !== undefined) updateData.fechaNacimiento = fechaNacimiento;
        if (direccion !== undefined) updateData.direccion = direccion;
        if (nivelAcademico !== undefined) updateData.nivelAcademico = nivelAcademico;
        if (directorEspiritual !== undefined) updateData.directorEspiritual = directorEspiritual;
        if (idiomas !== undefined) updateData.idiomas = idiomas;
        if (especialidad !== undefined) updateData.especialidad = especialidad;


        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            updateData,
            {
                new: true,
                runValidators: false // Desactivar validadores para evitar problemas con documentos existentes
            }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'Error al actualizar perfil'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Perfil actualizado correctamente',
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar perfil',
            error: error.message
        });
    }
};

// Cambiar contraseña propia
exports.changePassword = async (req, res) => {
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
        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            message: 'Contraseña cambiada correctamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al cambiar contraseña',
            error: error.message
        });
    }
};
// Estadísticas de usuarios para dashboard
exports.getUserStats = async (req, res) => {
    try {
        const total = await User.countDocuments();
        const activos = await User.countDocuments({ estado: 'activo' });
        const administradores = await User.countDocuments({ role: 'admin' });
        // Nuevos este mes
        const now = new Date();
        const primerDiaMes = new Date(now.getFullYear(), now.getMonth(), 1);
        const nuevosEsteMes = await User.countDocuments({ createdAt: { $gte: primerDiaMes } });
        res.json({
            success: true,
            stats: {
                totalUsuarios: total,
                usuariosActivos: activos,
                administradores,
                nuevosEsteMes
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener estadísticas', error: error.message });
    }
};
// Activar/desactivar usuario por ID
exports.toggleUserActivation = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body; // 'activo' o 'inactivo'
        if (!['activo', 'inactivo'].includes(estado)) {
            return res.status(400).json({ success: false, message: 'Estado inválido' });
        }
        const user = await User.findByIdAndUpdate(id, { estado }, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
        res.json({ success: true, message: `Usuario actualizado a ${estado}`, user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar estado', error: error.message });
    }
};


// Eliminar usuaario (solo admin)
exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Usuario eliminado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar usuario'
        });
    }
};