import React, { useState, useEffect } from "react";
import { cabanaService } from "../../services/cabanaService";
import { categorizacionService } from "../../services/categorizacionService";
import CabanaTabla from "./Tablas/CabanaTabla";
import CabanaModal from "./Modales/CabanaModal";
import { mostrarAlerta, mostrarConfirmacion } from '../utils/alertas';

const GestioCabañas = ({ readOnly = false, modoTesorero = false, canCreate = true, canEdit = true, canDelete = true }) => {
  const [cabanas, setCabanas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [cabanaSeleccionada, setCabanaSeleccionada] = useState(null);
  const [nuevaCabana, setNuevaCabana] = useState({
    nombre: "",
    descripcion: "",
    capacidad: "",
    categoria: "",
    precio: "",
    estado: "disponible",
    imagen: "",
    ubicacion: ""
  });
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerCabanas();
    obtenerCategorias();
  }, []);

  const obtenerCabanas = async () => {
    try {
      const data = await cabanaService.getAll();
      // Soporta respuesta tipo {data: [...]} o array directa
      let cabs = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
      setCabanas(cabs);
    } catch (err) {
      setError("Error al obtener cabañas: " + err.message);
    }
  };

  const obtenerCategorias = async () => {
    try {
      const data = await categorizacionService.getAll();
      // Soporta respuesta tipo {data: [...]} o array directa
      let cats = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
      setCategorias(cats);
    } catch (err) {
      setError("Error","Error al obtener categorías: " + err.message);
    }
  };
  // CRUD
  const crearCabana = async () => {
    try {
      const formData = new FormData();
      formData.append("nombre", nuevaCabana.nombre);
      formData.append("descripcion", nuevaCabana.descripcion);
      formData.append("capacidad", nuevaCabana.capacidad);
      formData.append("categoria", nuevaCabana.categoria);
      formData.append("precio", nuevaCabana.precio);
      formData.append("estado", nuevaCabana.estado);
      formData.append("ubicacion", nuevaCabana.ubicacion);

      if (Array.isArray(nuevaCabana.imagen)) {
        nuevaCabana.imagen.forEach(imagen => {
          formData.append("imagen",imagen);
        });
      }
      await cabanaService.create(formData);
      mostrarAlerta("¡Éxito!", "Cabaña creada exitosamente");
      setMostrarModal(false);
      setNuevaCabana({
        nombre: "",
        descripcion: "",
        capacidad: "",
        categoria: "",
        precio: "",
        estado: "disponible",
        imagen: [],
        ubicacion: ""
      });
      obtenerCabanas();
    } catch (error) {
      mostrarAlerta("Error", "Error al crear la cabaña: " + error.message, "error");
    }
  };

  const actualizarCabana = async () => {
    try {
      await cabanaService.update(cabanaSeleccionada._id, cabanaSeleccionada);
      mostrarAlerta("¡Éxito!", "Cabaña actualizada exitosamente");
      setMostrarModal(false);
      setCabanaSeleccionada(null);
      setModoEdicion(false);
      obtenerCabanas();
    } catch (err) {
      mostrarAlerta("Error", "Error al actualizar cabaña: " + err.message);
    }
  };

  const eliminarCabana = async (id) => {
    const confirmado = await mostrarConfirmacion(
      "¿Estás seguro?",
      "Esta acción eliminará el usuario de forma permanente."
    );

    if (!confirmado) return;
    try {
      await cabanaService.delete(id);
      mostrarAlerta("¡Éxito!", "Cabaña eliminada exitosamente");
      obtenerCabanas();
    } catch (err) {
      mostrarAlerta("Error", "Error al eliminar cabaña: " + err.message);
    }
  };

  // Modal handlers
  const abrirModalCrear = () => {
    setModoEdicion(false);
    setNuevaCabana({
      nombre: "",
      descripcion: "",
      capacidad: "",
      categoria: "",
      precio: "",
      estado: "disponible",
      imagen: "",
      ubicacion: ""
    });
    setMostrarModal(true);
  };

  const abrirModalEditar = (cabana) => {
    setModoEdicion(true);
    setCabanaSeleccionada(cabana);
    setMostrarModal(true);
  };

  // Search filter
  const cabanasFiltradas = cabanas.filter(c => {
    const texto = `${c.nombre} ${c.descripcion} ${c.estado}`.toLowerCase();
    return texto.includes(busqueda.toLowerCase());
  });

  const [modalImagen, setModalImagen] = useState({ abierto: false, imagenes: [], actual: 0 });

  const handleVerImagenes = (imagenes) => {
    if (Array.isArray(imagenes) && imagenes.length > 0) {
      setModalImagen({ abierto: true, imagenes, actual: 0 });
    }
  };

  const handleNext = () => {
    setModalImagen(prev => ({
      ...prev,
      actual: (prev.actual + 1) % prev.imagenes.length
    }));
  };

  const handlePrev = () => {
    setModalImagen(prev => ({
      ...prev,
      actual: (prev.actual - 1 + prev.imagenes.length) % prev.imagenes.length
    }));
  };

  const cerrarModalImagen = () => {
    setModalImagen({ abierto: false, imagenes: [], actual: 0 });
  };
  return (
    <div className="seccion-usuarios">
      <div className="page-header-Academicos">
        <h1 className="titulo-admin">Gestión de Cabañas</h1>
        {canCreate && !readOnly && (
          <button className="btn-admin" onClick={abrirModalCrear}>
            ➕ Nueva Cabaña
          </button>
        )}
      </div>
      <section className="filtros-section-admin">
        <div className="busqueda-contenedor">
          <i class="fas fa-search"></i>
          <input
            type="text"
            placeholder="Buscar Cabaña..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="input-busqueda"
          />
        </div>
        <div className="filtro-grupo-admin">
          <select className="filtro-dropdown">
            <option>Todos los Roles</option>
            <option>Administrador</option>
            <option>Seminarista</option>
            <option>Tesorero</option>
            <option>Usuario Externo</option>
          </select>
          <select className="filtro-dropdown">
            <option>Todos los Estados</option>
            <option>Activo</option>
            <option>Inactivo</option>
            <option>Pendiente</option>
          </select>
        </div>


        {error && <div className="error-message">{error}</div>}
        <CabanaTabla
          cabanas={cabanasFiltradas}
          onEditar={canEdit && !readOnly ? abrirModalEditar : null}
          onEliminar={canDelete && !modoTesorero && !readOnly ? eliminarCabana : null}
          onVerImagen={handleVerImagenes}
        />
        {modalImagen.abierto && (
          <div className="modal-overlay" onClick={cerrarModalImagen}>
            <div className="modal-imagines modal-imagines" onClick={(e) => e.stopPropagation()}>
              <button className="btn-cerrar" onClick={cerrarModalImagen}>✖</button>
              <button className="btn-flecha izquierda" onClick={handlePrev}>◀</button>
              <img
                src={`http://localhost:3000/uploads/cabanas/${modalImagen.imagenes[modalImagen.actual]}`}
                alt="Imagen de la cabaña"
                className="imagen-modal"
              />
              <button className="btn-flecha derecha" onClick={handleNext}>▶</button>
            </div>
          </div>
        )}
      </section>
      <CabanaModal
        mostrar={mostrarModal}
        modoEdicion={modoEdicion}
        cabanaSeleccionada={cabanaSeleccionada}
        setCabanaSeleccionada={setCabanaSeleccionada}
        nuevaCabana={nuevaCabana}
        setNuevaCabana={setNuevaCabana}
        onClose={() => setMostrarModal(false)}
        onSubmit={modoEdicion ? actualizarCabana : crearCabana}
        categorias={categorias}
      />
    </div>
  );
};

export default GestioCabañas;
