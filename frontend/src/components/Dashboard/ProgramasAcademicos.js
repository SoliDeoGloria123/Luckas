import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProgramasAcademicos.css';

const ProgramasAcademicos = () => {
    const [programas, setProgramas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filtros, setFiltros] = useState({
        tipo: '',
        modalidad: '',
        busqueda: ''
    });
    const [modalCrear, setModalCrear] = useState(false);
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

            cerrarModales();
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

    const abrirModalCrear = () => {
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
        setModalCrear(true);
    };

    const abrirModalEditar = (programa) => {
        setProgramaSeleccionado(programa);
        setFormData({
            titulo: programa.titulo || '',
            descripcion: programa.descripcion || '',
            tipo: programa.tipo || 'curso',
            modalidad: programa.modalidad || 'presencial',
            duracion: programa.duracion || '',
            precio: programa.precio?.toString() || '',
            fechaInicio: programa.fechaInicio ? new Date(programa.fechaInicio).toISOString().split('T')[0] : '',
            fechaFin: programa.fechaFin ? new Date(programa.fechaFin).toISOString().split('T')[0] : '',
            cupos: programa.cupos?.toString() || '',
            profesor: programa.profesor || '',
            profesorBio: programa.profesorBio || '',
            requisitos: programa.requisitos?.length ? programa.requisitos : [''],
            pensum: programa.pensum?.length ? programa.pensum : [{ modulo: '', descripcion: '', horas: '' }],
            objetivos: programa.objetivos?.length ? programa.objetivos : [''],
            metodologia: programa.metodologia || '',
            evaluacion: programa.evaluacion || '',
            certificacion: programa.certificacion || '',
            imagen: programa.imagen || '',
            destacado: programa.destacado || false
        });
        setModalEditar(true);
    };

    const cerrarModales = () => {
        setModalCrear(false);
        setModalEditar(false);
        setProgramaSeleccionado(null);
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
                <button className="btn-primary" onClick={abrirModalCrear}>
                     ➕ Nuevo Programa
                </button>
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
            <div className="table-container-Academicos">
                <table className="programas-table-Academicos">
                    <thead>
                        <tr>
                            <th>Programa</th>
                            <th>Tipo</th>
                            <th>Modalidad</th>
                            <th>Precio</th>
                            <th>Fecha Inicio</th>
                            <th>Cupos</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {programas.map(programa => (
                            <tr key={programa._id}>
                                <td>
                                    <div className="programa-info">
                                        <h4>{programa.titulo}</h4>
                                        <p>{programa.profesor}</p>
                                        {programa.destacado && (
                                            <span className="badge-destacado">Destacado</span>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <span className={`badge badge-${programa.tipo}`}>
                                        {programa.tipo.charAt(0).toUpperCase() + programa.tipo.slice(1)}
                                    </span>
                                </td>
                                <td>{programa.modalidad}</td>
                                <td>{formatearPrecio(programa.precio)}</td>
                                <td>{formatearFecha(programa.fechaInicio)}</td>
                                <td>
                                    <span className="cupos-info">
                                        {programa.cuposOcupados || 0}/{programa.cupos}
                                    </span>
                                </td>
                                <td>
                                    <span className={`badge ${programa.activo ? 'badge-success' : 'badge-secondary'}`}>
                                        {programa.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td>
                                    <div className="actions-group">
                                        <button 
                                            className="btn-icon btn-edit"
                                            onClick={() => abrirModalEditar(programa)}
                                            title="Editar"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button 
                                            className="btn-icon btn-delete"
                                            onClick={() => eliminarPrograma(programa._id)}
                                            title="Eliminar"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {programas.length === 0 && (
                    <div className="no-data">
                        <i className="fas fa-graduation-cap"></i>
                        <h3>No hay programas académicos</h3>
                        <p>Crea el primer programa académico para comenzar.</p>
                    </div>
                )}
            </div>

            {/* Modal Crear/Editar */}
            {(modalCrear || modalEditar) && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header-Academicos">
                            <h2>
                                {modalEditar ? 'Editar Programa Académico' : 'Crear Programa Académico'}
                            </h2>
                            <button className="modal-close" onClick={cerrarModales}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body-Academicos">
                            <form onSubmit={handleSubmit}>
                                {/* Información básica */}
                                <div className="form-section">
                                    <h3>Información Básica</h3>
                                    <div className="form-grid-Academicos">
                                        <div className="form-group-Academicos">
                                            <label>Título del Programa *</label>
                                            <input
                                                type="text"
                                                value={formData.titulo}
                                                onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div className="form-group-Academicos">
                                            <label>Tipo *</label>
                                            <select
                                                value={formData.tipo}
                                                onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                                                required
                                            >
                                                <option value="curso">Curso</option>
                                                <option value="tecnico">Técnico</option>
                                                <option value="especializacion">Especialización</option>
                                                <option value="diplomado">Diplomado</option>
                                            </select>
                                        </div>
                                        <div className="form-group-Academicos">
                                            <label>Modalidad *</label>
                                            <select
                                                value={formData.modalidad}
                                                onChange={(e) => setFormData({...formData, modalidad: e.target.value})}
                                                required
                                            >
                                                <option value="presencial">Presencial</option>
                                                <option value="virtual">Virtual</option>
                                                <option value="mixta">Mixta</option>
                                            </select>
                                        </div>
                                        <div className="form-group-Academicos">
                                            <label>Duración *</label>
                                            <input
                                                type="text"
                                                placeholder="ej: 6 meses, 1 año"
                                                value={formData.duracion}
                                                onChange={(e) => setFormData({...formData, duracion: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div className="form-group-Academicos">
                                            <label>Precio (COP) *</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={formData.precio}
                                                onChange={(e) => setFormData({...formData, precio: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div className="form-group-Academicos">
                                            <label>Cupos Disponibles *</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={formData.cupos}
                                                onChange={(e) => setFormData({...formData, cupos: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div className="form-group-Academicos">
                                            <label>Fecha de Inicio *</label>
                                            <input
                                                type="date"
                                                value={formData.fechaInicio}
                                                onChange={(e) => setFormData({...formData, fechaInicio: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div className="form-group-Academicos">
                                            <label>Fecha de Fin</label>
                                            <input
                                                type="date"
                                                value={formData.fechaFin}
                                                onChange={(e) => setFormData({...formData, fechaFin: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group-Academicos">
                                        <label>Descripción *</label>
                                        <textarea
                                            rows="3"
                                            value={formData.descripcion}
                                            onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="form-group-Academicos">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={formData.destacado}
                                                onChange={(e) => setFormData({...formData, destacado: e.target.checked})}
                                            />
                                            Programa Destacado
                                        </label>
                                    </div>
                                </div>

                                {/* Información del profesor */}
                                <div className="form-section">
                                    <h3>Profesor</h3>
                                    <div className="form-group-Academicos">
                                        <label>Nombre del Profesor *</label>
                                        <input
                                            type="text"
                                            value={formData.profesor}
                                            onChange={(e) => setFormData({...formData, profesor: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="form-group-Academicos">
                                        <label>Biografía del Profesor</label>
                                        <textarea
                                            rows="3"
                                            value={formData.profesorBio}
                                            onChange={(e) => setFormData({...formData, profesorBio: e.target.value})}
                                        />
                                    </div>
                                </div>

                                {/* Requisitos */}
                                <div className="form-section">
                                    <h3>Requisitos</h3>
                                    {formData.requisitos.map((requisito, index) => (
                                        <div key={index} className="dynamic-field">
                                            <input
                                                type="text"
                                                placeholder={`Requisito ${index + 1}`}
                                                value={requisito}
                                                onChange={(e) => actualizarRequisito(index, e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                className="btn-remove"
                                                onClick={() => removerRequisito(index)}
                                                disabled={formData.requisitos.length === 1}
                                            >
                                                <i className="fas fa-minus"></i>
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="btn-add"
                                        onClick={agregarRequisito}
                                    >
                                        <i className="fas fa-plus"></i>
                                        Agregar Requisito
                                    </button>
                                </div>

                                {/* Plan de estudios */}
                                <div className="form-section">
                                    <h3>Plan de Estudios</h3>
                                    {formData.pensum.map((modulo, index) => (
                                        <div key={index} className="pensum-item">
                                            <div className="form-grid-Academicos">
                                                <div className="form-group-Academicos">
                                                    <input
                                                        type="text"
                                                        placeholder="Nombre del módulo"
                                                        value={modulo.modulo}
                                                        onChange={(e) => actualizarModuloPensum(index, 'modulo', e.target.value)}
                                                    />
                                                </div>
                                                <div className="form-group-Academicos">
                                                    <input
                                                        type="number"
                                                        placeholder="Horas"
                                                        value={modulo.horas}
                                                        onChange={(e) => actualizarModuloPensum(index, 'horas', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <textarea
                                                placeholder="Descripción del módulo"
                                                value={modulo.descripcion}
                                                onChange={(e) => actualizarModuloPensum(index, 'descripcion', e.target.value)}
                                                rows="2"
                                            />
                                            <button
                                                type="button"
                                                className="btn-remove"
                                                onClick={() => removerModuloPensum(index)}
                                                disabled={formData.pensum.length === 1}
                                            >
                                                <i className="fas fa-minus"></i>
                                                Remover módulo
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="btn-add"
                                        onClick={agregarModuloPensum}
                                    >
                                        <i className="fas fa-plus"></i>
                                        Agregar Módulo
                                    </button>
                                </div>

                                <div className="form-actions">
                                    <button type="button" className="btn-secondary" onClick={cerrarModales}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn-primary">
                                        <i className="fas fa-save"></i>
                                        {modalEditar ? 'Actualizar' : 'Crear'} Programa
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProgramasAcademicos;
