import { useState, useCallback } from 'react';
import { userService } from '../../../services/userService';
import { mostrarAlerta, mostrarConfirmacion } from '../../utils/alertas.jsx';

// Hook para manejo de operaciones CRUD de usuarios
export const useUsuariosAdmin = (obtenerUsuarios, usuarioActual, setUsuarioActual) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    tipoDocumento: "",
    numeroDocumento: "",
    password: "",
    role: "externo",
    estado: "activo"
  });

  const crearUsuario = useCallback(async () => {
    try {
      await userService.createUser(nuevoUsuario);
      mostrarAlerta("¡Éxito!", "Usuario creado exitosamente");
      setMostrarModal(false);
      setNuevoUsuario({
        nombre: "",
        apellido: "",
        correo: "",
        telefono: "",
        tipoDocumento: "",
        numeroDocumento: "",
        password: "",
        role: "externo",
        estado: "activo"
      });
      obtenerUsuarios();
    } catch (error) {
  mostrarAlerta("Error", `Error al crear el usuario: ${error.message || ""}${error.error ? " - " + error.error : ""}`);
    }
  }, [nuevoUsuario, obtenerUsuarios]);

  const actualizarUsuario = useCallback(async () => {
    try {
      await userService.updateUser(usuarioSeleccionado._id, {
        nombre: usuarioSeleccionado.nombre,
        apellido: usuarioSeleccionado.apellido,
        correo: usuarioSeleccionado.correo,
        telefono: usuarioSeleccionado.telefono,
        tipoDocumento: usuarioSeleccionado.tipoDocumento,
        numeroDocumento: usuarioSeleccionado.numeroDocumento,
        role: usuarioSeleccionado.role,
        estado: usuarioSeleccionado.estado,
      });
      mostrarAlerta("¡Éxito!", "Usuario actualizado exitosamente");
      setMostrarModal(false);
      setUsuarioSeleccionado(null);
      setModoEdicion(false);
      
      if (usuarioActual && usuarioSeleccionado._id === usuarioActual._id) {
        const nuevoUsuarioActual = {
          ...usuarioActual,
          nombre: usuarioSeleccionado.nombre,
          apellido: usuarioSeleccionado.apellido,
          correo: usuarioSeleccionado.correo,
          telefono: usuarioSeleccionado.telefono,
          tipoDocumento: usuarioSeleccionado.tipoDocumento,
          numeroDocumento: usuarioSeleccionado.numeroDocumento,
          role: usuarioSeleccionado.role,
          estado: usuarioSeleccionado.estado,
        };
        setUsuarioActual(nuevoUsuarioActual);
        localStorage.setItem('usuario', JSON.stringify(nuevoUsuarioActual));
      }
      obtenerUsuarios();
    } catch (error) {
      mostrarAlerta("Error", `Error: ${error.message}`);
    }
  }, [usuarioSeleccionado, usuarioActual, setUsuarioActual, obtenerUsuarios]);

  const eliminarUsuario = useCallback(async (userId) => {
    const confirmado = await mostrarConfirmacion(
      "¿Estás seguro?",
      "Esta acción eliminará el usuario de forma permanente."
    );

    if (!confirmado) return;

    try {
      await userService.deleteUser(userId);
      mostrarAlerta("¡Éxito!", "Usuario eliminado exitosamente");
      obtenerUsuarios();
    } catch (error) {
      mostrarAlerta("Error", `No se pudo eliminar el usuario: ${error.message}`);
    }
  }, [obtenerUsuarios]);

  const abrirModalCrear = useCallback(() => {
    setModoEdicion(false);
    setNuevoUsuario({ 
      nombre: "", 
      apellido: "", 
      correo: "", 
      telefono: "", 
      tipoDocumento: "",
      numeroDocumento: "",
      password: "", 
      role: "externo",
      estado: "activo"
    });
    setMostrarModal(true);
  }, []);

  const abrirModalEditar = useCallback((usuario) => {
    setModoEdicion(true);
    setUsuarioSeleccionado({ ...usuario });
    setMostrarModal(true);
  }, []);

  const cerrarModal = useCallback(() => {
    setMostrarModal(false);
    setUsuarioSeleccionado(null);
    setModoEdicion(false);
  }, []);

  return {
    mostrarModal,
    usuarioSeleccionado,
    setUsuarioSeleccionado,
    modoEdicion,
    nuevoUsuario,
    setNuevoUsuario,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    abrirModalCrear,
    abrirModalEditar,
    cerrarModal
  };
};
