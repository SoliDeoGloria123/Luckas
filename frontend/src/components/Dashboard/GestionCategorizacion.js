import { useState, useEffect } from "react";
import { categorizacionService } from "../../services/categorizacionService";
import TablaCategorias from "./Tablas/CategorizacionTabla";
import CategorizacionModal from "./Modales/CategorizacionModal";
import { mostrarAlerta, mostrarConfirmacion } from '../utils/alertas';

const GestionCategorizacion = () => {
    const [categorias, setCategorias] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
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
        <div className="seccion-usuarios">
            <div className="page-header-Academicos">
                <h1 className="titulo-admin">Categorización</h1>
                <button className="btn-admin" onClick={abrirModalCrear}>
                    + Nueva Categoría
                </button>
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

                <TablaCategorias
                    categorias={categorias}
                    onEditar={abrirModalEditar}
                    onEliminar={eliminarCategoria}
                />
            </section>
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
    );
};

export default GestionCategorizacion;
