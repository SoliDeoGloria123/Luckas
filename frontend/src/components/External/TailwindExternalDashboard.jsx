import React, { useState, useEffect } from 'react';
import CabanaDetailsModal from './CabanaDetailsModal';
//import cursosService from '../../services/courseService';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  Home,
  User,
  Moon,
  Sun,
  Bell,
  Search,
  Star,
  Clock,
  Users,
  MapPin,
  CheckCircle,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import externalService from '../../services/externalService';
import PaymentModal from './PaymentModal';
import SeminaristaForm from './SeminaristaForm';
import ProfilePanel from './ProfilePanel';
import { reservaService } from '../../services/reservaService';
import { comentarioEventoService } from '../../services/comentarioEventoService';
import '../External/styles/globals.css';
import '../External/styles/search.css';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../External/styles/calendar-external.css';

// Funciones y variables faltantes para evitar errores de compilación
const isEventoAbiertoAComentarios = () => true;
const clearSearch = () => { };

const TailwindExternalDashboard = () => {
  // ...existing code...
  // Cargar comentarios de un evento desde el backend
  const cargarComentariosEvento = async (eventoId) => {
    setLoadingComments((prev) => ({ ...prev, [eventoId]: true }));
    try {
      const comentarios = await comentarioEventoService.getComentariosEvento(eventoId);
      setCommentsByEvento((prev) => ({ ...prev, [eventoId]: comentarios }));
    } catch (error) {
      setCommentsByEvento((prev) => ({ ...prev, [eventoId]: [] }));
    }
    setLoadingComments((prev) => ({ ...prev, [eventoId]: false }));
  };

  // Enviar comentario para un evento al backend
  const handleCommentSubmit = async (eventoId, e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    const texto = commentTextByEvento[eventoId];
    if (!texto) return;
    setLoadingComments((prev) => ({ ...prev, [eventoId]: true }));
    try {
      // Enviar al backend
      const nuevoComentario = await comentarioEventoService.crearComentario(eventoId, {
        autor: user?.nombre || 'Anónimo',
        texto,
      });
      // Recargar comentarios desde el backend
      await cargarComentariosEvento(eventoId);
      setCommentTextByEvento((prev) => ({ ...prev, [eventoId]: '' }));
    } catch (error) {
      // Manejo de error
    }
    setLoadingComments((prev) => ({ ...prev, [eventoId]: false }));
  };

  const toggleCommentSection = (eventoId) => {
    setShowCommentSection((prev) => ({
      ...prev,
      [eventoId]: !prev[eventoId],
    }));
    if (!showCommentSection[eventoId]) {
      cargarComentariosEvento(eventoId);
    }
  };
  const getEventsForDate = (date) => {
    // Filtra los eventos por la fecha seleccionada
    if (!Array.isArray(eventos) || !date) return [];
    // Normaliza la fecha a formato YYYY-MM-DD
    const selectedDateStr = new Date(date).toISOString().split('T')[0];
    return eventos.filter(ev => {
      // Soporta evento.fechaEvento o evento.fecha
      const eventDate = ev.fechaEvento || ev.fecha;
      if (!eventDate) return false;
      const eventDateStr = new Date(eventDate).toISOString().split('T')[0];
      return eventDateStr === selectedDateStr;
    });
  };
  // ...las funciones correctas ya están definidas arriba...
  const [user, setUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  // Cargar notificaciones del backend al iniciar
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if (usuario && usuario.token) {
          const notificationService = await import('../../services/notificationService');
          const notifs = await notificationService.default.getNotifications(usuario.token);
          setNotifications(notifs);
        }
      } catch (err) {
        // Opcional: mostrar error
      }
    };
    fetchNotifications();
  }, []);
  // Estados para el wizard de reserva
  const [wizardStep, setWizardStep] = useState(1);
  const [reservaForm, setReservaForm] = useState({
    nombre: '',
    documento: '',
    cantidadPersonas: 1,
    conNinos: false,
    edadesNinos: [],
    conBebes: false,
    edadesBebes: [],
    fechaInicio: '',
    fechaFin: '',
    correoElectronico: '',
    telefono: '',
    propositoEstadia: '',
    solicitudesEspeciales: '',
    precioTotal: 0
  });
  const [cursos, setCursos] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [cabanas, setCabanas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSeminaristaForm, setShowSeminaristaForm] = useState(false);
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [inscripciones, setInscripciones] = useState([]);
  const [reservaStatus, setReservaStatus] = useState(null);
  const [showReservaModal, setShowReservaModal] = useState(false);
  const [favoritos, setFavoritos] = useState([]);
  // Cargar favoritos del usuario al iniciar
  useEffect(() => {
    if (user && user.favoritos) {
      setFavoritos(user.favoritos.map(f => f.toString()));
    }
  }, [user]);
  // Handler para marcar/desmarcar favorito
  const handleToggleFavorito = async (cabanaId) => {
    try {
      const res = await externalService.toggleFavoritoCabana(cabanaId);
      if (res.success) {
        setFavoritos(res.favoritos.map(f => f.toString()));
      }
    } catch (err) {
      alert('Error al actualizar favorito');
    }
  };
  const [cabanaSeleccionada, setCabanaSeleccionada] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Estados para el buscador
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCursos, setFilteredCursos] = useState([]);
  const [filteredEventos, setFilteredEventos] = useState([]);
  const [filteredCabanas, setFilteredCabanas] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Estado para el calendario
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedEvents, setSelectedEvents] = useState([]);

  // Estado para el modal de comentarios
  const [commentsByEvento, setCommentsByEvento] = useState({});
  const [loadingComments, setLoadingComments] = useState({});
  const [commentTextByEvento, setCommentTextByEvento] = useState({});
  const [replyTextByEvento, setReplyTextByEvento] = useState({});
  const [replyToByEvento, setReplyToByEvento] = useState({});
  const [showCommentSection, setShowCommentSection] = useState({});
  const [commentOrderBy, setCommentOrderBy] = useState({});
  const [commentPageByEvento, setCommentPageByEvento] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [showReplyNotification, setShowReplyNotification] = useState({});
  // Eliminado: showCommentFeedback, setShowCommentFeedback (no usado)
  const [showEditFeedback, setShowEditFeedback] = useState({});
  const [showDeleteFeedback, setShowDeleteFeedback] = useState({});
  const [showModerateFeedback, setShowModerateFeedback] = useState({});

  const COMMENTS_PER_PAGE = 5;

  const navigate = useNavigate();

  const menuItems = [
  { id: 'dashboard', label: 'Inicio', icon: Home },
  { id: 'courses', label: 'Programas Académicos', icon: BookOpen },
  { id: 'events', label: 'Eventos', icon: Calendar },
  { id: 'cabins', label: 'Cabañas', icon: Home },
  ];

  // Funciones de búsqueda
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      setShowSearchResults(false);
      setFilteredCursos([]);
      setFilteredEventos([]);
      setFilteredCabanas([]);
      return;
    }
    const queryLower = query.toLowerCase();
    const filteredC = cursos.filter(curso => (
      (curso.nombre?.toLowerCase().includes(queryLower) ||
        curso.descripcion?.toLowerCase().includes(queryLower) ||
        curso.instructor?.toLowerCase().includes(queryLower))
    ));
    const filteredE = eventos.filter(evento =>
    (evento.nombre?.toLowerCase().includes(queryLower) ||
      evento.descripcion?.toLowerCase().includes(queryLower) ||
      evento.lugar?.toLowerCase().includes(queryLower))
    );
    const filteredCab = cabanas.filter(cabana =>
    (cabana.nombre?.toLowerCase().includes(queryLower) ||
      cabana.descripcion?.toLowerCase().includes(queryLower) ||
      cabana.ubicacion?.toLowerCase().includes(queryLower))
    );
    setFilteredCursos(filteredC);
    setFilteredEventos(filteredE);
    setFilteredCabanas(filteredCab);
    setShowSearchResults(true);
    setFilteredCabanas(filteredCab);
    setShowSearchResults(true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowSearchResults(false);
  };

  const goToSearchResult = (item, tipo) => {
    setShowSearchResults(false);
    if (tipo === 'curso') {
      // Navegar a la página del curso
      navigate(`/cursos/${item._id}`);
    } else if (tipo === 'evento') {
      // Navegar a la página del evento
      navigate(`/eventos/${item._id}`);
    } else if (tipo === 'cabana') {
      // Navegar a la página de la cabaña
      navigate(`/cabanas/${item._id}`);
    }
  };

  // Eliminado: renderContent (no usado)

  // Render del dashboard
  const renderDashboard = () => (
    <div className="p-8">
      <h2 className="text-4xl font-bold mb-6">Bienvenido, {user?.nombre}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tarjetas de resumen */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Tus Inscripciones</h3>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{inscripciones.length}</div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Cursos y eventos a los que estás inscrito</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Reservas de Cabañas</h3>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{cabanas.length}</div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Cabañas que has reservado</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Próximos Eventos</h3>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{eventos.length}</div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Eventos a los que asistirás próximamente</p>
        </div>
      </div>

      {/* Gráficos y estadísticas */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Estadísticas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h4 className="text-md font-semibold mb-4">Inscripciones por Curso</h4>
            {/* Aquí iría un gráfico de barras o pastel */}
            <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              Gráfico de Inscripciones
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h4 className="text-md font-semibold mb-4">Asistencia a Eventos</h4>
            {/* Aquí iría un gráfico de líneas */}
            <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              Gráfico de Asistencia
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render de cursos
  const renderCourses = () => (
    <div className="p-8">
      <h2 className="text-4xl font-bold mb-6">Programas Académicos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cursos.map((curso) => (
          <div key={curso._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">{curso.nombre}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{curso.descripcion}</p>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                {curso.categoria}
              </span>
              <span className="text-sm px-3 py-1 rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
                ${curso.precio}
              </span>
            </div>
            <button
              onClick={() => handleInscribirse(curso, 'curso')}
              className="w-full bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-700 transition-all duration-200"
            >
              Inscribirse
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  // Render de eventos
  const renderEvents = () => (
    <div className="p-8">
      <h2 className="text-4xl font-bold mb-6">Eventos Próximos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventos.map((evento) => (
          <div key={evento._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:scale-[1.02]">
            <h3 className="text-lg font-bold mb-4 text-blue-700 dark:text-blue-300">{evento.nombre}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{evento.descripcion}</p>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                {evento.tipo}
              </span>
              <span className="text-sm px-3 py-1 rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
                ${evento.precio}
              </span>
            </div>
            <button
              onClick={() => handleInscribirse(evento, 'evento')}
              className="w-full bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-700 transition-all duration-200 mb-2"
            >
              Registrarse
            </button>
            <button
              onClick={() => toggleCommentSection(evento._id)}
              className="w-full bg-gray-200 dark:bg-gray-700 text-blue-600 dark:text-blue-300 rounded-lg py-2 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 mb-2"
            >
              {showCommentSection[evento._id] ? 'Ocultar comentarios' : 'Comentar sobre este evento'}
            </button>
            {/* Sección de comentarios mejorada */}
            {showCommentSection[evento._id] && (
              <div className="mt-4 animate-fade-in">
                <h4 className="text-md font-semibold mb-2 text-blue-600 dark:text-blue-300">Comentarios</h4>
                {loadingComments[evento._id] ? (
                  <div className="text-gray-500">Cargando comentarios...</div>
                ) : (
                  <div>
                    {(commentsByEvento[evento._id] || []).length === 0 ? (
                      <div className="text-gray-500">No hay comentarios aún.</div>
                    ) : (
                      <ul className="mb-2">
                        {commentsByEvento[evento._id].map((comentario) => (
                          <li key={comentario.id} className="mb-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-900 shadow flex gap-3 items-start">
                            <div className="flex-shrink-0">
                              <img src={comentario.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(comentario.autor)} alt="avatar" className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-blue-700 dark:text-blue-300">{comentario.autor}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{comentario.fecha}</div>
                              <div className="text-gray-800 dark:text-gray-200 mb-2">{comentario.texto}</div>
                              <div className="flex gap-2 items-center">
                                <button className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200" title="Me gusta">
                                  👍 {comentario.likes || 0}
                                </button>
                                <button className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200" title="No me gusta">
                                  👎 {comentario.dislikes || 0}
                                </button>
                                <button className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200" title="Responder" onClick={() => setReplyToByEvento(prev => ({ ...prev, [evento._id]: comentario.id }))}>
                                  Responder
                                </button>
                              </div>
                              {replyToByEvento[evento._id] === comentario.id && (
                                <div className="mt-2 flex gap-2 items-center">
                                  <textarea
                                    className="flex-1 p-2 rounded border border-gray-300 dark:border-gray-700 resize-none focus:ring-2 focus:ring-blue-400"
                                    rows={1}
                                    placeholder="Escribe una respuesta..."
                                    value={replyTextByEvento[evento._id] || ''}
                                    onChange={e => setReplyTextByEvento(prev => ({ ...prev, [evento._id]: e.target.value }))}
                                  />
                                  <button
                                    className="bg-blue-600 text-white rounded-lg py-1 px-3 font-semibold hover:bg-blue-700 transition-all duration-200"
                                    onClick={async () => {
                                      // Aquí iría la lógica para enviar la respuesta al backend
                                      setReplyTextByEvento(prev => ({ ...prev, [evento._id]: '' }));
                                      setReplyToByEvento(prev => ({ ...prev, [evento._id]: null }));
                                      setTimeout(() => cargarComentariosEvento(evento._id), 400);
                                    }}
                                  >Responder</button>
                                </div>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                    <form className="flex gap-2 items-center mt-2 w-full" onSubmit={async (e) => {
                      await handleCommentSubmit(evento._id, e);
                    }}>
                      <img src={user?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.nombre || 'U')} alt="avatar" className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700" />
                      <textarea
                        className="flex-1 p-2 rounded border border-gray-300 dark:border-gray-700 resize-none focus:ring-2 focus:ring-blue-400"
                        rows={2}
                        placeholder="Escribe tu comentario..."
                        value={commentTextByEvento[evento._id] || ''}
                        onChange={e => setCommentTextByEvento(prev => ({ ...prev, [evento._id]: e.target.value }))}
                      />
                      <button
                        type="submit"
                        className="bg-blue-600 text-white rounded-lg py-2 px-6 font-semibold hover:bg-blue-700 transition-all duration-200 flex-shrink-0"
                      >
                        Comentar
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Render de cabañas
  const renderCabins = () => (
    <div className="p-8">
      <h2 className="text-4xl font-bold mb-6">Cabañas Disponibles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cabanas.map((cabana) => {
          // Mostrar la primera imagen del array si existe
          let imagenUrl = Array.isArray(cabana.imagen) && cabana.imagen.length > 0 ? cabana.imagen[0] : null;
          return (
            <div key={cabana._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              {imagenUrl ? (
                <img src={imagenUrl} alt={cabana.nombre}
                  className="w-full h-48 object-cover rounded-lg mb-4 border border-gray-200 dark:border-gray-700" />
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 text-gray-400">
                  Sin imagen
                </div>
              )}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                  {cabana.ubicacion}
                </span>
                <span className="text-sm px-3 py-1 rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
                  Capacidad: {cabana.capacidad}
                </span>
              </div>
              <button
                onClick={() => handleReservarCabana(cabana)}
                className="w-full bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-700 transition-all duration-200"
              >
                Reservar
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  const handleLike = async (eventoId, comentarioId) => {
    try {
      await comentarioEventoService.likeComentario(comentarioId);
      cargarComentariosEvento(eventoId);
    } catch { }
  };

  const handleDislike = async (eventoId, comentarioId) => {
    try {
      await comentarioEventoService.dislikeComentario(comentarioId);
      cargarComentariosEvento(eventoId);
    } catch { }
  };

  const handleReplySubmit = async (e, eventoId, comentarioId) => {
    e.preventDefault();
    if (!replyTextByEvento[eventoId]) return;
    try {
      await comentarioEventoService.responderComentario(comentarioId, replyTextByEvento[eventoId]);
      setReplyTextByEvento((prev) => ({ ...prev, [eventoId]: '' }));
      setReplyToByEvento((prev) => ({ ...prev, [eventoId]: null }));
      setShowReplyNotification((prev) => ({ ...prev, [eventoId]: true }));
      setTimeout(() => setShowReplyNotification((prev) => ({ ...prev, [eventoId]: false })), 3000);
      cargarComentariosEvento(eventoId);
    } catch { }
  };

  const handleEditCommentSubmit = async (e, eventoId, commentId) => {
    e.preventDefault();
    try {
      await comentarioEventoService.editarComentario(eventoId, commentId, editCommentText);
      await cargarComentariosEvento(eventoId);
      setEditingCommentId(null);
      setShowEditFeedback(prev => ({ ...prev, [commentId]: true }));
      setTimeout(() => setShowEditFeedback(prev => ({ ...prev, [commentId]: false })), 2000);
    } catch (err) {
      alert('Error al editar el comentario');
    }
  };

  const handleDeleteComment = async (eventoId, commentId) => {
    if (!window.confirm('¿Seguro que deseas eliminar este comentario?')) return;
    try {
      await comentarioEventoService.eliminarComentario(eventoId, commentId);
      await cargarComentariosEvento(eventoId);
      setShowDeleteFeedback(prev => ({ ...prev, [commentId]: true }));
      setTimeout(() => setShowDeleteFeedback(prev => ({ ...prev, [commentId]: false })), 2000);
    } catch (err) {
      alert('Error al eliminar el comentario');
    }
  };

  const handleModerateComment = async (eventoId, commentId) => {
    if (!window.confirm('¿Marcar este comentario como inapropiado?')) return;
    try {
      await comentarioEventoService.moderaComentario(eventoId, commentId);
      await cargarComentariosEvento(eventoId);
      setShowModerateFeedback(prev => ({ ...prev, [commentId]: true }));
      setTimeout(() => setShowModerateFeedback(prev => ({ ...prev, [commentId]: false })), 2000);
    } catch (err) {
      alert('Error al moderar el comentario');
    }
  };

  useEffect(() => {
    // Apply dark mode class
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    // Cerrar resultados de búsqueda al hacer clic fuera
    const handleClickOutside = (event) => {
      const searchContainer = event.target.closest('.search-container');
      if (!searchContainer && showSearchResults) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSearchResults]);

  useEffect(() => {
    const loadUserData = () => {
      let userData = null;
      try {
        userData = localStorage.getItem('usuario') ?
          JSON.parse(localStorage.getItem('usuario')) :
          (localStorage.getItem('externalUser') ?
            JSON.parse(localStorage.getItem('externalUser')) : null);
      } catch (e) {
        userData = null;
      }
      if (userData && userData._id) {
        setUser(userData);
        return userData;
      } else {
        navigate('/');
        return null;
      }
    };

    const loadData = async (userData) => {
      try {
        setLoading(true);
        const [cursosResponse, eventosResponse, cabanasResponse, inscripcionesResponse] = await Promise.all([
          externalService.getCursos(),
          externalService.getEventos(),
          externalService.getCabanas(),
          userData && userData._id ? externalService.getMisInscripciones(userData._id) : Promise.resolve({ success: true, data: [] })
        ]);

        const cursosData = Array.isArray(cursosResponse) ? cursosResponse : (cursosResponse.data || []);
        const eventosData = Array.isArray(eventosResponse) ? eventosResponse : (eventosResponse.data || []);
        const cabanasData = Array.isArray(cabanasResponse) ? cabanasResponse : (cabanasResponse.data || []);

        setCursos(cursosData);
        setEventos(eventosData);
        setCabanas(cabanasData);
        setInscripciones(inscripcionesResponse.data || inscripcionesResponse || []);
      } catch (error) {
        console.error('Error loading data:', error);
        setCursos([]);
        setEventos([]);
        setCabanas([]);
        setInscripciones([]);
      } finally {
        setLoading(false);
      }
    };

    const userData = loadUserData();
    if (userData) {
      loadData(userData);
    }
  }, [navigate]);

  useEffect(() => {
    selectedEvents.forEach((evento) => {
      if (isEventoAbiertoAComentarios(evento)) {
        cargarComentariosEvento(evento._id);
      }
    });
    // Opcional: limpiar replyTo y textos de comentario al cambiar de día
    setReplyToByEvento({});
    setCommentTextByEvento({});
    setReplyTextByEvento({});
  }, [calendarDate, selectedEvents]);

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('externalUser');
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleInscribirse = (item, tipo) => {
    setSelectedItem({ ...item, tipo });
    setShowPaymentModal(true);
  };

  const handleReservarCabana = (cabana) => {
    setCabanaSeleccionada(cabana);
    // Si el usuario tiene datos en el perfil, autocompletar
    setReservaForm({
      nombre: user?.nombre || '',
      apellido: user?.apellido || '',
      tipoDocumento: user?.tipoDocumento || '',
      numeroDocumento: user?.numeroDocumento || '',
      correoElectronico: user?.correo || '',
      telefono: user?.telefono || '',
      numeroPersonas: 1,
      propositoEstadia: '',
      solicitudesEspeciales: ''
    });
    setShowReservaModal(true);
    setReservaStatus(null);
  };

  const handleShowDetails = (cabana) => {
    setCabanaSeleccionada(cabana);
    setShowDetailsModal(true);
  };

  // Paso 2: pago y guardar reserva
  const handlePagoReserva = async () => {
    const noches = reservaForm.fechaInicio && reservaForm.fechaFin ?
      (new Date(reservaForm.fechaFin) - new Date(reservaForm.fechaInicio)) / (1000 * 60 * 60 * 24) : 1;
    const precioTotal = reservaForm.cantidadPersonas * noches * 15000;
    setReservaForm(f => ({ ...f, precioTotal }));
    // Aquí iría la integración con la pasarela de pagos real (PSE/ePayco/Wompi)
    // Simulación: esperar 2 segundos y continuar
    setTimeout(async () => {
      try {
        const reservaPayload = {
          ...reservaForm,
          cabana: cabanaSeleccionada._id, // Cambiado a 'cabana'
          estado: 'Pendiente',
          fechaReserva: new Date().toISOString(),
          usuario: user?._id || user?.id || null
        };
        console.log('Reserva enviada:', reservaPayload);
        await reservaService.create(reservaPayload);
        setWizardStep(3);
      } catch (err) {
        console.error('Error al guardar la reserva:', err);
        alert('Error al guardar la reserva');
      }
    }, 2000);
  };



  const isInscrito = (itemId, tipo) => {
    if (!inscripciones || inscripciones.length === 0) {
      return false;
    }

    return inscripciones.some(inscripcion =>
      (tipo === 'curso' && inscripcion.cursoId === itemId) ||
      (tipo === 'evento' && inscripcion.eventoId === itemId)
    );
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', (!darkMode).toString());
  };

  // Shader Background Component
  const ShaderBackground = () => (
    <div className="fixed inset-0 -z-10">
      <div className={`absolute inset-0 transition-all duration-1000 ${darkMode
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900'
        : 'bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600'
        }`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(120,20,120,0.2),transparent_50%)]" />
        <div className="absolute inset-0 animate-pulse-slow">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-gradient" />
        </div>
      </div>
    </div>
  );

  // Card Component
  const Card = ({ children, className = '', onClick }) => (
    <div
      className={`
        backdrop-blur-md bg-black/20 border border-white/20 rounded-xl
        hover:bg-black/30 transition-all duration-200 cursor-pointer
        ${className} dark:bg-black/40 dark:border-white/40
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );

  // Button Component
  const Button = ({ children, variant = 'primary', size = 'md', onClick, disabled, className = '' }) => {
    const variants = {
      primary: 'bg-white text-black hover:bg-white/90 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700',
      secondary: 'bg-white/10 text-white hover:bg-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20',
      ghost: 'text-white hover:bg-white/10 dark:text-white dark:hover:bg-white/20'
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-6 py-2 text-sm',
      lg: 'px-8 py-3 text-base'
    };

    return (
      <button
        className={`
          ${variants[variant]} ${sizes[size]}
          rounded-full font-figtree font-medium transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  };

  // Badge Component
  const Badge = ({ children, variant = 'default' }) => {
    const variants = {
      default: 'bg-blue-500/20 text-blue-400 border-blue-500/30 dark:text-blue-300',
      secondary: 'bg-white/10 text-white/80 dark:text-white',
      success: 'bg-green-500/20 text-green-400 border-green-500/30 dark:text-green-300'
    };

    return (
      <span className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
        ${variants[variant]}
      `}>
        {children}
      </span>
    );
  };

  // Render del wizard de reserva (pasos 2 y 3)
  const renderReservaWizard = () => {
    if (!showReservaModal || !cabanaSeleccionada) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl relative">
          <button type="button" onClick={() => { setShowReservaModal(false); setWizardStep(1); }} className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl">×</button>
          {wizardStep === 1 && (
            <form onSubmit={e => { e.preventDefault(); setWizardStep(2); }}>
              <h2 className="text-xl font-bold mb-4">Datos de la Reserva</h2>
              <div className="mb-2"><b>Cabaña:</b> {cabanaSeleccionada.nombre}</div>
              <div className="mb-2"><b>Precio por persona/noche:</b> ${cabanaSeleccionada.precio?.toLocaleString() || 'No disponible'}</div>
              <input className="border rounded p-2 w-full mb-2" type="text" placeholder="Nombre completo" value={reservaForm.nombre} onChange={e => setReservaForm(f => ({ ...f, nombre: e.target.value }))} required />
              <input className="border rounded p-2 w-full mb-2" type="text" placeholder="Documento" value={reservaForm.documento} onChange={e => setReservaForm(f => ({ ...f, documento: e.target.value }))} required />
              <input className="border rounded p-2 w-full mb-2" type="number" min={1} placeholder="Cantidad de personas" value={reservaForm.cantidadPersonas} onChange={e => setReservaForm(f => ({ ...f, cantidadPersonas: parseInt(e.target.value) }))} required />
              <label className="block mb-2"><input type="checkbox" checked={reservaForm.conNinos} onChange={e => setReservaForm(f => ({ ...f, conNinos: e.target.checked }))} /> ¿Va con niños?</label>
              {reservaForm.conNinos && <input className="border rounded p-2 w-full mb-2" type="text" placeholder="Edades de los niños (separadas por coma)" value={Array.isArray(reservaForm.edadesNinos) ? reservaForm.edadesNinos.join(',') : ''} onChange={e => setReservaForm(f => ({ ...f, edadesNinos: e.target.value.split(',').map(x => x.trim()) }))} />}
              <label className="block mb-2"><input type="checkbox" checked={reservaForm.conBebes} onChange={e => setReservaForm(f => ({ ...f, conBebes: e.target.checked }))} /> ¿Va con bebés?</label>
              {reservaForm.conBebes && <input className="border rounded p-2 w-full mb-2" type="text" placeholder="Edades de los bebés (separadas por coma)" value={Array.isArray(reservaForm.edadesBebes) ? reservaForm.edadesBebes.join(',') : ''} onChange={e => setReservaForm(f => ({ ...f, edadesBebes: e.target.value.split(',').map(x => x.trim()) }))} />}
              <div className="flex gap-2 mb-2">
                <input className="border rounded p-2 w-full" type="date" value={reservaForm.fechaInicio} onChange={e => setReservaForm(f => ({ ...f, fechaInicio: e.target.value }))} required />
                <input className="border rounded p-2 w-full" type="date" value={reservaForm.fechaFin} onChange={e => setReservaForm(f => ({ ...f, fechaFin: e.target.value }))} required />
              </div>
              <button className="w-full bg-orange-500 text-white py-2 rounded font-bold hover:bg-orange-600 transition mt-2 mb-1 text-lg" type="submit">Siguiente: Pago</button>
            </form>
          )}
          {wizardStep === 2 && (
            <div>
              <div className="mb-2">(Simulación de integración con pasarela de pagos real)</div>
              <button className="w-full bg-green-500 text-white py-2 rounded font-bold hover:bg-green-600 transition mt-2 mb-1 text-lg" onClick={handlePagoReserva}>Pagar y Reservar</button>
            </div>
          )}
          {wizardStep === 3 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Estado de la Reserva</h2>
              <div className="mb-4">
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-lg">Pendiente de confirmación por tesorero</span>
              </div>
              <div className="mb-2">Recibirás el certificado cuando el tesorero confirme el pago.</div>
              <button className="w-full bg-gray-500 text-white py-2 rounded font-bold hover:bg-gray-600 transition mt-2 mb-1 text-lg" onClick={() => { setShowReservaModal(false); setWizardStep(1); }}>Cerrar</button>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <ShaderBackground />
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
          <p className="text-white mt-4 font-figtree">Cargando experiencia premium...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-figtree dark:bg-gray-950">
      <ShaderBackground />
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full z-50 transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-80'
        }`}>
        <div className="h-full backdrop-blur-md bg-black/20 border-r border-white/20 flex flex-col dark:bg-black/40 dark:border-white/40">
          {/* Header */}
          <div className="p-6 border-b border-white/20 dark:border-white/40">
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <h2 className="text-xl font-semibold text-white font-figtree dark:text-white">
                  Mi <span className="font-instrument-serif italic text-blue-400 dark:text-blue-300">Portal</span>
                </h2>
              )}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-200 dark:text-white"
              >
                {sidebarCollapsed ? <ChevronRight className="h-5 w-5 dark:text-white" /> : <ChevronLeft className="h-5 w-5 dark:text-white" />}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                    ? 'bg-blue-500/20 text-white border border-blue-500/30 dark:bg-blue-700/30 dark:text-white dark:border-blue-700/40'
                    : 'text-white/80 hover:bg-white/10 hover:text-white dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white'
                    } ${sidebarCollapsed ? 'justify-center' : 'justify-start'}`}
                  onClick={() => setActiveSection(item.id)}
                >
                  <Icon className="h-5 w-5 flex-shrink-0 dark:text-white" />
                  {!sidebarCollapsed && <span className="font-medium dark:text-white">{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-6 border-t border-white/20 dark:border-white/40">
            {user && (
              <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
                <div
                  className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold cursor-pointer dark:bg-blue-700 dark:text-white overflow-hidden"
                  onClick={() => setShowProfilePanel(true)}
                >
                  {user.fotoPerfil ? (
                    <img
                      src={user.fotoPerfil}
                      alt={user.nombre}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'
                  )}
                </div>
                {!sidebarCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate dark:text-white">{user.nombre}</p>
                    <p className="text-white/60 text-sm dark:text-white/60">Externo</p>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="text-white/60 hover:text-white transition-colors dark:text-white/60 dark:hover:text-white"
                >
                  <LogOut className="h-4 w-4 dark:text-white" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Main Content */}
      {/* Wizard de reserva por pasos */}
      {renderReservaWizard()}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-80'}`}>
        {/* Header */}
        <header className="backdrop-blur-md bg-card/20 border-b border-border px-8 py-4 dark:bg-black/40 dark:border-white/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center dark:from-blue-700 dark:to-blue-900">
                <span className="text-white font-bold text-lg dark:text-white">L</span>
              </div>
              <div>
                <h1 className="text-foreground font-bold text-xl dark:text-white">Luckas</h1>
                <p className="text-muted-foreground text-xs dark:text-slate-200">Seminario Bautista de Colombia</p>
              </div>
            </div>

            <div className="flex-1 max-w-md mx-8 search-container">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 dark:text-slate-200" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => console.log('Input focused!')}
                  onBlur={() => console.log('Input blurred!')}
                  onClick={() => console.log('Input clicked!')}
                  placeholder="Buscar cursos, eventos, cabañas..."
                  className="w-full pl-10 pr-10 py-2 bg-card/20 border border-border rounded-lg text-foreground placeholder:text-muted-foreground backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary dark:bg-black/40 dark:border-white/40 dark:text-white dark:placeholder:text-slate-200"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground dark:text-slate-200 dark:hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>

              {/* Resultados de búsqueda */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card/95 backdrop-blur-lg border border-border rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto search-results-scroll search-results-enter dark:bg-black/40 dark:border-white/40">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-semibold text-foreground dark:text-white">
                        Resultados de búsqueda para "<span className="text-primary">{searchQuery}</span>"
                      </h3>
                      <button
                        onClick={clearSearch}
                        className="text-muted-foreground hover:text-foreground transition-colors dark:text-slate-200 dark:hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Cursos encontrados */}
                    {filteredCursos.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide flex items-center gap-1 dark:text-slate-200">
                          <BookOpen className="w-3 h-3 dark:text-slate-200" />
                          Cursos ({filteredCursos.length})
                        </h4>
                        {filteredCursos.map((curso, index) => (
                          <button
                            key={index}
                            onClick={() => goToSearchResult(curso, 'curso')}
                            className="w-full text-left p-3 hover:bg-accent/10 rounded-lg transition-all mb-1 search-result-item dark:hover:bg-slate-700"
                          >
                            <div className="font-medium text-foreground dark:text-white">{curso.nombre}</div>
                            <div className="text-sm text-muted-foreground truncate dark:text-slate-200">
                              {curso.descripcion}
                            </div>
                            <div className="text-xs text-primary mt-1 flex items-center gap-1 dark:text-blue-300">
                              <User className="w-3 h-3 dark:text-blue-300" />
                              {curso.instructor || 'Instructor no especificado'}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Eventos encontrados */}
                    {filteredEventos.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide flex items-center gap-1 dark:text-slate-200">
                          <Calendar className="w-3 h-3 dark:text-slate-200" />
                          Eventos ({filteredEventos.length})
                        </h4>
                        {filteredEventos.map((evento, index) => (
                          <button
                            key={index}
                            onClick={() => goToSearchResult(evento, 'evento')}
                            className="w-full text-left p-3 hover:bg-accent/10 rounded-lg transition-all mb-1 search-result-item dark:hover:bg-slate-700"
                          >
                            <div className="font-medium text-foreground dark:text-white">{evento.nombre}</div>
                            <div className="text-sm text-muted-foreground truncate dark:text-slate-200">
                              {evento.descripcion}
                            </div>
                            <div className="text-xs text-primary mt-1 flex items-center gap-2 dark:text-blue-300">
                              <MapPin className="w-3 h-3 dark:text-blue-300" />
                              {evento.lugar}
                              <Clock className="w-3 h-3 dark:text-blue-300" />
                              {new Date(evento.fecha).toLocaleDateString()}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Cabañas encontradas */}
                    {filteredCabanas.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide flex items-center gap-1 dark:text-slate-200">
                          <Home className="w-3 h-3 dark:text-slate-200" />
                          Cabañas ({filteredCabanas.length})
                        </h4>
                        {filteredCabanas.map((cabana, index) => (
                          <button
                            key={index}
                            onClick={() => goToSearchResult(cabana, 'cabana')}
                            className="w-full text-left p-3 hover:bg-accent/10 rounded-lg transition-all mb-1 search-result-item dark:hover:bg-slate-700"
                          >
                            <div className="font-medium text-foreground dark:text-white">{cabana.nombre}</div>
                            <div className="text-sm text-muted-foreground truncate dark:text-slate-200">
                              {cabana.descripcion}
                            </div>
                            <div className="text-xs text-primary mt-1 flex items-center gap-2 dark:text-blue-300">
                              <MapPin className="w-3 h-3 dark:text-blue-300" />
                              {cabana.ubicacion}
                              {cabana.precio && (
                                <>
                                  <span>•</span>
                                  <span className="font-semibold dark:text-blue-300">
                                    ${cabana.precio?.toLocaleString()}/noche
                                  </span>
                                </>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Sin resultados */}
                    {filteredCursos.length === 0 && filteredEventos.length === 0 && filteredCabanas.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground dark:text-slate-200">
                        <Search className="w-12 h-12 mx-auto mb-3 opacity-50 dark:text-slate-200" />
                        <p className="font-medium mb-1 dark:text-white">No se encontraron resultados para "{searchQuery}"</p>
                        <p className="text-sm dark:text-slate-200">Intenta con otras palabras clave</p>
                        <div className="mt-4 text-xs dark:text-slate-200">
                          <p>Sugerencias:</p>
                          <div className="flex flex-wrap justify-center gap-2 mt-2">
                            <button
                              onClick={() => setSearchQuery('bíblico')}
                              className="px-2 py-1 bg-accent/10 rounded text-primary hover:bg-accent/20 transition-colors dark:bg-slate-700 dark:text-blue-300 dark:hover:bg-slate-600"
                            >
                              bíblico
                            </button>
                            <button
                              onClick={() => setSearchQuery('seminario')}
                              className="px-2 py-1 bg-accent/10 rounded text-primary hover:bg-accent/20 transition-colors dark:bg-slate-700 dark:text-blue-300 dark:hover:bg-slate-600"
                            >
                              seminario
                            </button>
                            <button
                              onClick={() => setSearchQuery('retiro')}
                              className="px-2 py-1 bg-accent/10 rounded text-primary hover:bg-accent/20 transition-colors dark:bg-slate-700 dark:text-blue-300 dark:hover:bg-slate-600"
                            >
                              retiro
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="text-foreground hover:bg-accent/10 p-2 rounded-lg transition-colors dark:text-white dark:hover:bg-slate-700"
              >
                {darkMode ? <Sun className="w-5 h-5 dark:text-white" /> : <Moon className="w-5 h-5 dark:text-white" />}
              </button>
              <button
                className="relative text-foreground hover:bg-accent/10 p-2 rounded-lg transition-colors dark:text-white dark:hover:bg-slate-700"
                onClick={() => setShowNotifications((prev) => !prev)}
              >
                <Bell className="w-5 h-5 dark:text-white" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              {/* Panel de notificaciones */}
              {/* Panel de notificaciones fuera del flujo principal */}


              {/* Panel de notificaciones: SIEMPRE al final del componente para evitar stacking context */}
              {showNotifications && (
                <div className="fixed top-16 right-8 z-[99999] w-80 bg-white dark:bg-gray-900 border-2 border-blue-400 dark:border-blue-600 rounded-xl shadow-2xl p-4 transition-all duration-300 animate-fade-in">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-lg dark:text-black">Notificaciones</span>
                    <button onClick={() => setShowNotifications(false)} className="text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {notifications.length === 0 ? (
                      <div className="text-blue-600 dark:text-blue-300 font-semibold text-center py-4">No tienes notificaciones por ahora.<br />¡Aquí verás avisos importantes de eventos, pagos y novedades!</div>
                    ) : (
                      notifications.map((notif) => (
                        <div key={notif._id} className={`flex items-start gap-2 p-2 rounded-lg ${notif.read ? 'bg-gray-100 dark:bg-gray-800' : 'bg-blue-50 dark:bg-blue-900'}`}>
                          <Bell className="w-5 h-5 text-blue-500 dark:text-blue-300 mt-1" />
                          <div className="flex-1">
                            <div className="font-semibold dark:text-white">{notif.title}</div>
                            <div className="text-sm dark:text-gray-200">{notif.message}</div>
                            <div className="text-xs text-gray-400 dark:text-gray-400">{new Date(notif.createdAt).toLocaleString()}</div>
                          </div>
                          {!notif.read && (
                            <button
                              className="ml-2 text-xs text-blue-600 dark:text-blue-300 hover:underline"
                              onClick={async () => {
                                const usuario = JSON.parse(localStorage.getItem('usuario'));
                                const notificationService = await import('../../services/notificationService');
                                await notificationService.default.markNotificationAsRead(notif._id, usuario.token);
                                setNotifications((prev) => prev.map(n => n._id === notif._id ? { ...n, read: true } : n));
                              }}
                            >Marcar como leída</button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
              <button
                className="text-foreground hover:bg-accent/10 p-2 rounded-lg transition-colors dark:text-white dark:hover:bg-slate-700"
                onClick={() => setShowProfilePanel(true)}
              >
                <User className="w-5 h-5 dark:text-white" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8">
          {activeSection === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-6xl font-bold text-foreground mb-2 dark:text-white">
                  Bienvenido a tu <span className="font-instrument-serif italic text-primary dark:text-blue-300">Dashboard</span>
                </h2>
                <p className="text-muted-foreground text-sm dark:text-slate-200">Gestiona tus inscripciones y reservas desde aquí</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <div className="p-6">
                    <h3 className="text-sm font-medium text-white/80 mb-2 dark:text-slate-200">Programas Academicos Disponibles</h3>
                    <div className="text-3xl font-bold text-white dark:text-white">{cursos.length}</div>
                    <p className="text-xs text-white/60 dark:text-slate-200">Para inscribirse</p>
                  </div>
                </Card>

                <Card>
                  <div className="p-6">
                    <h3 className="text-sm font-medium text-white/80 mb-2 dark:text-slate-200">Eventos Próximos</h3>
                    <div className="text-3xl font-bold text-white dark:text-white">{eventos.length}</div>
                    <p className="text-xs text-white/60 dark:text-slate-200">Este mes</p>
                  </div>
                </Card>

                <Card>
                  <div className="p-6">
                    <h3 className="text-sm font-medium text-white/80 mb-2 dark:text-slate-200">Cabañas Disponibles</h3>
                    <div className="text-3xl font-bold text-white dark:text-white">{cabanas.length}</div>
                    <p className="text-xs text-white/60 dark:text-slate-200">Para reservar</p>
                  </div>
                </Card>
              </div>

              {/* Línea de procesos inscritos */}
              {inscripciones && inscripciones.length > 0 && (
                <div className="mt-10 mb-4 w-full max-w-4xl">
                  <h3 className="text-xl font-bold mb-2 text-yellow-400">Tus Inscripciones Recientes</h3>
                  <div className="flex flex-wrap gap-4 items-center bg-[#23272f] rounded-xl p-4 border border-yellow-300/30 shadow">
                    {inscripciones.map((insc, idx) => (
                      <div key={insc._id || idx} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#fff7e0] text-yellow-900 font-semibold text-sm border border-yellow-200">
                        <span>{insc.cursoId ? 'Curso' : insc.eventoId ? 'Evento' : 'Otro'}:</span>
                        <span>{insc.nombre || insc.titulo || insc.descripcion || insc.cursoId || insc.eventoId}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Calendario de eventos */}
              <div className="mt-8 flex flex-col md:flex-row gap-8 items-start">
                <div className="w-full md:w-[700px] max-w-full md:max-w-[700px] mx-auto md:mx-0 flex flex-col">
                  <h3 className="text-3xl font-bold mb-4 md:mb-8 dark:text-white">Calendario de Eventos</h3>
                  <div className="flex-1 flex flex-col justify-between rounded-3xl p-0 shadow-2xl bg-white/80 dark:bg-gray-900/80 border border-blue-200 dark:border-blue-700 min-h-[600px]">
                    <div className="flex-1 flex flex-col justify-center">
                      <ReactCalendar
                        onChange={(date) => {
                          setCalendarDate(date);
                          setSelectedEvents(getEventsForDate(date));
                        }}
                        value={calendarDate}
                        locale="es-ES"
                        tileClassName={({ date, view }) => {
                          if (getEventsForDate(date).length > 0) {
                            return 'external-calendar-event-day-warm';
                          }
                          return '';
                        }}
                        className="external-calendar w-full h-full text-xl"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex-1 w-full">
                  <h4 className="text-lg font-semibold mb-2 dark:text-white">Eventos para el {calendarDate.toLocaleDateString()}</h4>
                  {selectedEvents.length > 0 ? (
                    <ul className="space-y-6">
                      {selectedEvents.map((evento) => (
                        <li key={evento._id} className={`p-4 bg-white/80 dark:bg-gray-900 rounded-lg shadow border border-blue-200 dark:border-blue-700 ${showCommentSection[evento._id] ? 'flex flex-col md:flex-row gap-6' : ''}`}>
                          {/* Layout de 3 columnas: info, comentarios, comentar */}
                          <div className="flex-1 min-w-[200px] md:pr-4 flex flex-col justify-center">
                            <div className="font-bold text-blue-700 dark:text-blue-300">{evento.nombre}</div>
                            <div className="text-sm text-gray-700 dark:text-slate-200">{evento.descripcion}</div>
                            <div className="text-xs text-gray-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                              <MapPin className="w-3 h-3 dark:text-blue-300" /> {evento.lugar}
                              <Clock className="w-3 h-3 dark:text-blue-300" /> {new Date(evento.fechaEvento || evento.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            {isEventoAbiertoAComentarios(evento) && (
                              <button
                                className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition dark:bg-blue-700 dark:hover:bg-blue-800 w-fit min-w-[180px]"
                                style={{ minWidth: '180px', maxWidth: '220px' }}
                                onClick={() => toggleCommentSection(evento._id)}
                              >
                                {showCommentSection[evento._id] ? 'Ocultar comentarios' : 'Comentar sobre este evento'}
                              </button>
                            )}
                            {!isEventoAbiertoAComentarios(evento) && (
                              <div className="mt-4 text-xs text-gray-500 dark:text-slate-400">La ventana de comentarios aún no está abierta para este evento.</div>
                            )}
                          </div>
                          {showCommentSection[evento._id] && (
                            <div className="flex-1 flex flex-col md:flex-row gap-10 w-full px-2 md:px-6 py-4">
                              {/* Comentarios centrados en el card, con más aire y más largo en X */}
                              <div className="flex-[2.5] flex flex-col justify-center items-center px-2 md:px-6">
                                <div className="w-full max-w-4xl mx-auto">
                                  {loadingComments[evento._id] ? (
                                    <div className="text-gray-500 dark:text-slate-400">Cargando comentarios...</div>
                                  ) : (
                                    <div className="mb-4 max-h-60 overflow-y-auto flex flex-col items-center">
                                      {(commentsByEvento[evento._id]?.length === 0) ? (
                                        <div className="text-gray-500 dark:text-slate-400">Aún no hay comentarios.</div>
                                      ) : (
                                        commentsByEvento[evento._id]
                                          ?.slice(0, (commentPageByEvento[evento._id] || 1) * COMMENTS_PER_PAGE)
                                          .sort((a, b) => {
                                            if (commentOrderBy[evento._id] === 'relevantes') {
                                              return (b.likes?.length || 0) - (a.likes?.length || 0);
                                            } else {
                                              return new Date(b.createdAt) - new Date(a.createdAt);
                                            }
                                          })
                                          .map((comment) => (
                                            <div key={comment._id} className="mb-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 w-full max-w-5xl min-w-[340px]">
                                              <div className="flex items-center gap-2 mb-1">
                                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold dark:bg-blue-700">
                                                  {(comment.user?.nombre || comment.nombreUsuario || 'U')[0].toUpperCase()}
                                                </div>
                                                <span className="font-semibold text-gray-800 dark:text-white">{comment.user?.nombre || comment.nombreUsuario || 'Usuario'}</span>
                                                <span className="text-xs text-gray-500 dark:text-slate-400 ml-2">{new Date(comment.createdAt).toLocaleString()}</span>
                                                {(comment.user?._id === user?._id || comment.nombreUsuario === user?.nombre) && (
                                                  <>
                                                    <button
                                                      className="ml-2 text-xs text-yellow-600 hover:underline dark:text-yellow-400"
                                                      onClick={() => setEditingCommentId(comment._id)}
                                                    >Editar</button>
                                                    <button
                                                      className="ml-2 text-xs text-red-600 hover:underline dark:text-red-400"
                                                      onClick={() => handleDeleteComment(evento._id, comment._id)}
                                                    >Eliminar</button>
                                                  </>
                                                )}
                                                {user?.rol === 'admin' && (
                                                  <button
                                                    className="ml-2 text-xs text-red-600 hover:underline dark:text-red-400"
                                                    onClick={() => handleModerateComment(evento._id, comment._id)}
                                                  >Marcar como inapropiado</button>
                                                )}
                                              </div>
                                              {editingCommentId === comment._id ? (
                                                <form onSubmit={e => handleEditCommentSubmit(e, evento._id, comment._id)} className="flex gap-2 mt-1">
                                                  <input type="text" value={editCommentText} onChange={e => setEditCommentText(e.target.value)} className="input-respuesta flex-1" required autoFocus />
                                                  <button type="submit" className="bg-blue-500 text-white px-2 py-1 rounded">Guardar</button>
                                                  <button type="button" className="bg-gray-300 text-black px-2 py-1 rounded" onClick={() => setEditingCommentId(null)}>Cancelar</button>
                                                </form>
                                              ) : (
                                                <div className="text-gray-800 dark:text-white mb-2 whitespace-pre-line">{comment.texto}</div>
                                              )}
                                              {/* Feedback visual tras editar/eliminar/moderar */}
                                              {showEditFeedback[comment._id] && (
                                                <div className="text-green-600 dark:text-green-400 text-xs mb-1">¡Comentario actualizado!</div>
                                              )}
                                              {showDeleteFeedback[comment._id] && (
                                                <div className="text-red-600 dark:text-red-400 text-xs mb-1">Comentario eliminado.</div>
                                              )}
                                              {showModerateFeedback[comment._id] && (
                                                <div className="text-yellow-600 dark:text-yellow-400 text-xs mb-1">Comentario marcado como inapropiado.</div>
                                              )}
                                              <div className="flex items-center gap-3 text-xs">
                                                <button
                                                  className={`flex items-center gap-1 ${comment.likes?.includes(user?._id) ? 'text-blue-600 dark:text-blue-300 font-bold' : 'text-gray-600 dark:text-slate-300'}`}
                                                  onClick={() => handleLike(evento._id, comment._id)}
                                                >
                                                  👍 {comment.likes?.length || 0}
                                                </button>
                                                <button
                                                  className={`flex items-center gap-1 ${comment.dislikes?.includes(user?._id) ? 'text-red-600 dark:text-red-300 font-bold' : 'text-gray-600 dark:text-slate-300'}`}
                                                  onClick={() => handleDislike(evento._id, comment._id)}
                                                >
                                                  👎 {comment.dislikes?.length || 0}
                                                </button>
                                                <button
                                                  className="text-blue-600 hover:underline dark:text-blue-300"
                                                  onClick={() => setReplyToByEvento(prev => ({ ...prev, [evento._id]: comment._id }))}
                                                >
                                                  Responder
                                                </button>
                                              </div>
                                              {/* Respuestas */}
                                              {comment.respuestas && comment.respuestas.length > 0 && (
                                                <div className="ml-8 mt-2 space-y-2">
                                                  {comment.respuestas.map((resp) => (
                                                    <div key={resp._id} className="p-2 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                                                      <div className="flex items-center gap-2 mb-1">
                                                        <div className="w-6 h-6 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold dark:bg-blue-800">
                                                          {(resp.user?.nombre || resp.nombreUsuario || 'U')[0].toUpperCase()}
                                                        </div>
                                                        <span className="font-semibold text-gray-700 dark:text-white text-xs">{resp.user?.nombre || resp.nombreUsuario || 'Usuario'}</span>
                                                        <span className="text-xs text-gray-400 dark:text-slate-400 ml-2">{new Date(resp.createdAt).toLocaleString()}</span>
                                                      </div>
                                                      <div className="text-gray-700 dark:text-white text-xs">{resp.texto}</div>
                                                    </div>
                                                  ))}
                                                </div>
                                              )}
                                              {/* Responder */}
                                              {replyToByEvento[evento._id] === comment._id && (
                                                <form onSubmit={e => handleReplySubmit(e, evento._id, comment._id)} className="flex gap-2 mt-2 ml-8">
                                                  <input type="text" value={replyTextByEvento[evento._id] || ''} onChange={e => setReplyTextByEvento(prev => ({ ...prev, [evento._id]: e.target.value }))} className="input-respuesta flex-1" placeholder="Escribe una respuesta..." required />
                                                  <button type="submit" className="bg-yellow-400 text-black px-2 py-1 rounded font-bold">Responder</button>
                                                  <button type="button" className="bg-gray-300 text-black px-2 py-1 rounded" onClick={() => setReplyToByEvento(prev => ({ ...prev, [evento._id]: null }))}>Cancelar</button>
                                                </form>
                                              )}
                                            </div>
                                          ))
                                      )}
                                      {/* Paginación */}
                                      {commentsByEvento[evento._id]?.length > commentPageByEvento[evento._id] * COMMENTS_PER_PAGE && (
                                        <button
                                          className="mt-2 text-blue-600 hover:underline dark:text-blue-300"
                                          onClick={() => setCommentPageByEvento(prev => ({ ...prev, [evento._id]: (prev[evento._id] || 1) + 1 }))}
                                        >
                                          Ver más comentarios
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                              {/* Columna derecha: título, input y botón */}
                              <div className="w-full md:w-96 flex flex-col items-end justify-start gap-4 pr-2 md:pr-6">
                                <div className="flex items-center gap-2 mb-2">
                                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Comentarios</h2>
                                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs dark:bg-blue-900 dark:text-blue-200">
                                    {commentsByEvento[evento._id]?.length || 0}
                                  </span>
                                </div>
                                <div className="flex gap-2 mb-2">
                                  <button
                                    className={`text-xs px-2 py-1 rounded ${commentOrderBy[evento._id] === 'recientes' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white'}`}
                                    onClick={() => setCommentOrderBy(prev => ({ ...prev, [evento._id]: 'recientes' }))}
                                  >
                                    Más recientes
                                  </button>
                                  <button
                                    className={`text-xs px-2 py-1 rounded ${commentOrderBy[evento._id] === 'relevantes' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white'}`}
                                    onClick={() => setCommentOrderBy(prev => ({ ...prev, [evento._id]: 'relevantes' }))}
                                  >
                                    Más relevantes
                                  </button>
                                </div>
                                <form onSubmit={e => handleCommentSubmit(e, evento._id)} className="flex flex-row gap-2 w-full items-center">
                                  <textarea
                                    value={commentTextByEvento[evento._id] || ''}
                                    onChange={e => setCommentTextByEvento(prev => ({ ...prev, [evento._id]: e.target.value }))}
                                    className="flex-1 border-2 border-blue-400 bg-white text-black px-3 py-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none min-h-[44px]"
                                    placeholder="Escribe un comentario..."
                                    required
                                    disabled={false}
                                    rows={2}
                                    style={{ marginRight: 0 }}
                                  />
                                  <button type="submit" className="bg-yellow-400 text-black px-4 py-2 rounded font-bold w-fit h-[44px] align-middle">Comentar</button>
                                </form>
                                {/* Notificaciones y feedback visual */}
                                {showReplyNotification[evento._id] && (
                                  <div className="text-green-600 dark:text-green-400 text-xs mb-2">¡Respuesta enviada!</div>
                                )}
                                {/* Eliminado: showCommentFeedback, ya no existe el estado */}
                              </div>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-500 dark:text-slate-400 mb-4">No hay eventos para este día.</div>
                  )}
                </div>
              </div>

            </div>
          )}

          {activeSection === 'courses' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-5xl font-bold text-foreground mb-2 dark:text-white">
                  Programas Académicos <span className="font-instrument-serif italic text-primary dark:text-blue-300">Disponibles</span>
                </h2>
                <p className="text-muted-foreground text-sm dark:text-slate-200">Encuentra el programa académico perfecto para tu desarrollo espiritual</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cursos.map((curso) => {
                  const inscrito = isInscrito(curso._id, 'curso');
                  return (
                    <Card key={curso._id}>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <Badge variant={inscrito ? 'success' : 'default'}>
                            {inscrito ? 'Inscrito' : 'Disponible'}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 dark:fill-yellow-300 dark:text-yellow-300" />
                            <span className="text-sm text-white/60 dark:text-slate-200">4.8</span>
                          </div>
                        </div>
                        <h3 className="text-white font-semibold text-lg mb-2 dark:text-white">{curso.nombre}</h3>
                        <p className="text-white/60 text-sm mb-4 dark:text-slate-200">{curso.descripcion}</p>

                        <div className="flex justify-between text-sm text-white/60 mb-4 dark:text-slate-200">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 dark:text-slate-200" />
                            {typeof curso.duracion === 'object'
                              ? `${curso.duracion.semanas} semanas`
                              : curso.duracion
                            }
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 dark:text-slate-200" />
                            {curso.cuposDisponibles} cupos
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-primary dark:text-blue-300">
                            ${curso.costo?.toLocaleString()}
                          </span>
                          <Button
                            variant={inscrito ? 'secondary' : 'primary'}
                            onClick={() => !inscrito && handleInscribirse(curso, 'curso')}
                            disabled={inscrito}
                          >
                            {inscrito ? 'Inscrito' : 'Inscribirse'}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {activeSection === 'events' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-5xl font-bold text-foreground mb-2 dark:text-white">
                  Próximos <span className="font-instrument-serif italic text-primary dark:text-blue-300">Eventos</span>
                </h2>
                <p className="text-muted-foreground text-sm dark:text-slate-200">Únete a nuestros eventos y conferencias</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {eventos.map((evento) => (
                  <Card key={evento._id}>
                    <div className="p-6">
                      <Badge className="mb-3">Próximamente</Badge>
                      <h3 className="text-white font-semibold text-lg mb-2 dark:text-white">{evento.nombre}</h3>
                      <p className="text-white/60 text-sm mb-4 dark:text-slate-200">{evento.descripcion}</p>

                      <div className="space-y-2 text-sm text-white/60 mb-4 dark:text-slate-200">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 dark:text-slate-200" />
                          {new Date(evento.fechaEvento).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 dark:text-slate-200" />
                          {evento.lugar}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-primary dark:text-blue-300">
                          ${evento.precio?.toLocaleString()}
                        </span>
                        <Button onClick={() => handleInscribirse(evento, 'evento')}>
                          Registrarse
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'cabins' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-5xl font-bold text-foreground mb-2 dark:text-white">
                  Reserva tu <span className="font-instrument-serif italic text-primary dark:text-blue-300">Cabaña</span>
                </h2>
                <p className="text-muted-foreground text-sm dark:text-slate-200">Escápate a la naturaleza en nuestras cabañas</p>
              </div>

              <div className="flex flex-row gap-8 flex-wrap">
                {cabanas.map((cabana) => (
                  <div
                    key={cabana._id}
                    className="relative flex flex-col justify-between bg-black/80 border border-white/30 rounded-2xl shadow-lg min-w-[340px] max-w-[420px] w-full transition-all duration-200 hover:bg-black/90 dark:bg-black/90 dark:border-white/40 p-5"
                  >
                    {/* Imagen principal de la cabaña con overlay */}
                    <div className="w-full h-44 rounded-2xl overflow-hidden mb-5 relative">
                      <img
                        src={Array.isArray(cabana.imagen) && cabana.imagen.length > 0 ? cabana.imagen[0] : (cabana.foto || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80')}
                        alt={cabana.nombre}
                        className="w-full h-full object-cover"
                      />
                      {/* Overlay oscuro para mejorar contraste */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                      {/* Nombre sobre la imagen */}
                      <div className="absolute left-6 bottom-4 text-xl font-bold text-white drop-shadow-lg">
                        {cabana.nombre}
                      </div>
                    </div>
                    {/* Etiquetas y rating fuera de la imagen */}
                    <div className="flex justify-between items-center mb-4 px-1">
                      <div className="flex gap-3 items-center">
                        <span className="px-4 py-1 rounded-full bg-green-600 text-white text-xs font-bold shadow">Disponible</span>
                        <span className="px-3 py-1 rounded-full bg-blue-900 text-white text-xs font-bold shadow">
                          +{Array.isArray(cabana.imagen) ? cabana.imagen.length : 0} fotos
                        </span>
                      </div>
                      <div className="flex gap-3 items-center">
                        <span className="flex items-center gap-2 text-yellow-400 font-bold text-base">
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" /> 4.2
                        </span>
                        <button
                          className={`ml-2 text-xl transition ${favoritos.includes(cabana._id) ? 'text-red-500' : 'text-white/60 hover:text-red-500'}`}
                          title={favoritos.includes(cabana._id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                          onClick={() => handleToggleFavorito(cabana._id)}
                        >
                          ♥
                        </button>
                      </div>
                    </div>
                    {/* Info principal */}
                    <div className="mb-7 px-1">
                      <p className="text-white/80 text-base mb-4 dark:text-slate-200">{cabana.descripcion}</p>
                      <div className="flex flex-wrap gap-6 text-white/70 text-sm mb-4">
                        <span className="flex items-center gap-2"><Users className="h-5 w-5" /> {cabana.capacidad} personas</span>
                        <span className="flex items-center gap-2"><span className="font-bold">3</span> habitaciones</span>
                        <span className="flex items-center gap-2"><span className="font-bold">2</span> baños</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                        <MapPin className="h-5 w-5" /> {cabana.ubicacion || 'Sector Norte'}
                      </div>
                    </div>
                    {/* Precio y acciones */}
                    <div className="flex items-center justify-between mt-6 px-1 pb-2">
                      <span className="text-2xl font-bold text-green-400 dark:text-green-300">
                        ${cabana.precio?.toLocaleString() || '0'} / noche
                      </span>
                      <div className="flex gap-3">
                        <Button
                          variant="secondary"
                          className="!bg-white !text-black !rounded-lg !px-5 !py-2 !font-bold !shadow"
                          onClick={() => handleShowDetails(cabana)}
                        >
                          Ver Detalles
                        </Button>
                        <Button
                          variant="primary"
                          className="!bg-green-500 !text-white !rounded-lg !px-5 !py-2 !font-bold !shadow"
                          onClick={() => handleReservarCabana(cabana)}
                        >
                          Reservar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Modal de detalles de cabaña */}
              {showDetailsModal && cabanaSeleccionada && (
                <CabanaDetailsModal
                  cabana={cabanaSeleccionada}
                  onClose={() => setShowDetailsModal(false)}
                  onReservar={() => {
                    setShowDetailsModal(false);
                    handleReservarCabana(cabanaSeleccionada);
                  }}
                />
              )}
            </div>
          )}
        </main>
      </div>

      {/* Wizard de reserva por pasos */}
      {renderReservaWizard()}

      {/* Notifications */}
      {reservaStatus && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 dark:bg-green-700">
            <CheckCircle className="h-5 w-5 dark:text-white" />
            {reservaStatus}
            <button
              onClick={() => setReservaStatus(null)}
              className="ml-2 text-white/80 hover:text-white dark:text-white/60 dark:hover:text-white"
            >
              <X className="h-4 w-4 dark:text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {showPaymentModal && selectedItem && (
        <PaymentModal
          item={selectedItem}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setShowPaymentModal(false);
            setShowSeminaristaForm(true);
          }}
        />
      )}

      {showSeminaristaForm && selectedItem && (
        <SeminaristaForm
          item={selectedItem}
          onClose={() => setShowSeminaristaForm(false)}
          onSuccess={() => setShowSeminaristaForm(false)}
        />
      )}

      {showProfilePanel && (
        <ProfilePanel
          isOpen={showProfilePanel}
          currentUser={user}
          onClose={() => setShowProfilePanel(false)}
          onUserUpdate={(updatedUser) => {
            setUser(updatedUser);
            localStorage.setItem('usuario', JSON.stringify(updatedUser));
          }}
        />
      )}

    </div>
  );
}
export default TailwindExternalDashboard;
