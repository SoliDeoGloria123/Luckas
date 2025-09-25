import { useState, useEffect } from "react";
import { categorizacionService } from "../../services/categorizacionService";
import TablaCategorias from "./Tablas/CategorizacionTabla";
import CategorizacionModal from "./Modales/CategorizacionModal";
import { mostrarAlerta, mostrarConfirmacion } from '../utils/alertas';
import Sidebar from './Sidebar/Sidebar';
import Header from './Sidebar/Header';

const GestionCategorizacion = () => {
    const [categorias, setCategorias] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [sidebarAbierto, setSidebarAbierto] = useState(true);
    const [seccionActiva, setSeccionActiva] = useState("dashboard");
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
    const [nuevaCategoria, setNuevaCategoria] = useState({ nombre: "", codigo: "", estado: "activo" });

    // Obtener categorías
    const obtenerCategorias = async () => {
        try {
            const res = await categorizacionService.getAll();
            setCategorias(res.data || []);
        } catch (error) {
            setCategorias([]);
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
                    <div className="page-header-Academicos">
                        <div className="page-title-admin">
                            <h1>Gestión de Categorización</h1>
                            <p>Administra las cuentas de usuario del sistema</p>
                        </div>
                        <button className="btn-admin btn-primary-admin" onClick={abrirModalCrear}>
                            + Nueva Categoría
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
                    <section className="filtros-section-admin">
                        <div className="busqueda-contenedor">
                            <i class="fas fa-search"></i>
                            <input
                                type="text"
                                placeholder="Buscar Categorizacion..."
                                //value={busqueda}
                                //onChange={(e) => setBusqueda(e.target.value)}
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
                    </section>
                    <TablaCategorias
                        categorias={categorias}
                        onEditar={abrirModalEditar}
                        onEliminar={eliminarCategoria}
                    />
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

        </div>
    );
};

export default GestionCategorizacion;
