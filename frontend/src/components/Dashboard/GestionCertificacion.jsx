
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar/Sidebar';
import Header from './Sidebar/Header';
import CertificacionTabla from './Tablas/CertificacionTabla';

import { generarCertificado } from '../../services/certificadoService';
import { inscripcionService } from '../../services/inscripcionService';


const GestionCertificacion = () => {
    const [sidebarAbierto, setSidebarAbierto] = useState(true);
    const [seccionActiva, setSeccionActiva] = useState("certificaciones");
    const [certificados, setCertificados] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Obtener inscripciones con estado certificado o finalizado usando inscripcionService
        const fetchCertificados = async () => {
            setLoading(true);
            try {
                const data = await inscripcionService.getAll();
                if (data.success && Array.isArray(data.data)) {
                    const filtrados = data.data.filter(
                        insc => insc.estado === 'certificado' || insc.estado === 'finalizado'
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
                        <div className="stat-card-reporte-admin">
                            <div className="stat-icon-reporte-admin-admin users">
                                <i className="fas fa-users"></i>
                            </div>
                            <div className="stat-info-admin">
                                <h3>5</h3>
                                <p>Total Usuarios</p>
                            </div>
                        </div>
                        <div className="stat-card-reporte-admin">
                            <div className="stat-icon-reporte-admin-admin active">
                                <i className="fas fa-user-check"></i>
                            </div>
                            <div className="stat-info-admin">
                                <h3>4</h3>
                                <p>Usuarios Activos</p>
                            </div>
                        </div>
                        <div className="stat-card-reporte-admin">
                            <div className="stat-icon-reporte-admin-admin admins">
                                <i className="fas fa-user-shield"></i>
                            </div>
                            <div className="stat-info-admin">
                                <h3>1</h3>
                                <p>Administradores</p>
                            </div>
                        </div>
                        <div className="stat-card-reporte-admin">
                            <div className="stat-icon-reporte-admin-admin new">
                                <i className="fas fa-user-plus"></i>
                            </div>
                            <div className="stat-info-admin">
                                <h3>12</h3>
                                <p>Nuevos Este Mes</p>
                            </div>
                        </div>
                    </div>
                    <section className="filtros-section-admin">
                        <div className="busqueda-contenedor">
                            <i class="fas fa-search"></i>
                            <input
                                type="text"
                                placeholder="Buscar Certificados..."
                                //value={busqueda}
                                //onChange={(e) => setBusqueda(e.target.value)}
                                className="input-busqueda"
                            />
                        </div>
                        <div className="filtro-grupo-admin">
                            <select className="filtro-dropdown">
                                <option>Todos los Roles</option>
                                <option>Administrador</option>
                                <option>Seminarista</option>
                                <option>Tesorero</option>
                                <option>Usuario Externo</option>
                            </select>
                            <select className="filtro-dropdown">
                                <option>Todos los Estados</option>
                                <option>Activo</option>
                                <option>Inactivo</option>
                                <option>Pendiente</option>
                            </select>
                        </div>
                    </section>
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