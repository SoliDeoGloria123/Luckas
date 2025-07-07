import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProgramasTabla from './Tablas/ProgramasTabla';

const ProgramasAcademicos = () => {
    const [programas, setProgramas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filtros, setFiltros] = useState({
        tipo: '',
        modalidad: '',
        busqueda: ''
    });
    const [modalEditar, setModalEditar] = useState(false);
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
    }, [filtros]);

    const cargarProgramas = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const params = new URLSearchParams();
            
            if (filtros.tipo) params.append('tipo', filtros.tipo);
            if (filtros.modalidad) params.append('modalidad', filtros.modalidad);
            if (filtros.busqueda) params.append('busqueda', filtros.busqueda);
            
            const response = await axios.get(`/api/programas-academicos?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setProgramas(response.data.data);
            } else {
                setError('Error al cargar los programas');
            }
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
        <div className="programas-academicos-container">
            <div className="page-header-Academicos">
                <h1>
                    <i className="fas fa-graduation-cap"></i>
                    Gestión de Programas Académicos
                </h1>
             
            </div>

            {error && (
                <div className="alert alert-error">
                    <i className="fas fa-exclamation-triangle"></i>
                    {error}
                </div>
            )}

            {/* Filtros */}
            <div className="filtros-Academicos">
                <div className="filtros-group-Academicos">
                    <div className="filtro-item-Academicos">
                        <label>Tipo de Programa</label>
                        <select 
                            value={filtros.tipo} 
                            onChange={(e) => setFiltros({...filtros, tipo: e.target.value})}
                        >
                            <option value="">Todos</option>
                            <option value="curso">Cursos</option>
                            <option value="tecnico">Técnicos</option>
                            <option value="especializacion">Especializaciones</option>
                            <option value="diplomado">Diplomados</option>
                        </select>
                    </div>
                    <div className="filtro-item-Academicos">
                        <label>Modalidad</label>
                        <select 
                            value={filtros.modalidad} 
                            onChange={(e) => setFiltros({...filtros, modalidad: e.target.value})}
                        >
                            <option value="">Todas</option>
                            <option value="presencial">Presencial</option>
                            <option value="virtual">Virtual</option>
                            <option value="mixta">Mixta</option>
                        </select>
                    </div>
                    <div className="filtro-item-Academicos">
                        <label>Buscar</label>
                        <input
                            type="text"
                            placeholder="Título, profesor..."
                            value={filtros.busqueda}
                            onChange={(e) => setFiltros({...filtros, busqueda: e.target.value})}
                        />
                    </div>
                </div>
            </div>


            {/* Tabla de programas */}
            <ProgramasTabla
                programas={programas}
                eliminarPrograma={eliminarPrograma}
                formatearPrecio={formatearPrecio}
                formatearFecha={formatearFecha}
            />

            
            
        </div>
    );
};

export default ProgramasAcademicos;
