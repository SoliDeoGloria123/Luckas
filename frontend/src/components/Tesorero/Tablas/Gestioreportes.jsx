import React, { useState } from "react";
import Header from '../Header/Header-tesorero'
import Footer from '../../footer/Footer'

const Gestionreportes = () => {

    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [currentItem, setCurrentItem] = useState(null);

    const handleCreate = () => {
        setModalMode('create');
        setCurrentItem(null);
        setShowModal(true);
    };

    const handleEdit = (item) => {
        setModalMode('edit');
        setCurrentItem(item);
        setShowModal(true);
    };

    const handleSubmit = (data) => {
        if (modalMode === 'create') {
            // Lógica para crear
        } else {
            // Lógica para editar
        }
    };
    return (
        <>
        <Header/>
        <main className="main-content-tesorero">
            <div className="section-header-reporte">
                <h1>Sistema de Reportes</h1>
                <p>Generar informes del sistema</p>
                <div className="header-actions-reporte">
                    <select className="report-selector-reporte">
                        <option>Dashboard General</option>
                        <option>Reportes Financieros</option>
                        <option>Reportes de Usuarios</option>
                        <option>Reportes de Eventos</option>
                    </select>
                    <button className="btn-secondary-reporte">
                        <i className="fas fa-file-pdf"></i>
                        Exportar PDF
                    </button>
                    <button className="btn-secondary-reporte">
                        <i className="fas fa-file-excel"></i>
                        Exportar Excel
                    </button>
                    <button className="btn-primary-reporte">
                        <i className="fas fa-save"></i>
                        Guardar Reporte
                    </button>
                </div>
            </div>


            <div className="stats-grid-reporte report-stats">
                <div className="stat-card-reporte">
                    <div className="stat-header-reporte">
                        <h4>Usuarios Totales</h4>
                    </div>
                    <div className="stat-number-reporte">156</div>
                </div>
                <div className="stat-card-reporte">
                    <div className="stat-header-reporte">
                        <h4>Reservas Totales</h4>
                    </div>
                    <div className="stat-number-reporte">89</div>
                </div>
                <div className="stat-card-reporte">
                    <div className="stat-header-reporte">
                        <h4>Inscripciones Totales</h4>
                    </div>
                    <div className="stat-number-reporte">234</div>
                </div>
                <div className="stat-card-reporte">
                    <div className="stat-header-reporte">
                        <h4>Eventos Activos</h4>
                    </div>
                    <div className="stat-number-reporte">12</div>
                </div>
                <div className="stat-card-reporte">
                    <div className="stat-header-reporte">
                        <h4>Solicitudes Pendientes</h4>
                    </div>
                    <div className="stat-number-reporte">23</div>
                </div>
                <div className="stat-card-reporte">
                    <div className="stat-header-reporte">
                        <h4>Cabañas Disponibles</h4>
                    </div>
                    <div className="stat-number-reporte">8</div>
                </div>
            </div>

            <div className="report-info-reporte">
                <div className="report-timestamp-reporte">
                    <i className="fas fa-clock"></i>
                    <span>Fecha de generación: 2/9/2025, 10:38:05 p. m.</span>
                </div>
            </div>
            {/*Tabla de resportes*/}
            <div class="reports-table-container-reporte">
                <div class="table-header-reporte">
                    <h3>Reportes Guardados</h3>
                    <button class="btn-primary-reporte" id="newReportBtn">
                        <i class="fas fa-plus"></i>
                        Nuevo Reporte
                    </button>
                </div>

                <div class="table-filters-reporte">
                    <div class="search-container-reporte">
                        <i class="fas fa-search"></i>
                        <input type="text" placeholder="Buscar reportes..." id="reportSearch"/>
                    </div>
                    <select >
                        <option value="">Todos los tipos</option>
                        <option value="financiero">Financiero</option>
                        <option value="usuarios">Usuarios</option>
                        <option value="eventos">Eventos</option>
                        <option value="reservas">Reservas</option>
                    </select>
                    <select >
                        <option value="">Todos los estados</option>
                        <option value="generado">Generado</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="archivado">Archivado</option>
                    </select>
                </div>

                <div class="table-wrapper-reporte">
                    <table class="reports-table-reporte">
                        <thead>
                            <tr>
                                <th>Nombre del Reporte</th>
                                <th>Tipo</th>
                                <th>Fecha Creación</th>
                                <th>Estado</th>
                                <th>Tamaño</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="reportsTableBody">
                            <tr>
                                <td>
                                    <div class="report-name-reporte">
                                        <i class="fas fa-file-alt"></i>
                                        <span>Reporte Financiero Enero 2025</span>
                                    </div>
                                </td>
                                <td><span class="badge-reporte badge-blue-reporte">Financiero</span></td>
                                <td>15/01/2025 14:30</td>
                                <td><span class="badge-reporte badge-green-reporte">Generado</span></td>
                                <td>2.4 MB</td>
                                <td>
                                    <div class="action-buttons-reporte">
                                        <button class="btn-icon-reporte" title="Ver">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="btn-icon-reporte" title="Descargar">
                                            <i class="fas fa-download"></i>
                                        </button>
                                        <button class="btn-icon-reporte" title="Editar">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="report-name-reporte">
                                        <i class="fas fa-users"></i>
                                        <span>Reporte de Usuarios Activos</span>
                                    </div>
                                </td>
                                <td><span class="badge-reporte badge-purple-reporte">Usuarios</span></td>
                                <td>10/01/2025 09:15</td>
                                <td><span class="badge-reporte badge-green-reporte">Generado</span></td>
                                <td>1.8 MB</td>
                                <td>
                                    <div class="action-buttons-reporte">
                                        <button class="btn-icon-reporte" title="Ver">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="btn-icon-reporte" title="Descargar">
                                            <i class="fas fa-download"></i>
                                        </button>
                                        <button class="btn-icon-reporte" title="Editar">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="report-name-reporte">
                                        <i class="fas fa-calendar-alt"></i>
                                        <span>Reporte de Eventos Diciembre</span>
                                    </div>
                                </td>
                                <td><span class="badge-reporte badge-orange-reporte">Eventos</span></td>
                                <td>05/01/2025 16:45</td>
                                <td><span class="badge-reporte badge-yellow-reporte">Pendiente</span></td>
                                <td>-</td>
                                <td>
                                    <div class="action-buttons-reporte">
                                        <button class="btn-icon-reporte" title="Ver">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="btn-icon-reporte" title="Generar">
                                            <i class="fas fa-play"></i>
                                        </button>
                                        <button class="btn-icon-reporte" title="Editar">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
        <Footer/>
        </>
    )

}

export default Gestionreportes;
