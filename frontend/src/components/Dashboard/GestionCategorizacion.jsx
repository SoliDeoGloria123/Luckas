import { useState, useEffect } from "react";
import { categorizacionService } from "../../services/categorizacionService";
import TablaCategorias from "./Tablas/CategorizacionTabla";
import CategorizacionModal from "./Modales/CategorizacionModal";
import { mostrarAlerta, mostrarConfirmacion } from '../utils/alertas';
import { Search } from 'lucide-react';
import Sidebar from './Sidebar/Sidebar';
import Header from './Sidebar/Header';

const GestionCategorizacion = () => {
    const [categorias, setCategorias] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("");
    const [mostrarModal, setMostrarModal] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [sidebarAbierto, setSidebarAbierto] = useState(true);
    const [seccionActiva, setSeccionActiva] = useState("dashboard");
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
    const [nuevaCategoria, setNuevaCategoria] = useState({ nombre: "", codigo: "", estado: "activo" });
    const [estadisticas, setEstadisticas] = useState({ totalCategorias: 0, categoriasActivas: 0, categoriasInactivas: 0, nuevasEsteMes: 0 });

    // Obtener categorías
    const obtenerCategorias = async () => {
        try {
            const res = await categorizacionService.getAll();
            let lista = [];
            if (res) {
                if (Array.isArray(res)) lista = res;
                else if (res.data && Array.isArray(res.data)) lista = res.data;
                else if (res.data) lista = res.data;
            }
            setCategorias(lista);
            obtenerEstadisticas();
        } catch (error) {
            setCategorias([]);
            mostrarAlerta("Error", `No se pudieron obtener las categorías: ${error.message}`);
        }
    };
    useEffect(() => {
        obtenerCategorias();
    }, []);

    // Crear categoría
    const crearCategoria = async () => {
        try {
            await categorizacionService.create(nuevaCategoria);
            mostrarAlerta("¡EXITO!", "Categoría creada exitosamente");
            setNuevaCategoria({ nombre: "", codigo: "", estado: "activo" });
            setMostrarModal(false);
            obtenerCategorias();
        } catch (error) {
            mostrarAlerta("ERROR", `Error al crear la categoría: ${error.message}`);
        }
    };

    // Actualizar categoría
    const actualizarCategoria = async () => {
        try {
            await categorizacionService.update(categoriaSeleccionada._id, categoriaSeleccionada);
            mostrarAlerta("¡EXITO!", "Categoría actualizada exitosamente");
            setCategoriaSeleccionada(null);
            setModoEdicion(false);
            setMostrarModal(false);
            obtenerCategorias();
        } catch (error) {
            mostrarAlerta("ERROR", `Error al actualizar la categoría: ${error.message}`);
        }
    };

    // Eliminar categoría
    const eliminarCategoria = async (id) => {
        const confirmado = await mostrarConfirmacion(
            "¿Estás seguro?",
            "Esta acción eliminará el usuario de forma permanente."
        );
        if (!confirmado) return;
        try {
            await categorizacionService.delete(id);
            mostrarAlerta("¡Éxito!", "Categoría eliminada exitosamente");
            obtenerCategorias();
        } catch (error) {
            mostrarAlerta(`Error al eliminar la categoría: ${error.message}`);
        }
    };

    const obtenerEstadisticas = async () => {
        try {
            const stats = await categorizacionService.getStats();
            setEstadisticas(stats);
        } catch (error) {
            console.error("Error al obtener estadísticas de categorías:", error);
            // Manejar la excepción: notificar al usuario y restablecer estadísticas por defecto
            mostrarAlerta("Error", `No se pudieron obtener las estadísticas: ${error.message}`);
            setEstadisticas({ totalCategorias: 0, categoriasActivas: 0, categoriasInactivas: 0, nuevasEsteMes: 0 });
        }
    };

    const handleToggleEstado = async (categoria) => {
        const nuevoEstado = categoria.estado === "activo" ? "inactivo" : "activo";
        try {
            await categorizacionService.toggleActivation(categoria._id, nuevoEstado);
            mostrarAlerta("¡Éxito!", `Categoría actualizada a ${nuevoEstado}`);
            obtenerCategorias(); // refresca la lista
        } catch (error) {
            console.error("Error al cambiar estado de categoría:", error);
            mostrarAlerta("Error", `No se pudo actualizar el estado: ${error.message}`, 'error');
        }
    };



    // Abrir modal para crear
    const abrirModalCrear = () => {
        setModoEdicion(false);
        setNuevaCategoria({ nombre: "", codigo: "", estado: "activo" });
        setMostrarModal(true);
    };

    // Abrir modal para editar
    const abrirModalEditar = (categoria) => {
        setModoEdicion(true);
        setCategoriaSeleccionada({ ...categoria });
        setMostrarModal(true);
    };

    // Filtrado y paginación para categorías
    const categoriasFiltradas = Array.isArray(categorias)
        ? categorias.filter((cat) => {
            const texto = (busqueda || '').toLowerCase();
            const matchBusqueda =
                String(cat.nombre || '').toLowerCase().includes(texto) ||
                String(cat.codigo || '').toLowerCase().includes(texto);
            const matchEstado = !filtroEstado || String(cat.estado || '') === filtroEstado;
            return matchBusqueda && matchEstado;
        })
        : [];

    const [paginaActual, setPaginaActual] = useState(1);
    const registrosPorPagina = 10;
    const totalPaginas = Math.max(1, Math.ceil(categoriasFiltradas.length / registrosPorPagina));
    const categoriasPaginadas = categoriasFiltradas.slice(
        (paginaActual - 1) * registrosPorPagina,
        paginaActual * registrosPorPagina
    );

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
                <div className="space-y-7 fade-in-up p-9">
                    <div className="page-header-Academicos">
                        <div className="page-title-admin">
                            <h1>Gestión de Categorización</h1>
                            <p>Administra las categorías del sistema</p>
                        </div>
                        <button className="btn-admin btn-primary-admin" onClick={abrirModalCrear}>
                            + Nueva Categoría
                        </button>
                    </div>
                    <div className="dashboard-grid-reporte-admin">
                        <div className="stat-card-reporte-admin">
                            <div className="stat-icon-reporte-admin-admin users">
                                <i className="fas fa-layer-group"></i>
                            </div>
                            <div className="stat-info-admin">
                                <h3>{estadisticas.totalCategorias}</h3>
                                <p>Total Categorías</p>
                            </div>
                        </div>
                        <div className="stat-card-reporte-admin">
                            <div className="stat-icon-reporte-admin-admin active">
                                <i className="fas fa-check-circle"></i>
                            </div>
                            <div className="stat-info-admin">
                                <h3>{estadisticas.categoriasActivas}</h3>
                                <p>Categorías Activas</p>
                            </div>
                        </div>
                        <div className="stat-card-reporte-admin">
                            <div className="stat-icon-reporte-admin-admin admins">
                                <i className="fas fa-times-circle"></i>
                            </div>
                            <div className="stat-info-admin">
                                <h3>{estadisticas.categoriasInactivas}</h3>
                                <p>Categorías Inactivas</p>
                            </div>
                        </div>
                        <div className="stat-card-reporte-admin">
                            <div className="stat-icon-reporte-admin-admin new">
                                <i className="fas fa-plus-circle"></i>
                            </div>
                            <div className="stat-info-admin">
                                <h3>{estadisticas.nuevasEsteMes}</h3>
                                <p>Nuevas Este Mes</p>
                            </div>
                        </div>
                    </div>
                    <div className="glass-card rounded-2xl p-6 border border-white/20 shadow-lg">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                            <div className="relative flex-1 max-w-md">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar categorías..."
                                    value={busqueda}
                                    onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1); }}
                                    className="w-full pl-10 pr-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all"
                                />
                            </div>
                            <div className="flex space-x-3">
                                <select
                                    className="px-4 py-3 glass-card border border-slate-200/50 rounded-xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    value={filtroEstado}
                                    onChange={(e) => { setFiltroEstado(e.target.value); setPaginaActual(1); }}
                                >
                                    <option value="">Todos los Estados</option>
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 glass-card rounded-2xl border border-white/20 shadow-lg overflow-hidden user-card">
                        <TablaCategorias
                            categorias={categoriasPaginadas}
                            onEditar={abrirModalEditar}
                            onEliminar={eliminarCategoria}
                            onToggleEstado={handleToggleEstado}
                        />
                    </div>

                    <div className="pagination-admin flex items-center justify-center gap-4 mt-6">
                        <button
                            className="pagination-btn-admin"
                            onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
                            disabled={paginaActual === 1}
                        >
                            <i className="fas fa-chevron-left"></i>
                        </button>
                        <span className="pagination-info-admin">
                            Página {paginaActual} de {totalPaginas || 1}
                        </span>
                        <button
                            className="pagination-btn-admin"
                            onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
                            disabled={paginaActual === totalPaginas || totalPaginas === 0}
                        >
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
                 <CategorizacionModal
                        mostrar={mostrarModal}
                        modoEdicion={modoEdicion}
                        categoriaSeleccionada={categoriaSeleccionada}
                        setCategoriaSeleccionada={setCategoriaSeleccionada}
                        nuevaCategoria={nuevaCategoria}
                        setNuevaCategoria={setNuevaCategoria}
                        onClose={() => setMostrarModal(false)}
                        onSubmit={modoEdicion ? actualizarCategoria : crearCategoria}
                    />
            </div>

        </div>
    );
};

export default GestionCategorizacion;
