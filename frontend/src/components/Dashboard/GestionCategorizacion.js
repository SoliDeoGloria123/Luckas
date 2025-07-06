import { useState, useEffect } from "react";
import { categorizacionService } from "../../services/categorizacionService";
import TablaCategorias from "./Tablas/CategorizacionTabla";
import CategorizacionModal from "./Modales/CategorizacionModal";

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
            alert("Categoría creada exitosamente");
            setNuevaCategoria({ nombre: "", codigo: "", estado: "activo" });
            setMostrarModal(false);
            obtenerCategorias();
        } catch (error) {
            alert(`Error al crear la categoría: ${error.message}`);
        }
    };

    // Actualizar categoría
    const actualizarCategoria = async () => {
        try {
            await categorizacionService.update(categoriaSeleccionada._id, categoriaSeleccionada);
            alert("Categoría actualizada exitosamente");
            setCategoriaSeleccionada(null);
            setModoEdicion(false);
            setMostrarModal(false);
            obtenerCategorias();
        } catch (error) {
            alert(`Error al actualizar la categoría: ${error.message}`);
        }
    };

    // Eliminar categoría
    const eliminarCategoria = async (id) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar esta categoría?")) return;
        try {
            await categorizacionService.delete(id);
            alert("Categoría eliminada exitosamente");
            obtenerCategorias();
        } catch (error) {
            alert(`Error al eliminar la categoría: ${error.message}`);
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
                <h2>Categorización</h2>
                <button className="btn-primary" onClick={abrirModalCrear}>
                    + Nueva Categoría
                </button>
            </div>
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
    );
};

export default GestionCategorizacion;
