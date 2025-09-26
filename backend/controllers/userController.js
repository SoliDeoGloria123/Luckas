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
        const { nombre, apellido, correo, telefono, tipoDocumento, numeroDocumento, fechaNacimiento, estado, password, role } = req.body;

        // Validación de formato de teléfono
        if (!/^[0-9]{7,15}$/.test(telefono)) {
            return res.status(400).json({
                success: false,
                message: 'El teléfono debe contener solo dígitos y tener entre 7 y 15 caracteres.'
            });
        }

        // Validación de tipo de documento
        const tipoDocumentoNormalizado = normalizeTipoDocumento(tipoDocumento);
        const tiposValidos = ['Cédula de ciudadanía', 'Cédula de extranjería', 'Pasaporte', 'Tarjeta de identidad'];
        if (!tiposValidos.includes(tipoDocumentoNormalizado)) {
            return res.status(400).json({
                success: false,
                message: 'Tipo de documento inválido.'
            });
        }

        // Validación de duplicados
        const existeCorreo = await User.findOne({ correo });
        if (existeCorreo) {
            return res.status(409).json({
                success: false,
                message: 'El correo ya está registrado.'
            });
        }
        const existeTelefono = await User.findOne({ telefono });
        if (existeTelefono) {
            return res.status(409).json({
                success: false,
                message: 'El teléfono ya está registrado.'
            });
        }
        const existeDocumento = await User.findOne({ numeroDocumento });
        if (existeDocumento) {
            return res.status(409).json({
                success: false,
                message: 'El número de documento ya está registrado.'
            });
        }

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
        // Error de validación de mongoose
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Error de validación',
                error: error.message
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error al crear usuario',
            error: error.message
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
};