import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { eventService } from "../../../services/eventService";
import { programasAcademicosService } from "../../../services/programasAcademicosService";
import {
  Calendar,
  Users,
} from "lucide-react"

const EventosCarousel = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handlLogin = () => {
    navigate('/login');
  };
  // Helpers para normalizar imágenes y campos (fuera de useEffect para evitar anidación profunda)
  const toArray = (v) => {
    if (Array.isArray(v)) return v;
    if (v) return [v];
    return [];
  };
  const firstOr = (arr, fallback) => (arr && arr.length ? arr[0] : fallback);

  const normalizeEvent = (e) => {
    const categoria = e.categoria;
    const categoriaTexto = typeof categoria === 'string' ? categoria : (categoria && (categoria.nombre || categoria.tipo)) || null;
    const imagenRaw = e.imagen || e.image;
    const imagenesArray = toArray(imagenRaw);
    const imagen = firstOr(imagenesArray, "/spiritual-event.jpg");

    let statusText = '';
    if (e.estado) statusText = e.estado;
    else if (e.status) statusText = e.status;
    else if (e.disponible) statusText = 'Disponible';
    else if (e.active !== undefined) statusText = e.active ? 'Disponible' : 'No disponible';

    return {
      id: e._id || e.id || e.uuid || Math.random(),
      title: e.titulo || e.title || e.nombre || "Evento",
      date: e.fecha || e.date || e.fechaEvento || e.fecha_evento || e.createdAt || "--",
      type: e.tipo || e.type || categoriaTexto || "Evento",
      capacity: e.capacidad ? String(e.capacidad) : (e.cupo || e.cuposDisponibles || e.cuposTotales || "-"),
      status: statusText,
      images: imagenesArray.length ? imagenesArray : [imagen],
      image: imagen,
      createdAt: e.createdAt,
      category: "evento",
    };
  };

  const normalizePrograma = (p) => {
    const imagenesArray = toArray(p.imagen || p.image);
    return {
      id: p._id || p.id || Math.random(),
      title: p.titulo || p.nombre || p.title || "Programa",
      date: p.fecha_inicio || p.date || p.duracion || p.createdAt || "--",
      type: 'Curso',
      capacity: p.cupos ? String(p.cupos) : p.cupo || "-",
      status: p.estado || p.status || "Disponible",
      images: imagenesArray.length ? imagenesArray : ["/course.jpg"],
      image: firstOr(imagenesArray, "/course.jpg"),
      createdAt: p.createdAt,
      category: "programa",
    };
  };

  const sortByCreatedDesc = (arr) =>
    (arr || []).filter(Boolean).slice().sort((a, b) => {
      const da = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const db = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return db - da;
    });
  // No es necesario registrar módulos cuando se pasan en la prop `modules` del componente Swiper

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [events, programas] = await Promise.all([
          eventService.getAllEvents().catch(() => []),
          programasAcademicosService.getAllProgramas().catch(() => []),
        ]);

        console.debug('Eventos raw:', events);
        console.debug('Programas raw:', programas);

        const normalizedEvents = (events || []).map(normalizeEvent);
        const normalizedProgramas = (programas || []).map(normalizePrograma);

        // Ordenar cada lista por createdAt descendente y tomar los últimos 4 de cada una
        const latestEvents = sortByCreatedDesc(normalizedEvents).slice(0, 4);
        const latestProgramas = sortByCreatedDesc(normalizedProgramas).slice(0, 4);

        // Combinar: primero eventos, luego programas (puedes invertir si prefieres otra orden)
        const combined = [...latestEvents, ...latestProgramas];

        setItems(combined);
      } catch (err) {
        setError(err.message || "Error al cargar items");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) return <div className="text-center">Cargando eventos...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;
  if (!items.length) return <div className="text-center">No hay eventos o programas disponibles.</div>;

  return (
    <div>
      
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 1.2 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {items.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="overflow-hidden rounded-lg border-2 border-gray-200 bg-white shadow-sm transition-all hover:border-[#2563eb] hover:shadow-lg">
              <div className="h-44 overflow-hidden">
                {item.images && item.images.length > 1 ? (
                  <Swiper
                    modules={[Pagination]}
                    pagination={{ clickable: true }}
                    spaceBetween={0}
                    slidesPerView={1}
                  >
                    {item.images.map((src, idx) => (
                      <SwiperSlide key={`${item.id}-img-${idx}`}>
                        <img src={src} alt={`${item.title} - ${idx + 1}`} className="h-44 w-full object-cover" />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <img src={item.image} alt={item.title} className="h-44 w-full object-cover" />
                )}
              </div>
              <div className="p-4 md:p-6">
                <span className="mb-2 inline-block rounded-full bg-[#8b5cf6] px-3 py-1 text-xs font-medium text-white">{item.type}</span>
                <h3 className="mb-2 text-lg font-bold text-[#334155]">{item.title}</h3>
                <div className="mb-4 space-y-2 text-sm text-[#64748b]">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {item.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {item.capacity}
                  </div>
                </div>
                <span className="mb-4 inline-block rounded-full bg-[#059669] px-3 py-1 text-xs font-medium text-white">
                  {item.status}
                </span>
                <button className="mt-2 w-full rounded-lg border-2 border-[#2563eb] bg-transparent px-4 py-2.5 text-sm font-medium text-[#2563eb] transition-colors hover:bg-[#2563eb] hover:text-white" onClick={handlLogin}> Inscribirme Ahora</button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default EventosCarousel;
