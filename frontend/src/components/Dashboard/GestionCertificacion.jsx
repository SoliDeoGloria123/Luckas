
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar/Sidebar';
import Header from './Sidebar/Header';
import CertificacionTabla from './Tablas/CertificacionTabla';
import StatsCard from './Shared/StatsCard';
import SearchAndFilters from './Shared/SearchAndFilters';
import { generarCertificado, estadisticasCertificados as fetchEstadisticasCertificados } from '../../services/certificadoService';
import { inscripcionService } from '../../services/inscripcionService';


const GestionCertificacion = () => {
    const [sidebarAbierto, setSidebarAbierto] = useState(true);
    const [seccionActiva, setSeccionActiva] = useState("certificaciones");
    const [certificados, setCertificados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('todos');
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
                    // Solo mostrar certificados con estado "certificado" de programas académicos
                    const filtrados = data.data.filter(
                        insc => (insc.tipoReferencia === 'ProgramaAcademico') && (insc.estado === 'certificado')
                    );
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
                <div className="p-8">
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
                    <SearchAndFilters 
                        searchPlaceholder="Buscar Certificados..."
                        searchValue={busqueda}
                        onSearchChange={(e) => setBusqueda(e.target.value)}
                        filters={[
                            {
                                value: filtroEstado,
                                onChange: (e) => setFiltroEstado(e.target.value),
                                options: [
                                    { value: 'todos', label: 'Todos los Certificados' },
                                    { value: 'certificado', label: 'Certificados Emitidos' }
                                ]
                            }
                        ]}
                    />
                    {loading ? (
                        <div className="text-center py-12 text-gray-400">Cargando certificados...</div>
                    ) : (
                        <CertificacionTabla certificados={certificados} onDescargar={handleDescargar} />
                    )}

                </div>
            </div>
        </div>
    );
};

export default GestionCertificacion;