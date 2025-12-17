import { useState, useEffect } from "react"
import { Search, Download, Users, UserCheck, Shield, TrendingUp, ChevronLeft } from "lucide-react"
import Header from "../Header/Header-tesorero";
import Footer from '../../footer/Footer'
import { generarCertificado, estadisticasCertificados as fetchEstadisticasCertificados } from '../../../services/certificadoService';
import { inscripcionService } from '../../../services/inscripcionService';
import { mostrarAlerta } from '../../utils/alertas';


const CertificadosPage = () => {
    const [certificados, setCertificados] = useState([]);
    const [estadisticasCertificados, setEstadisticasCertificados] = useState({
        totalInscripciones: 0,
        certificadosEmitidos: 0,
        descargasHoy: 0,
        listosParaDescarga: 0
    });
    const [certificadosFiltrados, setCertificadosFiltrados] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPrograma, setFilterPrograma] = useState('todos');
    const [filterEstado, setFilterEstado] = useState('todos');

    useEffect(() => {
        // Obtener inscripciones con estado certificado o finalizado usando inscripcionService
        const fetchCertificados = async () => {
            try {
                const data = await inscripcionService.getAll();
                console.log('DEBUG - Datos recibidos:', data);
                
                if (data && data.success && Array.isArray(data.data)) {
                    // Mostrar solo inscripciones de programas académicos cuyo estado sea exactamente 'certificado'
                    const filtrados = data.data.filter(
                        insc => (insc.tipoReferencia === 'ProgramaAcademico') && (insc.estado === 'certificado')
                    );
                    console.log('DEBUG - Certificados filtrados:', filtrados);
                    if (filtrados.length > 0) {
                        console.log('DEBUG - Primer certificado:', {
                            nombre: filtrados[0].nombre,
                            apellido: filtrados[0].apellido,
                            usuario: filtrados[0].usuario
                        });
                    }
                    setCertificados(filtrados);
                    setCertificadosFiltrados(filtrados);
                } else if (Array.isArray(data)) {
                    const filtrados = data.filter(insc => (insc.tipoReferencia === 'ProgramaAcademico') && (insc.estado === 'certificado'));
                    setCertificados(filtrados);
                    setCertificadosFiltrados(filtrados);
                } else {
                    setCertificados([]);
                    setCertificadosFiltrados([]);
                }
            } catch (err) {
                console.error('DEBUG - Error:', err);
                setCertificados([]);
                mostrarAlerta("Error", `Error al obtener certificados: ${err.message}`, 'error');
            }
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
            mostrarAlerta("Error", `obtener estadísticas de certificados: ${error.message}`, 'error');
        }
    };

    useEffect(() => {
        obtenerEstadisticasCertificados();
    }, []);



    // Helper para obtener nombre completo seguro
    const obtenerNombreCompleto = (cert) => {
        const nombre = cert.nombre || '';
        const apellido = cert.apellido || '';
        return `${nombre} ${apellido}`.trim() || 'Sin nombre';
    };

    // Helper para obtener programa/curso
    const obtenerProgramaNombre = (cert) => {
        if (cert.programaNombre) return cert.programaNombre;
        if (cert.cursoNombre) return cert.cursoNombre;
        if (cert.referencia?.nombre) return cert.referencia.nombre;
        if (cert.referencia && typeof cert.referencia === 'object' && cert.referencia.nombre) return cert.referencia.nombre;
        return '-';
    };

    const applyFilters = (search = searchTerm, programa = filterPrograma, estado = filterEstado, lista = certificados) => {
        const s = (search || '').toString().trim().toLowerCase();
        const arr = Array.isArray(lista) ? lista : [];
        const filtered = arr.filter((c) => {
            // filtro por programa
            if (programa && programa !== 'todos') {
                const prog = obtenerProgramaNombre(c);
                if (String(prog) !== String(programa)) return false;
            }
            // filtro por estado
            if (estado && estado !== 'todos') {
                if (String((c.estado || '')).toLowerCase() !== String(estado).toLowerCase()) return false;
            }

            if (!s) return true;

            const nombre = String(c.nombre || '').toLowerCase();
            const apellido = String(c.apellido || '').toLowerCase();
            const correo = String(c.correo || '').toLowerCase();
            const documento = String(c.numeroDocumento || '').toLowerCase();
            const programaNombre = obtenerProgramaNombre(c).toLowerCase();

            return (
                nombre.includes(s) ||
                apellido.includes(s) ||
                correo.includes(s) ||
                documento.includes(s) ||
                programaNombre.includes(s) ||
                String(c.estado || '').toLowerCase().includes(s)
            );
        });

        setCertificadosFiltrados(filtered);
    };

    // aplicar filtros cuando cambie la fuente
    useEffect(() => {
        applyFilters(searchTerm, filterPrograma, filterEstado, certificados);
    }, [certificados]);

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
        } catch (err) {
            mostrarAlerta("Error", `Error al descargar certificado: ${err.message}`, 'error');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <Header />
            {/* Main Content */}
            <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button and Title */}
                <div className="page-header-tesorero">
                    <div className="card-header-tesorero">
                        <button className="back-btn-tesorero" onClick={() => globalThis.history.back()}>
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <div className="page-title-tesorero">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Certificados</h2>
                            <p>Administra y organiza los certificados del sistema</p>
                        </div>
                    </div>
                </div>
                {/* Stats Cards */}
                <div className="stats-grid-usuarios">
                    <div className="stat-card-usuarios">
                        <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="stat-content">
                            <div className="stat-number-usuarios" >{estadisticasCertificados.totalInscripciones}</div>
                            <div className="stat-label-usuarios">Total Inscripciones</div>
                        </div>
                    </div>
                    <div className="stat-card-usuarios">
                        <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                            <UserCheck className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="stat-content">
                            <div className="stat-number-usuarios" id="activeUsers">{estadisticasCertificados.certificadosEmitidos}</div>
                            <div className="stat-label-usuarios">Certificados Emitidos</div>
                        </div>
                    </div>
                    <div className="stat-card-usuarios">
                        <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                            <Shield className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="stat-content">
                            <div className="stat-number-usuarios" id="adminUsers">{estadisticasCertificados.descargasHoy}</div>
                            <div className="stat-label-usuarios">Descargas Hoy</div>
                        </div>
                    </div>
                    <div className="stat-card-usuarios">
                        <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
                            <TrendingUp className="h-6 w-6 text-orange-600" />
                        </div>
                        <div className="stat-content">
                            <div className="stat-number-usuarios" id="newUsers">{estadisticasCertificados.listosParaDescarga}</div>
                            <div className="stat-label-usuarios">Listos para Descarga</div>
                        </div>
                    </div>
                </div>


                <div className="filters-section-tesorero">
                    <div className="search-filters-tesorero">
                        <div className="search-input-container-tesorero">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre, descripción o código..."
                                id="userSearch"
                                value={searchTerm}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    setSearchTerm(v);
                                    applyFilters(v, filterPrograma, filterEstado, certificados);
                                }}
                            />
                        </div>
                        <select
                            id="programFilter"
                            className="filter-select"
                            value={filterPrograma}
                            onChange={(e) => {
                                const v = e.target.value;
                                setFilterPrograma(v);
                                applyFilters(searchTerm, v, filterEstado, certificados);
                            }}
                        >
                            <option value="todos">Todos los Programas</option>
                            {Array.from(new Set(certificados.map(c => obtenerProgramaNombre(c)).filter(p => p && p !== '-'))).map(p => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                        <select
                            id="statusFilterEstado"
                            className="filter-select"
                            value={filterEstado}
                            onChange={(e) => {
                                const v = e.target.value;
                                setFilterEstado(v);
                                applyFilters(searchTerm, filterPrograma, v, certificados);
                            }}
                        >
                            <option value="todos">Todos los Estados</option>
                            <option value="certificado">Certificado</option>
                            <option value="finalizado">Finalizado</option>
                        </select>
                    </div>
                
                </div>
                {/* Certificates Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                                        Nombre
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                                        Documento
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                                        Correo
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                                        Programa/Curso
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-900 uppercase tracking-wider">
                                        Acción
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {(certificadosFiltrados && certificadosFiltrados.length > 0 ? certificadosFiltrados : certificados).map((cert) => (
                                    <tr key={cert._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{obtenerNombreCompleto(cert)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{cert.numeroDocumento || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{cert.correo || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{obtenerProgramaNombre(cert)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                                                {cert.estado || 'Sin estado'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => handleDescargar(cert)}
                                                className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                            >
                                                <Download className="h-4 w-4 mr-2" />
                                                Descargar PDF
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {certificados.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No se encontraron certificados</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CertificadosPage;
