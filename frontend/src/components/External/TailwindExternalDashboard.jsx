import React, { useState, useEffect } from 'react';
import cabanaService from '../../services/cabanaService';
import eventService from '../../services/eventService';
//import cursosService from '../../services/courseService';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  Home,
  User,
  HelpCircle,
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

const TailwindExternalDashboard = () => {
  const [user, setUser] = useState(null);
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
  const [reservaForm, setReservaForm] = useState({
    nombre: '',
    apellido: '',
    tipoDocumento: '',
    numeroDocumento: '',
    correoElectronico: '',
    telefono: '',
    numeroPersonas: 1,
    propositoEstadia: '',
    solicitudesEspeciales: ''
  });
  const [cabanaSeleccionada, setCabanaSeleccionada] = useState(null);

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
  const [showCommentFeedback, setShowCommentFeedback] = useState({});
  const [showEditFeedback, setShowEditFeedback] = useState({});
  const [showDeleteFeedback, setShowDeleteFeedback] = useState({});
  const [showModerateFeedback, setShowModerateFeedback] = useState({});

  const COMMENTS_PER_PAGE = 5;

  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'Inicio', icon: Home },
    { id: 'courses', label: 'Cursos Bíblicos', icon: BookOpen },
    { id: 'events', label: 'Eventos', icon: Calendar },
    { id: 'cabins', label: 'Cabañas', icon: Home },
    { id: 'profile', label: 'Mi Perfil', icon: User },
    { id: 'support', label: 'Ayuda', icon: HelpCircle },
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
    const filteredC = cursos.filter(curso =>
      (curso.nombre?.toLowerCase().includes(queryLower) ||
        curso.descripcion?.toLowerCase().includes(queryLower) ||
        curso.instructor?.toLowerCase().includes(queryLower))
    );
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
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      setShowSearchResults(true);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowSearchResults(false);
    setFilteredCursos([]);
    setFilteredEventos([]);
    setFilteredCabanas([]);
  };

  const goToSearchResult = (item, type) => {
    switch (type) {
      case 'curso':
        setActiveSection('courses');
        setSelectedItem(item);
        break;
      case 'evento':
        setActiveSection('events');
        setSelectedItem(item);
        break;
      case 'cabana':
        setActiveSection('cabins');
        setSelectedItem(item);
        break;
      default:
        break;
    }
    clearSearch();
  };

  const getEventsForDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    return eventos.filter(evento => {
      const eventoDate = new Date(evento.fechaEvento || evento.fecha);
      return (
        eventoDate.getDate() === day &&
        eventoDate.getMonth() === month &&
        eventoDate.getFullYear() === year
      );
    });
  };

  // La ventana de comentarios está siempre abierta para pruebas
  const isEventoAbiertoAComentarios = (evento) => true;

  const cargarComentariosEvento = async (eventoId) => {
    setLoadingComments((prev) => ({ ...prev, [eventoId]: true }));
    try {
      const res = await comentarioEventoService.getComentarios(eventoId);
      if (res.success) {
        setCommentsByEvento((prev) => ({ ...prev, [eventoId]: res.comentarios }));
      } else {
        setCommentsByEvento((prev) => ({ ...prev, [eventoId]: [] }));
      }
    } catch {
      setCommentsByEvento((prev) => ({ ...prev, [eventoId]: [] }));
    } finally {
      setLoadingComments((prev) => ({ ...prev, [eventoId]: false }));
    }
  };

  const toggleCommentSection = (eventoId) => {
    setShowCommentSection((prev) => ({ ...prev, [eventoId]: !prev[eventoId] }));
    if (!showCommentSection[eventoId]) {
      cargarComentariosEvento(eventoId);
    }
  };

  const handleCommentSubmit = async (e, eventoId) => {
    e.preventDefault();
    if (!commentTextByEvento[eventoId]) return;
    try {
      await comentarioEventoService.crearComentario(eventoId, commentTextByEvento[eventoId]);
      setCommentTextByEvento((prev) => ({ ...prev, [eventoId]: '' }));
      setShowCommentFeedback((prev) => ({ ...prev, [eventoId]: true }));
      setTimeout(() => setShowCommentFeedback((prev) => ({ ...prev, [eventoId]: false })), 3000);
      cargarComentariosEvento(eventoId);
    } catch {}
  };

  const handleLike = async (eventoId, comentarioId) => {
    try {
      await comentarioEventoService.likeComentario(comentarioId);
      cargarComentariosEvento(eventoId);
    } catch {}
  };

  const handleDislike = async (eventoId, comentarioId) => {
    try {
      await comentarioEventoService.dislikeComentario(comentarioId);
      cargarComentariosEvento(eventoId);
    } catch {}
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
    } catch {}
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

  const handleReservaFormChange = (e) => {
    const { name, value } = e.target;
    setReservaForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleReservaSubmit = async (e) => {
    e.preventDefault();
    setReservaStatus(null);
    try {
      const reserva = {
        cabana: cabanaSeleccionada._id,
        usuario: user?._id,
        fechaInicio: new Date(),
        fechaFin: new Date(Date.now() + 86400000),
        ...reservaForm
      };
      const response = await reservaService.create(reserva);
      if (response.success) {
        setReservaStatus('Reserva realizada con éxito');
        setShowReservaModal(false);
      } else {
        setReservaStatus('No se pudo realizar la reserva');
      }
    } catch (error) {
      setReservaStatus('Error al reservar la cabaña');
    }
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
                  className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold cursor-pointer dark:bg-blue-700 dark:text-white"
                  onClick={() => setShowProfilePanel(true)}
                >
                  {user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
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
              <button className="text-foreground hover:bg-accent/10 p-2 rounded-lg transition-colors dark:text-white dark:hover:bg-slate-700">
                <Bell className="w-5 h-5 dark:text-white" />
              </button>
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
                    <h3 className="text-sm font-medium text-white/80 mb-2 dark:text-slate-200">Cursos Disponibles</h3>
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
                        <li key={evento._id} className="p-4 bg-white/80 dark:bg-gray-900 rounded-lg shadow border border-blue-200 dark:border-blue-700">
                          <div className="font-bold text-blue-700 dark:text-blue-300">{evento.nombre}</div>
                          <div className="text-sm text-gray-700 dark:text-slate-200">{evento.descripcion}</div>
                          <div className="text-xs text-gray-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                            <MapPin className="w-3 h-3 dark:text-blue-300" /> {evento.lugar}
                            <Clock className="w-3 h-3 dark:text-blue-300" /> {new Date(evento.fechaEvento || evento.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          {/* Botón comentar solo si el evento está abierto a comentarios */}
                          {isEventoAbiertoAComentarios(evento) && (
                            <button
                              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition dark:bg-blue-700 dark:hover:bg-blue-800"
                              onClick={() => toggleCommentSection(evento._id)}
                            >
                              {showCommentSection[evento._id] ? 'Ocultar comentarios' : 'Comentar sobre este evento'}
                            </button>
                          )}
                          {/* Si la ventana de comentarios está cerrada, mostrar mensaje */}
                          {!isEventoAbiertoAComentarios(evento) && (
                            <div className="mt-4 text-xs text-gray-500 dark:text-slate-400">La ventana de comentarios aún no está abierta para este evento.</div>
                          )}
                          {/* Sección de comentarios */}
                          {showCommentSection[evento._id] && (
                            <div className="mt-6 w-full max-w-2xl">
                              <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                  Comentarios
                                  <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs dark:bg-blue-900 dark:text-blue-200">
                                    {commentsByEvento[evento._id]?.length || 0}
                                  </span>
                                </h2>
                                <div className="flex gap-2">
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
                              </div>
                              {loadingComments[evento._id] ? (
                                <div className="text-gray-500 dark:text-slate-400">Cargando comentarios...</div>
                              ) : (
                                <div className="mb-4 max-h-60 overflow-y-auto">
                                  {(commentsByEvento[evento._id]?.length === 0) ? (
                                    <div className="text-gray-500 dark:text-slate-400">Aún no hay comentarios.</div>
                                  ) : (
                                    commentsByEvento[evento._id]
                                      ?.slice(0, commentPageByEvento[evento._id] * COMMENTS_PER_PAGE)
                                      .sort((a, b) => {
                                        if (commentOrderBy[evento._id] === 'relevantes') {
                                          return (b.likes?.length || 0) - (a.likes?.length || 0);
                                        } else {
                                          return new Date(b.createdAt) - new Date(a.createdAt);
                                        }
                                      })
                                      .map((comment) => (
                                        <div key={comment._id} className="mb-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                          <div className="flex items-center gap-2 mb-1">
                                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold dark:bg-blue-700">
                                              {comment.user?.nombre ? comment.user.nombre.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                            <span className="font-semibold text-gray-800 dark:text-white">{comment.user?.nombre || 'Usuario'}</span>
                                            <span className="text-xs text-gray-500 dark:text-slate-400 ml-2">{new Date(comment.createdAt).toLocaleString()}</span>
                                            {comment.user?._id === user?._id && (
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
                                                      {resp.user?.nombre ? resp.user.nombre.charAt(0).toUpperCase() : 'U'}
                                                    </div>
                                                    <span className="font-semibold text-gray-700 dark:text-white text-xs">{resp.user?.nombre || 'Usuario'}</span>
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
                              {/* Indicador de ventana de comentarios */}
                              {!isEventoAbiertoAComentarios(evento) && (
                                <div className="text-xs text-gray-500 dark:text-slate-400 mb-2">La ventana de comentarios aún no está abierta para este evento.</div>
                              )}
                              {/* Notificación visual al responder */}
                              {showReplyNotification[evento._id] && (
                                <div className="text-green-600 dark:text-green-400 text-xs mb-2">¡Respuesta enviada!</div>
                              )}
                              {/* Feedback visual tras comentar/like/dislike */}
                              {showCommentFeedback[evento._id] && (
                                <div className="text-green-600 dark:text-green-400 text-xs mb-2">¡Comentario enviado!</div>
                              )}
                              <form onSubmit={e => handleCommentSubmit(e, evento._id)} className="flex gap-2 mt-2">
                                <input type="text" value={commentTextByEvento[evento._id] || ''} onChange={e => setCommentTextByEvento(prev => ({ ...prev, [evento._id]: e.target.value }))} className="input-respuesta flex-1" placeholder="Escribe un comentario..." required disabled={!isEventoAbiertoAComentarios(evento)} />
                                <button type="submit" className="bg-yellow-400 text-black px-3 py-1 rounded font-bold" disabled={!isEventoAbiertoAComentarios(evento)}>Comentar</button>
                              </form>
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
                  Cursos <span className="font-instrument-serif italic text-primary dark:text-blue-300">Disponibles</span>
                </h2>
                <p className="text-muted-foreground text-sm dark:text-slate-200">Encuentra el curso perfecto para tu desarrollo espiritual</p>
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cabanas.map((cabana) => (
                  <Card key={cabana._id}>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <Badge variant="success">Disponible</Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 dark:fill-yellow-300 dark:text-yellow-300" />
                          <span className="text-sm text-white/60 dark:text-slate-200">4.9</span>
                        </div>
                      </div>
                      <h3 className="text-white font-semibold text-lg mb-2 dark:text-white">{cabana.nombre}</h3>
                      <p className="text-white/60 text-sm mb-4 dark:text-slate-200">{cabana.descripcion}</p>

                      <div className="flex items-center gap-2 text-sm text-white/60 mb-4 dark:text-slate-200">
                        <Users className="h-4 w-4 dark:text-slate-200" />
                        {cabana.capacidad} personas
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-primary dark:text-blue-300">
                          ${cabana.precio?.toLocaleString()}/noche
                        </span>
                        <Button onClick={() => handleReservarCabana(cabana)}>
                          Reservar
                        </Button>
                        {/* Modal de reserva de cabaña */}
                        {showReservaModal && cabanaSeleccionada && (
                          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                            <form onSubmit={handleReservaSubmit} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative dark:bg-gray-800">
                              <button type="button" onClick={() => setShowReservaModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-black dark:text-gray-300 dark:hover:text-white"><X /></button>
                              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Reserva de Cabaña</h2>
                              <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
                                <input name="nombre" value={reservaForm.nombre} onChange={handleReservaFormChange} required className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white" />
                              </div>
                              <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Apellido</label>
                                <input name="apellido" value={reservaForm.apellido} onChange={handleReservaFormChange} required className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white" />
                              </div>
                              <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Documento</label>
                                <select name="tipoDocumento" value={reservaForm.tipoDocumento} onChange={handleReservaFormChange} required className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white">
                                  <option value="">Seleccione...</option>
                                  <option value="Cédula de ciudadanía">Cédula de ciudadanía</option>
                                  <option value="Cédula de extranjería">Cédula de extranjería</option>
                                  <option value="Pasaporte">Pasaporte</option>
                                  <option value="Tarjeta de identidad">Tarjeta de identidad</option>
                                </select>
                              </div>
                              <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Número de Documento</label>
                                <input name="numeroDocumento" value={reservaForm.numeroDocumento} onChange={handleReservaFormChange} required className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white" />
                              </div>
                              <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Correo Electrónico</label>
                                <input name="correoElectronico" type="email" value={reservaForm.correoElectronico} onChange={handleReservaFormChange} required className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white" />
                              </div>
                              <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Teléfono</label>
                                <input name="telefono" value={reservaForm.telefono} onChange={handleReservaFormChange} required className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white" />
                              </div>
                              <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Número de Personas</label>
                                <input name="numeroPersonas" type="number" min="1" value={reservaForm.numeroPersonas} onChange={handleReservaFormChange} required className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white" />
                              </div>
                              <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Propósito de la estadía (opcional)</label>
                                <input name="propositoEstadia" value={reservaForm.propositoEstadia} onChange={handleReservaFormChange} className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white" />
                              </div>
                              <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Solicitudes Especiales (opcional)</label>
                                <input name="solicitudesEspeciales" value={reservaForm.solicitudesEspeciales} onChange={handleReservaFormChange} className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white" />
                              </div>
                              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition dark:bg-blue-700 dark:hover:bg-blue-800">Confirmar Reserva</button>
                            </form>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

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
};

export default TailwindExternalDashboard;
