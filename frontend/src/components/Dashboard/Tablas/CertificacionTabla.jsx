import React from 'react';

const CertificacionTabla = ({ certificados, onDescargar }) => {
  return (
    <div className="tabla-contenedor-admin">
      <table className="tabla-usuarios-admin">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Documento</th>
            <th>Correo</th>
            <th>Programa/Curso</th>
            <th>Estado</th>
            <th className="text-center">Acción</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {certificados.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-8 text-gray-400">No hay certificados generados aún.</td>
            </tr>
          )}
          {certificados.map((cert, idx) => (
            <tr key={cert._id || idx} className="hover:bg-blue-50 transition-all">
              <td className="px-6 py-4 whitespace-nowrap font-semibold">{cert.certificados} {cert.apellido}</td>
              <td className="px-6 py-4 whitespace-nowrap">{cert.numeroDocumento}</td>
              <td className="px-6 py-4 whitespace-nowrap">{cert.correo}</td>
              <td className="px-6 py-4 whitespace-nowrap">{cert.programaNombre || cert.cursoNombre || cert.referencia?.nombre || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${cert.estado === 'certificado' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{cert.estado}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <button
                  className="btn-admin btn-primary-admin px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all"
                  onClick={() => onDescargar(cert)}
                >
                  Descargar PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CertificacionTabla;
