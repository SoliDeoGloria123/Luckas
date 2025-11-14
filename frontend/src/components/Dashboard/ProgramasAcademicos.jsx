import React, { useState, useEffect } from 'react';
import ProgramasTabla from './Tablas/ProgramasTabla';
import { programasAcademicosService } from '../../services/programasAcademicosService';
import Sidebar from './Sidebar/Sidebar';
import Header from './Sidebar/Header';
import ProgramaModal from './Modales/ProgramaModal';
import { mostrarAlerta, mostrarConfirmacion } from '../utils/alertas';
import {
    Plus,
    Search
} from 'lucide-react';

const ProgramasAcademicos = () => {
    const [programas, setProgramas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarAbierto, setSidebarAbierto] = useState(true);
    const [seccionActiva, setSeccionActiva] = useState("dashboard");
    const [mostrarModal, setMostrarModal] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [filtros, setFiltros] = useState({
        tipo: '',
        modalidad: '',
        busqueda: ''
    });
    const [modoEdicion, setModoEdicion] = useState(false);
    const [programaSeleccionado, setProgramaSeleccionado] = useState(null);
    const [programaDetalle, setProgramaDetalle] = useState(null);
    const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);


    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        tipo: 'curso',
        modalidad: 'presencial',
        duracion: '',
        precio: '',
        fechaInicio: '',
        fechaFin: '',
        cupos: '',
        profesor: '',
        profesorBio: '',
        requisitos: [{ id: 'req_0', value: '' }],
        pensum: [{ id: 'pen_0', modulo: '', descripcion: '', horas: '' }],
        objetivos: [{ id: 'obj_0', value: '' }],
        metodologia: '',
        evaluacion: '',
        certificacion: '',
        imagen: '',
        destacado: false
    });


    useEffect(() => {
        cargarProgramas();
        cargarCategorias();
    }, []); // Solo cargar una vez, no depende de filtros

    const abrirModalVer = (programa) => {
        setProgramaDetalle(programa);
        setMostrarModalDetalle(true);
    };

    const cargarProgramas = async () => {
        setLoading(true);
        try {
            const response = await programasAcademicosService.getAllProgramas(filtros);
            if (response.success) {
                setProgramas(response.data);
            }
        } catch (error) {
            console.error('Error al cargar programas:', error);
        
        } finally {
            setLoading(false);
        }
    };

    const cargarCategorias = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/categorizacion', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setCategorias(data.data.filter(cat => cat.tipo === 'programa' || cat.tipo === 'curso'));
            }
        } catch (error) {
            console.error('Error al cargar categorías:', error);
        }
    };

    const mostrarMensaje = (mensaje, tipo) => {
        // Implementar sistema de notificaciones
        alert(mensaje);
    };

    // Crear programa
    const crearPrograma = async (e) => {
        if (e) e.preventDefault();
        setCargando(true);
        
        try {
            const categoriaId = encontrarCategoriaId();
            
            if (!categoriaId) {
                mostrarMensaje('No hay categorías disponibles. Por favor, contacte al administrador.', 'error');
                return;
            }
            const dataToSend = mapearDatosParaEnvio(categoriaId);
             await programasAcademicosService.createPrograma(dataToSend);
            mostrarAlerta('¡Éxito!', 'Programa creado exitosamente');
            cerrarModal();
            cargarProgramas();
        } catch (error) {
            console.error('Error al crear programa:', error);
        } finally {
            setCargando(false);
        }
    };

    // Actualizar programa
    const actualizarPrograma = async (e) => {
        if (e) e.preventDefault();
        setCargando(true);
        
        try {
            const categoriaId = encontrarCategoriaId();
            
            if (!categoriaId) {
                mostrarMensaje('No hay categorías disponibles. Por favor, contacte al administrador.', 'error');
                return;
            }
            const dataToSend = mapearDatosParaEnvio(categoriaId);
            await programasAcademicosService.updatePrograma(programaSeleccionado._id, dataToSend);
            mostrarAlerta('Éxito!', 'Programa actualizado exitosamente');
            cerrarModal();
            cargarProgramas();
        } catch (error) {
            console.error('Error al actualizar programa:', error);
            mostrarMensaje(`Error al actualizar el programa: ${error.message}`, 'error');
        } finally {
            setCargando(false);
        }
    };

        // Eliminar programa
    const eliminarPrograma = async (id) => {
        const confirmado = await mostrarConfirmacion(
            "¿Estás seguro?",
            "Esta acción eliminará el programa de forma permanente."
        );

        if (!confirmado) return;

        try {
            await programasAcademicosService.deletePrograma(id);
           mostrarAlerta('¡Éxito!', 'Programa eliminado exitosamente');
            cargarProgramas();
        } catch (error) {
            console.error('Error al eliminar programa:', error);
            mostrarMensaje(`No se pudo eliminar el programa: ${error.message}`, 'error');
        }
    };



    // Funciones del modal
    const abrirModalCrear = () => {
        setModoEdicion(false);
        setProgramaSeleccionado(null);
        setFormData({
            titulo: '',
            descripcion: '',
            tipo: 'curso',
            modalidad: 'presencial',
            duracion: '',
            precio: '',
            fechaInicio: '',
            fechaFin: '',
            cupos: '',
            profesor: '',
            profesorBio: '',
            requisitos: [{ id: 'req_0', value: '' }],
            pensum: [{ id: 'pen_0', modulo: '', descripcion: '', horas: '' }],
            objetivos: [{ id: 'obj_0', value: '' }],
            metodologia: '',
            evaluacion: '',
            certificacion: '',
            imagen: '',
            destacado: false
        });
        setMostrarModal(true);
    };

    const abrirModalEditar = (programa) => {
        console.log('=== ABRIR MODAL EDITAR ===');
        console.log('Programa a editar:', programa);

        setModoEdicion(true);
        setProgramaSeleccionado(programa);
        setMostrarModal(true);
    };

    const cerrarModal = () => {
        setMostrarModal(false);
        setModoEdicion(false);
        setProgramaSeleccionado(null);
        // setError(''); // Comentado porque setError no está disponible
    };

    // Funciones auxiliares para reducir complejidad cognitiva
    const encontrarCategoriaId = () => {
        if (!formData.tipo || !categorias.length) {
            return categorias.length > 0 ? categorias[0]._id : null;
        }
        
        const categoriaEncontrada = categorias.find(cat =>
            cat.tipo === 'programa' && formData.tipo.includes('programa') ||
            cat.tipo === 'curso' && formData.tipo === 'curso'
        );
        
        return categoriaEncontrada ? categoriaEncontrada._id : categorias[0]._id;
    };

    const mapearDatosParaEnvio = (categoriaId) => ({
        nombre: formData.titulo,
        tipo: formData.tipo || 'curso',
        descripcion: formData.descripcion,
        categoria: categoriaId,
        modalidad: formData.modalidad,
        duracion: formData.duracion,
        precio: Number.parseFloat(formData.precio) || 0,
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin,
        cuposDisponibles: Number.parseInt(formData.cupos) || 0,
        profesor: formData.profesor,
        nivel: 'básico',
        requisitos: Array.isArray(formData.requisitos) 
            ? formData.requisitos
                .filter(req => req && (req.value ? req.value.trim() !== '' : req.trim() !== ''))
                .map(req => req.value || req)
            : [],
        objetivos: Array.isArray(formData.objetivos)
            ? formData.objetivos
                .filter(obj => obj && (obj.value ? obj.value.trim() !== '' : obj.trim() !== ''))
                .map(obj => obj.value || obj)
            : [],
        metodologia: formData.metodologia || '',
        evaluacion: formData.evaluacion || '',
        certificacion: formData.certificacion == 'si' || formData.certificacion === true,
        destacado: formData.destacado || false,
        estado: 'activo'
    });



    const handleSubmitModal = async (e) => {
        if (modoEdicion) {
            await actualizarPrograma(e);
        } else {
            await crearPrograma(e);
        }
    };


    // Filtrado de programas
    const programasFiltrados = programas.filter(programa => {
        const coincideBusqueda = !filtros.busqueda || 
            programa.nombre?.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
            programa.descripcion?.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
            programa.profesor?.toLowerCase().includes(filtros.busqueda.toLowerCase());

        const coincideTipo = !filtros.tipo || programa.tipo === filtros.tipo;

        const coincideModalidad = !filtros.modalidad || programa.modalidad === filtros.modalidad;

        return coincideBusqueda && coincideTipo && coincideModalidad;
    });

    // Resetear paginación cuando cambien los filtros
    useEffect(() => {
        setPaginaActual(1);
    }, [filtros]);

    // Paginación para programas académicos
    const [paginaActual, setPaginaActual] = useState(1);
    const registrosPorPagina = 8;
    const totalPaginas = Math.ceil(programasFiltrados.length / registrosPorPagina);
    const programasPaginados = programasFiltrados.slice(
        (paginaActual - 1) * registrosPorPagina,
        paginaActual * registrosPorPagina
    );


    const formatearPrecio = (precio) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(precio);
    };

    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-ES');
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner">
                    <i className="fas fa-spinner fa-spin"></i>
                    <p>Cargando programas académicos...</p>
                </div>
            </div>
        );
    }
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
                <div className='seccion-usuarios'>
                    {/* Header */}
                    <div  className="page-header-Academicos">
                        <div className="page-title-admin">
                            <h1>Gestión de Programas Académicos</h1>
                            <p>Administra cursos y programas técnicos del seminario</p>
                        </div>
                        <button
                            onClick={abrirModalCrear}
                            className="btn-premium flex items-center space-x-2 px-4 py-2 text-white rounded-xl font-medium shadow-lg"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Nuevo Programa</span>
                        </button>
                    </div>

                    <div className="dashboard-grid-reporte-admin">
                        <div className="stat-card-reporte-admin">
                            <div className="stat-icon-reporte-admin-admin users">
                                <i className="fas fa-users"></i>
                            </div>
                            <div className="stat-info-admin">
                                <h3>5</h3>
                                <p>Total de programas académicos</p>
                            </div>
                        </div>
                        <div className="stat-card-reporte-admin">
                            <div className="stat-icon-reporte-admin-admin active">
                                <i className="fas fa-user-check"></i>
                            </div>
                            <div className="stat-info-admin">
                                <h3>4</h3>
                                <p>Total de cursos</p>
                            </div>
                        </div>
                        <div className="stat-card-reporte-admin">
                            <div className="stat-icon-reporte-admin-admin admins">
                                <i className="fas fa-user-shield"></i>
                            </div>
                            <div className="stat-info-admin">
                                <h3>1</h3>
                                <p>Total de programas técnicos</p>
                            </div>
                        </div>
                        <div className="stat-card-reporte-admin">
                            <div className="stat-icon-reporte-admin-admin admins">
                                <i className="fas fa-user-shield"></i>
                            </div>
                            <div className="stat-info-admin">
                                <h3>1</h3>
                                <p>Programas activos</p>
                            </div>
                        </div>
                        <div className="stat-card-reporte-admin">
                            <div className="stat-icon-reporte-admin-admin admins">
                                <i className="fas fa-user-shield"></i>
                            </div>
                            <div className="stat-info-admin">
                                <h3>1</h3>
                                <p>Programas inactivos</p>
                            </div>
                        </div>
                        <div className="stat-card-reporte-admin">
                            <div className="stat-icon-reporte-admin-admin new">
                                <i className="fas fa-user-plus"></i>
                            </div>
                            <div className="stat-info-admin">
                                <h3>12</h3>
                                <p>Nuevos programas este mes</p>
                            </div>
                        </div>
                    </div>
                    {/* Filtros */}
                    <div className="glass-card rounded-2xl p-6 border border-white/20 shadow-lg">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar programas..."
                                    value={filtros.busqueda}
                                    onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>

                            <select
                                value={filtros.tipo}
                                onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
                                className="px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            >
                                <option value="">Todos los tipos</option>
                                <option value="curso">Cursos</option>
                                <option value="programa-tecnico">Programas Técnicos</option>
                                <option value="diplomado">Diplomados</option>
                                <option value="certificacion">Certificaciones</option>
                            </select>

                            <select
                                value={filtros.estado}
                                onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
                                className="px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            >
                                <option value="todos">Todos los estados</option>
                                <option value="activo">Activo</option>
                                <option value="inactivo">Inactivo</option>
                                <option value="borrador">Borrador</option>
                            </select>

                            <div className="text-sm text-slate-600 flex items-center">
                                <span className="font-medium">{programasFiltrados.length}</span> programa(s) encontrado(s)
                            </div>
                        </div>
                    </div>

                    {mostrarModalDetalle && programaDetalle && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
                                <h2 className="text-2xl font-bold mb-4">{programaDetalle.nombre}</h2>
                                <p className="mb-2"><strong>Descripción:</strong> {programaDetalle.descripcion}</p>
                                <p className="mb-2"><strong>Categoría:</strong> {programaDetalle.categoria?.nombre || programaDetalle.categoria}</p>
                                <p className="mb-2"><strong>Modalidad:</strong> {programaDetalle.modalidad}</p>
                                <p className="mb-2"><strong>Duración:</strong> {programaDetalle.duracion}</p>
                                <p className="mb-2"><strong>Precio:</strong> {formatearPrecio(programaDetalle.precio)}</p>
                                <p className="mb-2"><strong>Fecha de inicio:</strong> {programaDetalle.fechaInicio ? new Date(programaDetalle.fechaInicio).toLocaleDateString() : 'Por definir'}</p>
                                <p className="mb-2"><strong>Fecha de fin:</strong> {programaDetalle.fechaFin ? new Date(programaDetalle.fechaFin).toLocaleDateString() : 'Por definir'}</p>
                                <p className="mb-2"><strong>Cupos disponibles:</strong> {programaDetalle.cuposDisponibles}</p>
                                <p className="mb-2"><strong>Cupos ocupados:</strong> {programaDetalle.cuposOcupados}</p>
                                <p className="mb-2"><strong>Profesor:</strong> {programaDetalle.profesor}</p>
                                <p className="mb-2"><strong>Nivel:</strong> {programaDetalle.nivel}</p>
                                <p className="mb-2"><strong>Requisitos:</strong> {programaDetalle.requisitos && programaDetalle.requisitos.length > 0 ? (
                                    <ul className="list-disc ml-6">
                                        {programaDetalle.requisitos.map((req, idx) => <li key={req + '-' + idx}>{req}</li>)}
                                    </ul>
                                ) : 'Ninguno'}</p>
                                <p className="mb-2"><strong>Objetivos:</strong> {programaDetalle.objetivos && programaDetalle.objetivos.length > 0 ? (
                                    <ul className="list-disc ml-6">
                                        {programaDetalle.objetivos.map((obj, idx) => <li key={obj + '-' + idx}>{obj}</li>)}
                                    </ul>
                                ) : 'Ninguno'}</p>
                                <p className="mb-2"><strong>Metodología:</strong> {programaDetalle.metodologia}</p>
                                <p className="mb-2"><strong>Evaluación:</strong> {programaDetalle.evaluacion}</p>
                                <p className="mb-2"><strong>Certificación:</strong> {programaDetalle.certificacion ? 'Sí' : 'No'}</p>
                                <p className="mb-2"><strong>Destacado:</strong> {programaDetalle.destacado ? 'Sí' : 'No'}</p>
                                <p className="mb-2"><strong>Estado:</strong> {programaDetalle.estado}</p>
                                <p className="mb-2"><strong>Fecha de creación:</strong> {programaDetalle.createdAt ? new Date(programaDetalle.createdAt).toLocaleDateString() : ''}</p>
                                <p className="mb-2"><strong>Fecha de actualización:</strong> {programaDetalle.updatedAt ? new Date(programaDetalle.updatedAt).toLocaleDateString() : ''}</p>
                                <p className="mb-2"><strong>Inscripciones:</strong> {programaDetalle.inscripciones && programaDetalle.inscripciones.length > 0 ? (
                                    <ul className="list-disc ml-6">
                                        {programaDetalle.inscripciones.map((insc, idx) => (
                                            <li key={(insc.usuario?._id || insc.usuario || '') + '-' + (insc.fechaInscripcion || idx)}>
                                                Usuario: {insc.usuario?.nombre || insc.usuario} | Estado: {insc.estado} | Fecha: {insc.fechaInscripcion ? new Date(insc.fechaInscripcion).toLocaleDateString() : ''}
                                            </li>
                                        ))}
                                    </ul>
                                ) : 'Ninguna'}
                                </p>
                                <button
                                    onClick={() => setMostrarModalDetalle(false)}
                                    className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    )}
                    {/* Tabla de programas */}
                    <ProgramasTabla
                        programas={programasPaginados}
                        eliminarPrograma={eliminarPrograma}
                        formatearPrecio={formatearPrecio}
                        formatearFecha={formatearFecha}
                        cargando={cargando}
                        abrirModalCrear={abrirModalCrear}
                        abrirModalEditar={abrirModalEditar}
                        abrirModalVer={abrirModalVer}
                    />
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
            </div>

            {/* Modal de Programa */}
            <ProgramaModal
                mostrar={mostrarModal}
                modoEdicion={modoEdicion}
                programaSeleccionado={programaSeleccionado}
                formData={formData}
                setFormData={setFormData}
                onClose={cerrarModal}
                onSubmit={handleSubmitModal}
            />
        </div>
    );
};

export default ProgramasAcademicos;
