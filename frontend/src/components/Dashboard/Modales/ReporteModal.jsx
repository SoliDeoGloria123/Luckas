import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Users,
  Bed,
  UserPlus,
  Calendar,
  FileText,
  Home,
  BarChart3
} from "lucide-react";
import ReportTypePicker from './common/ReportTypePicker';
import ReportFilters from './common/ReportFilters';
import FormField from './common/FormField';
import ModalHeader from './common/ModalHeader';
import { 
  initialFormState, 
  getCurrentDate, 
  formatDateForForm, 
  buildSubmissionData,
  datosInicialesPropType 
} from './common/reporteModalTypes';

const ReporteModal = ({ mostrar, onClose, onSubmit, datosIniciales, modoEdicion }) => {
  const [form, setForm] = useState(initialFormState);
  const [selectedReportType, setSelectedReportType] = useState("");
  const [error, setError] = useState("");

  // Actualizar el formulario cuando se abra en modo edición
  useEffect(() => {

    if (mostrar) {
      if (modoEdicion && datosIniciales) {
        // Modo edición - cargar datos del reporte
        const formData = {
          nombre: datosIniciales.nombre || "",
          descripcion: datosIniciales.descripcion || datosIniciales.description || "",
          tipo: datosIniciales.tipo || datosIniciales.type || "",
          fechaInicio: formatDateForForm(datosIniciales.filtros?.fechaInicio),
          fechaFin: formatDateForForm(datosIniciales.filtros?.fechaFin),
          estado: datosIniciales.filtros?.estado || "",
          categoria: datosIniciales.filtros?.categoria || "",
          usuario: datosIniciales.filtros?.usuario || ""
        };
        setForm(formData);
        setSelectedReportType(datosIniciales.tipo || datosIniciales.type || "");
      } else {
        // Modo creación - limpiar formulario
        setForm(initialFormState);
        setSelectedReportType("");
      }
      setError(""); // Limpiar errores al abrir el modal
    }
  }, [mostrar, datosIniciales, modoEdicion]);

  // Calcular la fecha actual en formato YYYY-MM-DD
  const maxDate = getCurrentDate();

  if (!mostrar) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.nombre || !form.descripcion || !form.tipo) {
      setError("Todos los campos obligatorios deben estar completos.");
      return;
    }
    // Construir objeto de datos para el backend
    setError("");
    const datosEnvio = buildSubmissionData(form);
    onSubmit(datosEnvio);
  };

  const REPORT_TYPES = [
    { value: "usuarios", label: "Usuarios", icon: Users },
    { value: "inscripciones", label: "Inscripciones", icon: UserPlus },
    { value: "reservas", label: "Reservas", icon: Bed },
    { value: "eventos", label: "Eventos", icon: Calendar },
    { value: "solicitudes", label: "Solicitudes", icon: FileText },
    { value: "programas", label: "Programas Académicos", icon: BarChart3 },
    { value: "tareas", label: "Tareas", icon: FileText },
    { value: "cabañas", label: "Cabañas", icon: Home },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="glass-card rounded-2xl shadow-2xl border border-white/20 w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white">        <ModalHeader 
          title={modoEdicion ? "Editar Reporte" : "Crear Nuevo Reporte"}
          onClose={onClose}
        />
        <form className="modal-body-admin" onSubmit={handleSubmit}>
          <div className="from-grid-admin">
            <div className="form-grupo-admin">
              <FormField
                label="Nombre del Reporte"
                name="nombre"
                type="text"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Ej: Reporte de Inscripciones Octubre"
                required
              />
            </div>
            <div className="form-grupo-admin">
              <FormField
                label="Descripción"
                name="descripcion"
                type="text"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Breve descripción del reporte"
                required
              />
            </div>
          </div>

          <div className="mb-2">
            <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">Tipo de Reporte</label>
            <ReportTypePicker
              types={REPORT_TYPES}
              selected={selectedReportType}
              onSelect={(val) => { setSelectedReportType(val); setForm((prev) => ({ ...prev, tipo: val })); }}
            />
          </div>

          <ReportFilters form={form} onChange={handleChange} maxDate={maxDate} />

          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          <div className="modal-action-admin">
            <button className="btn-admin secondary-admin" type="button" onClick={onClose}>
              <i className="fas fa-times"></i> Cancelar
            </button>
            <button type="submit" className="btn-admin btn-primary">
              <i className="fas fa-save"></i> {modoEdicion ? 'Guardar Cambios' : 'Crear Reporte'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ReporteModal.propTypes = {
  mostrar: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  modoEdicion: PropTypes.bool,
  datosIniciales: datosInicialesPropType
};

export default ReporteModal;
