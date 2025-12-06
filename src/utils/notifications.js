import Swal from "sweetalert2";

// ================================
// ✔ Notificación de éxito (modal)
// ================================
export function notifySuccess(message = "Operación realizada correctamente") {
  Swal.fire({
    title: "¡Éxito!",
    text: message,
    icon: "success",
    confirmButtonText: "Aceptar",
    confirmButtonColor: "#4CAF50",
    timer: 4000,
    timerProgressBar: true
  });
}

// ================================
// ✔ Notificación de error (modal)
// ================================
export function notifyError(message = "Ocurrió un error inesperado") {
  Swal.fire({
    title: "Error",
    text: message,
    icon: "error",
    confirmButtonText: "Cerrar",
    confirmButtonColor: "#d33"
  });
}

// ================================
// ✔ Toast de éxito (no bloqueante)
// ================================
export function toastSuccess(message = "Guardado correctamente") {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: message,
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true
  });
}

// ================================
// ✔ Toast de error
// ================================
export function toastError(message = "Hubo un error") {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "error",
    title: message,
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true
  });
}
