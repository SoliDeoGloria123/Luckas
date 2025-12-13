import { Shield, Lock, Eye, FileText, Users, Cookie, Bell, Mail } from "lucide-react"
import { useState } from "react"
import Header from "../Panel Principal/Header"
import Footer from "../footer/Footer"

const PoliticaPrivacidad = () => {
   const [activeSection, setActiveSection] = useState("")

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
      setActiveSection(id)
    }
  }

  const sections = [
    { id: "introduccion", title: "1. Introducción", icon: FileText },
    { id: "informacion", title: "2. Información que Recolectamos", icon: Users },
    { id: "uso", title: "3. Cómo Usamos tu Información", icon: Eye },
    { id: "proteccion", title: "4. Protección de Datos", icon: Lock },
    { id: "derechos", title: "5. Tus Derechos", icon: Shield },
    { id: "cookies", title: "6. Cookies", icon: Cookie },
    { id: "cambios", title: "7. Cambios en esta Política", icon: Bell },
    { id: "contacto", title: "8. Contacto", icon: Mail },
  ]

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Política de Privacidad</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Cómo protegemos tus datos y respetamos tu privacidad
          </p>
          <p className="mt-4 text-sm text-blue-200">Última actualización: Diciembre 2024</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Table of Contents */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-bold text-[#1e293b] mb-4">Contenido</h3>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeSection === section.id ? "bg-[#2563eb] text-white" : "text-[#64748b] hover:bg-[#f1f5f9]"
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{section.title}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-8 space-y-12">
              {/* 1. Introducción */}
              <section id="introduccion" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-6 h-6 text-[#2563eb]" />
                  <h2 className="text-2xl font-bold text-[#1e293b]">1. Introducción</h2>
                </div>
                <p className="text-[#64748b] leading-relaxed mb-4">
                  En LUCKAS (Sistema de Gestión de Seminario Bautista), nos comprometemos a proteger la privacidad y
                  seguridad de la información personal de nuestros usuarios. Esta Política de Privacidad describe cómo
                  recopilamos, usamos, almacenamos y protegemos tu información cuando utilizas nuestros servicios.
                </p>
                <div className="bg-blue-50 border-l-4 border-[#2563eb] p-4 rounded-r-lg">
                  <p className="text-sm text-[#1e293b] font-medium">
                    <strong>Importante:</strong> Al utilizar LUCKAS, aceptas los términos de esta Política de
                    Privacidad. Si no estás de acuerdo, por favor no utilices nuestros servicios.
                  </p>
                </div>
              </section>

              {/* 2. Información que Recolectamos */}
              <section id="informacion" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-[#059669]" />
                  <h2 className="text-2xl font-bold text-[#1e293b]">2. Información que Recolectamos</h2>
                </div>
                <p className="text-[#64748b] leading-relaxed mb-4">
                  Recopilamos diferentes tipos de información para proporcionar y mejorar nuestros servicios:
                </p>
                <div className="space-y-4">
                  <div className="border-l-4 border-[#059669] bg-green-50 p-4 rounded-r-lg">
                    <h3 className="font-bold text-[#1e293b] mb-2">Información Personal</h3>
                    <ul className="list-disc list-inside space-y-1 text-[#64748b] text-sm">
                      <li>Nombre completo</li>
                      <li>Correo electrónico</li>
                      <li>Número de teléfono</li>
                      <li>Fecha de nacimiento</li>
                      <li>Dirección física</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-[#f59e0b] bg-amber-50 p-4 rounded-r-lg">
                    <h3 className="font-bold text-[#1e293b] mb-2">Información Académica</h3>
                    <ul className="list-disc list-inside space-y-1 text-[#64748b] text-sm">
                      <li>Historial de cursos y eventos</li>
                      <li>Calificaciones y certificaciones</li>
                      <li>Asistencia a clases</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-[#8b5cf6] bg-purple-50 p-4 rounded-r-lg">
                    <h3 className="font-bold text-[#1e293b] mb-2">Información Técnica</h3>
                    <ul className="list-disc list-inside space-y-1 text-[#64748b] text-sm">
                      <li>Dirección IP</li>
                      <li>Tipo de navegador</li>
                      <li>Sistema operativo</li>
                      <li>Cookies y tecnologías similares</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 3. Cómo Usamos tu Información */}
              <section id="uso" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="w-6 h-6 text-[#2563eb]" />
                  <h2 className="text-2xl font-bold text-[#1e293b]">3. Cómo Usamos tu Información</h2>
                </div>
                <p className="text-[#64748b] leading-relaxed mb-4">
                  Utilizamos la información recopilada para los siguientes propósitos:
                </p>
                <ul className="space-y-3">
                  {[
                    "Proporcionar y mantener nuestros servicios",
                    "Gestionar tu cuenta de usuario y autenticación",
                    "Procesar inscripciones a cursos y eventos",
                    "Enviar notificaciones importantes sobre el servicio",
                    "Responder a consultas y solicitudes de soporte",
                    "Mejorar la experiencia del usuario",
                    "Analizar el uso del sistema para optimización",
                    "Cumplir con obligaciones legales",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-[#2563eb] text-white rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                        {item.split(". ")[0]}
                      </span>
                      <span className="text-[#64748b] leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* 4. Protección de Datos */}
              <section id="proteccion" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="w-6 h-6 text-[#059669]" />
                  <h2 className="text-2xl font-bold text-[#1e293b]">4. Protección de Datos</h2>
                </div>
                <p className="text-[#64748b] leading-relaxed mb-4">
                  Implementamos medidas de seguridad técnicas y organizativas para proteger tu información:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#f1f5f9] p-6 rounded-lg">
                    <Lock className="w-8 h-8 text-[#059669] mb-3" />
                    <h3 className="font-bold text-[#1e293b] mb-2">Encriptación</h3>
                    <p className="text-sm text-[#64748b]">Todos los datos se transmiten mediante protocolo HTTPS/SSL</p>
                  </div>
                  <div className="bg-[#f1f5f9] p-6 rounded-lg">
                    <Shield className="w-8 h-8 text-[#2563eb] mb-3" />
                    <h3 className="font-bold text-[#1e293b] mb-2">Acceso Restringido</h3>
                    <p className="text-sm text-[#64748b]">
                      Solo personal autorizado tiene acceso a información sensible
                    </p>
                  </div>
                  <div className="bg-[#f1f5f9] p-6 rounded-lg">
                    <FileText className="w-8 h-8 text-[#f59e0b] mb-3" />
                    <h3 className="font-bold text-[#1e293b] mb-2">Auditorías Regulares</h3>
                    <p className="text-sm text-[#64748b]">Realizamos auditorías de seguridad periódicas</p>
                  </div>
                  <div className="bg-[#f1f5f9] p-6 rounded-lg">
                    <Bell className="w-8 h-8 text-[#8b5cf6] mb-3" />
                    <h3 className="font-bold text-[#1e293b] mb-2">Respaldo de Datos</h3>
                    <p className="text-sm text-[#64748b]">
                      Copias de seguridad automáticas y redundancia de servidores
                    </p>
                  </div>
                </div>
              </section>

              {/* 5. Tus Derechos */}
              <section id="derechos" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-[#2563eb]" />
                  <h2 className="text-2xl font-bold text-[#1e293b]">5. Tus Derechos</h2>
                </div>
                <p className="text-[#64748b] leading-relaxed mb-4">
                  Como usuario, tienes los siguientes derechos sobre tus datos personales:
                </p>
                <div className="space-y-3">
                  {[
                    { title: "Derecho de Acceso", desc: "Solicitar una copia de tu información personal" },
                    { title: "Derecho de Rectificación", desc: "Corregir información inexacta o incompleta" },
                    { title: "Derecho de Eliminación", desc: "Solicitar la eliminación de tus datos" },
                    { title: "Derecho de Portabilidad", desc: "Recibir tus datos en formato estructurado" },
                    { title: "Derecho de Oposición", desc: "Oponerte al procesamiento de tus datos" },
                  ].map((right) => (
                    <div key={right.title} className="bg-[#f1f5f9] p-4 rounded-lg border-l-4 border-[#2563eb]">
                      <h3 className="font-bold text-[#1e293b] mb-1">{right.title}</h3>
                      <p className="text-sm text-[#64748b]">{right.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mt-4">
                  <p className="text-sm text-[#1e293b]">
                    <strong>Ejercer tus derechos:</strong> Para ejercer cualquiera de estos derechos, contáctanos en{" "}
                    <a href="mailto:privacidad@luckas.ejemplo" className="text-[#2563eb] underline">
                      privacidad@luckas.ejemplo
                    </a>
                  </p>
                </div>
              </section>

              {/* 6. Cookies */}
              <section id="cookies" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <Cookie className="w-6 h-6 text-[#f59e0b]" />
                  <h2 className="text-2xl font-bold text-[#1e293b]">6. Cookies</h2>
                </div>
                <p className="text-[#64748b] leading-relaxed mb-4">
                  Utilizamos cookies y tecnologías similares para mejorar tu experiencia:
                </p>
                <div className="space-y-3">
                  <div className="bg-green-50 border-l-4 border-[#059669] p-4 rounded-r-lg">
                    <h3 className="font-bold text-[#1e293b] mb-2">Cookies Esenciales</h3>
                    <p className="text-sm text-[#64748b]">
                      Necesarias para el funcionamiento básico del sitio (autenticación, seguridad)
                    </p>
                  </div>
                  <div className="bg-blue-50 border-l-4 border-[#2563eb] p-4 rounded-r-lg">
                    <h3 className="font-bold text-[#1e293b] mb-2">Cookies de Funcionalidad</h3>
                    <p className="text-sm text-[#64748b]">Recuerdan tus preferencias y configuración</p>
                  </div>
                  <div className="bg-purple-50 border-l-4 border-[#8b5cf6] p-4 rounded-r-lg">
                    <h3 className="font-bold text-[#1e293b] mb-2">Cookies Analíticas</h3>
                    <p className="text-sm text-[#64748b]">Nos ayudan a entender cómo se usa el sitio para mejorarlo</p>
                  </div>
                </div>
                <p className="text-sm text-[#64748b] mt-4">
                  Puedes configurar tu navegador para rechazar cookies, pero esto puede afectar la funcionalidad del
                  sitio.
                </p>
              </section>

              {/* 7. Cambios */}
              <section id="cambios" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <Bell className="w-6 h-6 text-[#8b5cf6]" />
                  <h2 className="text-2xl font-bold text-[#1e293b]">7. Cambios en esta Política</h2>
                </div>
                <p className="text-[#64748b] leading-relaxed mb-4">
                  Nos reservamos el derecho de actualizar esta Política de Privacidad en cualquier momento. Los cambios
                  serán efectivos inmediatamente después de su publicación en esta página.
                </p>
                <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                  <p className="text-sm text-[#1e293b]">
                    <strong>Notificación de cambios:</strong> Te notificaremos sobre cambios significativos mediante
                    correo electrónico o un aviso destacado en el sistema.
                  </p>
                </div>
              </section>

              {/* 8. Contacto */}
              <section id="contacto" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="w-6 h-6 text-[#2563eb]" />
                  <h2 className="text-2xl font-bold text-[#1e293b]">8. Contacto</h2>
                </div>
                <p className="text-[#64748b] leading-relaxed mb-4">
                  Si tienes preguntas sobre esta Política de Privacidad o cómo manejamos tus datos, contáctanos:
                </p>
                <div className="bg-[#f1f5f9] p-6 rounded-lg space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#2563eb]" />
                    <span className="text-[#1e293b]">
                      <strong>Email:</strong>{" "}
                      <a href="mailto:privacidad@luckas.ejemplo" className="text-[#2563eb] underline">
                        privacidad@luckas.ejemplo
                      </a>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#059669]" />
                    <span className="text-[#1e293b]">
                      <strong>Dirección:</strong> Bogotá, Colombia
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-[#f59e0b]" />
                    <span className="text-[#1e293b]">
                      <strong>Tiempo de respuesta:</strong> 48 horas hábiles
                    </span>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default PoliticaPrivacidad;
