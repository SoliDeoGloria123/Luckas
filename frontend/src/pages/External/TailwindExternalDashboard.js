import React, { useState, useEffect } from 'react';
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
import PaymentModal from '../../components/External/PaymentModal';
import SeminaristaForm from '../../components/External/SeminaristaForm';
import ProfilePanel from '../../components/External/ProfilePanel';
import { reservaService } from '../../services/reservaService';
import '../../styles/globals.css';
import '../../styles/search.css';

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
  
  // Estados para el buscador
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCursos, setFilteredCursos] = useState([]);
  const [filteredEventos, setFilteredEventos] = useState([]);
  const [filteredCabanas, setFilteredCabanas] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
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
    console.log('Search query:', query);
    console.log('Datos disponibles:', { cursos: cursos.length, eventos: eventos.length, cabanas: cabanas.length });
    
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setShowSearchResults(false);
      return;
    }
    
    // Filtrar resultados de búsqueda con verificación de datos
    const queryLower = query.toLowerCase();
    
    // Verificar que los arrays existen y tienen datos
    console.log('Cursos data sample:', cursos.slice(0, 2));
    console.log('Eventos data sample:', eventos.slice(0, 2));
    console.log('Cabanas data sample:', cabanas.slice(0, 2));
    
    const filteredC = cursos.filter(curso => {
      const match = curso.nombre?.toLowerCase().includes(queryLower) ||
                   curso.descripcion?.toLowerCase().includes(queryLower) ||
                   curso.instructor?.toLowerCase().includes(queryLower);
      if (match) console.log('Curso match found:', curso.nombre);
      return match;
    });
    
    const filteredE = eventos.filter(evento => {
      const match = evento.nombre?.toLowerCase().includes(queryLower) ||
                   evento.descripcion?.toLowerCase().includes(queryLower) ||
                   evento.lugar?.toLowerCase().includes(queryLower);
      if (match) console.log('Evento match found:', evento.nombre);
      return match;
    });
    
    const filteredCab = cabanas.filter(cabana => {
      const match = cabana.nombre?.toLowerCase().includes(queryLower) ||
                   cabana.descripcion?.toLowerCase().includes(queryLower) ||
                   cabana.ubicacion?.toLowerCase().includes(queryLower);
      if (match) console.log('Cabana match found:', cabana.nombre);
      return match;
    });
    
    console.log('Resultados filtrados:', { 
      cursos: filteredC.length, 
      eventos: filteredE.length, 
      cabanas: filteredCab.length 
    });
    
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
    switch(type) {
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
        navigate('/external/login');
        return null;
      }
    };

    const loadData = async (userData) => {
      try {
        setLoading(true);
        const [cursosResponse, eventosResponse, cabanasResponse, inscripcionesResponse] = await Promise.all([
          externalService.getCursos(),
          externalService.getEventos(),
          fetch('http://localhost:3001/api/cabanas/publicas').then(res => res.json()),
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

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('externalUser');
    localStorage.removeItem('token');
    navigate('/external/login');
  };

  const handleInscribirse = (item, tipo) => {
    setSelectedItem({ ...item, tipo });
    setShowPaymentModal(true);
  };

  const handleReservarCabana = async (cabana) => {
    setReservaStatus(null);
    try {
      const reserva = {
        cabana: cabana._id,
        usuario: user?._id,
        fechaInicio: new Date(),
        fechaFin: new Date(Date.now() + 86400000),
      };
      const response = await reservaService.create(reserva);
      if (response.success) {
        setReservaStatus('Reserva realizada con éxito');
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
      <div className={`absolute inset-0 transition-all duration-1000 ${
        darkMode 
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
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );

  // Button Component
  const Button = ({ children, variant = 'primary', size = 'md', onClick, disabled, className = '' }) => {
    const variants = {
      primary: 'bg-white text-black hover:bg-white/90',
      secondary: 'bg-white/10 text-white hover:bg-white/20',
      ghost: 'text-white hover:bg-white/10'
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
      default: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      secondary: 'bg-white/10 text-white/80',
      success: 'bg-green-500/20 text-green-400 border-green-500/30'
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
    <div className="min-h-screen bg-background font-figtree">
      <ShaderBackground />
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full z-50 transition-all duration-300 ${
        sidebarCollapsed ? 'w-20' : 'w-80'
      }`}>
        <div className="h-full backdrop-blur-md bg-black/20 border-r border-white/20 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <h2 className="text-xl font-semibold text-white font-figtree">
                  Mi <span className="font-instrument-serif italic text-blue-400">Portal</span>
                </h2>
              )}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-200"
              >
                {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
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
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-500/20 text-white border border-blue-500/30'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  } ${sidebarCollapsed ? 'justify-center' : 'justify-start'}`}
                  onClick={() => setActiveSection(item.id)}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-6 border-t border-white/20">
            {user && (
              <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
                <div 
                  className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold cursor-pointer"
                  onClick={() => setShowProfilePanel(true)}
                >
                  {user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
                </div>
                {!sidebarCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{user.nombre}</p>
                    <p className="text-white/60 text-sm">Externo</p>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-80'}`}>
        {/* Header */}
        <header className="backdrop-blur-md bg-card/20 border-b border-border px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <div>
                <h1 className="text-foreground font-bold text-xl">Luckas</h1>
                <p className="text-muted-foreground text-xs">Seminario Bautista de Colombia</p>
              </div>
            </div>

            <div className="flex-1 max-w-md mx-8 search-container">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => console.log('Input focused!')}
                  onBlur={() => console.log('Input blurred!')}
                  onClick={() => console.log('Input clicked!')}
                  placeholder="Buscar cursos, eventos, cabañas..."
                  className="w-full pl-10 pr-10 py-2 bg-card/20 border border-border rounded-lg text-foreground placeholder:text-muted-foreground backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>
              
              {/* Resultados de búsqueda */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card/95 backdrop-blur-lg border border-border rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto search-results-scroll search-results-enter">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-semibold text-foreground">
                        Resultados de búsqueda para "<span className="text-primary">{searchQuery}</span>"
                      </h3>
                      <button
                        onClick={clearSearch}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Cursos encontrados */}
                    {filteredCursos.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          Cursos ({filteredCursos.length})
                        </h4>
                        {filteredCursos.map((curso, index) => (
                          <button
                            key={index}
                            onClick={() => goToSearchResult(curso, 'curso')}
                            className="w-full text-left p-3 hover:bg-accent/10 rounded-lg transition-all mb-1 search-result-item"
                          >
                            <div className="font-medium text-foreground">{curso.nombre}</div>
                            <div className="text-sm text-muted-foreground truncate">
                              {curso.descripcion}
                            </div>
                            <div className="text-xs text-primary mt-1 flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {curso.instructor || 'Instructor no especificado'}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* Eventos encontrados */}
                    {filteredEventos.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Eventos ({filteredEventos.length})
                        </h4>
                        {filteredEventos.map((evento, index) => (
                          <button
                            key={index}
                            onClick={() => goToSearchResult(evento, 'evento')}
                            className="w-full text-left p-3 hover:bg-accent/10 rounded-lg transition-all mb-1 search-result-item"
                          >
                            <div className="font-medium text-foreground">{evento.nombre}</div>
                            <div className="text-sm text-muted-foreground truncate">
                              {evento.descripcion}
                            </div>
                            <div className="text-xs text-primary mt-1 flex items-center gap-2">
                              <MapPin className="w-3 h-3" />
                              {evento.lugar}
                              <Clock className="w-3 h-3" />
                              {new Date(evento.fecha).toLocaleDateString()}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* Cabañas encontradas */}
                    {filteredCabanas.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide flex items-center gap-1">
                          <Home className="w-3 h-3" />
                          Cabañas ({filteredCabanas.length})
                        </h4>
                        {filteredCabanas.map((cabana, index) => (
                          <button
                            key={index}
                            onClick={() => goToSearchResult(cabana, 'cabana')}
                            className="w-full text-left p-3 hover:bg-accent/10 rounded-lg transition-all mb-1 search-result-item"
                          >
                            <div className="font-medium text-foreground">{cabana.nombre}</div>
                            <div className="text-sm text-muted-foreground truncate">
                              {cabana.descripcion}
                            </div>
                            <div className="text-xs text-primary mt-1 flex items-center gap-2">
                              <MapPin className="w-3 h-3" />
                              {cabana.ubicacion}
                              {cabana.precio && (
                                <>
                                  <span>•</span>
                                  <span className="font-semibold">
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
                      <div className="text-center py-8 text-muted-foreground">
                        <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="font-medium mb-1">No se encontraron resultados para "{searchQuery}"</p>
                        <p className="text-sm">Intenta con otras palabras clave</p>
                        <div className="mt-4 text-xs">
                          <p>Sugerencias:</p>
                          <div className="flex flex-wrap justify-center gap-2 mt-2">
                            <button 
                              onClick={() => setSearchQuery('bíblico')}
                              className="px-2 py-1 bg-accent/10 rounded text-primary hover:bg-accent/20 transition-colors"
                            >
                              bíblico
                            </button>
                            <button 
                              onClick={() => setSearchQuery('seminario')}
                              className="px-2 py-1 bg-accent/10 rounded text-primary hover:bg-accent/20 transition-colors"
                            >
                              seminario
                            </button>
                            <button 
                              onClick={() => setSearchQuery('retiro')}
                              className="px-2 py-1 bg-accent/10 rounded text-primary hover:bg-accent/20 transition-colors"
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
                className="text-foreground hover:bg-accent/10 p-2 rounded-lg transition-colors"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button className="text-foreground hover:bg-accent/10 p-2 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button 
                className="text-foreground hover:bg-accent/10 p-2 rounded-lg transition-colors"
                onClick={() => setShowProfilePanel(true)}
              >
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8">
          {activeSection === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-6xl font-bold text-foreground mb-2">
                  Bienvenido a tu <span className="font-instrument-serif italic text-primary">Dashboard</span>
                </h2>
                <p className="text-muted-foreground text-sm">Gestiona tus inscripciones y reservas desde aquí</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <div className="p-6">
                    <h3 className="text-sm font-medium text-white/80 mb-2">Cursos Disponibles</h3>
                    <div className="text-3xl font-bold text-white">{cursos.length}</div>
                    <p className="text-xs text-white/60">Para inscribirse</p>
                  </div>
                </Card>

                <Card>
                  <div className="p-6">
                    <h3 className="text-sm font-medium text-white/80 mb-2">Eventos Próximos</h3>
                    <div className="text-3xl font-bold text-white">{eventos.length}</div>
                    <p className="text-xs text-white/60">Este mes</p>
                  </div>
                </Card>

                <Card>
                  <div className="p-6">
                    <h3 className="text-sm font-medium text-white/80 mb-2">Cabañas Disponibles</h3>
                    <div className="text-3xl font-bold text-white">{cabanas.length}</div>
                    <p className="text-xs text-white/60">Para reservar</p>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeSection === 'courses' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-5xl font-bold text-foreground mb-2">
                  Cursos <span className="font-instrument-serif italic text-primary">Disponibles</span>
                </h2>
                <p className="text-muted-foreground text-sm">Encuentra el curso perfecto para tu desarrollo espiritual</p>
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
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-white/60">4.8</span>
                          </div>
                        </div>
                        <h3 className="text-white font-semibold text-lg mb-2">{curso.nombre}</h3>
                        <p className="text-white/60 text-sm mb-4">{curso.descripcion}</p>
                        
                        <div className="flex justify-between text-sm text-white/60 mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {typeof curso.duracion === 'object' 
                              ? `${curso.duracion.semanas} semanas`
                              : curso.duracion
                            }
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {curso.cuposDisponibles} cupos
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-primary">
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
                <h2 className="text-5xl font-bold text-foreground mb-2">
                  Próximos <span className="font-instrument-serif italic text-primary">Eventos</span>
                </h2>
                <p className="text-muted-foreground text-sm">Únete a nuestros eventos y conferencias</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {eventos.map((evento) => (
                  <Card key={evento._id}>
                    <div className="p-6">
                      <Badge className="mb-3">Próximamente</Badge>
                      <h3 className="text-white font-semibold text-lg mb-2">{evento.nombre}</h3>
                      <p className="text-white/60 text-sm mb-4">{evento.descripcion}</p>
                      
                      <div className="space-y-2 text-sm text-white/60 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(evento.fechaEvento).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {evento.lugar}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-primary">
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
                <h2 className="text-5xl font-bold text-foreground mb-2">
                  Reserva tu <span className="font-instrument-serif italic text-primary">Cabaña</span>
                </h2>
                <p className="text-muted-foreground text-sm">Escápate a la naturaleza en nuestras cabañas</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cabanas.map((cabana) => (
                  <Card key={cabana._id}>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <Badge variant="success">Disponible</Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-white/60">4.9</span>
                        </div>
                      </div>
                      <h3 className="text-white font-semibold text-lg mb-2">{cabana.nombre}</h3>
                      <p className="text-white/60 text-sm mb-4">{cabana.descripcion}</p>
                      
                      <div className="flex items-center gap-2 text-sm text-white/60 mb-4">
                        <Users className="h-4 w-4" />
                        {cabana.capacidad} personas
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-primary">
                          ${cabana.precio?.toLocaleString()}/noche
                        </span>
                        <Button onClick={() => handleReservarCabana(cabana)}>
                          Reservar
                        </Button>
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
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            {reservaStatus}
            <button 
              onClick={() => setReservaStatus(null)}
              className="ml-2 text-white/80 hover:text-white"
            >
              <X className="h-4 w-4" />
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
