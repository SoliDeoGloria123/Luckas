
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});

  // Obtener el ID del usuario externo (puede venir de auth, localStorage, etc.)
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) return;
    axios.get(`/api/users/${userId}`)
      .then(res => {
        if (res.data.success && res.data.user) {
          setUser(res.data.user);
          setForm({
            nombre: res.data.user.nombre || '',
            apellido: res.data.user.apellido || '',
            correo: res.data.user.correo || '',
            telefono: res.data.user.telefono || '',
            fechaNacimiento: res.data.user.fechaNacimiento || '',
          });
        }
      })
      .catch(err => {
        console.error('Error al cargar usuario:', err);
      });
  }, [userId]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = e => {
    e.preventDefault();
    axios.put(`/api/users/${userId}`, form)
      .then(res => {
        if (res.data.success && res.data.user) {
          setUser(res.data.user);
          setEditMode(false);
        }
      })
      .catch(err => {
        console.error('Error al actualizar usuario:', err);
      });
  };

  if (!user) return <div>Cargando perfil...</div>;

  return (
    <div>
      <h2>Perfil de Usuario</h2>
      {editMode ? (
        <form onSubmit={handleUpdate}>
          <label>Nombre: <input name="nombre" value={form.nombre} onChange={handleChange} /></label><br />
          <label>Apellido: <input name="apellido" value={form.apellido} onChange={handleChange} /></label><br />
          <label>Correo: <input name="correo" value={form.correo} onChange={handleChange} /></label><br />
          <label>Teléfono: <input name="telefono" value={form.telefono} onChange={handleChange} /></label><br />
          <label>Fecha de Nacimiento: <input name="fechaNacimiento" type="date" value={form.fechaNacimiento?.slice(0,10) || ''} onChange={handleChange} /></label><br />
          <button type="submit">Guardar</button>
          <button type="button" onClick={() => setEditMode(false)}>Cancelar</button>
        </form>
      ) : (
        <div>
          <p><strong>Nombre:</strong> {user.nombre}</p>
          <p><strong>Apellido:</strong> {user.apellido}</p>
          <p><strong>Correo:</strong> {user.correo}</p>
          <p><strong>Teléfono:</strong> {user.telefono}</p>
          <p><strong>Fecha de Nacimiento:</strong> {user.fechaNacimiento ? new Date(user.fechaNacimiento).toLocaleDateString() : ''}</p>
          <button onClick={() => setEditMode(true)}>Editar Perfil</button>
        </div>
      )}
    </div>
  );
}
