import { Mail, Phone, MapPin, Clock, Send, Facebook, Instagram, CheckCircle, AlertCircle } from "lucide-react"
import React, { useState } from "react"
import Header from "../Panel Principal/Header"
import Footer from "../footer/Footer"
import { enviarMensajeContacto } from "../../services/contactosService"

const Contactanos = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: "",
  })
  const [errors, setErrors] = useState({})
  const [submitStatus, setSubmitStatus] = useState("idle")

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

    if (!formData.asunto.trim()) {
      newErrors.asunto = "El asunto es requerido"
    }

    if (!formData.mensaje.trim()) {
      newErrors.mensaje = "El mensaje es requerido"
    } else if (formData.mensaje.trim().length < 10) {
      newErrors.mensaje = "El mensaje debe tener al menos 10 caracteres"
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
      await enviarMensajeContacto({
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        asunto: formData.asunto,
        mensaje: formData.mensaje,
      })

      setSubmitStatus("success")
      setFormData({ nombre: "", email: "", telefono: "", asunto: "", mensaje: "" })
      
      setTimeout(() => {
        setSubmitStatus("idle")
      }, 5000)
    } catch (error) {
      console.error("Error al enviar:", error)
      setSubmitStatus("error")
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }
  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      {/* Header */}
      <Header/>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Phone className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contáctanos</h1>
          <p className="text-xl text-amber-100 max-w-2xl mx-auto">Estamos aquí para ayudarte. Envíanos tu mensaje</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Cards */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#1e293b] mb-6">Información de Contacto</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                  <Mail className="w-6 h-6 text-[#2563eb] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-[#1e293b] mb-1">Email</h3>
                    <a href="mailto:soporte@luckas.ejemplo" className="text-sm text-[#2563eb] hover:underline">
                      soporte@luckas.ejemplo
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                  <Phone className="w-6 h-6 text-[#059669] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-[#1e293b] mb-1">Teléfono</h3>
                    <a href="tel:+5711234567" className="text-sm text-[#059669] hover:underline">
                      +57 (1) 123-4567
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
                  <MapPin className="w-6 h-6 text-[#8b5cf6] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-[#1e293b] mb-1">Dirección</h3>
                    <p className="text-sm text-[#64748b]">
                      Calle 123 #45-67
                      <br />
                      Bogotá, Colombia
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-lg">
                  <Clock className="w-6 h-6 text-[#f59e0b] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-[#1e293b] mb-1">Horario</h3>
                    <p className="text-sm text-[#64748b]">
                      Lunes - Viernes
                      <br />
                      8:00 AM - 5:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#1e293b] mb-4">Redes Sociales</h2>
              <div className="space-y-3">
                <a
                  href="https://facebook.com"
                  className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Facebook className="w-5 h-5 text-[#2563eb]" />
                  <span className="text-[#1e293b]">Facebook</span>
                </a>
                <a
                  href="https://instagram.com"
                  className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
                >
                  <Instagram className="w-5 h-5 text-[#8b5cf6]" />
                  <span className="text-[#1e293b]">Instagram</span>
                </a>
              </div>
            </div>

            {/* Quick FAQ */}
            <div className="bg-[#2563eb] text-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">¿Necesitas ayuda rápida?</h2>
              <p className="text-sm text-blue-100 mb-4">
                Visita nuestro centro de ayuda para encontrar respuestas inmediatas a preguntas frecuentes.
              </p>
              <a
                href="/ayuda"
                className="inline-block bg-white text-[#2563eb] px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Ver Centro de Ayuda
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-[#1e293b] mb-2">Envíanos un Mensaje</h2>
              <p className="text-[#64748b] mb-6">
                Completa el formulario y nos pondremos en contacto contigo lo antes posible
              </p>

              {submitStatus === "success" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-green-900 mb-1">¡Mensaje enviado exitosamente!</h3>
                    <p className="text-sm text-green-700">Te responderemos dentro de 48 horas hábiles.</p>
                  </div>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
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
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.nombre ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-[#2563eb]"
                      }`}
                    placeholder="Juan Pérez"
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
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.email ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-[#2563eb]"
                      }`}
                    placeholder="juan@ejemplo.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Teléfono */}
                <div>
                  <label htmlFor="telefono" className="block text-sm font-bold text-[#1e293b] mb-2">
                    Teléfono <span className="text-[#64748b] text-xs">(opcional)</span>
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] transition-colors"
                    placeholder="+57 300 123 4567"
                  />
                </div>

                {/* Asunto */}
                <div>
                  <label htmlFor="asunto" className="block text-sm font-bold text-[#1e293b] mb-2">
                    Asunto <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="asunto"
                    name="asunto"
                    value={formData.asunto}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.asunto ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-[#2563eb]"
                      }`}
                  >
                    <option value="">Selecciona un asunto</option>
                    <option value="general">Consulta General</option>
                    <option value="tecnico">Soporte Técnico</option>
                    <option value="inscripcion">Inscripciones</option>
                    <option value="facturacion">Facturación</option>
                    <option value="sugerencia">Sugerencia</option>
                    <option value="otro">Otro</option>
                  </select>
                  {errors.asunto && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.asunto}
                    </p>
                  )}
                </div>

                {/* Mensaje */}
                <div>
                  <label htmlFor="mensaje" className="block text-sm font-bold text-[#1e293b] mb-2">
                    Mensaje <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    rows={6}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors resize-none ${errors.mensaje ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-[#2563eb]"
                      }`}
                    placeholder="Escribe tu mensaje aquí..."
                  />
                  {errors.mensaje && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.mensaje}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-[#64748b]">Mínimo 10 caracteres</p>
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
                      Enviar Mensaje
                    </>
                  )}
                </button>

                <p className="text-xs text-[#64748b] text-center">
                  Al enviar este formulario, aceptas nuestra{" "}
                  <a href="/politica-privacidad" className="text-[#2563eb] underline">
                    Política de Privacidad
                  </a>
                </p>
              </form>
            </div>

            {/* Map */}
            <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#1e293b] mb-4">Nuestra Ubicación</h2>
              <iframe
                title="Mapa de ubicación del Seminario Bautista de Colombia"
                width="100%"
                height="400"
                style={{ border: 0, borderRadius: "8px" }}
                loading="lazy"
                allowFullScreen=""
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.3921205655415!2d-74.08536107820107!3d4.701749483048455!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9b40fadf128b%3A0x4d054ea98d646a5d!2sSeminario%20Bautista%20De%20Colombia%20-%20Sede%20Pontevedra!5e0!3m2!1ses-419!2sco!4v1765333907882!5m2!1ses-419!2sco"
              ></iframe>

              <p className="text-sm text-[#64748b] mt-4">
                📍 Carrera 71g # 116-77 a 116-71, Bogotá, Colombia
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default Contactanos;
