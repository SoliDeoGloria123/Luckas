
import { useState } from "react";
import {
  Users,
  FileText,
  Calendar,
  Home,
  GraduationCap,
  CheckSquare,
  UserPlus,
  BarChart3,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  Camera,
  Save,
  Edit3,
  Mail,
  Phone,
  MapPin,
  CalendarIcon,
  Shield,
} from "lucide-react";
import Header from './Header/Header-tesorero';
import Footer from '../footer/Footer';
import {userService} from '../../services/userService';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    nombre: "Sofía",
    apellido: "Martínez",
    email: "sofia.martinez@luckas.edu.co",
    telefono: "+57 300 123 4567",
    documento: "1234567890",
    tipoDocumento: "Cédula de Ciudadanía",
    fechaNacimiento: "1990-05-15",
    direccion: "Calle 123 #45-67, Bogotá",
    cargo: "Tesorera",
    departamento: "Administración Financiera",
    fechaIngreso: "2020-03-01",
    estado: "Activo",
  })
   // Obtener usuario logueado desde localStorage
    const usuarioLogueado = (() => {
        try {
            const usuarioStorage = localStorage.getItem('usuario');
            return usuarioStorage ? JSON.parse(usuarioStorage) : null;
        } catch {
            return null;
        }
    })();


  

  return (

    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Header />
        <div className="bg-gradient-to-r  to-purple-600 h-32"></div>
        <div className="px-6 pb-6">
          <div className="flex items-center space-x-8 -mt-16">
            <div className="relative">
              <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <span className="text-white text-4xl font-bold">S</span>
              </div>
              <button className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 pt-16">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {usuarioLogueado.nombre} {usuarioLogueado.apellido}
                  </h1>
                  <p className="text-gray-600">{usuarioLogueado.role} - {profileData.departamento}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></div>
                      {profileData.estado}
                    </span>
                    <span className="text-sm text-gray-500">
                      Miembro desde {new Date(profileData.fechaIngreso).toLocaleDateString('es-ES', { 
                        year: 'numeric', 
                        month: 'long' 
                      })}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>{isEditingProfile ? "Cancelar" : "Editar Perfil"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Personal Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Información Personal</h2>
                {isEditingProfile && (
                  <button
                    onClick={() => {
                      setIsEditingProfile(false)
                      // Here you would typically save the data
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                  {isEditingProfile ? (
                    <input
                      type="text"
                      value={usuarioLogueado.nombre}
                      onChange={(e) => setProfileData({...usuarioLogueado, nombre: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{usuarioLogueado.nombre}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                  {isEditingProfile ? (
                    <input
                      type="text"
                      value={usuarioLogueado.apellido}
                      onChange={(e) => setProfileData({...usuarioLogueado, apellido: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{usuarioLogueado.apellido}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
                  {isEditingProfile ? (
                    <input
                      type="email"
                      value={usuarioLogueado.email}
                      onChange={(e) => setProfileData({...usuarioLogueado, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{usuarioLogueado.correo}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                  {isEditingProfile ? (
                    <input
                      type="tel"
                      value={usuarioLogueado.telefono}
                      onChange={(e) => setProfileData({...usuarioLogueado, telefono: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{usuarioLogueado.telefono}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Documento</label>
                  {isEditingProfile ? (
                    <select
                      value={usuarioLogueado.tipoDocumento}
                      onChange={(e) => setProfileData({...usuarioLogueado, tipoDocumento: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option>Cédula de Ciudadanía</option>
                      <option>Cédula de Extranjería</option>
                      <option>Pasaporte</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{usuarioLogueado.tipoDocumento}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Número de Documento</label>
                  {isEditingProfile ? (
                    <input
                      type="text"
                      value={usuarioLogueado.documento}
                      onChange={(e) => setProfileData({...usuarioLogueado, documento: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{usuarioLogueado.numeroDocumento}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Nacimiento</label>
                  {isEditingProfile ? (
                    <input
                      type="date"
                      value={usuarioLogueado.fechaNacimiento}
                      onChange={(e) => setProfileData({...usuarioLogueado, fechaNacimiento: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">
                        {new Date(usuarioLogueado.fechaNacimiento).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                  {isEditingProfile ? (
                    <input
                      type="text"
                      value={profileData.direccion}
                      onChange={(e) => setProfileData({...profileData, direccion: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{profileData.direccion}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Professional Information & Quick Stats */}
          <div className="space-y-6">
            {/* Professional Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Profesional</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{usuarioLogueado.role}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                  <p className="text-gray-900">{profileData.departamento}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Ingreso</label>
                  <p className="text-gray-900">
                    {new Date(profileData.fechaIngreso).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas Rápidas</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Gestiones Activas</span>
                  <span className="text-lg font-semibold text-blue-600">10</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Reportes Generados</span>
                  <span className="text-lg font-semibold text-green-600">25</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tareas Completadas</span>
                  <span className="text-lg font-semibold text-purple-600">156</span>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración de Seguridad</h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Cambiar Contraseña</span>
                    <ChevronDown className="w-4 h-4 text-gray-400 rotate-[-90deg]" />
                  </div>
                </button>
                <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Autenticación de Dos Factores</span>
                    <ChevronDown className="w-4 h-4 text-gray-400 rotate-[-90deg]" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
  )
  
}

export default Dashboard
