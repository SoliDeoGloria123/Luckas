const mongoose = require('mongoose'); // 👈 IMPORTANTE
const Categorizacion = require('../models/categorizacion');
const Solicitud = require('../models/Solicitud');

// CREAR nueva categoría
const crearCategoria = async (req, res) => {
  try {
    console.log('[CATEGORIA] Datos recibidos:', req.body);
    const { nombre, codigo } = req.body;

    if (!nombre || !codigo) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y código son requeridos',
        datos: { nombre, codigo }
      });
    }

    const categoriaExistente = await Categorizacion.findOne({ codigo: codigo.toUpperCase() });
    if (categoriaExistente) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una categoría con ese código'
      });
    }

    const nombreExistente = await Categorizacion.findOne({ nombre });
    if (nombreExistente) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una categoría con ese nombre'
      });
    }

    const nuevaCategoria = new Categorizacion({
      nombre,
      codigo: codigo.toUpperCase(),
      creadoPor: req.userId
    });

    await nuevaCategoria.save();

    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: nuevaCategoria
    });

  } catch (error) {
    console.error('[CATEGORIA] Error al crear:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear la categoría',
      error: error.message
    });
  }
};

// OBTENER todas las categorías
const obtenerCategorias = async (req, res) => {
  try {
    const { activo } = req.query;
    let filtro = {};

    if (activo !== undefined) {
      filtro.activo = activo === 'true';
    }

    const categorias = await Categorizacion.find(filtro)
      .populate('creadoPor', 'nombre apellido correo')
      .sort({ nombre: 1 });

    res.json({
      success: true,
      data: categorias,
      total: categorias.length
    });

  } catch (error) {
    console.error('[CATEGORIA] Error al obtener:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las categorías',
      error: error.message
    });
  }
};

// OBTENER categoría por ID
const obtenerCategoriaPorId = async (req, res) => {
  try {
    const categoria = await Categorizacion.findById(req.params.id)
      .populate('creadoPor', 'nombre apellido correo');

    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    res.json({
      success: true,
      data: categoria
    });

  } catch (error) {
    console.error('[CATEGORIA] Error al buscar por ID:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la categoría',
      error: error.message
    });
  }
};

// ACTUALIZAR categoría
const actualizarCategoria = async (req, res) => {
  try {
    const { nombre, codigo, activo } = req.body;
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido'
      });
    }

    const objectId = new mongoose.Types.ObjectId(id);

    if (codigo) {
      const categoriaExistente = await Categorizacion.findOne({
        codigo: codigo.toUpperCase(),
        _id: { $ne: objectId }
      });

      if (categoriaExistente) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe una categoría con ese código'
        });
      }
    }

    if (nombre) {
      const nombreExistente = await Categorizacion.findOne({
        nombre,
        _id: { $ne: objectId }
      });

      if (nombreExistente) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe una categoría con ese nombre'
        });
      }
    }

    const datosActualizacion = {};
    if (nombre) datosActualizacion.nombre = nombre;
    if (typeof activo === 'boolean') datosActualizacion.activo = activo;
    if (codigo) datosActualizacion.codigo = codigo.toUpperCase();

    const categoriaActualizada = await Categorizacion.findByIdAndUpdate(
      objectId,
      datosActualizacion,
      { new: true, runValidators: true }
    );

    if (!categoriaActualizada) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Categoría actualizada exitosamente',
      data: categoriaActualizada
    });

  } catch (error) {
    console.error('[CATEGORIA] Error al actualizar:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la categoría',
      error: error.message
    });
  }
};

// ELIMINAR categoría
const eliminarCategoria = async (req, res) => {
  try {
    const solicitudesConCategoria = await Solicitud.countDocuments({
      'categoria.id': req.params.id
    });

    if (solicitudesConCategoria > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar la categoría porque tiene ${solicitudesConCategoria} solicitudes asociadas`
      });
    }

    const categoriaEliminada = await Categorizacion.findByIdAndDelete(req.params.id);

    if (!categoriaEliminada) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Categoría eliminada exitosamente'
    });

  } catch (error) {
    console.error('[CATEGORIA] Error al eliminar:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la categoría',
      error: error.message
    });
  }
};

// CATEGORIZAR solicitud
const categorizarSolicitud = async (req, res) => {
  try {
    const { categoriaId } = req.body;
    const solicitudId = req.params.id;

    const categoria = await Categorizacion.findById(categoriaId);
    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    const solicitud = await Solicitud.findById(solicitudId);
    if (!solicitud) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud no encontrada'
      });
    }

    const solicitudActualizada = await Solicitud.findByIdAndUpdate(
      solicitudId,
      {
        categoria: {
          id: categoria._id,
          nombre: categoria.nombre,
          codigo: categoria.codigo
        },
        estado: 'categorizada',
        fechaCategorizacion: new Date(),
        categorizadoPor: req.usuario.id
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Solicitud categorizada exitosamente',
      data: solicitudActualizada
    });

  } catch (error) {
    console.error('[CATEGORIA] Error al categorizar solicitud:', error);
    res.status(500).json({
      success: false,
      message: 'Error al categorizar la solicitud',
      error: error.message
    });
  }
};

module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoriaPorId,
  actualizarCategoria,
  eliminarCategoria,
  categorizarSolicitud
};
