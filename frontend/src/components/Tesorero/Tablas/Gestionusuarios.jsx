import React, { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import UsuarioModal from '../modal/UsuarioModal';
import { userService } from '../../../services/userService'
import { mostrarAlerta } from '../../utils/alertas';
import Header from '../Header/Header-tesorero'
import Footer from '../../footer/Footer'



const Gestionusuarios = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedEstado, setSelectedEstado] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  // Datos de ejemplo
  const [usuarios, setUsuarios] = useState([]);
  // Ref para el botón de compartir
  const compartirBtnRef = useRef(null);

  // Función para descargar usuarios como PDF
  const handleDescargarPDF = () => {
    if (!usuarios.length) return;
  const doc = new jsPDF({ orientation: 'landscape' });
  // pageWidth y pageHeight se definen aquí y se usan en addContent
    const pageWidth = doc.internal.pageSize.getWidth();
    // Logo Luckas (base64)
    const logoUrl = process.env.PUBLIC_URL + '/logo192.png';
    // Encabezado
    const title = 'LUCKAS - Panel del Tesorero';
    const subtitle = 'Lista de Usuarios';
    const fecha = new Date().toLocaleString();

    // Cargar logo y generar PDF
    const addContent = (logoBase64) => {
    // Fondo degradado minimalista
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

      // Logo semitransparente y centrado
      if (logoBase64) {
        doc.addImage(logoBase64, 'PNG', pageWidth/2 - 18, 10, 36, 36, undefined, 'FAST');
        doc.setDrawColor(230);
        doc.setLineWidth(0.5);
        doc.line(pageWidth/2 - 20, 48, pageWidth/2 + 20, 48);
      }

      // Encabezado elegante
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(41, 128, 185);
      doc.text(title, pageWidth/2, 60, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(13);
      doc.setTextColor(30, 30, 30);
      doc.text(subtitle, pageWidth/2, 70, { align: 'center' });
      doc.setFontSize(10);
      doc.setTextColor(120, 120, 120);
      doc.text(`Generado: ${fecha}`, pageWidth - 20, 70, { align: 'right' });

      // Tabla premium
      const columns = [
        { header: 'ID', dataKey: 'id' },
        { header: 'NOMBRE', dataKey: 'nombre' },
        { header: 'APELLIDO', dataKey: 'apellido' },
        { header: 'TIPO DE DOCUMENTO', dataKey: 'tipoDocumento' },
        { header: 'NUMERO DE DOCUMENTO', dataKey: 'numeroDocumento' },
        { header: 'CORREO', dataKey: 'correo' },
        { header: 'TELEFONO', dataKey: 'telefono' },
        { header: 'ROL', dataKey: 'role' },
        { header: 'ESTADO', dataKey: 'estado' }
      ];
      const rows = usuarios.map(user => ({
        id: user._id,
        nombre: user.nombre,
        apellido: user.apellido,
        tipoDocumento: user.tipoDocumento,
        numeroDocumento: user.numeroDocumento,
        correo: user.correo,
        telefono: user.telefono,
        role: user.role,
        estado: user.estado
      }));
      autoTable(doc, {
        columns,
        body: rows,
        startY: 80,
        margin: { left: 10, right: 13 },
        styles: {
          fontSize: 9,
          halign: 'center',
          cellPadding: 2,
          textColor: [30, 30, 30],
          lineColor: [230, 230, 230],
          lineWidth: 0.2,
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
          halign: 'center',
          lineWidth: 0.5,
          lineColor: [41, 128, 185],
        },
        alternateRowStyles: {
          fillColor: [240, 243, 248],
        },
        tableLineColor: [230, 230, 230],
        tableLineWidth: 0.2,
        columnStyles: {
          id: { cellWidth: 32 },
          nombre: { cellWidth: 22 },
          apellido: { cellWidth: 22 },
          tipoDocumento: { cellWidth: 28 },
          numeroDocumento: { cellWidth: 28 },
          correo: { cellWidth: 38 },
          telefono: { cellWidth: 22 },
          role: { cellWidth: 18 },
          estado: { cellWidth: 18 },
        },
        didDrawPage: (data) => {
          // Pie de página en cada página
          doc.setDrawColor(230);
          doc.setLineWidth(0.5);
          doc.line(14, pageHeight - 18, pageWidth - 14, pageHeight - 18);
          doc.setFontSize(9);
          doc.setTextColor(120, 120, 120);
          doc.text('Sistema Luckas · Seminario Bautista de Colombia · Experiencia premium', pageWidth / 2, pageHeight - 10, { align: 'center' });
        },
        useCss: true,
      });

      // Pie de página minimalista
      doc.setDrawColor(230);
      doc.setLineWidth(0.5);
      doc.line(14, doc.internal.pageSize.getHeight() - 18, pageWidth - 14, doc.internal.pageSize.getHeight() - 18);
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text('Sistema Luckas · Seminario Bautista de Colombia · Experiencia premium', pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
      doc.save('usuarios.pdf');
    };

    // Convertir logo a base64 y generar PDF
    fetch(logoUrl)
      .then(response => response.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = function () {
          addContent(reader.result);
        };
        reader.readAsDataURL(blob);
      })
      .catch(() => addContent(null));
  };

  // Función para compartir (copiar CSV al portapapeles)
  const handleCompartir = async () => {
    if (!usuarios.length) return;
    const header = [
      'ID', 'NOMBRE', 'APELLIDO', 'TIPO DE DOCUMENTO', 'NUMERO DE DOCUMENTO', 'CORREO', 'TELEFONO', 'ROL', 'ESTADO'
    ];
    const rows = usuarios.map(user => [
      user._id,
      user.nombre,
      user.apellido,
      user.tipoDocumento,
      user.numeroDocumento,
      user.correo,
      user.telefono,
      user.role,
      user.estado
    ]);
    const csvContent = [header, ...rows].map(e => e.join(",")).join("\n");
    try {
      await navigator.clipboard.writeText(csvContent);
      mostrarAlerta('¡Compartido!', 'Datos de usuarios copiados al portapapeles.');
    } catch (err) {
      mostrarAlerta('Error', 'No se pudo copiar al portapapeles.', 'error');
    }
  };
  const [showModal, setShowModalUsuario] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentItem, setCurrentItem] = useState(null);

  const handleCreate = () => {
    setModalMode('create');
    setCurrentItem(null);
    setShowModalUsuario(true);
  };

  //------------------------------------------------------------------------------------------------------------------------------------
  //obtener usuarios
  const obtenerUsuarios = async () => {
    try {
      const data = await userService.getAllUsers();
      const usuariosData = Array.isArray(data.data) ? data.data : [];
      setUsuarios(usuariosData);
    } catch (error) {
      console.error("Error al obtener los usuarios de la base de datos", error.mensage);
    }
  };
  useEffect(() => {
    obtenerUsuarios();
  }, []);

  // Filtrar usuarios por el término de búsqueda
  const usuariosFiltrados = usuarios.filter(user => {
    const term = searchTerm.trim().toLowerCase();
    let match = true;
    if (term) {
      match = (
        (user.nombre && user.nombre.toLowerCase().includes(term)) ||
        (user.apellido && user.apellido.toLowerCase().includes(term)) ||
        (user.correo && user.correo.toLowerCase().includes(term)) ||
        (user.numeroDocumento && user.numeroDocumento.toLowerCase().includes(term)) ||
        (user.telefono && user.telefono.toLowerCase().includes(term)) ||
        (user.role && user.role.toLowerCase().includes(term)) ||
        (user.estado && user.estado.toLowerCase().includes(term))
      );
    }
    if (selectedRole && user.role !== selectedRole) return false;
    if (selectedEstado && user.estado && user.estado.toLowerCase() !== selectedEstado.toLowerCase()) return false;
    return match;
  });

  const handleSubmit = async (Usuariodata) => {
    try {
      if (modalMode === 'create') {
          console.log("Datos enviados al backend:", Usuariodata); // <-- Verifica aquí
        await userService.createUser(Usuariodata)
        mostrarAlerta("¡Éxito!", "Usuario creado exitosamente");

      } else {
        await userService.updateUser(currentItem._id, Usuariodata);
        mostrarAlerta("¡Éxito!", "Usuario actualizado exitosamente");
        obtenerUsuarios();
      }
      setShowModalUsuario(false);
      obtenerUsuarios();
    } catch (error) {
      mostrarAlerta( 'Error','Error al procesar el usuario','error' );
    };
  };

  return (
    <> 
    <Header />
    <main className="main-content-tesorero">
      <div className="page-header-tesorero">
        <div className="card-header-tesorero">
          <button className="back-btn-tesorero">
            <i className="fas fa-arrow-left"></i>
          </button>
          <div className="page-title-tesorero">
            <h1>Gestión de Usuarios</h1>
            <p>Administr a las cuentas de usuario del sistema</p>
          </div>
        </div>

        <button className="btn-primary-tesorero" onClick={handleCreate}>
          <i className="fas fa-plus"></i>
          Nuevo Usuario
        </button>
      </div>
      <div className="stats-grid-usuarios">
        <div className="stat-card-usuarios">
          <div className="stat-icon-usuarios blue">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number-usuarios" id="totalUsers">{usuarios.length}</div>
            <div className="stat-label-usuarios">Total Usuarios</div>
          </div>
        </div>
        <div className="stat-card-usuarios">
          <div className="stat-icon-usuarios green">
            <i className="fas fa-user-check"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number-usuarios" id="activeUsers">{usuarios.filter(u => u.estado && u.estado.toLowerCase() === 'activo').length}</div>
            <div className="stat-label-usuarios">Usuarios Activos</div>
          </div>
        </div>
        <div className="stat-card-usuarios">
          <div className="stat-icon-usuarios purple">
            <i className="fas fa-user-shield"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number-usuarios" id="adminUsers">1</div>
            <div className="stat-label-usuarios">Administradores</div>
          </div>
        </div>
        <div className="stat-card-usuarios">
          <div className="stat-icon-usuarios orange">
            <i className="fas fa-user-plus"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number-usuarios" id="newUsers">12</div>
            <div className="stat-label-usuarios">Nuevos Este Mes</div>
          </div>
        </div>
      </div>

      <div className="filters-section-tesorero">
        <div className="search-filters-tesorero">
          <div className="search-input-container-tesorero">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Buscar usuarios..."
              id="userSearch"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="filter-select" value={selectedRole} onChange={e => setSelectedRole(e.target.value)}>
            <option value="">Todos los roles</option>
            <option value="tesorero">Tesorero</option>
            <option value="seminarista">Seminarista</option>
            <option value="externo">Externo</option>
          </select>
          <select id="statusFilter" className="filter-select" value={selectedEstado} onChange={e => setSelectedEstado(e.target.value)}>
            <option value="">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
        <div className="export-actions">
          <button className="btn-outline-tesorero" onClick={handleDescargarPDF}>
            <i className="fas fa-download"></i>
          </button>
          <button className="btn-outline-tesorero" ref={compartirBtnRef} onClick={handleCompartir}>
            <i className="fas fa-share"></i>
          </button>
        </div>
      </div>

      <div className="table-container-tesorero">
        <table className="users-table-tesorero">
          <thead>
            <tr>
              <th>
                <input type="checkbox" id="selectAll"></input>
              </th>
              <th>ID</th>
              <th>NOMBRE</th>
              <th>APELLIDO</th>
              <th>TIPO DE DOCUEMENTO</th>
              <th>NUMERO DE DOCUMENTO </th>
              <th>CORREO</th>
              <th>TELEFONO</th>
              <th>ROL</th>
              <th>ESTADO</th>
              <th>ACCINES</th>
            </tr>
          </thead>
          <tbody id="usersTableBody">
            {usuariosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={11}>No hay usuarios para mostrar</td>
              </tr>
            ) : (
              usuariosFiltrados.map((user) => (
                <tr key={user._id}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>{user._id}</td>
                  <td>{user.nombre}</td>
                  <td>{user.apellido}</td>
                  <td>{user.tipoDocumento}</td>
                  <td>{user.numeroDocumento}</td>
                  <td>{user.correo}</td>
                  <td>{user.telefono}</td>
                  <td>
                    <span
                      className={`role-badge ${user.role === "admin"
                        ? "role-administrador"
                        : user.role === "tesorero"
                          ? "role-tesorero"
                          : "role-seminarista"
                        }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td>
                      <span className={`badge-tesorero badge-tesorero-${user.estado}`}>
                        {user.estado}
                      </span>
                  </td>
                  <td className='actions-cell'>
                    <button className='action-btn edit'
                      onClick={() => {
                        setModalMode('edit');
                        setCurrentItem(user);
                        setShowModalUsuario(true);
                      }}>
                      <i className="fas fa-edit"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}

          </tbody>
        </table>
      </div>

      {showModal && (
        <UsuarioModal
          mode={modalMode}
          initialData={currentItem || {}}
          onClose={() => setShowModalUsuario(false)}
          onSubmit={handleSubmit}
        />
      )}
    </main>
    <Footer />
    </>

  );
};

export default Gestionusuarios;