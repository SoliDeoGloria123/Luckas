import  { useEffect, useState } from 'react';
import { useNavigate} from 'react-router-dom';
import "./DashboardTesorero.css";
import Header from './Header/Header-tesorero';
import Footer from '../footer/Footer';
import { Users, Home, Book, ClipboardList, UserCheck, Award, FileText, Calendar } from "lucide-react"

const DashboardTesorero = () => {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const usuarioStorage = localStorage.getItem('usuario');
    const token = localStorage.getItem('token');

    if (!usuarioStorage || !token) {
      navigate('/login');
      return;
    }

    const usuarioData = JSON.parse(usuarioStorage);

    if (usuarioData.role !== 'tesorero') {
      navigate(usuarioData.role === 'admin' ? '/admin/users' : '/login');
      return;
    }
    setUsuario(usuarioData);
  }, [navigate]);

  if (!usuario) {
    return <div className="loading-screen">Cargando...</div>;
  }

  return (
    <div className="dashboard-tesorero">
      <Header usuario={usuario} />
      <main className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Principal</h2>
            <p className="text-gray-600">Gestiona recursos y administra el sistema eficientemente</p>
          </div>
          <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Ver Todas las Gestiones
          </button>
        </div>

        {/* Reports Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Reporte Mensual</h3>
              <p className="text-sm text-gray-500 mb-3">Actividad y métricas del mes</p>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">Completado</span>
                <span className="text-xs text-gray-400">Septiembre 2025</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Home className="w-6 h-6 text-blue-600" />
              </div>
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Ocupación Cabañas</h3>
              <p className="text-sm text-gray-500 mb-3">Análisis de ocupación y rentabilidad</p>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">En proceso</span>
                <span className="text-xs text-gray-400">Q1 2025</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-purple-600" />
              </div>
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Inscripciones</h3>
              <p className="text-sm text-gray-500 mb-3">Análisis de inscripciones y programas</p>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">Nuevo</span>
                <span className="text-xs text-gray-400">Octubre 2025</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Generar Nuevo</h3>
              <p className="text-sm text-gray-500 mb-3">Crea reporte personalizado</p>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">Nuevo</span>
                <span className="text-xs text-gray-400">Personalizado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Administrative Functions */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Funciones Administrativas</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Gestionar Usuarios */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-gray-900">156</span>
                  <span className="text-sm text-gray-500">usuarios</span>
                  <span className="text-xs text-gray-400 ml-auto">+12 este mes</span>
                </div>
              </div>
              <h4 className="text-base font-semibold text-gray-900 mb-1">Gestionar Usuarios</h4>
              <p className="text-sm text-gray-500 mb-4">Administrar cuentas de usuarios del sistema</p>
              <a
                href="/tesorero/usuarios"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
              >
                Gestionar →
              </a>
            </div>

            {/* Gestionar Categorías */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-gray-900">156</span>
                  <span className="text-sm text-gray-500">usuarios</span>
                  <span className="text-xs text-gray-400 ml-auto">+12 este mes</span>
                </div>
              </div>
              <h4 className="text-base font-semibold text-gray-900 mb-1">Gestionar Categorías</h4>
              <p className="text-sm text-gray-500 mb-4">Administrar Categorías del sistema</p>
              <a
                href="/tesorero/categorias"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
              >
                Gestionar →
              </a>
            </div>

            {/* Gestionar Solicitudes */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-green-50 rounded-lg mb-4">
                <ClipboardList className="w-6 h-6 text-green-600" />
              </div>
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-gray-900">23</span>
                  <span className="text-sm text-gray-500">pendientes</span>
                  <span className="text-xs text-gray-400 ml-auto">5 nuevas hoy</span>
                </div>
              </div>
              <h4 className="text-base font-semibold text-gray-900 mb-1">Gestionar Solicitudes</h4>
              <p className="text-sm text-gray-500 mb-4">Revisar y categorizar solicitudes</p>
              <a
                href="/tesorero/solicitudes"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
              >
                Gestionar →
              </a>
            </div>

            {/* Gestionar Eventos */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-50 rounded-lg mb-4">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-gray-900">8</span>
                  <span className="text-sm text-gray-500">próximos</span>
                  <span className="text-xs text-gray-400 ml-auto">2 esta semana</span>
                </div>
              </div>
              <h4 className="text-base font-semibold text-gray-900 mb-1">Gestionar Eventos</h4>
              <p className="text-sm text-gray-500 mb-4">Organizar y categorizar eventos</p>
              <a
                href="/tesorero/eventos"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
              >
                Gestionar →
              </a>
            </div>

            {/* Gestionar Cabañas */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mb-4">
                <Home className="w-6 h-6 text-blue-600" />
              </div>
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-gray-900">12</span>
                  <span className="text-sm text-gray-500">disponibles</span>
                  <span className="text-xs text-gray-400 ml-auto">85% ocupación</span>
                </div>
              </div>
              <h4 className="text-base font-semibold text-gray-900 mb-1">Gestionar Cabañas</h4>
              <p className="text-sm text-gray-500 mb-4">Administrar las cabañas</p>
              <a
                href="/tesorero/cabañas"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
              >
                Gestionar →
              </a>
            </div>

            {/* Gestionar Reservas */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-gray-900">12</span>
                  <span className="text-sm text-gray-500">disponibles</span>
                  <span className="text-xs text-gray-400 ml-auto">85% ocupación</span>
                </div>
              </div>
              <h4 className="text-base font-semibold text-gray-900 mb-1">Gestionar Reservas</h4>
              <p className="text-sm text-gray-500 mb-4">Administrar reservas de cabañas</p>
              <a
                href="/tesorero/reservas"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
              >
                Gestionar →
              </a>
            </div>

            {/* Gestionar Programas */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mb-4">
                <Book className="w-6 h-6 text-blue-600" />
              </div>
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-gray-900">15</span>
                  <span className="text-sm text-gray-500">activos</span>
                  <span className="text-xs text-gray-400 ml-auto">245 inscritos</span>
                </div>
              </div>
              <h4 className="text-base font-semibold text-gray-900 mb-1">Gestionar Programas</h4>
              <p className="text-sm text-gray-500 mb-4">Administrar programas académicos</p>
              <a
                href="/tesorero/programas"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
              >
                Gestionar →
              </a>
            </div>

            {/* Gestionar Tareas */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-gray-900">34</span>
                  <span className="text-sm text-gray-500">activas</span>
                  <span className="text-xs text-gray-400 ml-auto">12 completadas</span>
                </div>
              </div>
              <h4 className="text-base font-semibold text-gray-900 mb-1">Gestionar Tareas</h4>
              <p className="text-sm text-gray-500 mb-4">Asignar y supervisar tareas</p>
              <a
                href="/tesorero/tarea"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
              >
                Gestionar →
              </a>
            </div>

            {/* Gestionar Inscripciones */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mb-4">
                <UserCheck className="w-6 h-6 text-blue-600" />
              </div>
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-gray-900">67</span>
                  <span className="text-sm text-gray-500">nuevas</span>
                  <span className="text-xs text-gray-400 ml-auto">+18 esta semana</span>
                </div>
              </div>
              <h4 className="text-base font-semibold text-gray-900 mb-1">Gestionar Inscripciones</h4>
              <p className="text-sm text-gray-500 mb-4">Procesar inscripciones y categorizar</p>
              <a
                href="/tesorero/inscripcion"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
              >
                Gestionar →
              </a>
            </div>

            {/* Gestionar Certificados */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mb-4">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-gray-900">67</span>
                  <span className="text-sm text-gray-500">nuevas</span>
                  <span className="text-xs text-gray-400 ml-auto">+18 esta semana</span>
                </div>
              </div>
              <h4 className="text-base font-semibold text-gray-900 mb-1">Gestionar Certificados</h4>
              <p className="text-sm text-gray-500 mb-4">Procesar inscripciones y categorizar</p>
              <a
                href="/tesorero/certificados"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
              >
                Gestionar →
              </a>
            </div>

            {/* Gestionar Reportes */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-gray-900">25</span>
                  <span className="text-sm text-gray-500">reportes</span>
                  <span className="text-xs text-gray-400 ml-auto">Actualizado hoy</span>
                </div>
              </div>
              <h4 className="text-base font-semibold text-gray-900 mb-1">Gestionar Reportes</h4>
              <p className="text-sm text-gray-500 mb-4">Generar informes del sistema</p>
              <a
                href="/tesorero/reportes"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
              >
                Gestionar →
              </a>
            </div>
          </div>
        </div>

        {/* Activity & Statistics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Actividad Reciente</h3>
              <a href="/actividad" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                Ver todas
              </a>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Nueva solicitud de permiso</p>
                  <p className="text-xs text-gray-500">Juan Mendoza • Hace 2 horas</p>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">Pendiente</span>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Usuario registrado</p>
                  <p className="text-xs text-gray-500">María García • Hace 4 horas</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">Completado</span>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Nueva inscripción al programa</p>
                  <p className="text-xs text-gray-500">Pedro López • Hace 6 horas</p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">Nuevo</span>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Certificado generado</p>
                  <p className="text-xs text-gray-500">Ana Martínez • Hace 8 horas</p>
                </div>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">Completado</span>
              </div>
            </div>
          </div>

          {/* System Statistics */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Estadísticas del Sistema</h3>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Usuarios Activos</span>
                  <span className="text-lg font-bold text-gray-900">142</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "78%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Solicitudes Pendientes</span>
                  <span className="text-lg font-bold text-gray-900">23</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Eventos Este Mes</span>
                  <span className="text-lg font-bold text-gray-900">8</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: "32%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Ocupación Cabañas</span>
                  <span className="text-lg font-bold text-gray-900">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardTesorero;