import React, { useState, useEffect } from 'react';
import ProgramasTabla from './Tablas/ProgramasTabla';
import { programasAcademicosService } from '../../services/programasAcademicosService';
import Sidebar from './Sidebar/Sidebar';
import Header from './Sidebar/Header';
import ProgramaModal from './Modales/ProgramaModal';
import { mostrarAlerta, mostrarConfirmacion } from '../utils/alertas';
import { Plus, Search } from 'lucide-react';
import {categorizacionService} from '../../services/categorizacionService';

const ProgramasAcademicos = () => {
    const [programas, setProgramas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [sidebarAbierto, setSidebarAbierto] = useState(true);
    const [seccionActiva, setSeccionActiva] = useState("dashboard");
    const [mostrarModal, setMostrarModal] = useState(false);
    const [filtros, setFiltros] = useState({
        tipo: '',
        modalidad: '',
        estado: 'todos',
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
    const [estadisticas, setEstadisticas] = useState({
        totalProgramas: 0,
        totalCursos: 0,
        totalProgramasTecnicos: 0,
        programasActivos: 0,
        programasInactivos: 0,
        nuevosProgramasEsteMes: 0
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
        try {
            const response = await programasAcademicosService.getAllProgramas(filtros);
            // El servicio puede devolver directamente un array o un objeto { success, data }
            let lista = [];
            if (response) {
                if (Array.isArray(response)) lista = response;
                else if (response.success && Array.isArray(response.data)) lista = response.data;
                else if (response.data && Array.isArray(response.data)) lista = response.data;
                else if (response.data) lista = response.data;
            }
                // Ordenar por fecha de creación ascendente para que los programas nuevos aparezcan al final
                const listaOrdenada = Array.isArray(lista)
                    ? lista.slice().sort((a, b) => (Date.parse(a.createdAt) || 0) - (Date.parse(b.createdAt) || 0))
                    : lista;
                setProgramas(listaOrdenada);
            // Obtener estadísticas aunque la lista venga vacía
            obtenerEstadisticas();
        } catch (error) {
            console.error('Error al cargar programas:', error);

        }
    };

    //obtener estadiscas de programas 
    const obtenerEstadisticas = async () => {
        try {
            const stats = await programasAcademicosService.obtenerEstadisticasGenerales();
            // El backend devuelve { success: true, data: { ... } }
            const payload = stats && stats.data ? stats.data : stats;
            setEstadisticas(payload || {});
        } catch (err) {
            console.error("Error al obtener estadísticas: " + err.message);
        }
    };




    const cargarCategorias = async () => {
        try {
            const response = await categorizacionService.getAllCategorias({
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
        }
    };

    // Actualizar programa
    const actualizarPrograma = async (e) => {
        if (e) e.preventDefault();
     

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

        const coincideEstado = !filtros.estado || filtros.estado === 'todos' || programa.estado === filtros.estado;

        return coincideBusqueda && coincideTipo && coincideModalidad && coincideEstado;
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
                <div className='space-y-7 fade-in-up  p-9'>
                    {/* Header */}
                    <div className="page-header-Academicos">
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
                                <h3>{estadisticas.totalProgramas}</h3>
                                <p>Total de programas académicos</p>
                            </div>
                        </div>
                        <div className="stat-card-reporte-admin">
                            <div className="stat-icon-reporte-admin-admin active">
                                <i className="fas fa-user-check"></i>
                            </div>
                            <div className="stat-info-admin">
                                <h3>{estadisticas.totalCursos}</h3>
                                <p>Total de cursos</p>
                            </div>
                        </div>
                        <div className="stat-card-reporte-admin">
                            <div className="stat-icon-reporte-admin-admin admins">
                                <i className="fas fa-user-shield"></i>
                            </div>
                            <div className="stat-info-admin">
                                <h3>{estadisticas.totalProgramasTecnicos}</h3>
                                <p>Total de programas técnicos</p>
                            </div>
                        </div>
                        <div className="stat-card-reporte-admin">
                            <div className="stat-icon-reporte-admin-admin admins">
                                <i className="fas fa-user-shield"></i>
                            </div>
                            <div className="stat-info-admin">
                                <h3>{estadisticas.programasActivos}</h3>
                                <p>Programas activos</p>
                            </div>
                        </div>
                        <div className="stat-card-reporte-admin">
                            <div className="stat-icon-reporte-admin-admin admins">
                                <i className="fas fa-user-shield"></i>
                            </div>
                            <div className="stat-info-admin">
                                <h3>{estadisticas.programasInactivos}</h3>
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
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                            <div className="relative flex-1 max-w-md">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar programas..."
                                    value={filtros.busqueda}
                                    onChange={(e) => { setFiltros({ ...filtros, busqueda: e.target.value }); setPaginaActual(1); }}
                                    className="w-full pl-10 pr-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>
                            <div className="flex space-x-3">
                                <select
                                    value={filtros.tipo}
                                    onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
                                    className="px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                >
                                    <option value="">Todos los tipos</option>
                                    <option value="curso">Cursos</option>
                                    <option value="programa-tecnico">Programas Técnicos</option>
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
                            </div>


                        </div>
                    </div>

                    {mostrarModalDetalle && programaDetalle && (
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-xl">
                                <div className="flex items-start justify-between p-6 border-b">
                                    <div>
                                        <h2 className="text-2xl font-semibold text-slate-800">{programaDetalle.nombre}</h2>
                                        <p className="text-sm text-slate-500 mt-1">{programaDetalle.tipo ? String(programaDetalle.tipo).replace('-', ' ') : ''} • {programaDetalle.modalidad}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2">
                                            <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">{programaDetalle.estado || '—'}</span>
                                            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">{programaDetalle.certificacion ? 'Con certificación' : 'Sin certificación'}</span>
                                            {programaDetalle.destacado && <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm">Destacado</span>}
                                        </div>
                                        <button onClick={() => setMostrarModalDetalle(false)} className="text-slate-400 hover:text-slate-600 p-2 rounded-md">
                                            ✕
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 overflow-y-auto" style={{ maxHeight: '70vh' }}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            {programaDetalle.imagen && (
                                                <img src={programaDetalle.imagen} alt="Imagen del programa" className="w-full h-44 object-cover rounded-lg mb-4" />
                                            )}

                                            <p className="text-sm text-slate-700 leading-relaxed">{programaDetalle.descripcion || 'Sin descripción'}</p>

                                            <ul className="mt-4 space-y-2 text-sm text-slate-700">
                                                <li><strong className="text-slate-800">Profesor:</strong> {programaDetalle.profesor || '—'}</li>
                                                <li><strong className="text-slate-800">Duración:</strong> {programaDetalle.duracion || '—'}</li>
                                                <li><strong className="text-slate-800">Precio:</strong> {formatearPrecio(programaDetalle.precio || 0)}</li>
                                                <li><strong className="text-slate-800">Cupos disponibles:</strong> {programaDetalle.cuposDisponibles ?? '—'}</li>
                                                <li><strong className="text-slate-800">Cupos ocupados:</strong> {programaDetalle.cuposOcupados ?? '—'}</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <div className="mb-4">
                                                <h4 className="font-semibold text-slate-800">Objetivos</h4>
                                                {programaDetalle.objetivos && programaDetalle.objetivos.length > 0 ? (
                                                    <ul className="list-disc ml-5 mt-2 text-sm text-slate-700 space-y-1">
                                                        {programaDetalle.objetivos.map((obj) => (
                                                            <li key={String(obj)}>{obj}</li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="text-sm text-slate-500 mt-2">Ninguno</p>
                                                )}
                                            </div>

                                            <div className="mb-4">
                                                <h4 className="font-semibold text-slate-800">Requisitos</h4>
                                                {programaDetalle.requisitos && programaDetalle.requisitos.length > 0 ? (
                                                    <ul className="list-disc ml-5 mt-2 text-sm text-slate-700 space-y-1">
                                                        {programaDetalle.requisitos.map((req) => (
                                                            <li key={String(req)}>{req}</li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="text-sm text-slate-500 mt-2">Ninguno</p>
                                                )}
                                            </div>

                                            <div className="mb-4">
                                                <h4 className="font-semibold text-slate-800">Metodología</h4>
                                                <p className="text-sm text-slate-700 mt-2">{programaDetalle.metodologia || 'No especificada'}</p>
                                            </div>

                                            <div className="mb-4">
                                                <h4 className="font-semibold text-slate-800">Evaluación</h4>
                                                <p className="text-sm text-slate-700 mt-2">{programaDetalle.evaluacion || 'No especificada'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <h4 className="font-semibold text-slate-800">Inscripciones</h4>
                                        {programaDetalle.inscripciones && programaDetalle.inscripciones.length > 0 ? (
                                            <ul className="mt-3 space-y-2 text-sm text-slate-700">
                                                {programaDetalle.inscripciones.map((insc) => (
                                                    <li key={insc._id || insc.usuario?._id || `${String(insc.usuario || '')}-${String(insc.fechaInscripcion || '')}` } className="p-2 rounded-md bg-slate-50">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <div className="text-sm font-medium text-slate-800">{insc.usuario?.nombre || insc.usuario || 'Usuario anónimo'}</div>
                                                                <div className="text-xs text-slate-500">{insc.fechaInscripcion ? new Date(insc.fechaInscripcion).toLocaleDateString() : ''}</div>
                                                            </div>
                                                            <div className="text-sm text-slate-700">{insc.estado}</div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-slate-500 mt-2">Ninguna</p>
                                        )}
                                    </div>
                                </div>

                                <div className="p-4 border-t flex justify-end">
                                    <button
                                        onClick={() => setMostrarModalDetalle(false)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Tabla de programas */}
                    <ProgramasTabla
                        programas={programasPaginados}
                        eliminarPrograma={eliminarPrograma}
                        formatearPrecio={formatearPrecio}
                        formatearFecha={formatearFecha}
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
