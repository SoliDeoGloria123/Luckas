import React, { useEffect, useState } from "react";
import { userService } from "../../../services/ObteneruserService";

const InscripcionModal = ({
  mostrar,
  modoEdicion,
  inscripcionSeleccionada,
  setInscripcionSeleccionada,
  nuevaInscripcion,
  setNuevaInscripcion,
  eventos,
  categorias,
  onClose,
  onSubmit
}) => {
  const [cedulaBusqueda, setCedulaBusqueda] = useState("");
  const [cargandoUsuario, setCargandoUsuario] = useState(false);
  const [usuarioEncontrado, setUsuarioEncontrado] = useState(null);
  const [errorBackend, setErrorBackend] = useState(""); // Estado para el error del backend

  // Función para buscar usuario por cédula
  const buscarUsuarioPorCedula = async (cedula) => {
    if (!cedula || cedula.length < 6) return;

    setCargandoUsuario(true);
    try {
      const usuario = await userService.getByDocumento(cedula);
      setUsuarioEncontrado(usuario);

      // Llenar automáticamente los campos del formulario
      const datosUsuario = {
        usuario: usuario._id,
        nombre: usuario.nombre || "",
        apellido: usuario.apellido || "",
        correo: usuario.correo || "",
        telefono: usuario.telefono || "",
        tipoDocumento: usuario.tipoDocumento || "",
        numeroDocumento: usuario.numeroDocumento || ""
      };

      if (modoEdicion) {
        setInscripcionSeleccionada(prev => ({
          ...prev,
          ...datosUsuario
        }));
      } else {
        setNuevaInscripcion(prev => ({
          ...prev,
          ...datosUsuario
        }));
      }
    } catch (error) {
      console.error("Usuario no encontrado:", error);
      setUsuarioEncontrado(null);
      // Limpiar los campos si no se encuentra el usuario
      const datosVacios = {
        usuario: "",
        nombre: "",
        apellido: "",
        correo: "",
        telefono: "",
        tipoDocumento: "",
        numeroDocumento: ""
      };

      if (modoEdicion) {
        setInscripcionSeleccionada(prev => ({
          ...prev,
          ...datosVacios
        }));
      } else {
        setNuevaInscripcion(prev => ({
          ...prev,
          ...datosVacios
        }));
      }
    } finally {
      setCargandoUsuario(false);
    }
  };

  // Inicializar cédula cuando se abre el modal en modo edición
  useEffect(() => {
    if (modoEdicion && inscripcionSeleccionada?.numeroDocumento) {
      setCedulaBusqueda(inscripcionSeleccionada.numeroDocumento);
    } else if (!modoEdicion) {
      setCedulaBusqueda("");
      setUsuarioEncontrado(null);
    }
  }, [modoEdicion, inscripcionSeleccionada, mostrar]);

  // Detectar cambios en el campo de cédula
  const handleCedulaChange = (e) => {
    const cedula = e.target.value;
    setCedulaBusqueda(cedula);
    if (cedula.length >= 6) {
      buscarUsuarioPorCedula(cedula);
    }
  };

  // Detectar pegado en el campo de cédula
  const handleCedulaPaste = (e) => {
    setTimeout(() => {
      const cedula = e.target.value;
      if (cedula.length >= 6) {
        buscarUsuarioPorCedula(cedula);
      }
    }, 100);
  };

  if (!mostrar) return null;

  // En el componente, modifica el handler de onSubmit para crear el objeto con los nombres correctos
  const handleSubmit = async () => {
    const insc = modoEdicion ? inscripcionSeleccionada : nuevaInscripcion;
    const usuarioId = typeof insc.usuario === 'object' && insc.usuario._id ? insc.usuario._id : insc.usuario;
    const payload = {
      usuario: usuarioId,
      referencia: insc.evento, // id del evento
      tipoReferencia: 'Eventos',
      categoria: insc.categoria,
      estado: insc.estado,
      observaciones: insc.observaciones,
      nombre: insc.nombre,
      tipoDocumento: insc.tipoDocumento,
      numeroDocumento: insc.numeroDocumento,
      telefono: insc.telefono,
      edad: insc.edad,
      correo: insc.correo,
      apellido: insc.apellido,
    };
    try {
      await onSubmit(payload);
      setErrorBackend("");
    } catch (err) {
      setErrorBackend(err?.message || "Error desconocido");
    }
  };

  // Handler único para todos los campos
  const inscripcionActual = modoEdicion ? inscripcionSeleccionada : nuevaInscripcion;
  const setInscripcion = modoEdicion ? setInscripcionSeleccionada : setNuevaInscripcion;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInscripcion({ ...inscripcionActual, [name]: value });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-2xl shadow-2xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <div className="sticky top-0 glass-card border-b border-white/20 px-6 py-4 flex items-center justify-between modal-header-admin"
        style={{
            background: 'linear-gradient(90deg, var(--color-blue-principal), var(--color-blue-oscuro))',
            color: 'white'
          }}>
          <h3>{modoEdicion ? "Editar Inscripción" : "Nueva Inscripción"}</h3>
          <button className="modal-cerrar" onClick={onClose}>
            ✕
          </button>
        </div>
        <form className="modal-body-admin" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
          <div className="form-grupo-admin">
            <label>Buscar por Cédula:</label>
            <input
              type="text"
              value={cedulaBusqueda}
              onChange={handleCedulaChange}
              onPaste={handleCedulaPaste}
              placeholder="Ingrese número de cédula"
              className="form-control"
              style={{ marginBottom: '5px' }}
            />
            {cargandoUsuario && (
              <small style={{ color: '#007bff', display: 'block' }}>🔍 Buscando usuario...</small>
            )}
            {usuarioEncontrado && (
              <small style={{ color: '#28a745', display: 'block' }}>
                ✅ Usuario encontrado: {usuarioEncontrado.nombre} {usuarioEncontrado.apellido}
              </small>
            )}
            {cedulaBusqueda.length >= 6 && !usuarioEncontrado && !cargandoUsuario && (
              <small style={{ color: '#dc3545', display: 'block' }}>❌ Usuario no encontrado con cédula: {cedulaBusqueda}</small>
            )}
          </div>

          {/* Campo oculto para el ID del usuario */}
          <input
            type="hidden"
            value={modoEdicion ? inscripcionSeleccionada?.usuario || "" : nuevaInscripcion.usuario || ""}
          />

          {!modoEdicion && (
            <div className="form-grupo-admin" style={{ display: 'none' }}>
              <label>Usuario (ID):</label>
              <input
                type="text"
                value={nuevaInscripcion.usuario}
                readOnly
                disabled
                style={{ backgroundColor: '#f5f5f5' }}
              />
            </div>
          )}
          <div className="from-grid-admin">
            <div className="form-grupo-admin">
              <label>Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={inscripcionActual.nombre}
                onChange={handleChange}
                readOnly={!modoEdicion && usuarioEncontrado}
                style={{ backgroundColor: !modoEdicion && usuarioEncontrado ? '#f5f5f5' : 'white' }}
                placeholder="Nombre"
              />
            </div>

            <div className="form-grupo-admin">
              <label>Apellido:</label>
              <input
                type="text"
                name="apellido"
                value={inscripcionActual.apellido}
                onChange={handleChange}
                readOnly={!modoEdicion && usuarioEncontrado}
                style={{ backgroundColor: !modoEdicion && usuarioEncontrado ? '#f5f5f5' : 'white' }}
                placeholder="Apellido"
              />
            </div>
          </div>
          <div className="from-grid-admin">

            <div className="form-grupo-admin">
              <label>Tipo de Documento:</label>
              <select
                name="tipoDocumento"
                value={inscripcionActual.tipoDocumento}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione...</option>
                <option value="Cédula de ciudadanía">Cédula de ciudadanía</option>
                <option value="Cédula de extranjería">Cédula de extranjería</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="Tarjeta de identidad">Tarjeta de identidad</option>
              </select>
            </div>


            <div className="form-grupo-admin">
              <label>Número de Documento:</label>
              <input
                type="text"
                name="numeroDocumento"
                value={inscripcionActual.numeroDocumento}
                onChange={handleChange}
                readOnly={!modoEdicion && usuarioEncontrado}
                style={{ backgroundColor: !modoEdicion && usuarioEncontrado ? '#f5f5f5' : 'white' }}
                placeholder="Número de documento"
                required
              />
            </div>
          </div>
          <div className="from-grid-admin">
            {!modoEdicion && (
              <div className="form-grupo-admin">
                <label>Correo:</label>
                <input
                  type="email"
                  value={nuevaInscripcion.correo}
                  onChange={e =>
                    setNuevaInscripcion({ ...nuevaInscripcion, correo: e.target.value })
                  }
                  readOnly={usuarioEncontrado}
                  style={{ backgroundColor: usuarioEncontrado ? '#f5f5f5' : 'white' }}
                  placeholder="Correo electrónico"
                />
              </div>
            )}
            {modoEdicion && (
              <div className="form-grupo-admin">
                <label>Correo:</label>
                <input
                  type="email"
                  name="correo"
                  value={inscripcionActual.correo}
                  onChange={handleChange}
                  placeholder="Correo electrónico"
                />
              </div>
            )}
            <div className="form-grupo-admin">
              <label>Teléfono:</label>
              <input
                type="text"
                name="telefono"
                value={inscripcionActual.telefono}
                onChange={handleChange}
                readOnly={!modoEdicion && usuarioEncontrado}
                style={{ backgroundColor: !modoEdicion && usuarioEncontrado ? '#f5f5f5' : 'white' }}
                placeholder="Teléfono"
                required
              />
            </div>
          </div>
          <div className="from-grid-admin">
            <div className="form-grupo-admin">
              <label>Edad:</label>
              <input
                type="number"
                name="edad"
                value={inscripcionActual.edad}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-grupo-admin">
              <label>Evento:</label>
              <select
                name="evento"
                value={inscripcionActual.evento}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione...</option>
                {eventos && eventos.map(ev => (
                  <option key={ev._id} value={ev._id}>
                    {ev.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="from-grid-admin">
            <div className="form-grupo-admin">
              <label>Categoría:</label>
              <select
                name="categoria"
                value={inscripcionActual.categoria}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione...</option>
                {categorias && categorias.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-grupo-admin">
              <label>Estado:</label>
              <select
                name="estado"
                value={inscripcionActual.estado}
                onChange={handleChange}
              >
                <option value="pendiente">Pendiente</option>
                <option value="aprobada">Aprobada</option>
                <option value="rechazada">Rechazada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
          </div>
          <div className="form-grupo-admin">
            <label>Observaciones:</label>
            <input
              type="text"
              name="observaciones"
              value={inscripcionActual.observaciones}
              onChange={handleChange}
              placeholder="Observaciones"
            />
          </div>
          {errorBackend && (
            <div style={{ color: 'red', marginBottom: '10px' }}>
              <b>Error:</b> {errorBackend}
            </div>
          )}
          <div className="modal-action-admin">
            <button className="btn-admin secondary-admin" onClick={onClose}>
                <i class="fas fa-times"></i>
              Cancelar
            </button>
            <button className="btn-admin btn-primary" type="submit">
               <i class="fas fa-save"></i>
              {modoEdicion ? "Guardar Cambios" : "Crear Inscripción"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InscripcionModal;