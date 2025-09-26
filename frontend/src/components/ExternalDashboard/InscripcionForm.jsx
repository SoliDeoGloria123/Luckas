
import React, { useState } from 'react';
import axios from 'axios';

export default function InscripcionForm({ tipo, id, categoriaId }) {
  // tipo: 'evento' | 'programa'
  // id: id del evento o programa
  // categoriaId: id de la categoría asociada
  const userId = localStorage.getItem('userId');
  const [form, setForm] = useState({
    nombre: '',
    tipoDocumento: '',
    numeroDocumento: '',
    correo: '',
    telefono: '',
    edad: '',
    observaciones: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('');
    // Construir payload
    const payload = {
      ...form,
      usuario: userId,
      evento: tipo === 'evento' ? id : undefined,
      programa: tipo === 'programa' ? id : undefined,
      categoria: categoriaId
    };
    try {
      const res = await axios.post('/api/inscripciones', payload);
      if (res.data.success) {
        setStatus('Inscripción realizada correctamente.');
      } else {
        setStatus(res.data.message || 'Error al inscribirse.');
      }
    } catch (err) {
      setStatus('Error al inscribirse: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Inscribirse a {tipo === 'evento' ? 'Evento' : 'Programa'}</h3>
      <label>Nombre completo</label>
      <input name="nombre" value={form.nombre} onChange={handleChange} required />
      <label>Tipo de documento</label>
      <input name="tipoDocumento" value={form.tipoDocumento} onChange={handleChange} required />
      <label>Número de documento</label>
      <input name="numeroDocumento" value={form.numeroDocumento} onChange={handleChange} required />
      <label>Correo electrónico</label>
      <input name="correo" type="email" value={form.correo} onChange={handleChange} required />
      <label>Teléfono</label>
      <input name="telefono" value={form.telefono} onChange={handleChange} required />
      <label>Edad</label>
      <input name="edad" type="number" value={form.edad} onChange={handleChange} required />
      <label>Observaciones</label>
      <input name="observaciones" value={form.observaciones} onChange={handleChange} />
      <button type="submit">Inscribirse y Pagar</button>
      {status && <p>{status}</p>}
    </form>
  );
}
