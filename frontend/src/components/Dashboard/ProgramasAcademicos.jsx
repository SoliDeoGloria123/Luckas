import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProgramasTabla from './Tablas/ProgramasTabla';
import { programasAcademicosService } from '../../services/programasAcademicosService';
import Sidebar from './Sidebar/Sidebar';
import Header from './Sidebar/Header';
import ProgramaModal from './Modales/ProgramaModal';
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
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);
    const [filtros, setFiltros] = useState({
        tipo: '',
        modalidad: '',
        busqueda: ''
    });
    const [modalEditar, setModalEditar] = useState(false);
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
        requisitos: [''],
        pensum: [{ modulo: '', descripcion: '', horas: '' }],
        objetivos: [''],
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
            setError('Error al cargar los programas académicos');
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setCargando(true);
            setError('');

            console.log('=== DEBUG PROGRAMA ACADÉMICO ===');
            console.log('FormData original:', formData);
            console.log('Categorías disponibles:', categorias);
            console.log('Token disponible:', !!localStorage.getItem('token'));

            // Buscar la categoría correspondiente
            let categoriaId = null;
            if (formData.tipo && categorias.length > 0) {
                const categoriaEncontrada = categorias.find(cat =>
                    cat.tipo === 'programa' && formData.tipo.includes('programa') ||
                    cat.tipo === 'curso' && formData.tipo === 'curso'
                );
                categoriaId = categoriaEncontrada ? categoriaEncontrada._id : categorias[0]._id;
            } else if (categorias.length > 0) {
                categoriaId = categorias[0]._id; // usar primera categoría como fallback
            }

            console.log('Categoria seleccionada:', categoriaId);

            if (!categoriaId) {
                setError('No hay categorías disponibles. Por favor, contacte al administrador.');
                return;
            }

            // Mapear campos del frontend al backend
            const dataToSend = {
                nombre: formData.titulo,
                descripcion: formData.descripcion,
                categoria: categoriaId,
                modalidad: formData.modalidad,
                duracion: formData.duracion,
                precio: parseFloat(formData.precio) || 0,
                fechaInicio: formData.fechaInicio,
                fechaFin: formData.fechaFin,
                cuposDisponibles: parseInt(formData.cupos) || 0,
                profesor: formData.profesor,
                nivel: formData.nivel || 'intermedio',
                requisitos: formData.requisitos.filter(req => req.trim() !== ''),
                objetivos: formData.objetivos.filter(obj => obj.trim() !== ''),
                metodologia: formData.metodologia || '',
                evaluacion: formData.evaluacion || '',
                certificacion: formData.certificacion === 'si' || formData.certificacion === true,
                destacado: formData.destacado || false,
                estado: 'activo'
            };

            console.log('Datos a enviar:', dataToSend);

            let response;
            if (modoEdicion && programaSeleccionado) {
                console.log('Actualizando programa:', programaSeleccionado._id);
                response = await programasAcademicosService.updatePrograma(programaSeleccionado._id, dataToSend);
            } else {
                console.log('Creando nuevo programa...');
                response = await programasAcademicosService.createPrograma(dataToSend);
            }

            console.log('Respuesta del servidor:', response);

            if (response.success) {
                await cargarProgramas();
                cerrarModal();
                mostrarMensaje(modoEdicion ? 'Programa actualizado exitosamente' : 'Programa creado exitosamente', 'success');
            } else {
                setError(response.message || 'Error al guardar el programa');
            }
        } catch (error) {
            console.error('Error al guardar programa:', error);
            setError(error.response?.data?.message || error.message || 'Error al guardar el programa');
        } finally {
            setCargando(false);
        }
    };

    const eliminarPrograma = async (id) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este programa?')) return;

        try {
            await programasAcademicosService.deletePrograma(id);
            cargarProgramas();
            mostrarMensaje('Programa eliminado exitosamente', 'success');
        } catch (error) {
            setError('Error al eliminar el programa');
        }
    };


    const mostrarMensaje = (mensaje, tipo) => {
        // Implementar sistema de notificaciones
        alert(mensaje);
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
            requisitos: [''],
            pensum: [{ modulo: '', descripcion: '', horas: '' }],
            objetivos: [''],
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
        setError('');
    };

    const handleSubmitModal = async (e) => {
        e.preventDefault();
        setCargando(true);
        try {
            console.log('=== DEBUG MODAL SUBMIT ===');
            console.log('FormData del modal:', formData);
            console.log('Categorías disponibles:', categorias);

            // Buscar la categoría correspondiente
            let categoriaId = null;
            if (formData.tipo && categorias.length > 0) {
                const categoriaEncontrada = categorias.find(cat =>
                    cat.tipo === 'programa' && formData.tipo.includes('programa') ||
                    cat.tipo === 'curso' && formData.tipo === 'curso'
                );
                categoriaId = categoriaEncontrada ? categoriaEncontrada._id : categorias[0]._id;
            } else if (categorias.length > 0) {
                categoriaId = categorias[0]._id; // usar primera categoría como fallback
            }

            if (!categoriaId) {
                setError('No hay categorías disponibles. Por favor, contacte al administrador.');
                return;
            }

            // Mapear campos del frontend al backend correctamente
            const dataToSend = {
                nombre: formData.titulo,
                descripcion: formData.descripcion,
                categoria: categoriaId,
                modalidad: formData.modalidad,
                duracion: formData.duracion,
                precio: parseFloat(formData.precio) || 0,
                fechaInicio: formData.fechaInicio,
                fechaFin: formData.fechaFin,
                cuposDisponibles: parseInt(formData.cupos) || 0,
                profesor: formData.profesor,
                nivel: 'básico', // valor por defecto
                requisitos: formData.requisitos ? formData.requisitos.filter(req => req.trim() !== '') : [],
                objetivos: formData.objetivos ? formData.objetivos.filter(obj => obj.trim() !== '') : [],
                metodologia: formData.metodologia || '',
                evaluacion: formData.evaluacion || '',
                certificacion: formData.certificacion === 'si' || formData.certificacion === true,
                destacado: formData.destacado || false,
                estado: 'activo'
            };

            console.log('Datos mapeados para enviar:', dataToSend);

            let response;
            if (modoEdicion && programaSeleccionado) {
                console.log('Actualizando programa:', programaSeleccionado._id);
                response = await programasAcademicosService.updatePrograma(programaSeleccionado._id, dataToSend);
            } else {
                console.log('Creando nuevo programa...');
                response = await programasAcademicosService.createPrograma(dataToSend);
            }

            console.log('Respuesta del servidor:', response);

            if (response.success) {
                await cargarProgramas();
                cerrarModal();
                mostrarMensaje(
                    modoEdicion ? 'Programa actualizado exitosamente' : 'Programa creado exitosamente',
                    'success'
                );
            } else {
                setError(response.message || 'Error al guardar el programa');
            }
        } catch (error) {
            console.error('Error completo al guardar programa:', error);
            if (error.response) {
                console.error('Respuesta de error:', error.response.data);
                setError(error.response.data.message || 'Error del servidor');
            } else {
                setError(error.message || 'Error al guardar el programa');
            }
        } finally {
            setCargando(false);
        }
    };

    const agregarRequisito = () => {
        setFormData({
            ...formData,
            requisitos: [...formData.requisitos, '']
        });
    };

    const removerRequisito = (index) => {
        const nuevosRequisitos = formData.requisitos.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            requisitos: nuevosRequisitos.length > 0 ? nuevosRequisitos : ['']
        });
    };

    const actualizarRequisito = (index, valor) => {
        const nuevosRequisitos = [...formData.requisitos];
        nuevosRequisitos[index] = valor;
        setFormData({
            ...formData,
            requisitos: nuevosRequisitos
        });
    };

    const agregarModuloPensum = () => {
        setFormData({
            ...formData,
            pensum: [...formData.pensum, { modulo: '', descripcion: '', horas: '' }]
        });
    };

    const removerModuloPensum = (index) => {
        const nuevoPensum = formData.pensum.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            pensum: nuevoPensum.length > 0 ? nuevoPensum : [{ modulo: '', descripcion: '', horas: '' }]
        });
    };

    const actualizarModuloPensum = (index, campo, valor) => {
        const nuevoPensum = [...formData.pensum];
        nuevoPensum[index][campo] = valor;
        setFormData({
            ...formData,
            pensum: nuevoPensum
        });
    };

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
                <div className="space-y-7 fade-in-up p-9">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Gestión de Programas Académicos</h1>
                            <p className="text-slate-600">Administra cursos y programas técnicos del seminario</p>
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
                                <option value="todos">Todos los tipos</option>
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

                            <div className="text-sm text-slate-600 flex items-center">
                                <span className="font-medium">{/*programasFiltrados.length*/}</span> programa(s) encontrado(s)
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
                                        {programaDetalle.requisitos.map((req, i) => <li key={i}>{req}</li>)}
                                    </ul>
                                ) : 'Ninguno'}</p>
                                <p className="mb-2"><strong>Objetivos:</strong> {programaDetalle.objetivos && programaDetalle.objetivos.length > 0 ? (
                                    <ul className="list-disc ml-6">
                                        {programaDetalle.objetivos.map((obj, i) => <li key={i}>{obj}</li>)}
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
                                        {programaDetalle.inscripciones.map((insc, i) => (
                                            <li key={i}>
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
                        programas={programas}
                        eliminarPrograma={eliminarPrograma}
                        formatearPrecio={formatearPrecio}
                        formatearFecha={formatearFecha}
                        cargando={cargando}
                        abrirModalCrear={abrirModalCrear}
                        abrirModalEditar={abrirModalEditar}
                        abrirModalVer={abrirModalVer}
                    />

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
