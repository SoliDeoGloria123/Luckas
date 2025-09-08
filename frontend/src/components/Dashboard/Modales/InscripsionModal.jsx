import React, { useEffect } from "react";
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
  // Autocompletar datos del usuario al escribir el ID
  useEffect(() => {
    const cargarDatosUsuario = async () => {
      const idUsuario = modoEdicion
        ? inscripcionSeleccionada?.usuario
        : nuevaInscripcion.usuario;
      if (idUsuario && idUsuario.length === 24) {
        try {
          const user = await userService.getById(idUsuario);
          if (user) {
            const datos = {
              nombre: user.nombre || "",
              apellido: user.apellido || "",
              correo: user.correo || "",
              telefono: user.telefono || "",
              tipoDocumento: user.tipoDocumento || "",
              numeroDocumento: user.numeroDocumento || ""
            };
            if (modoEdicion) {
              setInscripcionSeleccionada((prev) => ({
                ...prev,
                ...datos
              }));
            } else {
              setNuevaInscripcion((prev) => ({
                ...prev,
                ...datos
              }));
            }
          }
        } catch (error) {
          // Si no encuentra el usuario, limpia los campos
          if (modoEdicion) {
            setInscripcionSeleccionada((prev) => ({
              ...prev,
              nombre: "",
              apellido: "",
              correo: "",
              telefono: "",
              tipoDocumento: "",
              numeroDocumento: ""
            }));
          } else {
            setNuevaInscripcion((prev) => ({
              ...prev,
              nombre: "",
              apellido: "",
              correo: "",
              telefono: "",
              tipoDocumento: "",
              numeroDocumento: ""
            }));
          }
        }
      }
    };
    cargarDatosUsuario();
    // eslint-disable-next-line
  }, [modoEdicion ? inscripcionSeleccionada?.usuario : nuevaInscripcion.usuario, modoEdicion]);

  if (!mostrar) return null;


  return (
    <div className="modal-overlay-admin">
      <div className="modal-admin">
        <div className="modal-header-admin">
          <h3>{modoEdicion ? "Editar Inscripción" : "Nueva Inscripción"}</h3>
          <button className="modal-cerrar" onClick={onClose}>
            ✕
          </button>
        </div>
        <form className="modal-body-admin">

          {!modoEdicion && (
            <div className="form-grupo-admin">
              <label>Usuario:</label>
              <input
                type="text"
                value={nuevaInscripcion.usuario}
                onChange={e => setNuevaInscripcion({ ...nuevaInscripcion, usuario: e.target.value })}
                placeholder="ID del Usuario"
                required
              />
            </div>
          )}
          <div className="from-grid-admin">
            <div className="form-grupo-admin">
              <label>Nombre:</label>
              <input
                type="text"
                value={modoEdicion ? inscripcionSeleccionada?.nombre : nuevaInscripcion.nombre}
                onChange={e =>
                  modoEdicion
                    ? setInscripcionSeleccionada({ ...inscripcionSeleccionada, nombre: e.target.value })
                    : setNuevaInscripcion({ ...nuevaInscripcion, nombre: e.target.value })
                }
              />
            </div>

            <div className="form-grupo-admin">
              <label>Apellido:</label>
              <input
                type="text"
                value={modoEdicion ? inscripcionSeleccionada?.apellido : nuevaInscripcion.apellido}
                onChange={e =>
                  modoEdicion
                    ? setInscripcionSeleccionada({ ...inscripcionSeleccionada, apellido: e.target.value })
                    : setNuevaInscripcion({ ...nuevaInscripcion, apellido: e.target.value })
                }
              />
            </div>
          </div>
          <div className="from-grid-admin">

            <div className="form-grupo-admin">
              <label>Tipo de Documento:</label>
              <select
                value={modoEdicion ? inscripcionSeleccionada?.tipoDocumento : nuevaInscripcion.tipoDocumento}
                onChange={e =>
                  modoEdicion
                    ? setInscripcionSeleccionada({ ...inscripcionSeleccionada, tipoDocumento: e.target.value })
                    : setNuevaInscripcion({ ...nuevaInscripcion, tipoDocumento: e.target.value })
                }
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
                value={modoEdicion ? inscripcionSeleccionada?.numeroDocumento : nuevaInscripcion.numeroDocumento}
                onChange={e =>
                  modoEdicion
                    ? setInscripcionSeleccionada({ ...inscripcionSeleccionada, numeroDocumento: e.target.value })
                    : setNuevaInscripcion({ ...nuevaInscripcion, numeroDocumento: e.target.value })
                }
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
                />
              </div>
            )}

            <div className="form-grupo-admin">
              <label>Teléfono:</label>
              <input
                type="text"
                value={modoEdicion ? inscripcionSeleccionada?.telefono : nuevaInscripcion.telefono}
                onChange={e =>
                  modoEdicion
                    ? setInscripcionSeleccionada({ ...inscripcionSeleccionada, telefono: e.target.value })
                    : setNuevaInscripcion({ ...nuevaInscripcion, telefono: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="from-grid-admin">
            <div className="form-grupo-admin">
              <label>Edad:</label>
              <input
                type="number"
                value={modoEdicion ? inscripcionSeleccionada?.edad : nuevaInscripcion.edad}
                onChange={e =>
                  modoEdicion
                    ? setInscripcionSeleccionada({ ...inscripcionSeleccionada, edad: e.target.value })
                    : setNuevaInscripcion({ ...nuevaInscripcion, edad: e.target.value })
                }
                required
              />
            </div>
            <div className="form-grupo-admin">
              <label>Evento:</label>
              <select
                value={modoEdicion ? inscripcionSeleccionada?.evento : nuevaInscripcion.evento}
                onChange={e =>
                  modoEdicion
                    ? setInscripcionSeleccionada({ ...inscripcionSeleccionada, evento: e.target.value })
                    : setNuevaInscripcion({ ...nuevaInscripcion, evento: e.target.value })
                }
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
                value={modoEdicion ? inscripcionSeleccionada?.categoria : nuevaInscripcion.categoria}
                onChange={e =>
                  modoEdicion
                    ? setInscripcionSeleccionada({ ...inscripcionSeleccionada, categoria: e.target.value })
                    : setNuevaInscripcion({ ...nuevaInscripcion, categoria: e.target.value })
                }
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
                value={modoEdicion ? inscripcionSeleccionada?.estado : nuevaInscripcion.estado}
                onChange={e =>
                  modoEdicion
                    ? setInscripcionSeleccionada({ ...inscripcionSeleccionada, estado: e.target.value })
                    : setNuevaInscripcion({ ...nuevaInscripcion, estado: e.target.value })
                }
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
              value={modoEdicion ? inscripcionSeleccionada?.observaciones : nuevaInscripcion.observaciones}
              onChange={e =>
                modoEdicion
                  ? setInscripcionSeleccionada({ ...inscripcionSeleccionada, observaciones: e.target.value })
                  : setNuevaInscripcion({ ...nuevaInscripcion, observaciones: e.target.value })
              }
              placeholder="Observaciones"
            />
          </div>
          <div className="modal-action-admin">
            <button className="btn-admin secondary-admin" onClick={onClose}>
                <i class="fas fa-times"></i>
              Cancelar
            </button>
            <button className="btn-admin btn-primary" onClick={onSubmit}>
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