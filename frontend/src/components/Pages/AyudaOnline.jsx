import { Search, HelpCircle, User, Settings, CreditCard, Book, Smartphone, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import Header from "../Panel Principal/Header"
import Footer from "../footer/Footer"


const AyudaOnline = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("todos")
  const [openFAQ, setOpenFAQ] = useState(null)

  const faqs = [
    // General
    {
      id: 1,
      question: "¿Qué es LUCKAS?",
      answer:
        "LUCKAS es un Sistema de Gestión de Seminario Bautista diseñado para administrar cursos, eventos, reservas de cabañas y gestión de usuarios de manera integral.",
      category: "general",
    },
    {
      id: 2,
      question: "¿Cómo me registro en el sistema?",
      answer:
        'Para registrarte, haz clic en "Registrarse" en la página principal, completa el formulario con tus datos personales y verifica tu correo electrónico. Una vez verificado, podrás acceder al sistema.',
      category: "general",
    },
    {
      id: 3,
      question: "¿Es gratuito usar LUCKAS?",
      answer:
        "El acceso básico al sistema es gratuito para estudiantes registrados. Algunas funciones premium o cursos específicos pueden requerir pago.",
      category: "general",
    },

    // Usuarios
    {
      id: 4,
      question: "¿Cómo cambio mi contraseña?",
      answer:
        'Ve a tu perfil, selecciona "Configuración de Seguridad" y haz clic en "Cambiar Contraseña". Necesitarás tu contraseña actual y la nueva contraseña dos veces para confirmar.',
      category: "usuarios",
    },
    {
      id: 5,
      question: "¿Cómo actualizo mi información personal?",
      answer:
        'Accede a tu perfil desde el menú principal, haz clic en "Editar Perfil" y actualiza los campos que desees. No olvides guardar los cambios.',
      category: "usuarios",
    },
    {
      id: 6,
      question: "¿Qué hago si olvidé mi contraseña?",
      answer:
        'En la página de inicio de sesión, haz clic en "¿Olvidaste tu contraseña?". Ingresa tu correo electrónico y recibirás un enlace para restablecer tu contraseña.',
      category: "usuarios",
    },

    // Técnico
    {
      id: 7,
      question: "¿Qué navegadores son compatibles?",
      answer:
        "LUCKAS funciona mejor en las últimas versiones de Chrome, Firefox, Safari y Edge. Recomendamos mantener tu navegador actualizado para la mejor experiencia.",
      category: "tecnico",
    },
    {
      id: 8,
      question: "¿Hay una aplicación móvil?",
      answer:
        "Actualmente LUCKAS es una aplicación web responsive que funciona perfectamente en dispositivos móviles a través del navegador. Una app nativa está en desarrollo.",
      category: "tecnico",
    },
    {
      id: 9,
      question: "¿Por qué no puedo iniciar sesión?",
      answer:
        "Verifica que tu correo y contraseña sean correctos. Si el problema persiste, intenta restablecer tu contraseña o contacta con soporte técnico.",
      category: "tecnico",
    },

    // Cursos
    {
      id: 10,
      question: "¿Cómo me inscribo en un curso?",
      answer:
        'Navega al catálogo de cursos, selecciona el curso de tu interés, revisa los detalles y haz clic en "Inscribirse". Algunos cursos pueden requerir aprobación o pago previo.',
      category: "cursos",
    },
    {
      id: 11,
      question: "¿Puedo cancelar una inscripción?",
      answer:
        'Sí, puedes cancelar tu inscripción hasta 48 horas antes del inicio del curso. Ve a "Mis Cursos" y selecciona "Cancelar Inscripción".',
      category: "cursos",
    },
    {
      id: 12,
      question: "¿Cómo accedo al material del curso?",
      answer:
        'Una vez inscrito, encontrarás todo el material en la página del curso bajo la sección "Recursos". Esto incluye documentos, videos y tareas.',
      category: "cursos",
    },

    // Pagos
    {
      id: 13,
      question: "¿Qué métodos de pago aceptan?",
      answer:
        "Aceptamos tarjetas de crédito y débito (Visa, Mastercard), transferencias bancarias y pagos en efectivo en nuestras oficinas.",
      category: "pagos",
    },
    {
      id: 14,
      question: "¿Puedo obtener un reembolso?",
      answer:
        "Los reembolsos se procesan según nuestra política: cancelaciones con más de 7 días de anticipación reciben reembolso completo, menos una tarifa administrativa del 10%.",
      category: "pagos",
    },
    {
      id: 15,
      question: "¿Dónde veo mis facturas?",
      answer:
        'Todas tus facturas están disponibles en "Mi Cuenta" > "Historial de Pagos". Puedes descargarlas en formato PDF.',
      category: "pagos",
    },
  ]

  const categories = [
    { id: "todos", name: "Todos", icon: HelpCircle, color: "bg-blue-100 text-[#2563eb]" },
    { id: "general", name: "General", icon: Book, color: "bg-green-100 text-[#059669]" },
    { id: "usuarios", name: "Usuarios", icon: User, color: "bg-purple-100 text-[#8b5cf6]" },
    { id: "tecnico", name: "Técnico", icon: Settings, color: "bg-amber-100 text-[#f59e0b]" },
    { id: "cursos", name: "Cursos y Eventos", icon: Book, color: "bg-blue-100 text-[#2563eb]" },
    { id: "pagos", name: "Pagos", icon: CreditCard, color: "bg-green-100 text-[#059669]" },
  ]

  const filteredFAQs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === "todos" || faq.category === activeCategory
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id)
  }
  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      {/* Header */}
     <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HelpCircle className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Centro de Ayuda</h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto mb-8">Encuentra respuestas rápidas a tus preguntas</p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar en las preguntas frecuentes..."
                className="w-full pl-12 pr-4 py-4 rounded-xl text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-purple-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#1e293b] mb-4">Categorías</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`p-4 rounded-xl transition-all ${
                    activeCategory === category.id
                      ? "bg-[#2563eb] text-white shadow-lg scale-105"
                      : "bg-white hover:shadow-md"
                  }`}
                >
                  <Icon
                    className={`w-8 h-8 mx-auto mb-2 ${
                      activeCategory === category.id ? "text-white" : "text-[#2563eb]"
                    }`}
                  />
                  <span className="text-sm font-medium">{category.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* FAQ List */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#1e293b]">Preguntas Frecuentes</h2>
            <p className="text-[#64748b] mt-1">
              {filteredFAQs.length} {filteredFAQs.length === 1 ? "resultado encontrado" : "resultados encontrados"}
            </p>
          </div>

          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#1e293b] mb-2">No se encontraron resultados</h3>
              <p className="text-[#64748b] mb-6">
                Intenta con otros términos de búsqueda o selecciona una categoría diferente
              </p>
              <a
                href="/contacto"
                className="inline-block bg-[#2563eb] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1d4ed8] transition-colors"
              >
                Contactar Soporte
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFAQs.map((faq) => (
                <div
                  key={faq.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:border-[#2563eb] transition-colors"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-[#f1f5f9] transition-colors"
                  >
                    <span className="text-left font-medium text-[#1e293b] flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-[#2563eb] flex-shrink-0" />
                      {faq.question}
                    </span>
                    {openFAQ === faq.id ? (
                      <ChevronUp className="w-5 h-5 text-[#64748b] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#64748b] flex-shrink-0" />
                    )}
                  </button>

                  {openFAQ === faq.id && (
                    <div className="px-6 py-4 bg-[#f8fafc] border-t border-gray-200">
                      <p className="text-[#64748b] leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Additional Help */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <Book className="w-12 h-12 text-[#2563eb] mb-4" />
            <h3 className="text-xl font-bold text-[#1e293b] mb-2">Guía de Inicio Rápido</h3>
            <p className="text-[#64748b] mb-4">Aprende lo básico sobre cómo usar LUCKAS en pocos minutos</p>
            <a href="/ayuda" className="text-[#2563eb] font-medium hover:underline">
              Ver Guía →
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <Smartphone className="w-12 h-12 text-[#059669] mb-4" />
            <h3 className="text-xl font-bold text-[#1e293b] mb-2">¿Aún necesitas ayuda?</h3>
            <p className="text-[#64748b] mb-4">Nuestro equipo de soporte está listo para asistirte</p>
            <a href="/contacto" className="text-[#059669] font-medium hover:underline">
              Contactar Soporte →
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AyudaOnline;


