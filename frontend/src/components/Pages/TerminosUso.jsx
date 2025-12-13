import { FileText, UserCheck, AlertTriangle, Copyright, Shield, Ban, Gavel, Phone } from "lucide-react"
import { useState } from "react"
import Header from "../Panel Principal/Header"
import Footer from "../footer/Footer"

const TerminosUso = () => {
   const [activeSection, setActiveSection] = useState("")

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
      setActiveSection(id)
    }
  }

  const sections = [
    { id: "aceptacion", title: "1. Aceptación de Términos", icon: UserCheck },
    { id: "acceso", title: "2. Acceso y Registro", icon: Shield },
    { id: "responsabilidades", title: "3. Responsabilidades del Usuario", icon: FileText },
    { id: "prohibiciones", title: "4. Prohibiciones", icon: Ban },
    { id: "propiedad", title: "5. Propiedad Intelectual", icon: Copyright },
    { id: "limitacion", title: "6. Limitación de Responsabilidad", icon: AlertTriangle },
    { id: "suspension", title: "7. Suspensión de Cuenta", icon: Ban },
    { id: "cambios-terminos", title: "8. Cambios en los Términos", icon: FileText },
    { id: "ley", title: "9. Ley Aplicable", icon: Gavel },
    { id: "contacto-terminos", title: "10. Contacto", icon: Phone },
  ]

  return (
   <div className="min-h-screen bg-[#f1f5f9]">
      {/* Header */}
     <Header/>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#059669] to-[#047857] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Términos de Uso</h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">Condiciones de acceso y uso del sistema LUCKAS</p>
          <p className="mt-4 text-sm text-green-200">Última actualización: Diciembre 2024</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
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
                        activeSection === section.id ? "bg-[#059669] text-white" : "text-[#64748b] hover:bg-[#f1f5f9]"
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
              {/* 1. Aceptación */}
              <section id="aceptacion" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <UserCheck className="w-6 h-6 text-[#059669]" />
                  <h2 className="text-2xl font-bold text-[#1e293b]">1. Aceptación de Términos</h2>
                </div>
                <p className="text-[#64748b] leading-relaxed mb-4">
                  Al acceder y utilizar LUCKAS (Sistema de Gestión de Seminario Bautista), aceptas estar legalmente
                  vinculado por estos Términos de Uso. Si no aceptas estos términos, no debes usar nuestros servicios.
                </p>
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                  <div className="flex items-start gap-2">
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">IMPORTANTE</span>
                    <p className="text-sm text-[#1e293b] flex-1">
                      El uso continuado del sistema constituye la aceptación de estos términos y todas sus
                      actualizaciones.
                    </p>
                  </div>
                </div>
              </section>

              {/* 2. Acceso y Registro */}
              <section id="acceso" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-[#2563eb]" />
                  <h2 className="text-2xl font-bold text-[#1e293b]">2. Acceso y Registro</h2>
                </div>
                <p className="text-[#64748b] leading-relaxed mb-4">Para utilizar LUCKAS, debes:</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-[#2563eb] text-white rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="text-[#64748b] leading-relaxed">
                      Tener al menos 18 años de edad o contar con autorización de un tutor legal
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-[#2563eb] text-white rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="text-[#64748b] leading-relaxed">
                      Proporcionar información precisa y actualizada durante el registro
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-[#2563eb] text-white rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="text-[#64748b] leading-relaxed">
                      Mantener la confidencialidad de tu contraseña y credenciales de acceso
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-[#2563eb] text-white rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="text-[#64748b] leading-relaxed">
                      Notificar inmediatamente cualquier uso no autorizado de tu cuenta
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-[#2563eb] text-white rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="text-[#64748b] leading-relaxed">
                      Ser responsable de todas las actividades realizadas bajo tu cuenta
                    </span>
                  </li>
                </ul>
              </section>

              {/* 3. Responsabilidades */}
              <section id="responsabilidades" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-6 h-6 text-[#f59e0b]" />
                  <h2 className="text-2xl font-bold text-[#1e293b]">3. Responsabilidades del Usuario</h2>
                </div>
                <p className="text-[#64748b] leading-relaxed mb-4">Como usuario de LUCKAS, te comprometes a:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#f1f5f9] p-4 rounded-lg border-l-4 border-[#059669]">
                    <h3 className="font-bold text-[#1e293b] mb-2">✓ Uso Apropiado</h3>
                    <p className="text-sm text-[#64748b]">Usar el sistema solo para fines legítimos y educativos</p>
                  </div>
                  <div className="bg-[#f1f5f9] p-4 rounded-lg border-l-4 border-[#2563eb]">
                    <h3 className="font-bold text-[#1e293b] mb-2">✓ Información Veraz</h3>
                    <p className="text-sm text-[#64748b]">Proporcionar datos precisos y actualizados</p>
                  </div>
                  <div className="bg-[#f1f5f9] p-4 rounded-lg border-l-4 border-[#f59e0b]">
                    <h3 className="font-bold text-[#1e293b] mb-2">✓ Seguridad</h3>
                    <p className="text-sm text-[#64748b]">Proteger tus credenciales de acceso</p>
                  </div>
                  <div className="bg-[#f1f5f9] p-4 rounded-lg border-l-4 border-[#8b5cf6]">
                    <h3 className="font-bold text-[#1e293b] mb-2">✓ Respeto</h3>
                    <p className="text-sm text-[#64748b]">Mantener un comportamiento respetuoso con otros usuarios</p>
                  </div>
                </div>
              </section>

              {/* 4. Prohibiciones */}
              <section id="prohibiciones" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <Ban className="w-6 h-6 text-red-600" />
                  <h2 className="text-2xl font-bold text-[#1e293b]">4. Prohibiciones</h2>
                </div>
                <p className="text-[#64748b] leading-relaxed mb-4">Está estrictamente prohibido:</p>
                <div className="space-y-3">
                  {[
                    "Intentar acceder a áreas restringidas o cuentas de otros usuarios",
                    "Usar el sistema para actividades ilegales o no autorizadas",
                    "Interferir con el funcionamiento normal del sistema",
                    "Realizar ingeniería inversa, descompilar o modificar el software",
                    "Copiar, distribuir o vender contenido del sistema sin autorización",
                    "Enviar spam, malware o contenido malicioso",
                    "Suplantar la identidad de otros usuarios o administradores",
                    "Realizar ataques de denegación de servicio (DDoS)",
                    "Extraer datos masivamente mediante web scraping o bots",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 bg-red-50 p-3 rounded-lg">
                      <Ban className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span className="text-[#1e293b] text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-lg mt-4">
                  <div className="flex items-start gap-2">
                    <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">ADVERTENCIA</span>
                    <p className="text-sm text-[#1e293b] flex-1">
                      La violación de estas prohibiciones puede resultar en la suspensión inmediata de tu cuenta y
                      posibles acciones legales.
                    </p>
                  </div>
                </div>
              </section>

              {/* 5. Propiedad Intelectual */}
              <section id="propiedad" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <Copyright className="w-6 h-6 text-[#8b5cf6]" />
                  <h2 className="text-2xl font-bold text-[#1e293b]">5. Propiedad Intelectual</h2>
                </div>
                <p className="text-[#64748b] leading-relaxed mb-4">
                  Todo el contenido, diseño, código, funcionalidades y materiales de LUCKAS están protegidos por:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <Copyright className="w-8 h-8 text-[#8b5cf6] mx-auto mb-2" />
                    <h3 className="font-bold text-[#1e293b] mb-1">Derechos de Autor</h3>
                    <p className="text-xs text-[#64748b]">© 2025 LUCKAS</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <Shield className="w-8 h-8 text-[#2563eb] mx-auto mb-2" />
                    <h3 className="font-bold text-[#1e293b] mb-1">Marcas Registradas</h3>
                    <p className="text-xs text-[#64748b]">Logos y nombres</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <FileText className="w-8 h-8 text-[#059669] mx-auto mb-2" />
                    <h3 className="font-bold text-[#1e293b] mb-1">Patentes</h3>
                    <p className="text-xs text-[#64748b]">Tecnología propietaria</p>
                  </div>
                </div>
                <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                  <p className="text-sm text-[#1e293b]">
                    <strong>Licencia de Uso:</strong> Se te otorga una licencia limitada, no exclusiva y no transferible
                    para usar el sistema según estos términos.
                  </p>
                </div>
              </section>

              {/* 6. Limitación de Responsabilidad */}
              <section id="limitacion" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-[#f59e0b]" />
                  <h2 className="text-2xl font-bold text-[#1e293b]">6. Limitación de Responsabilidad</h2>
                </div>
                <p className="text-[#64748b] leading-relaxed mb-4">
                  LUCKAS se proporciona "tal cual" y "según disponibilidad". No garantizamos:
                </p>
                <ul className="space-y-2 mb-4">
                  {[
                    "Funcionamiento ininterrumpido o libre de errores",
                    "Corrección de todos los defectos",
                    "Que el servicio sea seguro o esté libre de virus",
                    "Exactitud o confiabilidad de la información",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-[#f59e0b] flex-shrink-0 mt-1" />
                      <span className="text-[#64748b] text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-amber-50 border-l-4 border-[#f59e0b] p-4 rounded-r-lg">
                  <p className="text-sm text-[#1e293b]">
                    <strong>Exclusión de garantías:</strong> En la medida permitida por la ley, LUCKAS no será
                    responsable por daños indirectos, incidentales, especiales o consecuentes.
                  </p>
                </div>
              </section>

              {/* 7. Suspensión */}
              <section id="suspension" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <Ban className="w-6 h-6 text-red-600" />
                  <h2 className="text-2xl font-bold text-[#1e293b]">7. Suspensión de Cuenta</h2>
                </div>
                <p className="text-[#64748b] leading-relaxed mb-4">
                  Nos reservamos el derecho de suspender o cancelar tu cuenta si:
                </p>
                <div className="space-y-3">
                  <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-600">
                    <h3 className="font-bold text-[#1e293b] mb-1">Violación de Términos</h3>
                    <p className="text-sm text-[#64748b]">Incumples cualquiera de estos términos de uso</p>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-[#f59e0b]">
                    <h3 className="font-bold text-[#1e293b] mb-1">Actividad Sospechosa</h3>
                    <p className="text-sm text-[#64748b]">Detectamos comportamiento fraudulento o malicioso</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-[#2563eb]">
                    <h3 className="font-bold text-[#1e293b] mb-1">Solicitud del Usuario</h3>
                    <p className="text-sm text-[#64748b]">Solicitas la eliminación de tu cuenta</p>
                  </div>
                </div>
              </section>

              {/* 8. Cambios */}
              <section id="cambios-terminos" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-6 h-6 text-[#2563eb]" />
                  <h2 className="text-2xl font-bold text-[#1e293b]">8. Cambios en los Términos</h2>
                </div>
                <p className="text-[#64748b] leading-relaxed mb-4">
                  Podemos modificar estos términos en cualquier momento. Los cambios serán efectivos al publicarse en
                  esta página.
                </p>
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <p className="text-sm text-[#1e293b]">
                    <strong>Responsabilidad del usuario:</strong> Es tu responsabilidad revisar periódicamente estos
                    términos. El uso continuado después de los cambios constituye aceptación.
                  </p>
                </div>
              </section>

              {/* 9. Ley Aplicable */}
              <section id="ley" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <Gavel className="w-6 h-6 text-[#059669]" />
                  <h2 className="text-2xl font-bold text-[#1e293b]">9. Ley Aplicable</h2>
                </div>
                <p className="text-[#64748b] leading-relaxed mb-4">
                  Estos términos se rigen por las leyes de la República de Colombia. Cualquier disputa se resolverá en
                  los tribunales competentes de Bogotá, Colombia.
                </p>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-bold text-[#1e293b] mb-2">Jurisdicción</h3>
                  <p className="text-sm text-[#64748b]">
                    Al usar LUCKAS, aceptas la jurisdicción exclusiva de los tribunales de Bogotá, Colombia para
                    resolver cualquier disputa relacionada con estos términos.
                  </p>
                </div>
              </section>

              {/* 10. Contacto */}
              <section id="contacto-terminos" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <Phone className="w-6 h-6 text-[#2563eb]" />
                  <h2 className="text-2xl font-bold text-[#1e293b]">10. Contacto</h2>
                </div>
                <p className="text-[#64748b] leading-relaxed mb-4">Para preguntas sobre estos Términos de Uso:</p>
                <div className="bg-[#f1f5f9] p-6 rounded-lg space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#2563eb]" />
                    <span className="text-[#1e293b]">
                      <strong>Email:</strong>{" "}
                      <a href="mailto:legal@luckas.ejemplo" className="text-[#2563eb] underline">
                        legal@luckas.ejemplo
                      </a>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#059669]" />
                    <span className="text-[#1e293b]">
                      <strong>Dirección:</strong> Bogotá, Colombia
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

export default TerminosUso;
