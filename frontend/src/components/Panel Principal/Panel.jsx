import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../footer/Footer";
import './Panel.css'
import EventosCarousel from "./EventosCarousel/EventosCarousel";
import {
    Calendar,
    BookOpen,
    Home,
    Users,
    CheckCircle,
    ArrowRight,
    MapPin,
    Phone,
    Mail,
    Star,
    Award,
    Heart,
    Quote,
} from "lucide-react"

const PanelPrincipal = () => {

    const navigate = useNavigate();

    const handlLogin = () => {
        navigate('/login');
    };

    const handlRegistro = () => {
        navigate('/signup/registro');
    };

    const [menuOpen, setMenuOpen] = useState(false);


    const stats = [
        { value: "500+", label: "Participantes Activos" },
        { value: "50+", label: "Eventos Anuales" },
        { value: "20+", label: "Cursos Disponibles" },
        { value: "15", label: "Cabañas Confortables" },
    ]

    const services = [
        {
            icon: Calendar,
            title: "Eventos Espirituales",
            description:
                "Participa en conferencias, retiros, seminarios y actividades especiales que fortalecerán tu fe y crecimiento espiritual.",
            features: [
                "Conferencias con invitados especiales",
                "Retiros de fin de semana",
                "Seminarios temáticos",
                "Actividades familiares",
            ],
            buttonText: "Ver Eventos",
            color: "blue",
        },
        {
            icon: BookOpen,
            title: "Cursos de Formación",
            description:
                "Amplía tus conocimientos con nuestros cursos teológicos, ministeriales y de crecimiento personal de alta calidad.",
            features: ["Teología bíblica", "Liderazgo cristiano", "Ministerio pastoral", "Estudios especializados"],
            buttonText: "Explorar Cursos",
            color: "purple",
        },
        {
            icon: Home,
            title: "Reserva de Cabañas",
            description:
                "Disfruta de nuestras cómodas cabañas en un ambiente natural perfecto para el descanso y la reflexión.",
            features: ["Cabañas familiares", "Ambiente natural", "Instalaciones completas", "Tarifas accesibles"],
            buttonText: "Hacer Reserva",
            color: "green",
        },
    ]



    const testimonials = [
        {
            name: "María González",
            role: "Estudiante de Teología",
            content:
                "El Seminario Bautista ha transformado mi vida. Los cursos son profundos y los profesores son increíblemente preparados. He crecido enormemente en mi fe.",
            rating: 5,
        },
        {
            name: "Carlos Ramírez",
            role: "Pastor",
            content:
                "Los retiros espirituales aquí son una bendición. El ambiente es perfecto para la meditación y el encuentro con Dios. Las instalaciones son excelentes.",
            rating: 5,
        },
        {
            name: "Ana Martínez",
            role: "Líder de Jóvenes",
            content:
                "Las cabañas son ideales para nuestros grupos de jóvenes. Cómodas, limpias y en un entorno natural hermoso. Altamente recomendado.",
            rating: 5,
        },
    ]

    const values = [
        {
            icon: Heart,
            title: "Fe y Comunidad",
            description: "Fortalecemos la fe y construimos una comunidad unida en Cristo",
        },
        {
            icon: Award,
            title: "Excelencia Académica",
            description: "Ofrecemos educación teológica de la más alta calidad",
        },
        {
            icon: Users,
            title: "Servicio Pastoral",
            description: "Formamos líderes comprometidos con el servicio a Dios y la comunidad",
        },
    ]

    const getServiceColor = (color) => {
        const colors = {
            blue: { bg: "#2563eb", light: "#dbeafe", hover: "#1d4ed8" },
            purple: { bg: "#8b5cf6", light: "#ede9fe", hover: "#7c3aed" },
            green: { bg: "#059669", light: "#d1fae5", hover: "#047857" },
        }
        return colors[color]
    }


    return (
        <>
            <header className="header-panel-princiapl">
                <nav className="nav-panel-princiapl">
                    <div className="nav-brand-panel-princiapl">
                        <h1 className="icono-luckas" >LUCKAS</h1>
                    </div>
                    <button
                        className="mobile-menu-btn"
                        aria-expanded={menuOpen}
                        aria-label="Abrir menú"
                        onClick={() => setMenuOpen(prev => !prev)}
                    >
                        ☰
                    </button>
                    <div className={`nav-links-panel-princiapl ${menuOpen ? 'mobile-open' : ''}`}>
                        <a href="#inicio" onClick={() => setMenuOpen(false)}>Inicio</a>
                        <a href="#servicios" onClick={() => setMenuOpen(false)}>Servicios</a>
                        <a href="#eventos" onClick={() => setMenuOpen(false)}>Eventos</a>
                        <a href="#testimonios" onClick={() => setMenuOpen(false)}>Testimonios</a>
                        <a href="#contacto" onClick={() => setMenuOpen(false)}>Contacto</a>
                        <div className="nav-actions-panel-princiapl">
                            <button className="btn-secondary-panel-princiapl" onClick={() => { setMenuOpen(false); handlLogin(); }}>Iniciar Sesión</button>
                            <button className="btn-primary-panel-princiapl" onClick={() => { setMenuOpen(false); handlRegistro(); }}>Registrarse</button>
                        </div>
                    </div>
                
                </nav>
            </header>
            <section id="inicio" className="relative overflow-hidden bg-gradient-to-br from-[#2563eb] via-[#1d4ed8] to-[#1e40af] py-20 text-white md:py-32">
                <div className="absolute inset-0  opacity-10" />
                <div className="container relative mx-auto px-4">
                    <div className="grid items-center gap-12 lg:grid-cols-2">
                        <div className="space-y-6">
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#059669] px-3 py-1 text-xs font-medium text-white">
                                <CheckCircle className="h-3 w-3" />
                                Inscripciones Abiertas 2025
                            </span>
                            <h1 className="text-balance text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                                Bienvenido al <span className="text-white">Seminario Bautista</span> de Colombia
                            </h1>
                            <p className="text-pretty text-lg text-blue-100 md:text-xl">
                                Únete a nuestros eventos espirituales, cursos de formación y disfruta de nuestras cabañas en un ambiente
                                de paz y crecimiento espiritual.
                            </p>
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-medium text-[#2563eb] transition-colors hover:bg-blue-50" onClick={handlLogin}>
                                    Explorar Eventos
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                                <button className="inline-flex items-center justify-center rounded-lg border-2 border-white bg-transparent px-6 py-3 text-base font-medium text-white transition-colors hover:bg-white/10" onClick={handlLogin}>
                                    Ver Cursos
                                </button> 
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-2xl border-0 bg-white/10 p-6 text-center backdrop-blur-sm">
                                <Calendar className="mx-auto mb-3 h-8 w-8 text-white" />
                                <div className="text-sm text-blue-100">Eventos</div>
                                <div className="text-lg font-normal text-white">Conferencias y retiros espirituales</div>
                            </div>
                            <div className="rounded-2xl border-0 bg-white/10 p-6 text-center backdrop-blur-sm">
                                <BookOpen className="mx-auto mb-3 h-8 w-8 text-white" />
                                <div className="text-sm text-blue-100">Cursos</div>
                                <div className="text-lg font-normal text-white">Formación teológica y ministerial</div>
                            </div>
                            <div className="rounded-2xl border-0 bg-white/10 p-6 text-center backdrop-blur-sm">
                                <Home className="mx-auto mb-3 h-8 w-8 text-white" />
                                <div className="text-sm text-blue-100">Cabañas</div>
                                <div className="text-lg font-normal text-white">Alojamiento cómodo y tranquilo</div>
                            </div>
                            <div className="rounded-2xl border-0 bg-white/10 p-6 text-center backdrop-blur-sm">
                                <Users className="mx-auto mb-3 h-8 w-8 text-white" />
                                <div className="text-sm text-blue-100">Comunidad</div>
                                <div className="text-lg font-normal text-white">500+ miembros activos</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-b border-gray-200 bg-[#f1f5f9] py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                        {stats.map((stat) => (
                            <div key={stat.value} className="text-center">
                                <div className="text-4xl font-bold text-[#2563eb] md:text-5xl">{stat.value}</div>
                                <div className="mt-2 text-sm text-[#334155] md:text-base">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="mb-12 text-center">
                        <span className="mb-4 inline-block rounded-full bg-[#8b5cf6] px-3 py-1 text-xs font-medium text-white">
                            Nuestros Valores
                        </span>
                        <h2 className="text-balance text-3xl font-bold text-[#334155] md:text-4xl">
                            Comprometidos con la Excelencia
                        </h2>
                    </div>
                    <div className="grid gap-8 md:grid-cols-3">
                        {values.map((value) => {
                            const IconComponent = value.icon
                            return (
                                <div
                                    key={value.title}
                                    className="rounded-lg border-2 border-gray-200 bg-white p-8 text-center shadow-sm transition-all hover:border-[#8b5cf6] hover:shadow-lg"
                                >
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#8b5cf6]/10">
                                        <IconComponent className="h-8 w-8 text-[#8b5cf6]" />
                                    </div>
                                    <h3 className="mb-3 text-xl font-bold text-[#334155]">{value.title}</h3>
                                    <p className="text-pretty text-[#64748b]">{value.description}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="servicios" className="bg-[#f1f5f9] py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="mb-12 text-center">
                        <span className="mb-4 inline-block rounded-full bg-[#2563eb] px-3 py-1 text-xs font-medium text-white">
                            Nuestros Servicios
                        </span>
                        <h2 className="text-balance text-3xl font-bold text-[#334155] md:text-4xl">
                            Descubre Todo lo que Tenemos para Ofrecerte
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-pretty text-[#64748b]">
                            El Seminario Bautista de Colombia ofrece una experiencia integral de crecimiento espiritual, académico y
                            comunitario
                        </p>
                    </div>
                    <div className="grid gap-8 lg:grid-cols-3">
                        {services.map((service) => {
                            const IconComponent = service.icon
                            const colors = getServiceColor(service.color)
                            return (
                                <div
                                    key={service.title}
                                    className="group rounded-lg border-t-4 bg-white p-8 shadow-sm transition-all hover:shadow-xl"
                                    style={{ borderTopColor: colors.bg }}
                                >
                                    <div
                                        className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                                        style={{ backgroundColor: colors.light }}
                                    >
                                        <IconComponent className="h-7 w-7" style={{ color: colors.bg }} />
                                    </div>
                                    <h3 className="mb-3 text-2xl font-bold text-[#334155]">{service.title}</h3>
                                    <p className="mb-6 text-pretty text-[#64748b]">{service.description}</p>
                                    <ul className="mb-6 space-y-2">
                                        {service.features.map((feature) => (
                                            <li key={feature} className="flex items-start gap-2">
                                                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: colors.bg }} />
                                                <span className="text-sm text-[#334155]">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors"
                                        style={{ backgroundColor: colors.bg }}
                                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.hover)}
                                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.bg)}
                                         onClick={handlLogin}
                                    >
                                        {service.buttonText}
                                        <ArrowRight className="h-4 w-4" />
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Upcoming Events Section */}
            <section id="eventos" className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="mb-12 text-center">
                        <span className="mb-4 inline-block rounded-full bg-[#059669] px-3 py-1 text-xs font-medium text-white">
                            Próximos Eventos e Programas Académicos
                        </span>
                        <h2 className="text-balance text-3xl font-bold text-[#334155] md:text-4xl">
                            No Te Pierdas Nuestras Actividades
                        </h2>
                    </div>

                    <div>
                        <EventosCarousel/>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonios" className="bg-[#f1f5f9] py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="mb-12 text-center">
                        <span className="mb-4 inline-block rounded-full bg-[#8b5cf6] px-3 py-1 text-xs font-medium text-white">
                            Testimonios
                        </span>
                        <h2 className="text-balance text-3xl font-bold text-[#334155] md:text-4xl">
                            Lo Que Dicen Nuestros Estudiantes
                        </h2>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {testimonials.map((testimonial) => (
                            <div key={testimonial.name} className="relative rounded-lg bg-white p-8 shadow-sm">
                                <Quote className="absolute right-8 top-8 h-12 w-12 text-[#2563eb]/10" />
                                <div className="relative">
                                    <div className="mb-4 flex gap-1">
                                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                                            <Star key={`${testimonial.name}-star-${i}`} className="h-4 w-4 fill-[#fbbf24] text-[#fbbf24]" />
                                        ))}
                                    </div>
                                    <p className="mb-6 text-pretty text-[#334155]">{testimonial.content}</p>
                                    <div>
                                        <div className="font-bold text-[#334155]">{testimonial.name}</div>
                                        <div className="text-sm text-[#64748b]">{testimonial.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] py-16 text-white md:py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl">¿Listo para Comenzar tu Experiencia?</h2>
                    <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg text-blue-100">
                        Regístrate hoy y accede a todos nuestros eventos, cursos y servicios de alojamiento
                    </p>
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <button className="rounded-lg bg-white px-6 py-3 text-base font-medium text-[#2563eb] transition-colors hover:bg-blue-50" onClick={handlRegistro}>
                            Crear Cuenta Gratuita
                        </button>
                        <button className="rounded-lg border-2 border-white bg-transparent px-6 py-3 text-base font-medium text-white transition-colors hover:bg-white/10" onClick={handlLogin}>
                            Iniciar Sesión
                        </button>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contacto" className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="grid gap-12 lg:grid-cols-2">
                        <div>
                            <span className="mb-4 inline-block rounded-full bg-[#2563eb] px-3 py-1 text-xs font-medium text-white">
                                Contáctanos
                            </span>
                            <h2 className="mb-6 text-balance text-3xl font-bold text-[#334155] md:text-4xl">
                                Gestiona y Administra tu Seminario Eficientemente
                            </h2>
                            <p className="mb-8 text-pretty text-[#64748b]">
                                Sistema integral de gestión académica y administrativa para el Seminario Bautista de Colombia. Optimiza
                                procesos y mejora la experiencia de nuestros estudiantes.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563eb]/10">
                                        <MapPin className="h-5 w-5 text-[#2563eb]" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-[#334155]">Ubicación</div>
                                        <div className="text-sm text-[#64748b]">Calle 123 #45-67, Bogotá, Colombia</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563eb]/10">
                                        <Phone className="h-5 w-5 text-[#2563eb]" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-[#334155]">Teléfono</div>
                                        <div className="text-sm text-[#64748b]">+57 (1) 234-5678</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563eb]/10">
                                        <Mail className="h-5 w-5 text-[#2563eb]" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-[#334155]">Email</div>
                                        <div className="text-sm text-[#64748b]">info@seminariobautista.edu.co</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-lg bg-white p-8 shadow-sm">
                            <h3 className="mb-6 text-2xl font-bold text-[#334155]">Envíanos un Mensaje</h3>
                            <form className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-[#334155]">
                                        Nombre Completo
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-[#334155] outline-none ring-[#2563eb] transition-colors focus:border-[#2563eb] focus:ring-2"
                                        placeholder="Tu nombre"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#334155]">
                                        Correo Electrónico
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-[#334155] outline-none ring-[#2563eb] transition-colors focus:border-[#2563eb] focus:ring-2"
                                        placeholder="tu@email.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="mb-2 block text-sm font-medium text-[#334155]">
                                        Mensaje
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={4}
                                        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-[#334155] outline-none ring-[#2563eb] transition-colors focus:border-[#2563eb] focus:ring-2"
                                        placeholder="¿En qué podemos ayudarte?"
                                    />
                                </div>
                                <button className="w-full rounded-lg bg-[#2563eb] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1d4ed8]">
                                    Enviar Mensaje
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />

        </>
    );

};

export default PanelPrincipal;
