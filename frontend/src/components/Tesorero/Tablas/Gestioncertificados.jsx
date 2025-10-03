import { useState, useEffect } from "react"
import { Search, Download, Users, UserCheck, Shield, TrendingUp, ChevronLeft, ChevronDown } from "lucide-react"
import Header from "../Header/Header-tesorero";
import Footer from '../../footer/Footer'
import { generarCertificado } from '../../../services/certificadoService';
import { inscripcionService } from '../../../services/inscripcionService';


const CertificadosPage = () => {

    const [certificados, setCertificados] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        // Obtener inscripciones con estado certificado o finalizado usando inscripcionService
        const fetchCertificados = async () => {
            setLoading(true);
            try {
                const data = await inscripcionService.getAll();
                if (data.success && Array.isArray(data.data)) {
                    // Solo mostrar certificados de programas académicos (cursos)
                    const filtrados = data.data.filter(
                        insc => (insc.tipoReferencia === 'ProgramaAcademico') && (insc.estado === 'certificado' || insc.estado === 'finalizado')
                    );
                    setCertificados(filtrados);
                } else {
                    setCertificados([]);
                }
            } catch (err) {
                setCertificados([]);
            }
            setLoading(false);
        };
        fetchCertificados();
    }, []);

    // Descargar certificado PDF
    const handleDescargar = async (cert) => {
        try {
            const userId = cert.usuario?._id || cert.usuario;
            const cursoId = cert.referencia?._id || cert.referencia;
            const nombre = cert.nombre;
            const blob = await generarCertificado(userId, cursoId);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `certificado-${nombre}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            alert('Error generando certificado');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <Header />
            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button and Title */}
                <div className="page-header-tesorero">
                    <div className="card-header-tesorero">
                        <button className="back-btn-tesorero">
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <div className="page-title-tesorero">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Certificados</h2>
                            <p>Administra y organiza los certificados del sistema</p>
                        </div>
                    </div>
                </div>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">156</p>
                                <p className="text-sm text-gray-600">Total Usuarios</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                                <UserCheck className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">142</p>
                                <p className="text-sm text-gray-600">Usuarios Activos</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                                <Shield className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">8</p>
                                <p className="text-sm text-gray-600">Administradores</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
                                <TrendingUp className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">23</p>
                                <p className="text-sm text-gray-600">Nuevos Este Mes</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="search"
                                placeholder="Buscar por nombre, documento o correo..."
                               // value={searchQuery}
                                //onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 h-10 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="relative w-full sm:w-[200px]">
                            <select
                                //value={programFilter}
                                //onChange={(e) => setProgramFilter(e.target.value)}
                                className="w-full h-10 px-3 pr-8 bg-white border border-gray-200 rounded-md text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">Todos los programas</option>
                                <option value="Administración de Empresas">Administración de Empresas</option>
                                <option value="Inglés Conversacional">Inglés Conversacional</option>
                                <option value="Pintura al Óleo">Pintura al Óleo</option>
                                <option value="Yoga y Meditación">Yoga y Meditación</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                        <div className="relative w-full sm:w-[180px]">
                            <select
                               // value={statusFilter}
                               // onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full h-10 px-3 pr-8 bg-white border border-gray-200 rounded-md text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">Todos los estados</option>
                                <option value="certificado">Certificado</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
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
                                {certificados.map((cert) => (
                                    <tr key={cert._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cert.certificados} {cert.apellido}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{cert.numeroDocumento}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{cert.correo}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{cert.programaNombre || cert.cursoNombre || cert.referencia?.nombre || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                                                {cert.estado}
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
