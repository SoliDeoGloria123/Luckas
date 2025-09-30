import React, { useState, useEffect } from "react";
import { cabanaService } from "../../services/cabanaService";
import { categorizacionService } from "../../services/categorizacionService";
import CabanaTabla from "./Tablas/CabanaTabla";
import CabanaModal from "./Modales/CabanaModal";
import { mostrarAlerta, mostrarConfirmacion } from '../utils/alertas';
import Sidebar from './Sidebar/Sidebar';
import Header from './Sidebar/Header';
import {
  Plus,
  X,
} from 'lucide-react';

const GestioCabañas = ({ readOnly = false, modoTesorero = false, canCreate = true, canEdit = true, canDelete = true }) => {
  const [cabanas, setCabanas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [sidebarAbierto, setSidebarAbierto] = useState(true);
  const [seccionActiva, setSeccionActiva] = useState("dashboard");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [cabanaSeleccionada, setCabanaSeleccionada] = useState(null);
  const [eventoDetalle, setEventoDetalle] = useState(null);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
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
      setError("Error", "Error al obtener categorías: " + err.message);
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
          formData.append("imagen", imagen);
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

  const abrirModalVer = (evento) => {
    setEventoDetalle(evento);
    setMostrarModalDetalle(true);
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


  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-bg)' }}>
      <Sidebar
        sidebarAbierto={sidebarAbierto}
        setSidebarAbierto={setSidebarAbierto}
        seccionActiva={seccionActiva}
        setSeccionActiva={setSeccionActiva}
      />
      <div className={`transition-all duration-300 ${sidebarAbierto ? 'ml-72' : 'ml-20'}`}>
        <Header
          sidebarAbierto={sidebarAbierto}
          setSidebarAbierto={setSidebarAbierto}
          seccionActiva={seccionActiva}
        />
        <div className="seccion-usuarios">
          <div className="p-9 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Gestión de Cabañas</h1>
              <p className="text-slate-600">Administra las cabañas y alojamientos del seminario</p>
            </div>
            <button
              onClick={abrirModalCrear}
              className="btn-premium flex items-center space-x-2 px-4 py-2 text-white rounded-xl font-medium shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Cabaña</span>
            </button>
          </div>
          <div className="dashboard-grid-reporte-admin">
            <div className="stat-card-reporte-admin">
              <div className="stat-icon-reporte-admin-admin users">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-info-admin">
                <h3>5</h3>
                <p>Total Usuarios</p>
              </div>
            </div>
            <div className="stat-card-reporte-admin">
              <div className="stat-icon-reporte-admin-admin active">
                <i className="fas fa-user-check"></i>
              </div>
              <div className="stat-info-admin">
                <h3>4</h3>
                <p>Usuarios Activos</p>
              </div>
            </div>
            <div className="stat-card-reporte-admin">
              <div className="stat-icon-reporte-admin-admin admins">
                <i className="fas fa-user-shield"></i>
              </div>
              <div className="stat-info-admin">
                <h3>1</h3>
                <p>Administradores</p>
              </div>
            </div>
            <div className="stat-card-reporte-admin">
              <div className="stat-icon-reporte-admin-admin new">
                <i className="fas fa-user-plus"></i>
              </div>
              <div className="stat-info-admin">
                <h3>12</h3>
                <p>Nuevos Este Mes</p>
              </div>
            </div>
          </div>
          {mostrarModalDetalle && eventoDetalle && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
                <button
                  className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                  onClick={() => setMostrarModalDetalle(false)}
                >
                  <X size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-4">{eventoDetalle.nombre}</h2>
                <p className="mb-2"><strong>Descripción:</strong> {eventoDetalle.descripcion}</p>
                <p className="mb-2"><strong>Categoría:</strong> {eventoDetalle.categoria?.nombre || eventoDetalle.categoria}</p>
                <p className="mb-2"><strong>Capacidad:</strong> {eventoDetalle.capacidad}</p>
                <p className="mb-2"><strong>Precio:</strong> ${eventoDetalle.precio}</p>
                <p className="mb-2"><strong>Ubicación:</strong> {eventoDetalle.ubicacion}</p>
                <p className="mb-2"><strong>Estado:</strong> {eventoDetalle.estado}</p>
                <p className="mb-2"><strong>Creado por:</strong> {eventoDetalle.creadoPor?.nombre || eventoDetalle.creadoPor}</p>
                <div className="flex flex-wrap gap-2 my-4">
                  {Array.isArray(eventoDetalle.imagen) && eventoDetalle.imagen.length > 0 ? (
                    eventoDetalle.imagen.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Imagen ${idx + 1}`}
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                    ))
                  ) : (
                    <span className="text-gray-400">Sin imágenes</span>
                  )}
                </div>
                <div className="text-xs text-gray-400">
                  <span>Creado: {eventoDetalle.createdAt ? new Date(eventoDetalle.createdAt).toLocaleString() : "N/A"}</span>
                  <span className="ml-4">Actualizado: {eventoDetalle.updatedAt ? new Date(eventoDetalle.updatedAt).toLocaleString() : "N/A"}</span>
                </div>
                <button
                  onClick={() => setMostrarModalDetalle(false)}
                  className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}


          <CabanaTabla
            cabanas={cabanasFiltradas}
            onEditar={canEdit && !readOnly ? abrirModalEditar : null}
            onEliminar={canDelete && !modoTesorero && !readOnly ? eliminarCabana : null}
            onVerDetalle={abrirModalVer}
            onInsertar={abrirModalCrear}
            nuevaCabana={nuevaCabana}
            setNuevaCabana={setNuevaCabana}
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
      </div>
    </div>
  );
};

export default GestioCabañas;
