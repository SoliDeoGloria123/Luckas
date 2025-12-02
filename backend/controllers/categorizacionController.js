const mongoose = require('mongoose'); 
const Categorizacion = require('../models/categorizacion');
const Solicitud = require('../models/Solicitud');
const Eventos = require('../models/Eventos');
const Cabana = require('../models/Cabana');
const ProgramaAcademico = require('../models/ProgramaAcademico');
const Inscripcion = require('../models/Inscripciones');

// CREAR nueva categoría
const crearCategoria = async (req, res) => {
  try {
  
    const { nombre, codigo, tipo } = req.body;

    if (!nombre || !codigo || !tipo) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, código y tipo son requeridos',
        datos: { nombre, codigo, tipo }
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
      tipo,
      estado: 'activo', // Por defecto, nueva categoría está activa
      creadoPor: req.userId
    });

    await nuevaCategoria.save();

    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: nuevaCategoria
    });

  } catch (error) {

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
    const { nombre, codigo, tipo, estado } = req.body;
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido'
      });
    }
  const objectId = mongoose.Types.ObjectId.createFromHexString(id);

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

    if (nombre) {
      datosActualizacion.nombre = nombre;
    }

    if (estado && ['activo', 'inactivo'].includes(estado)) {
      datosActualizacion.estado = estado;
    }

    if (codigo) {
      datosActualizacion.codigo = codigo.toUpperCase();
    }

    if (tipo) {
      datosActualizacion.tipo = tipo;
    }

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
          tipo: categoria.tipo,
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

// ACTIVAR/DESACTIVAR categoría (usando campo 'estado')
const activarDesactivarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body; // 'activo' o 'inactivo'
    if (!['activo', 'inactivo'].includes(estado)) {
      return res.status(400).json({ success: false, message: 'El campo "estado" debe ser "activo" o "inactivo".' });
    }
    // Si intentan desactivar, comprobar asociaciones en modelos que usan categoría
    if (estado === 'inactivo') {
      const asociaciones = await obtenerAsociacionesCategoria(id);
      if (asociaciones.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'No se puede desactivar la categoría porque está asociada a otras entidades',
          asociaciones
        });
      }
    }

    const categoria = await Categorizacion.findByIdAndUpdate(id, { estado }, { new: true });
    if (!categoria) {
      return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
    }

    res.json({ success: true, message: `Categoría actualizada a ${estado}`, data: categoria });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar estado', error: error.message });
  }
};

// Helper: retorna lista de asociaciones encontradas para una categoría
const obtenerAsociacionesCategoria = async (categoriaId) => {
  const asociaciones = [];
  const [countSolicitudes, countEventos, countCabanas, countProgramas, countInscripciones] = await Promise.all([
    Solicitud.countDocuments({ categoria: categoriaId }),
    Eventos.countDocuments({ categoria: categoriaId }),
    Cabana.countDocuments({ categoria: categoriaId }),
    ProgramaAcademico.countDocuments({ categoria: categoriaId }),
    Inscripcion.countDocuments({ categoria: categoriaId })
  ]);

  if (countSolicitudes > 0) asociaciones.push({ entidad: 'Solicitudes', count: countSolicitudes });
  if (countEventos > 0) asociaciones.push({ entidad: 'Eventos', count: countEventos });
  if (countCabanas > 0) asociaciones.push({ entidad: 'Cabañas', count: countCabanas });
  if (countProgramas > 0) asociaciones.push({ entidad: 'Programas', count: countProgramas });
  if (countInscripciones > 0) asociaciones.push({ entidad: 'Inscripciones', count: countInscripciones });

  return asociaciones;
};

// ESTADÍSTICAS de categorías
const estadisticasCategorias = async (req, res) => {
  try {
    const total = await Categorizacion.countDocuments();
    const activo = await Categorizacion.countDocuments({ estado: 'activo' });
    const inactivo = await Categorizacion.countDocuments({ estado: 'inactivo' });
    // Nuevas este mes
    const now = new Date();
    const primerDiaMes = new Date(now.getFullYear(), now.getMonth(), 1);
    const nuevasEsteMes = await Categorizacion.countDocuments({ createdAt: { $gte: primerDiaMes } });
    res.json({
      success: true,
      stats: {
        totalCategorias: total,
        categoriasActivas: activo,
        categoriasInactivas: inactivo,
        nuevasEsteMes
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener estadísticas', error: error.message });
  }
};

module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoriaPorId,
  actualizarCategoria,
  eliminarCategoria,
  categorizarSolicitud,
  activarDesactivarCategoria,
  estadisticasCategorias
};
