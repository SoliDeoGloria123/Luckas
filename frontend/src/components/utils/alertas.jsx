import Swal from 'sweetalert2';

export const mostrarAlerta = (titulo, mensaje, tipo = "success") => {

    Swal.fire({
        title: titulo,
        text: mensaje,
        icon: tipo,
        confirmButtonText: 'OK'
    });
};

export const mostrarConfirmacion = async (titulo, mensaje) => {

    const result = await Swal.fire({
   title: titulo,
    text: mensaje,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
    });
    return result.isConfirmed;
}

