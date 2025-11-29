
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar/Sidebar';
import Header from './Sidebar/Header';
import CertificacionTabla from './Tablas/CertificacionTabla';
import StatsCard from './Shared/StatsCard';
import { generarCertificado, estadisticasCertificados as fetchEstadisticasCertificados } from '../../services/certificadoService';
import { inscripcionService } from '../../services/inscripcionService';
import { Search, } from 'lucide-react';


const GestionCertificacion = () => {
    const [sidebarAbierto, setSidebarAbierto] = useState(true);
    const [seccionActiva, setSeccionActiva] = useState("certificaciones");
    const [certificados, setCertificados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('certificado');
    const [filtroPrograma, setFiltroPrograma] = useState('');
    const [paginaActual, setPaginaActual] = useState(1);
    const itemsPorPagina = 10;
    const [estadisticasCertificados, setEstadisticasCertificados] = useState({
        totalInscripciones: 0,
        certificadosEmitidos: 0,
        descargasHoy: 0,
        listosParaDescarga: 0
    });

    useEffect(() => {
        // Obtener inscripciones con estado certificado o finalizado usando inscripcionService
        const fetchCertificados = async () => {
            setLoading(true);
            try {
                const data = await inscripcionService.getAll();
                if (data.success && Array.isArray(data.data)) {
                    // Obtener inscripciones de tipo ProgramaAcademico (dejamos el filtrado por estado para la UI)
                    const filtrados = data.data.filter(insc => insc.tipoReferencia === 'ProgramaAcademico');
                    setCertificados(filtrados);
                } else {
                    setCertificados([]);
                }
            } catch (err) {
                setCertificados([]);
                alert('Error al obtener certificados: ' + (err?.message || err));
            }
            setLoading(false);
        };
        fetchCertificados();
    }, []);

    // Obtener estadísticas de certificados
    const obtenerEstadisticasCertificados = async () => {
        try {
            const data = await fetchEstadisticasCertificados();
            // El servicio devuelve directamente el objeto { totalInscripciones, certificadosEmitidos, descargasHoy, listosParaDescarga }
            setEstadisticasCertificados(data || {});
        } catch (error) {
            console.error("ERROR", `Error al obtener estadísticas de certificados: ${error.message}`, 'error');
        }
    };

    useEffect(() => {
        obtenerEstadisticasCertificados();
    }, []);

    // Filtrado, búsqueda y paginación
    const programasUnicos = React.useMemo(() => {
        const map = new Map();
        for (const c of certificados) {
            const ref = c.referencia;
            if (!ref) continue;
            const id = ref._id || ref.id || ref;
            const nombre = ref.nombre || ref.titulo || String(ref);
            if (!map.has(id)) map.set(id, { id, nombre });
        }
        return Array.from(map.values());
    }, [certificados]);

    const certificadosFiltrados = React.useMemo(() => {
        const q = (busqueda || '').toString().trim().toLowerCase();
        return certificados.filter(c => {
            // filtro por estado
            if (filtroEstado && filtroEstado !== 'todos') {
                if ((c.estado || '') !== filtroEstado) return false;
            }
            // filtro por programa (referencia)
            if (filtroPrograma) {
                const refId = c.referencia?._id || c.referencia || '';
                if (String(refId) !== String(filtroPrograma)) return false;
            }
            if (!q) return true;
            const partes = [
                ...(c.usuario ? [c.usuario.nombre || c.usuario.nombreCompleto || c.usuario.nombres || c.usuario.apellidos || '', c.usuario.email || ''] : []),
                ...(c.referencia ? [c.referencia.nombre || c.referencia.titulo || ''] : []),
                c.nombre || ''
            ];
            const hay = partes.join(' ').toLowerCase().includes(q);
            return hay;
        });
    }, [certificados, busqueda, filtroEstado, filtroPrograma]);

    const totalPaginas = Math.max(1, Math.ceil(certificadosFiltrados.length / itemsPorPagina));
    const certificadosPaginated = React.useMemo(() => {
        const start = (paginaActual - 1) * itemsPorPagina;
        return certificadosFiltrados.slice(start, start + itemsPorPagina);
    }, [certificadosFiltrados, paginaActual]);
    // Descargar certificado PDF
    const handleDescargar = async (cert) => {
        try {
            const userId = cert.usuario?._id || cert.usuario;
            const cursoId = cert.referencia?._id || cert.referencia;
            const nombre = cert.nombre;
            const blob = await generarCertificado(userId, cursoId);
            const url = globalThis.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `certificado-${nombre}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            globalThis.URL.revokeObjectURL(url);
        } catch (error) {
            alert('Error generando certificado: ' + (error?.message || error));
        };
    };

    // Configuración de stats cards usando los valores devueltos por la API
    const statsCards = [
        { icon: 'fa-certificate', value: estadisticasCertificados.totalInscripciones || certificados.length, label: 'Total Inscripciones', type: 'users' },
        { icon: 'fa-check-circle', value: estadisticasCertificados.certificadosEmitidos || certificados.length, label: 'Certificados Emitidos', type: 'active' },
        { icon: 'fa-download', value: estadisticasCertificados.descargasHoy || 0, label: 'Descargas Hoy', type: 'admins' },
        { icon: 'fa-graduation-cap', value: estadisticasCertificados.listosParaDescarga || certificados.length, label: 'Listos para Descarga', type: 'new' }
    ];

    return (
        <div className="min-h-screen" style={{ background: 'var(--gradient-bg)' }}>
            <Sidebar
                sidebarAbierto={sidebarAbierto}
                setSidebarAbierto={setSidebarAbierto}
                seccionActiva={seccionActiva}
                setSeccionActiva={setSeccionActiva}
            />
            <div className={`transition-all duration-300 ${sidebarAbierto ? 'ml-72' : 'ml-20'}`}>
                <Header
                    sidebarAbierto={sidebarAbierto}
                    setSidebarAbierto={setSidebarAbierto}
                    seccionActiva={seccionActiva}
                />
                <div className="space-y-7 fade-in-up p-9">
                    <div className="page-header-Academicos">
                        <div className="page-title-admin">
                            <h1>Gestión de Certificaciones</h1>
                            <p>Administra los certificados de los programas</p>
                        </div>

                    </div>
                    <div className="dashboard-grid-reporte-admin">
                        {statsCards.map((card, index) => (
                            <StatsCard
                                key={`${card.label}-${card.value}`}
                                icon={card.icon}
                                value={card.value}
                                label={card.label}
                                type={card.type}
                            />
                        ))}
                    </div>

                    <div className="glass-card rounded-2xl p-6 border border-white/20 shadow-lg">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                            <div className="relative flex-1 max-w-md">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                <input
                                    placeholder="Buscar certificados por usuario o programa..."
                                    value={busqueda}
                                    onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1); }}
                                    className="w-full pl-10 pr-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all"
                                />
                            </div>
                            <div className="flex space-x-3">
                                <select
                                    className="px-4 py-3 glass-card border border-slate-200/50 rounded-xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    value={filtroPrograma}
                                    onChange={(e) => { setFiltroPrograma(e.target.value); setPaginaActual(1); }}
                                >
                                    <option value="">Todos los Programas</option>
                                    {programasUnicos.map(p => (
                                        <option key={p.id} value={p.id}>{p.nombre}</option>
                                    ))}
                                </select>
                                <select
                                    className="px-4 py-3 glass-card border border-slate-200/50 rounded-xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    value={filtroEstado}
                                    onChange={(e) => { setFiltroEstado(e.target.value); setPaginaActual(1); }}
                                >
                                    <option value="todos">Todos los Estados</option>
                                    <option value="certificado">Certificado</option>
                                    <option value="finalizado">Finalizado</option>
                                    <option value="pendiente">Pendiente</option>
                                </select>
                            </div>

                        </div>
                    </div>
                    <div className="p-6 glass-card rounded-2xl border border-white/20 shadow-lg overflow-hidden user-card">
                        {loading ? (
                            <div className="text-center py-12 text-gray-400">Cargando certificados...</div>
                        ) : (

                            <CertificacionTabla certificados={certificadosPaginated} onDescargar={handleDescargar} />
                        )}
                    </div>
                    <div className="pagination-admin flex items-center justify-center gap-4 mt-6">
                        <button
                            className="pagination-btn-admin"
                            disabled={paginaActual <= 1}
                            onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
                        > <i className="fas fa-chevron-left"/>
                        </button>
                        <div className="pagination-info-admin">Página {paginaActual} / {totalPaginas}</div>
                        <button
                            className="pagination-btn-admin"
                            disabled={paginaActual >= totalPaginas}
                            onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
                        > <i className="fas fa-chevron-right"/>
                            </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GestionCertificacion;