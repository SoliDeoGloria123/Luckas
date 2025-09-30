import React, { useState, useEffect } from 'react';
import { useAuthCheck } from '../hooks/useAuthCheck';
import { tareaService } from '../../../services/tareaService';
import { userService } from '../../../services/userService';
import TareaModal from '../../Tesorero/modal/TareaModal';
import { mostrarAlerta } from '../../utils/alertas';
import Header from '../Shared/Header';
import Footer from '../Shared/MiPerfil';

const GestionTareasSeminarista = () => {
  const { user } = useAuthCheck('seminarista');
  const [tareas, setTareas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModalTarea] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentItemTarea, setcurrentItemTarea] = useState(null);

  const obtenerTareas = async () => {
    try {
      const data = await tareaService.getAll();
      let allTareas = Array.isArray(data.data) ? data.data : [];
      // Filtrar: solo tareas asignadas a mí o que yo asigné
      if (user && user._id) {
        allTareas = allTareas.filter(t =>
          (t.asignadoA && (t.asignadoA._id === user._id || t.asignadoA === user._id)) ||
          (t.asignadoPor && (t.asignadoPor._id === user._id || t.asignadoPor === user._id))
        );
      }
      setTareas(allTareas);
    } catch (err) {
      console.log('Error al obtener tareas: ' + err.message);
    }
  };

  const obtenerUsuarios = async () => {
    try {
      const data = await userService.getAllUsers();
      setUsuarios(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.log('Error al obtener usuarios: ' + err.message);
    }
  };

  useEffect(() => {
    obtenerTareas();
    obtenerUsuarios();
  }, []);

  const handleSubmit = async (Tareadata) => {
    try {
      if (modalMode === 'create') {
        await tareaService.create(Tareadata);
        mostrarAlerta('¡Éxito!', 'Tarea creada exitosamente');
      } else {
        await tareaService.update(currentItemTarea._id, Tareadata);
        mostrarAlerta('¡Éxito!', 'Tarea actualizada exitosamente');
      }
      setShowModalTarea(false);
      obtenerTareas();
    } catch (error) {
      mostrarAlerta('Error', 'Error al procesar la tarea: ' + error.message);
    }
  };

  const handleCreate = () => {
    setModalMode('create');
    setcurrentItemTarea(null);
    setShowModalTarea(true);
  };

  const handleEdit = (item) => {
    const normalizado = {
      ...item,
      prioridad: item.prioridad && ['Alta','Media','Baja'].includes(item.prioridad) ? item.prioridad : 'Media',
      estado: item.estado && ['pendiente','en_progreso','completada','cancelada'].includes(item.estado) ? item.estado : 'pendiente',
      comentarios: Array.isArray(item.comentarios) ? item.comentarios : [],
      asignadoA: item.asignadoA?._id || item.asignadoA || '',
      asignadoPor: item.asignadoPor?._id || item.asignadoPor || ''
    };
    setModalMode('edit');
    setcurrentItemTarea(normalizado);
    setShowModalTarea(true);
  };

  return (
    <>
      <Header />
      <main className="main-content-tesorero">
        <div className="page-header-tesorero">
          <div className="card-header-tesorero">
            <button className="back-btn-tesorero">
              <i className="fas fa-arrow-left"></i>
            </button>
            <div className="page-title-tesorero">
              <h1>Gestión de Tareas</h1>
              <p>Asignar y supervisar tareas del sistema</p>
            </div>
          </div>
          <button className="btn-primary-tesorero" onClick={handleCreate}>
            <i className="fas fa-plus"></i>
            Nueva Tarea
          </button>
        </div>
        <div className="table-container-tesorero">
          <table className="users-table-tesorero">
            <thead>
              <tr>
                <th></th>
                <th>ID</th>
                <th>TITULO</th>
                <th>DESCRIPCION</th>
                <th>ESTADO</th>
                <th>PRIORIDAD</th>
                <th>ASIGNADO A</th>
                <th>ASIGNADO A ROL</th>
                <th>ASIGNADO POR</th>
                <th>ASIGNADO POR ROL</th>
                <th>FECHA LIMITE</th>
                <th>FECHA CREACION</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {tareas.length === 0 ? (
                <tr>
                  <td colSpan={6}>No hay tareas para mostrar</td>
                </tr>
              ) : (
                tareas.map((tarea) => (
                  <tr key={tarea._id}>
                    <td></td>
                    <td>{tarea._id}</td>
                    <td>{tarea.titulo}</td>
                    <td>{tarea.descripcion}</td>
                    <td>
                      <span className={`badge-tesorero badge-tesorero-${tarea.estado} `}>
                        {tarea.estado}
                      </span>
                    </td>
                    <td>{tarea.prioridad}</td>
                    <td>{tarea.asignadoA?.nombre || 'N/A'}</td>
                    <td>{tarea.asignadoA?.role || 'N/A'}</td>
                    <td>{tarea.asignadoPor?.nombre || 'N/A'}</td>
                    <td>{tarea.asignadoPor?.role || 'N/A'}</td>
                    <td>{tarea.fechaLimite ? new Date(tarea.fechaLimite).toLocaleDateString() : 'N/A'}</td>
                    <td>{tarea.updatedAt ? new Date(tarea.updatedAt).toLocaleDateString() : 'N/A'}</td>
                    <td className='actions-cell'>
                      <button className="action-btn edit" onClick={() => handleEdit(tarea)}>
                        <i className="fas fa-edit"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {showModal && (
          <TareaModal
            mode={modalMode}
            initialData={currentItemTarea || {}}
            onClose={() => setShowModalTarea(false)}
            onSubmit={handleSubmit}
            usuarios={usuarios}
          />
        )}
      </main>
      <Footer />
    </>
  );
};

export default GestionTareasSeminarista;
