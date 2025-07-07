// controllers/categorizacionController.js
const Categorizacion = require('../models/categorizacion');
const Solicitud = require('../models/Solicitud');

// CREAR nueva categoría
const crearCategoria = async (req, res) => {
  try {
    console.log('[CATEGORIA] Datos recibidos:', req.body);
    const { nombre, codigo } = req.body;
    
    // Validar que se envíen los campos requeridos
    if (!nombre || !codigo) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y código son requeridos',
        datos: { nombre, codigo }
      });
    }
    
    // Verificar si el código ya existe
    const categoriaExistente = await Categorizacion.findOne({ codigo: codigo.toUpperCase() });
    if (categoriaExistente) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una categoría con ese código'
      });
    }

    // Verificar si el nombre ya existe
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
    console.log('[CATEGORIA] Creada exitosamente:', nuevaCategoria);

    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: nuevaCategoria
    });

  } catch (error) {
    console.error('Error al crear categoría:', error);
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
    console.log('[CATEGORIA] Obteniendo categorías...');
    const { activo } = req.query;
    
    let filtro = {};
    if (activo !== undefined) {
      filtro.activo = activo === 'true';
    }

    console.log('[CATEGORIA] Filtro aplicado:', filtro);
    const categorias = await Categorizacion.find(filtro)
      .populate('creadoPor', 'nombre apellido correo')
      .sort({ nombre: 1 });

    console.log('[CATEGORIA] Categorías encontradas:', categorias.length);
    res.json({
      success: true,
      data: categorias,
      total: categorias.length
    });

  } catch (error) {
    console.error('[CATEGORIA] Error al obtener categorías:', error);
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
    const id = mongoose.Types.ObjectId(req.params.id); // Conversión segura

    // Validar si el código ya existe en otra categoría
    if (codigo) {
      const categoriaExistente = await Categorizacion.findOne({
        codigo: codigo.toUpperCase(),
        _id: { $ne: id } // Excluir el mismo ID que estamos editando
      });

      if (categoriaExistente) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe una categoría con ese código'
        });
      }
    }

    // Validar si el nombre ya existe en otra categoría
    if (nombre) {
      const nombreExistente = await Categorizacion.findOne({
        nombre,
        _id: { $ne: id }
      });

      if (nombreExistente) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe una categoría con ese nombre'
        });
      }
    }

    const datosActualizacion = { nombre, activo };
    if (codigo) {
      datosActualizacion.codigo = codigo.toUpperCase();
    }

    const categoriaActualizada = await Categorizacion.findByIdAndUpdate(
      id,
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
    // Verificar si hay solicitudes usando esta categoría
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
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la categoría',
      error: error.message
    });
  }
};
// CATEGORIZAR una solicitud
const categorizarSolicitud = async (req, res) => {
  try {
    const { categoriaId } = req.body;
    const solicitudId = req.params.id;

    // Verificar que la categoría existe
    const categoria = await Categorizacion.findById(categoriaId);
    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    // Verificar que la solicitud existe
    const solicitud = await Solicitud.findById(solicitudId);
    if (!solicitud) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud no encontrada'
      });
    }

    // Actualizar la solicitud con la categoría
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