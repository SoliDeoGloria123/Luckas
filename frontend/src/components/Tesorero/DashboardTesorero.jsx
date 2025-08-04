import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Gestionusuarios from './Tablas/Gestionusuarios';
import Gestioncategorizacion from './Tablas/Gestioncategorizar';
import Gestionsolicitud from './Tablas//Gestionsolicitud';
import Gestionevento from './Tablas/Gestionevento';
import Gestioninscripcion from './Tablas/Gestioninscripcion';
import Gestiontarea from './Tablas/Gestiontareas';
import Gestioncabana from './Tablas/Gestioncabana';
import Gestionreserva from './Tablas/Gestionreserva'
import "./DashboardTesorero.css"

const DashboardTesorero = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();
  const [seccionActiva, setSeccionActiva] = useState("dashboard");

  // Datos para gráficos (simulados)
  const [financialData, setFinancialData] = useState({
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    income: [4500, 5200, 4800, 5500, 6000, 5800],
    expenses: [3200, 3800, 3500, 4200, 4500, 4300]
  });

  // Datos de métricas financieras
  const financialMetrics = [
    {
      title: "Ingresos Totales",
      value: "$45,231",
      change: "+15%",
      trend: "up",
      icon: "💰",
      color: "green"
    },
    {
      title: "Gastos Operativos",
      value: "$28,450",
      change: "+8%",
      trend: "down",
      icon: "💸",
      color: "purple"
    },
    {
      title: "Balance Neto",
      value: "$16,781",
      change: "+22%",
      trend: "up",
      icon: "📊",
      color: "blue"
    },
    {
      title: "Donaciones",
      value: "$5,200",
      change: "+5%",
      trend: "up",
      icon: "❤️",
      color: "pink"
    }
  ];

  // Transacciones recientes
  const recentTransactions = [
    {
      id: 1,
      type: "ingreso",
      description: "Donación mensual",
      amount: "$1,200",
      date: "Hoy, 10:45 AM",
      icon: "⬆️"
    },
    {
      id: 2,
      type: "gasto",
      description: "Mantenimiento cabañas",
      amount: "$850",
      date: "Ayer, 3:30 PM",
      icon: "⬇️"
    },
    {
      id: 3,
      type: "ingreso",
      description: "Inscripción curso",
      amount: "$350",
      date: "Ayer, 11:20 AM",
      icon: "⬆️"
    },
    {
      id: 4,
      type: "gasto",
      description: "Materiales seminario",
      amount: "$1,450",
      date: "Lun, 9:15 AM",
      icon: "⬇️"
    }
  ];

  // Resumen de categorías
  const categoriesSummary = [
    {
      name: "Cursos",
      amount: "$12,450",
      percentage: 35,
      color: "blue"
    },
    {
      name: "Eventos",
      amount: "$8,750",
      percentage: 25,
      color: "purple"
    },
    {
      name: "Donaciones",
      amount: "$5,200",
      percentage: 15,
      color: "pink"
    },
    {
      name: "Otros",
      amount: "$8,831",
      percentage: 25,
      color: "green"
    }
  ];

  // Proyección financiera
  const financialProjection = [
    { month: 'Jul', amount: 6200 },
    { month: 'Ago', amount: 6500 },
    { month: 'Sep', amount: 6800 },
    { month: 'Oct', amount: 7100 },
    { month: 'Nov', amount: 7400 },
    { month: 'Dic', amount: 8000 }
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "/login";
  };

  useEffect(() => {
    const usuarioStorage = localStorage.getItem('usuario');
    const token = localStorage.getItem('token');

    if (!usuarioStorage || !token) {
      navigate('/login');
      return;
    }

    const usuarioData = JSON.parse(usuarioStorage);

    if (usuarioData.role !== 'tesorero') {
      navigate(usuarioData.role === 'admin' ? '/admin/users' : '/login');
      return;
    }
    setUsuario(usuarioData);
  }, [navigate]);

  if (!usuario) {
    return <div className="loading-screen">Cargando...</div>;
  }

  return (
    <div className="dashboard-tesorero">
     <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue:wght@400&display=swap" />
      <aside className={`sidebar-tesorero ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header-tesorero">
          <div className="logo-container-tesorero">
            <div className="logo-icon-tesorero">💰</div>
            <div className="logo-text-tesorero">
                <span className="luckas-tesorero">Luckas</span>
      
            </div>
          </div>
        </div>

        <nav className="sidebar-nav-tesorero">
          <div className="nav-section-tesorero">
            <h3 className="section-title-tesorero">Finanzas</h3>
            <ul>
              <li className="active"><span>📊</span> Dashboard</li>
              <li><span>💵</span> Ingresos</li>
              <li><span>📋</span> Presupuesto</li>
              <li><span>🧾</span> Facturas</li>
            </ul>
          </div>

          <div className="nav-section-tesorero">
            <h3 className="section-title-tesorero">Gestión</h3>
            <ul>
              <li className={seccionActiva === "usuarios" ? "activo" : ""}>
                <button onClick={() => setSeccionActiva("usuarios")} style={{ all: 'unset', cursor: 'pointer' }}>
                  <span>👥</span>
                  Usuarios
                </button>
              </li>
              <li className={seccionActiva === "categorizacion" ? "activo" : ""}>
                <button onClick={() => setSeccionActiva("categorizacion")} style={{ all: 'unset', cursor: 'pointer' }}>
                  <span>🏷️</span>
                  Categorizacion
                </button>
              </li>
              <li className={seccionActiva === "solicitud" ? "activo" : ""}>
                <button onClick={() => setSeccionActiva("solicitud")} style={{ all: 'unset', cursor: 'pointer' }}>
                  <span>📋</span>
                  Solicitud
                </button>
              </li>
              <li className={seccionActiva === "cabana" ? "activo" : ""} >
                <button onClick={() => setSeccionActiva("cabana")} style={{ all: 'unset', cursor: 'pointer' }}>
                  <span>🏠</span>
                  Cabañas
                </button>
              </li>
              <li><span>📚</span> Cursos</li>
              <li className={seccionActiva === "evento" ? "activo" : ""} >
                <button onClick={() => setSeccionActiva("evento")} style={{ all: 'unset', cursor: 'pointer' }}>
                  <span>🎉</span>
                  Eventos
                </button>
              </li>
              <li className={seccionActiva === "inscripcion" ? "activo" : ""} >
                <button onClick={() => setSeccionActiva("inscripcion")} style={{ all: 'unset', cursor: 'pointer' }}>
                  <span>✏️</span>
                  Inscripcion
                </button>
              </li>
              <li className={seccionActiva === "tarea" ? "activo" : ""} >
                <button onClick={() => setSeccionActiva("tarea")} style={{ all: 'unset', cursor: 'pointer' }}>
                  <span></span>
                  <span>✅</span>
                  Tareas
                </button>
              </li>
              <li className={seccionActiva === "reserva" ? "activo" : ""} >
                <button onClick={() => setSeccionActiva("reserva")} style={{ all: 'unset', cursor: 'pointer' }}>
                  <span>🔖</span>
                  Reserva
                </button>
              </li>
            </ul>
          </div>
        </nav>

        <div className="sidebar-footer-tesorero">
          <div className="user-profile-tesorero">
            <div className="avatar-tesorero">TE</div>
            <div className="user-info-tesorero">
              <p className="name-tesorero">Tesorero</p>
              <p className="email-tesorero">tesorero@seminario.com</p>
            </div>
          </div>
          <button className="logout-btn-tesorero" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content-tesorero">
        {/* Header */}
        <header className="dashboard-header-tesorero">
          <div className="header-left-tesorero">
            <button className="menu-toggle-tesorero" onClick={toggleSidebar}>
              ☰
            </button>


            <h1>
              {seccionActiva === "dashboard" && "Dashboard Principal"}
              {seccionActiva === "usuarios" && "Dashboard Principal   "}
              {seccionActiva === "categorizacion" && "Dashboard Principal"}
              {seccionActiva === "solicitud" && "Dashboard Principal"}
              {seccionActiva === "evento" && "Dashboard Principal"}
              {seccionActiva === "inscripcion" && "Dashboard Principal"}
              {seccionActiva === "tarea" && "Dashboard Principal"}
              {seccionActiva === "cabana" && "Dashboard Principal"}
              {seccionActiva === "reserva" && "Dashboard Principal"}
            </h1>
          </div>
          <div className="header-right-tesorero">
            <div className="search-box-tesorero ">
              <input type="text" placeholder="Buscar..." />
              <span>🔍</span>
            </div>
            <div className="notifications">
              <span>🔔</span>
              <div className="notification-badge">3</div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {seccionActiva === "dashboard" && (
            <>
              {/* Financial Overview */}
              <section className="financial-overview">
                <div className="section-header">
                  <h2>Resumen Financiero</h2>
                  <div className="time-filter">
                    <select>
                      <option>Este mes</option>
                      <option>Trimestre</option>
                      <option>Año</option>
                      <option>Personalizado</option>
                    </select>
                  </div>
                </div>

                <div className="metrics-grid">
                  {financialMetrics.map((metric, index) => (
                    <div key={index} className={`metric-card ${metric.color}`}>
                      <div className="metric-icon">{metric.icon}</div>
                      <div className="metric-info">
                        <h3>{metric.title}</h3>
                        <p className="value">{metric.value}</p>
                        <p className={`change ${metric.trend}`}>
                          {metric.change} <span>vs mes anterior</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="financial-chart">
                  <div className="chart-header">
                    <h3>Tendencia Financiera</h3>
                    <div className="chart-legend">
                      <div className="legend-item">
                        <span className="income-dot"></span> Ingresos
                      </div>
                      <div className="legend-item">
                        <span className="expense-dot"></span> Gastos
                      </div>
                    </div>
                  </div>
                  <div className="chart-placeholder">
                    {/* Aquí iría un gráfico real con una librería como Chart.js */}
                    <div className="chart-lines">
                      {financialData.labels.map((month, i) => (
                        <div key={i} className="chart-column">
                          <div
                            className="income-bar"
                            style={{ height: `${financialData.income[i] / 100}px` }}
                          ></div>
                          <div
                            className="expense-bar"
                            style={{ height: `${financialData.expenses[i] / 100}px` }}
                          ></div>
                          <span className="month-label">{month}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Bottom Section */}
              <div className="bottom-section">
                {/* Recent Transactions */}
                <section className="recent-transactions">
                  <div className="section-header">
                    <h2>Transacciones Recientes</h2>
                    <button className="view-all">Ver todas</button>
                  </div>

                  <div className="transactions-list">
                    {recentTransactions.map(transaction => (
                      <div key={transaction.id} className="transaction-item">
                        <div className="transaction-icon">{transaction.icon}</div>
                        <div className="transaction-details">
                          <h4>{transaction.description}</h4>
                          <p className="date">{transaction.date}</p>
                        </div>
                        <div className={`amount ${transaction.type}`}>
                          {transaction.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Financial Summary */}
                <section className="financial-summary">
                  <div className="summary-card income-distribution">
                    <h3>Distribución de Ingresos</h3>
                    <div className="distribution-chart">
                      {categoriesSummary.map((category, index) => (
                        <div
                          key={index}
                          className="distribution-slice"
                          style={{
                            backgroundColor: `var(--color-${category.color})`,
                            width: `${category.percentage}%`
                          }}
                          title={`${category.name}: ${category.amount} (${category.percentage}%)`}
                        ></div>
                      ))}
                    </div>
                    <div className="distribution-legend">
                      {categoriesSummary.map((category, index) => (
                        <div key={index} className="legend-item">
                          <span className={`dot ${category.color}`}></span>
                          {category.name} - {category.amount}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="summary-card financial-projection">
                    <h3>Proyección Financiera</h3>
                    <div className="projection-chart">
                      {financialProjection.map((item, index) => (
                        <div key={index} className="projection-item">
                          <div className="month">{item.month}</div>
                          <div className="projection-bar">
                            <div
                              className="bar-fill"
                              style={{ width: `${(item.amount / 8000) * 100}%` }}
                            ></div>
                            <span className="amount">${item.amount}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                </section>
              </div>
            </>
          )}
          {seccionActiva === "usuarios" && (
            <div className="seccion-usuarios">
              <Gestionusuarios />
            </div>
          )}
          {seccionActiva === "categorizacion" && (
            <div className="seccion-categorizacion">
              <Gestioncategorizacion />
            </div>
          )}
          {seccionActiva === "solicitud" && (
            <div className="seccion-solicitud">
              <Gestionsolicitud />
            </div>
          )}
          {seccionActiva === "evento" && (
            <div className="seccion-solicitud">
              <Gestionevento />
            </div>
          )}
          {seccionActiva === "inscripcion" && (
            <div className="seccion-solicitud">
              <Gestioninscripcion />
            </div>
          )}
          {seccionActiva === "tarea" && (
            <div className="seccion-solicitud">
              <Gestiontarea />
            </div>
          )}
          {seccionActiva === "cabana" && (
            <div className="seccion-solicitud">
              <Gestioncabana />
            </div>
          )}
          {seccionActiva === "reserva" && (
            <div className="seccion-solicitud">
              <Gestionreserva />
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default DashboardTesorero;