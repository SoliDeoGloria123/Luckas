import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar/Sidebar';
import Header from './Sidebar/Header';
import {
  Users,
  UserPlus,
  Activity,
  TrendingUp

} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import './Dashboard.css';
import { useDashboardAdmin } from './hooks/useDashboardAdmin';
import { eventService } from '../../services/eventService';
import { programasAcademicosService } from '../../services/programasAcademicosService';

import { useNavigate } from "react-router-dom";



const Dashboard = ({ usuario: usuarioProp, onCerrarSesion: onCerrarSesionProp }) => {
  // Estados locales
  //const [busqueda] = useState("");
  const [sidebarAbierto, setSidebarAbierto] = useState(true);
  const [seccionActiva, setSeccionActiva] = useState("dashboard");
  const navigate = useNavigate();

  // Hook principal del dashboard
  const {
    estadisticas,
    usuarios
  } = useDashboardAdmin(usuarioProp, onCerrarSesionProp);

  const [eventosRecientes, setEventosRecientes] = useState([]);
  const [programasRecientes, setProgramasRecientes] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [selectedRange, setSelectedRange] = useState('day'); // 'day' | 'month' | 'year'

  // Construye datos de actividad a partir de usuarios y rango
  const buildActivityByMonth = (usuariosList) => {
    // últimos 12 meses, agrupado por mes
    const now = new Date();
    const months = [];
    const map = new Map();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleString(undefined, { month: 'short', year: 'numeric' });
      const obj = { date: key, label, count: 0 };
      months.push(obj);
      map.set(key, obj);
    }

    for (const u of usuariosList || []) {
      if (!u || !u.createdAt) continue;
      const d = new Date(u.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const found = map.get(key);
      if (found) found.count += 1;
    }

    return months;
  };

  const handleEventos = () => {
    navigate('/admin/eventos');
  };

  const handleProgramas = () => {
    navigate('/admin/programas-academicos');
  };



  const buildActivityByYear = (usuariosList, years = 5) => {
    // últimos `years` años, agrupado por año
    const now = new Date();
    const currentYear = now.getFullYear();
    const yearsArr = [];
    const map = new Map();
    for (let i = years - 1; i >= 0; i--) {
      const y = currentYear - i;
      const key = String(y);
      const label = String(y);
      const obj = { date: key, label, count: 0 };
      yearsArr.push(obj);
      map.set(key, obj);
    }

    for (const u of usuariosList || []) {
      if (!u || !u.createdAt) continue;
      const d = new Date(u.createdAt);
      const key = String(d.getFullYear());
      const found = map.get(key);
      if (found) found.count += 1;
    }

    return yearsArr;
  };

  const buildActivityByDays = (usuariosList, days) => {
    // últimos `days` días, agrupado por día
    const result = [];
    const map = new Map();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString();
      const obj = { date: key, label, count: 0 };
      result.push(obj);
      map.set(key, obj);
    }

    for (const u of usuariosList || []) {
      if (!u || !u.createdAt) continue;
      const createdKey = new Date(u.createdAt).toISOString().split('T')[0];
      const found = map.get(createdKey);
      if (found) found.count += 1;
    }

    return result;
  };

  const buildActivityData = (usuariosList, range) => {
    if (!Array.isArray(usuariosList)) return [];
    if (range === 'year') return buildActivityByYear(usuariosList, 5); // últimos 5 años
    if (range === 'month') return buildActivityByMonth(usuariosList);
    return buildActivityByDays(usuariosList, 7);
  };

  const formatDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString();
  };

  const displayValue = (val) => {
    if (val === null || val === undefined) return '';
    if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') return String(val);
    // If it's an object, try common fields
    if (typeof val === 'object') {
      if (val.nombre) return String(val.nombre);
      if (val.titulo) return String(val.titulo);
      if (val.correo) return String(val.correo);
      // Safe stringify to avoid circular reference exceptions
      const safeStringify = (obj) => {
        const seen = new WeakSet();
        return JSON.stringify(obj, (_k, v) => {
          if (typeof v === 'object' && v !== null) {
            if (seen.has(v)) return '[Circular]';
            seen.add(v);
          }
          return v;
        });
      };

      return safeStringify(val);
    }
    return String(val);
  };

  useEffect(() => {
    let mounted = true;
    const fetchRecientes = async () => {
      try {
        const ev = await eventService.getAllEvents();
        const evArr = Array.isArray(ev) ? ev : (ev && ev.data) || [];
        const sortedE = evArr.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);
        if (mounted) setEventosRecientes(sortedE);

        const pr = await programasAcademicosService.getAllProgramas();
        const prArr = Array.isArray(pr) ? pr : (pr && pr.data) || [];
        const sortedP = prArr.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);
        if (mounted) setProgramasRecientes(sortedP);
      } catch (error) {
        console.error('Error cargando recientes del dashboard:', error);
      }
    };

    fetchRecientes();
    return () => { mounted = false; };
  }, []);

  // Reconstruir activityData cuando cambian usuarios o el rango seleccionado
  useEffect(() => {
    const data = buildActivityData(usuarios, selectedRange);
    setActivityData(data);
  }, [usuarios, selectedRange]);


  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-bg)' }}>
      <Sidebar
        sidebarAbierto={sidebarAbierto}
        setSidebarAbierto={setSidebarAbierto}
        seccionActiva={seccionActiva}
        setSeccionActiva={setSeccionActiva}
      />
      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarAbierto ? 'ml-72' : 'ml-20'}`}>
        <Header
          sidebarAbierto={sidebarAbierto}
          setSidebarAbierto={setSidebarAbierto}
          seccionActiva={seccionActiva}
        />
        {/* Content con transiciones */}
        <main className="p-6 content-transition">
          {seccionActiva === "dashboard" && (
            <div className="space-y-6">
              {/* Stats Grid con animaciones */}
              {/* Mini KPIs compactos - evitar duplicar las tarjetas superiores */}
              <div className="flex flex-col md:flex-row gap-4 mb-10">
                <div className="flex-1 flex items-center p-7 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-sm">
                  <div className="p-3 rounded-lg bg-white/10 mr-3">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs opacity-90">Usuarios</div>
                    <div className="text-xl font-bold">{Array.isArray(usuarios) ? usuarios.length : 0}</div>
                  </div>
                </div>

                <div className="flex-1 flex items-center p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-white shadow-sm">
                  <div className="p-3 rounded-lg bg-white/10 mr-3">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs opacity-90">Eventos recientes</div>
                    <div className="text-xl font-bold">{Array.isArray(eventosRecientes) ? eventosRecientes.length : 0}</div>
                  </div>
                </div>

                <div className="flex-1 flex items-center p-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm">
                  <div className="p-3 rounded-lg bg-white/10 mr-3">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs opacity-90">Programas recientes</div>
                    <div className="text-xl font-bold">{Array.isArray(programasRecientes) ? programasRecientes.length : 0}</div>
                  </div>
                </div>

                <div className="flex-1 flex items-center p-4 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-400 text-white shadow-sm">
                  <div className="p-3 rounded-lg bg-white/10 mr-3">
                    <UserPlus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs opacity-90">Nuevos Hoy</div>
                    <div className="text-xl font-bold">{estadisticas && estadisticas.nuevosHoy ? estadisticas.nuevosHoy : 0}</div>
                  </div>
                </div>
              </div>

              {/* Activity Chart con efectos premium */}
              <div className="glass-card rounded-2xl p-6 border border-white/20 shadow-lg fade-in-up">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-800">Actividad de Usuarios</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedRange('day')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium shadow-md ${selectedRange === 'day' ? 'btn-premium text-white' : 'glass-card text-slate-600 hover:shadow-md'}`}>
                      Día
                    </button>
                    <button
                      onClick={() => setSelectedRange('month')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedRange === 'month' ? 'btn-premium text-white' : 'glass-card text-slate-600 hover:shadow-md'}`}>
                      Mes
                    </button>
                    <button
                      onClick={() => setSelectedRange('year')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedRange === 'year' ? 'btn-premium text-white' : 'glass-card text-slate-600 hover:shadow-md'}`}>
                      Año
                    </button>
                  </div>
                </div>
                <div className="h-64 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-xl border border-slate-200/50 shimmer p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activityData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#edf2ff" />
                      <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="count" stroke="#3b82f6" fill="url(#colorCount)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card rounded-2xl p-6 border border-white/20 shadow-lg fade-in-up col-span-2">
                  <div className="card-header flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">Últimos eventos y programas</h3>
                  </div>
                  <div className="grid grid-cols-1 recientes-grid-md gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-slate-600 mb-2">Eventos</h4>

                      <ul className="recientes-list space-y-2 bg-white/5 p-4 rounded-lg">
                        {eventosRecientes.length > 0 ? eventosRecientes.map((ev) => (
                          <li key={ev._id || ev.id || displayValue(ev)} className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-slate-800">{displayValue(ev.titulo || ev.nombre) || 'Evento'}</div>
                              <div className="text-xs text-slate-500">{formatDate(ev.createdAt)}</div>
                            </div>
                            <div className="text-xs text-slate-500">{displayValue(ev.categoria) || ''}</div>
                          </li>
                        )) : <li className="text-slate-500">No hay eventos</li>}
                      </ul>
                      <button className={`card-action inline-flex px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full text-sm mr-2`} onClick={handleEventos}>Ver eventos</button>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-600 mb-2">Programas</h4>
                      <ul className="recientes-list space-y-2 bg-white/5 p-4 rounded-lg">
                        {programasRecientes.length > 0 ? programasRecientes.map((p) => (
                          <li key={p._id || p.id || displayValue(p)} className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-slate-800">{displayValue(p.titulo || p.nombre || p.nombrePrograma) || 'Programa'}</div>
                              <div className="text-xs text-slate-500">{formatDate(p.createdAt)}</div>
                            </div>
                            <div className="text-xs text-slate-500">{displayValue(p.modalidad) || ''}</div>
                          </li>
                        )) : <li className="text-slate-500">No hay programas</li>}
                      </ul>
                      <button className={`card-action inline-flex px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full text-sm`} onClick={handleProgramas}>Ver programas</button>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  usuario: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string
  ]),
  onCerrarSesion: PropTypes.func
};

export default Dashboard;
