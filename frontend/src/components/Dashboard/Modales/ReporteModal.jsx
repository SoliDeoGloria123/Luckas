import React, { useState } from "react";
import {
  Users,
  Bed,
  UserPlus,
  Calendar,
  FileText,
  Home,
  BarChart3,
  Filter,
} from "lucide-react"

const ReporteModal = ({ mostrar, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    tipo: "",
    fechaInicio: "",
    fechaFin: "",
    estado: "",
    categoria: "",
    usuario: ""
  });
  const [selectedReportType, setSelectedReportType] = useState("")
  const [error, setError] = useState("");

  // Calcular la fecha actual en formato YYYY-MM-DD
  const today = new Date();
  const maxDate = today.toISOString().split('T')[0];

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
    // Construir objeto de filtros para el backend
    const filtros = {
      fechaInicio: form.fechaInicio ? new Date(form.fechaInicio) : null,
      fechaFin: form.fechaFin ? new Date(form.fechaFin) : null,
      estado: form.estado,
      categoria: form.categoria,
      usuario: form.usuario,
      otros: {}
    };
    setError("");
    onSubmit({
      nombre: form.nombre,
      descripcion: form.descripcion,
      tipo: form.tipo,
      filtros
    });
  };

  const REPORT_TYPES = [
    { value: "usuarios", label: "Usuarios", icon: Users },
    { value: "inscripciones", label: "Inscripciones", icon: UserPlus },
    { value: "reservas", label: "Reservas", icon: Bed },
    { value: "eventos", label: "Eventos", icon: Calendar },
    { value: "solicitudes", label: "Solicitudes", icon: FileText },
    { value: "programas", label: "Programas Académicos", icon: BarChart3 },
    { value: "tareas", label: "Tareas", icon: FileText },
    { value: "cabanas", label: "Cabañas", icon: Home },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="glass-card rounded-2xl shadow-2xl border border-white/20 w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white">        <div
        className="sticky top-0 glass-card border-b border-white/20 px-6 py-4 flex items-center justify-between modal-header-admin"
        style={{
          background: 'linear-gradient(90deg, var(--color-blue-principal), var(--color-blue-oscuro))',
          color: 'white'
        }}
      >
        <h2>Crear Nuevo Reporte</h2>
        <button className="modal-cerrar" onClick={onClose}>
          ✕
        </button>
      </div>
        <form className="modal-body-admin" onSubmit={handleSubmit}>
          <div className="from-grid-admin">
            <div className="form-grupo-admin">
              <label><i className="fas fa-file-alt"></i> Nombre del Reporte *</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Ej: Reporte de Inscripciones Octubre"
                required
              />
            </div>
            <div className="form-grupo-admin">
              <label><i className="fas fa-align-left"></i> Descripción *</label>
              <input
                type="text"
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Breve descripción del reporte"
                required
              />
            </div>
          </div>

          <>
            <label className="mb-2 block text-sm font-medium text-gray-700">Tipo de Reporte</label>
            <div className="grid gap-3 md:grid-cols-2">
              {REPORT_TYPES.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    type="button"
                    key={type.value}
                    onClick={() => {
                      setSelectedReportType(type.value);
                      setForm((prev) => ({ ...prev, tipo: type.value }));
                    }}
                    className={`flex items-center gap-3 rounded-lg border-2 p-3 text-left transition-all ${selectedReportType === type.value
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${selectedReportType === type.value ? "bg-blue-600" : "bg-gray-100"
                        }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${selectedReportType === type.value ? "text-white" : "text-gray-600"}`}
                      />
                    </div>
                    <span className="font-medium text-gray-900">{type.label}</span>
                  </button>
                )
              })}
            </div>
          </>

          <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 mt-6">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="h-4 w-4 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Filtros</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {(form.tipo === "usuarios" || form.tipo === "reservas" || form.tipo === "eventos" || form.tipo === "inscripciones") && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Fecha Desde</label>
                  <input
                    type="date"
                    name="fechaInicio"
                    value={form.fechaInicio}
                    onChange={handleChange}
                    max={maxDate}
                    className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              )}
              {(form.tipo === "usuarios" || form.tipo === "reservas" || form.tipo === "eventos" || form.tipo === "inscripciones") && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Fecha Hasta</label>
                  <input
                    type="date"
                    name="fechaFin"
                    value={form.fechaFin}
                    onChange={handleChange}
                    max={maxDate}
                    className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              )}
              {(form.tipo === "usuarios" || form.tipo === "reservas" || form.tipo === "solicitudes") && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Estado</label>
                  <select
                    value={form.estado}
                    onChange={handleChange}
                    className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="">Sin filtro</option>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="finalizado">Finalizado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          <div className="modal-action-admin">
            <button className="btn-admin secondary-admin" type="button" onClick={onClose}>
              <i className="fas fa-times"></i> Cancelar
            </button>
            <button type="submit" className="btn-admin btn-primary">
              <i className="fas fa-save"></i> Crear Reporte
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReporteModal;
