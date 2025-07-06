import React, { useState, useEffect } from "react";
import { cabanaService } from "../../services/cabanaService";
import { categorizacionService } from "../../services/categorizacionService";
import CabanaTabla from "./Tablas/CabanaTabla";
import CabanaModal from "./Modales/CabanaModal";

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
      setError("Error al obtener categorías: " + err.message);
    }
  };

  // CRUD
  const crearCabana = async () => {
    try {
      await cabanaService.create(nuevaCabana);
      setMostrarModal(false);
      setNuevaCabana({
        nombre: "",
        descripcion: "",
        capacidad: "",
        categoria: "",
        estado: "disponible",
        imagen: "",
        ubicacion: ""
      });
      obtenerCabanas();
    } catch (err) {
      setError("Error al crear la cabaña: " + err.message);
    }
  };

  const actualizarCabana = async () => {
    try {
      await cabanaService.update(cabanaSeleccionada._id, cabanaSeleccionada);
      setMostrarModal(false);
      setCabanaSeleccionada(null);
      setModoEdicion(false);
      obtenerCabanas();
    } catch (err) {
      setError("Error al actualizar cabaña: " + err.message);
    }
  };

  const eliminarCabana = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta cabaña?")) return;
    try {
      await cabanaService.delete(id);
      obtenerCabanas();
    } catch (err) {
      setError("Error al eliminar cabaña: " + err.message);
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

  return (
    <div className="seccion-usuarios">
      <div className="seccion-header">
        <h2>Gestión de Cabañas</h2>
        {canCreate && !readOnly && (
          <button className="btn-primary" onClick={abrirModalCrear}>
            ➕ Nueva Cabaña
          </button>
        )}
      </div>
      <div className="busqueda-contenedor">
        <input
          type="text"
          placeholder="🔍 Buscar Cabaña..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="input-busqueda"
        />
      </div>
      {error && <div className="error-message">{error}</div>}
      <CabanaTabla
        cabanas={cabanasFiltradas}
        onEditar={canEdit && !readOnly ? abrirModalEditar : null}
        onEliminar={canDelete && !modoTesorero && !readOnly ? eliminarCabana : null}
      />
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
