import { lazy } from 'react';

// Lazy loading para componentes pesados del dashboard
export const GestionSolicitudLazy = lazy(() => import('./GestionSolicitud'));
export const ReportesLazy = lazy(() => import('./Reportes'));
export const ProgramasAcademicosLazy = lazy(() => import('./ProgramasAcademicos'));
export const GestionCategorizacionLazy = lazy(() => import('./GestionCategorizacion'));
export const GestionIscripcionLazy = lazy(() => import('./GestionIscripcion'));
export const GestionEventosLazy = lazy(() => import('./GestionEventos'));
export const GestionTareaLazy = lazy(() => import('./GestionTarea'));
export const GestioCabañasLazy = lazy(() => import('./GestioCabañas'));
export const GestionReservasLazy = lazy(() => import('./GestionReservas'));

// Componente de loading premium
export const PremiumLoader = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/20">
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
        <span className="text-lg font-semibold text-slate-700">Cargando módulo...</span>
      </div>
    </div>
  </div>
);
