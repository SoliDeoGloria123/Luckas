import {
  Settings,
  MessageCircle,
  AlertCircle,
  CheckCircle,
  Send,
  Monitor,
  Smartphone,
  Globe,
  AlertTriangle,
} from "lucide-react"
import { useState } from "react"
import Header from "../Panel Principal/Header"
import Footer from "../footer/Footer"
import { enviarReporteSoporte } from "../../services/contactosService"

const SoporteTecnico = () => {
   const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    modulo: "",
    severidad: "",
    descripcion: "",
    pasos: "",
    navegador: "",
    dispositivo: "",
  })
  const [errors, setErrors] = useState({})
  const [submitStatus, setSubmitStatus] = useState("idle")
  const [ticketNumber, setTicketNumber] = useState("")

  const validateForm = () => {
    const newErrors = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido"
    }
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido"
    }
    if (!formData.modulo) {
      newErrors.modulo = "Selecciona un módulo"
    }
    if (!formData.severidad) {
      newErrors.severidad = "Selecciona la severidad"
    }
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es requerida"
    } else if (formData.descripcion.trim().length < 20) {
      newErrors.descripcion = "La descripción debe tener al menos 20 caracteres"
    }
    if (!formData.navegador) {
      newErrors.navegador = "Selecciona tu navegador"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      setSubmitStatus("error")
      return
    }

    setSubmitStatus("loading")

    try {
      const resultado = await enviarReporteSoporte({
        nombre: formData.nombre,
        email: formData.email,
        modulo: formData.modulo,
        severidad: formData.severidad,
        descripcion: formData.descripcion,
        pasos: formData.pasos,
        navegador: formData.navegador,
        dispositivo: formData.dispositivo,
      })

      setTicketNumber(resultado.ticketNumber)
      setSubmitStatus("success")
      setFormData({
        nombre: "",
        email: "",
        modulo: "",
        severidad: "",
        descripcion: "",
        pasos: "",
        navegador: "",
        dispositivo: "",
      })
      setTimeout(() => {
        setSubmitStatus("idle")
        setTicketNumber("")
      }, 10000)
    } catch (error) {
      console.error("Error al enviar:", error)
      setSubmitStatus("error")
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const getSeveridadColor = (severidad) => {
    switch (severidad) {
      case "critico":
        return "bg-red-100 border-red-300 text-red-800"
      case "alto":
        return "bg-orange-100 border-orange-300 text-orange-800"
      case "medio":
        return "bg-yellow-100 border-yellow-300 text-yellow-800"
      case "bajo":
        return "bg-blue-100 border-blue-300 text-blue-800"
      default:
        return "bg-gray-100 border-gray-300 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Settings className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Soporte Técnico</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Reporta problemas técnicos y recibe asistencia especializada
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Support Options */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#1e293b] mb-4">Opciones de Soporte</h2>

              <div className="space-y-3">
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-[#059669]">
                  <div className="flex items-start gap-3">
                    <MessageCircle className="w-5 h-5 text-[#059669] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-[#1e293b] mb-1">Chat en Vivo</h3>
                      <p className="text-xs text-[#64748b] mb-2">Disponible Lun-Vie 8AM-5PM</p>
                      <button className="text-xs bg-[#059669] text-white px-3 py-1 rounded hover:bg-[#047857] transition-colors">
                        Iniciar Chat
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-[#2563eb]">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-[#2563eb] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-[#1e293b] mb-1">Crear Ticket</h3>
                      <p className="text-xs text-[#64748b]">Completa el formulario a continuación</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-[#8b5cf6]">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#8b5cf6] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-[#1e293b] mb-1">Estado del Sistema</h3>
                      <p className="text-xs text-[#64748b] mb-2">Todos los sistemas operativos</p>
                      <a href="/soporte-tecnico" className="text-xs text-[#8b5cf6] hover:underline">
                        Ver detalles →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* System Requirements */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#1e293b] mb-4">Información del Sistema</h2>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Monitor className="w-5 h-5 text-[#2563eb]" />
                    <h3 className="font-bold text-[#1e293b]">Navegadores Soportados</h3>
                  </div>
                  <ul className="text-sm text-[#64748b] space-y-1 ml-7">
                    <li>• Chrome 90+</li>
                    <li>• Firefox 88+</li>
                    <li>• Safari 14+</li>
                    <li>• Edge 90+</li>
                  </ul>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Smartphone className="w-5 h-5 text-[#059669]" />
                    <h3 className="font-bold text-[#1e293b]">Compatibilidad Móvil</h3>
                  </div>
                  <p className="text-sm text-[#64748b] ml-7">iOS 13+ y Android 8+</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-5 h-5 text-[#f59e0b]" />
                    <h3 className="font-bold text-[#1e293b]">Conexión</h3>
                  </div>
                  <p className="text-sm text-[#64748b] ml-7">Mínimo 1 Mbps recomendado</p>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold mb-4">Tiempo de Respuesta</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Crítico:</span>
                  <span className="font-bold">1-2 horas</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Alto:</span>
                  <span className="font-bold">4-8 horas</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Medio:</span>
                  <span className="font-bold">1-2 días</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Bajo:</span>
                  <span className="font-bold">2-5 días</span>
                </div>
              </div>
            </div>
          </div>

          {/* Support Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-[#1e293b] mb-2">Crear Ticket de Soporte</h2>
              <p className="text-[#64748b] mb-6">
                Describe el problema técnico con el mayor detalle posible para una resolución más rápida
              </p>

              {submitStatus === "success" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                  <div className="flex items-start gap-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-green-900 mb-1">¡Ticket creado exitosamente!</h3>
                      <p className="text-sm text-green-700">Tu reporte ha sido recibido y está siendo procesado</p>
                    </div>
                  </div>
                  <div className="bg-white border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-[#64748b] mb-2">Número de ticket:</p>
                    <p className="text-2xl font-bold text-[#2563eb]">{ticketNumber}</p>
                    <p className="text-xs text-[#64748b] mt-2">
                      Recibirás actualizaciones por email. Tiempo estimado de respuesta según la severidad seleccionada.
                    </p>
                  </div>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-red-900 mb-1">Error en el formulario</h3>
                    <p className="text-sm text-red-700">Por favor corrige los errores antes de enviar.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nombre */}
                <div>
                  <label htmlFor="nombre" className="block text-sm font-bold text-[#1e293b] mb-2">
                    Nombre Completo <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      errors.nombre ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-[#2563eb]"
                    }`}
                    placeholder="Tu nombre completo"
                  />
                  {errors.nombre && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.nombre}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-[#1e293b] mb-2">
                    Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      errors.email ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-[#2563eb]"
                    }`}
                    placeholder="tu@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Módulo */}
                <div>
                  <label htmlFor="modulo" className="block text-sm font-bold text-[#1e293b] mb-2">
                    Módulo del Sistema <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="modulo"
                    name="modulo"
                    value={formData.modulo}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      errors.modulo ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-[#2563eb]"
                    }`}
                  >
                    <option value="">Selecciona el módulo afectado</option>
                    <option value="usuarios">Gestión de Usuarios</option>
                    <option value="cursos">Cursos y Eventos</option>
                    <option value="reservas">Reservas de Cabañas</option>
                    <option value="pagos">Pagos y Facturación</option>
                    <option value="autenticacion">Autenticación</option>
                    <option value="reportes">Reportes</option>
                    <option value="otro">Otro</option>
                  </select>
                  {errors.modulo && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.modulo}
                    </p>
                  )}
                </div>

                {/* Severidad */}
                <div>
                  <label htmlFor="severidad" className="block text-sm font-bold text-[#1e293b] mb-2">
                    Severidad <span className="text-red-600">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { value: "critico", label: "Crítico", desc: "Sistema caído" },
                      { value: "alto", label: "Alto", desc: "Función importante no funciona" },
                      { value: "medio", label: "Medio", desc: "Error menor" },
                      { value: "bajo", label: "Bajo", desc: "Consulta general" },
                    ].map((sev) => (
                      <label
                        key={sev.value}
                        className={`cursor-pointer border-2 rounded-lg p-3 text-center transition-all ${
                          formData.severidad === sev.value
                            ? getSeveridadColor(sev.value) + " border-current"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="severidad"
                          value={sev.value}
                          checked={formData.severidad === sev.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="font-bold text-sm mb-1">{sev.label}</div>
                        <div className="text-xs opacity-75">{sev.desc}</div>
                      </label>
                    ))}
                  </div>
                  {errors.severidad && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.severidad}
                    </p>
                  )}
                </div>

                {/* Descripción */}
                <div>
                  <label htmlFor="descripcion" className="block text-sm font-bold text-[#1e293b] mb-2">
                    Descripción del Problema <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors resize-none ${
                      errors.descripcion ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-[#2563eb]"
                    }`}
                    placeholder="Describe el problema que estás experimentando..."
                  />
                  {errors.descripcion && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.descripcion}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-[#64748b]">Mínimo 20 caracteres</p>
                </div>

                {/* Pasos para reproducir */}
                <div>
                  <label htmlFor="pasos" className="block text-sm font-bold text-[#1e293b] mb-2">
                    Pasos para Reproducir <span className="text-[#64748b] text-xs">(opcional)</span>
                  </label>
                  <textarea
                    id="pasos"
                    name="pasos"
                    value={formData.pasos}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] transition-colors resize-none"
                    placeholder="1. Navegar a...\n2. Hacer clic en...\n3. Ver error..."
                  />
                </div>

                {/* Navegador y Dispositivo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="navegador" className="block text-sm font-bold text-[#1e293b] mb-2">
                      Navegador <span className="text-red-600">*</span>
                    </label>
                    <select
                      id="navegador"
                      name="navegador"
                      value={formData.navegador}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                        errors.navegador ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-[#2563eb]"
                      }`}
                    >
                      <option value="">Selecciona tu navegador</option>
                      <option value="chrome">Google Chrome</option>
                      <option value="firefox">Mozilla Firefox</option>
                      <option value="safari">Safari</option>
                      <option value="edge">Microsoft Edge</option>
                      <option value="otro">Otro</option>
                    </select>
                    {errors.navegador && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.navegador}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="dispositivo" className="block text-sm font-bold text-[#1e293b] mb-2">
                      Dispositivo <span className="text-[#64748b] text-xs">(opcional)</span>
                    </label>
                    <select
                      id="dispositivo"
                      name="dispositivo"
                      value={formData.dispositivo}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] transition-colors"
                    >
                      <option value="">Selecciona tu dispositivo</option>
                      <option value="windows">Windows</option>
                      <option value="mac">Mac</option>
                      <option value="linux">Linux</option>
                      <option value="ios">iOS</option>
                      <option value="android">Android</option>
                    </select>
                  </div>
                </div>

                {/* Screenshot Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-[#1e293b]">
                    <strong>Consejo:</strong> Incluir capturas de pantalla en el seguimiento del ticket ayuda a resolver
                    el problema más rápido.
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitStatus === "loading"}
                  className={`w-full px-6 py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${
                    submitStatus === "loading"
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-[#2563eb] text-white hover:bg-[#1d4ed8]"
                  }`}
                >
                  {submitStatus === "loading" ? (
                    <>
                      <div className="animate-spin">
                        <Send className="w-5 h-5" />
                      </div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Enviar Reporte Técnico
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default SoporteTecnico;
