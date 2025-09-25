import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProgramasTabla from './Tablas/ProgramasTabla';
import { cursosService } from '../../services/cursosService';
import { programasTecnicosService } from '../../services/programasTecnicosService';
import Sidebar from './Sidebar/Sidebar';
import Header from './Sidebar/Header';
import ProgramaModal from './Modales/ProgramaModal';
import {
    Plus,
    Search
} from 'lucide-react';

const ProgramasAcademicos = () => {
    const [programas, setProgramas] = useState([]);
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
    }, []); // Solo cargar una vez, no depende de filtros

    const cargarProgramas = async () => {
        try {
            setLoading(true);
            setError('');
            // Traer cursos
            const cursosRes = await cursosService.obtenerCursos({});
            // Traer programas técnicos
            const tecnicosRes = await programasTecnicosService.obtenerProgramasTecnicos({});
            // Normalizar y unificar
            const cursos = (cursosRes.data || []).map(curso => ({
                ...curso,
                tipo: 'curso',
                titulo: curso.nombre,
                profesor: curso.instructor,
                precio: curso.costo,
                fechaInicio: curso.fechaInicio,
                cupos: curso.cuposDisponibles,
                activo: curso.estado === 'activo'
            }));
            const tecnicos = (tecnicosRes.data || []).map(prog => ({
                ...prog,
                tipo: 'tecnico',
                titulo: prog.nombre,
                profesor: prog.instructor,
                precio: prog.costo,
                fechaInicio: prog.fechaInicio,
                cupos: prog.cuposDisponibles,
                activo: prog.estado === 'activo'
            }));
            // Filtrar por tipo y modalidad si el usuario selecciona filtros
            let resultado = [...cursos, ...tecnicos];
            if (filtros.tipo) {
                resultado = resultado.filter(p => p.tipo === filtros.tipo);
            }
            if (filtros.modalidad) {
                resultado = resultado.filter(p => p.modalidad === filtros.modalidad);
            }
            if (filtros.busqueda) {
                const texto = filtros.busqueda.toLowerCase();
                resultado = resultado.filter(p =>
                    (p.titulo && p.titulo.toLowerCase().includes(texto)) ||
                    (p.profesor && p.profesor.toLowerCase().includes(texto))
                );
            }
            setProgramas(resultado);
        } catch (error) {
            setError('Error de conexión');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');

            // Limpiar arrays vacíos
            const dataToSend = {
                ...formData,
                requisitos: formData.requisitos.filter(req => req.trim() !== ''),
                objetivos: formData.objetivos.filter(obj => obj.trim() !== ''),
                pensum: formData.pensum.filter(item => item.modulo.trim() !== ''),
                precio: parseFloat(formData.precio),
                cupos: parseInt(formData.cupos)
            };

            if (modalEditar) {
                await axios.put(`/api/programas-academicos/${programaSeleccionado._id}`, dataToSend, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            } else {
                await axios.post('/api/programas-academicos', dataToSend, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
            cargarProgramas();
            mostrarMensaje('Programa guardado exitosamente', 'success');
        } catch (error) {
            setError(error.response?.data?.message || 'Error al guardar el programa');
        }
    };

    const eliminarPrograma = async (id) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este programa?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/programas-academicos/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
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
            const token = localStorage.getItem('token');

            // Limpiar arrays vacíos
            const dataToSend = {
                ...formData,
                requisitos: formData.requisitos.filter(req => req.trim() !== ''),
                objetivos: formData.objetivos.filter(obj => obj.trim() !== ''),
                pensum: formData.pensum.filter(item => item.modulo.trim() !== ''),
                precio: parseFloat(formData.precio),
                cupos: parseInt(formData.cupos)
            };

            let response;
            if (modoEdicion && programaSeleccionado) {
                response = await axios.put(`/api/programas-academicos/${programaSeleccionado._id}`, dataToSend, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            } else {
                response = await axios.post('/api/programas-academicos', dataToSend, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            }

            if (response.status === 200 || response.status === 201) {
                cargarProgramas();
                cerrarModal();
                mostrarMensaje(
                    modoEdicion ? 'Programa actualizado exitosamente' : 'Programa creado exitosamente', 
                    'success'
                );
            }
        } catch (error) {
            console.error('Error al guardar programa:', error);
            setError(error.response?.data?.message || 'Error al guardar el programa');
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


                    {/* Tabla de programas */}
                    <ProgramasTabla
                        programas={programas}
                        eliminarPrograma={eliminarPrograma}
                        formatearPrecio={formatearPrecio}
                        formatearFecha={formatearFecha}
                        cargando={cargando}
                        abrirModalCrear={abrirModalCrear}
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
