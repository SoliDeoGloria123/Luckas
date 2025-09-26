
import React, { useState } from 'react';
import axios from 'axios';

export default function PagoPSE({ monto, inscripcionId, onPagoExitoso }) {
  // monto: cantidad a pagar
  // inscripcionId: id de la inscripción o reserva
  // onPagoExitoso: callback cuando el pago se realiza
  const [status, setStatus] = useState('');

  // Simulación de pago real
  const handlePago = async () => {
    setStatus('Procesando pago...');
    try {
      // Aquí iría la integración con la pasarela real (PayU, Stripe, etc.)
      // Ejemplo de endpoint ficticio:
      // const res = await axios.post(`/api/pagos/pse`, { inscripcionId, monto });
      // if (res.data.success) { ... }
      setTimeout(() => {
        setStatus('Pago realizado correctamente.');
        if (onPagoExitoso) onPagoExitoso();
      }, 1500);
    } catch (err) {
      setStatus('Error al procesar el pago.');
    }
  };

  return (
    <div>
      <h3>Pagar con PSE</h3>
      <p>Monto a pagar: ${monto}</p>
      <button onClick={handlePago}>Pagar ahora</button>
      {status && <p>{status}</p>}
      {/* TODO: Integrar con API real de PSE */}
    </div>
  );
}
