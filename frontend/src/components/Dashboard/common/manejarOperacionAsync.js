export default async function manejarOperacionAsync(operacion, setEstado, mensajeError, onError) {
  try {
    const data = await operacion();
    let resultado = [];
    if (Array.isArray(data)) {
      resultado = data;
    } else if (Array.isArray(data?.data)) {
      resultado = data.data;
    } else {
      resultado = [];
    }
    setEstado(resultado);
  } catch (error) {
    const message = `${mensajeError}: ${error.message}`;
    if (typeof onError === 'function') {
      onError(message);
    } else {
      console.error(message);
    }
  }
}
