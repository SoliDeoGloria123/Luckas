import { useState, useMemo } from "react";


function buscarEnCampos(item, campos, texto) {
  return campos.some((campo) => {
    const valor = campo.split('.').reduce((obj, key) => obj?.[key], item);
    return (valor || "").toString().toLowerCase().includes(texto);
  });
}

// datos: array de objetos a filtrar
// campos: array de strings con los nombres de los campos a buscar (soporta campos anidados con punto)
export default function useBusqueda(datos = [], campos = []) {
  const [busqueda, setBusqueda] = useState("");

  const datosFiltrados = useMemo(() => {
    if (!Array.isArray(datos)) return [];
    const texto = busqueda.toLowerCase();
    return datos.filter((item) => buscarEnCampos(item, campos, texto));
  }, [datos, campos, busqueda]);

  return { busqueda, setBusqueda, datosFiltrados };
}