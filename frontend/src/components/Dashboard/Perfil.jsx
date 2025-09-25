import React, { useState } from "react";
import './Dashboard.css';
import Sidebar from './Sidebar/Sidebar';
import Header from './Sidebar/Header';
import { userService } from "../../services/userService";

const Perfil = () => {
    const [sidebarAbierto, setSidebarAbierto] = useState(true);
    const [seccionActiva, setSeccionActiva] = useState("dashboard");
    const [isEditing, setIsEditing] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [adminData, setAdminData] = useState({
        nombre: "Steven",
        apellido: "Pedraza",
        tipoDocumento: "Cédula de Ciudadanía",
        numeroDocumento: "117203027",
        telefono: "3115224272",
        fechaNacimiento: "1990-05-15",
        correo: "admin@gmail.com",
        cargo: "Administrador del Sistema",
        fechaIngreso: "2020-01-15",
        permisos: "Administrador Total",
        departamento: "Tecnología",
        tema: "Claro",
        idioma: "Español",
        notificacionesPush: true,
        notificacionesEmail: true,
    })

    const handleSave = async () => {
        try {
            await actualizarPerfil();
            setShowSuccess(true);
            setIsEditing(false);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error('Error al guardar el perfil:', error);
            alert('Error al guardar los cambios');
        }
    }

    // Obtener usuario logueado desde localStorage
    const usuarioLogueado = (() => {
        try {
            const usuarioStorage = localStorage.getItem('usuario');
            return usuarioStorage ? JSON.parse(usuarioStorage) : null;
        } catch {
            return null;
        }
    })();

    // Estado para los datos editables
    const [datosEditados, setDatosEditados] = useState({
        nombre: usuarioLogueado?.nombre || "",
        apellido: usuarioLogueado?.apellido || "",
        correo: usuarioLogueado?.correo || "",
        telefono: usuarioLogueado?.telefono || "",
        tipoDocumento: usuarioLogueado?.tipoDocumento || "",
        numeroDocumento: usuarioLogueado?.numeroDocumento || "",
        fechaNacimiento: usuarioLogueado?.fechaNacimiento || "",
        // agrega más campos si los tienes
    });

    // Estado para cambio de contraseña
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });


    // Función para guardar cambios
    const actualizarPerfil = async () => {
        try {
            const response = await userService.updateOwnProfile(datosEditados);
            console.log('Perfil actualizado:', response);
            
            // Actualizar localStorage con los nuevos datos
            const usuarioActualizado = { ...usuarioLogueado, ...datosEditados };
            localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
            
            alert('Perfil actualizado correctamente');
        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
            throw error;
        }
    };


    const handleInputChange = (field, value) => {
        setDatosEditados((prev) => ({ ...prev, [field]: value }))
    }

    const handleCancelEdit = () => {
        // Resetear los datos editados a los valores originales
        setDatosEditados({
            nombre: usuarioLogueado?.nombre || "",
            apellido: usuarioLogueado?.apellido || "",
            correo: usuarioLogueado?.correo || "",
            telefono: usuarioLogueado?.telefono || "",
            tipoDocumento: usuarioLogueado?.tipoDocumento || "",
            numeroDocumento: usuarioLogueado?.numeroDocumento || "",
            fechaNacimiento: usuarioLogueado?.fechaNacimiento || "",
        });
        // Resetear campos de contraseña
        setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        });
        setIsEditing(false);
    }

    const handlePasswordChange = (field, value) => {
        setPasswordData(prev => ({ ...prev, [field]: value }));
    }

    const cambiarContrasena = async () => {
        try {
            if (!passwordData.currentPassword || !passwordData.newPassword) {
                alert('Por favor complete todos los campos de contraseña');
                return;
            }

            if (passwordData.newPassword !== passwordData.confirmPassword) {
                alert('Las contraseñas nuevas no coinciden');
                return;
            }

            if (passwordData.newPassword.length < 6) {
                alert('La nueva contraseña debe tener al menos 6 caracteres');
                return;
            }

            const response = await userService.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });

            console.log('Contraseña cambiada:', response);
            alert('Contraseña cambiada correctamente');
            
            // Limpiar campos de contraseña
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
        } catch (error) {
            console.error('Error al cambiar contraseña:', error);
            alert(error.message || 'Error al cambiar la contraseña');
        }
    }


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
                <div className="min-h-screen bg-gray-50">
                    {/* Success Notification */}
                    {showSuccess && (
                        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Perfil actualizado exitosamente
                        </div>
                    )}

                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        <div className="max-w-7xl mx-auto px-6 py-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold backdrop-blur-sm">
                                            {usuarioLogueado.nombre.charAt(0)}
                                            {usuarioLogueado.apellido.charAt(0)}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold">
                                            {usuarioLogueado.nombre} {usuarioLogueado.apellido}
                                        </h1>
                                        <p className="text-blue-100 text-lg">{usuarioLogueado.role}</p>
                                        <div className="flex items-center gap-4 mt-2 text-blue-100">
                                            <div className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                    />
                                                </svg>
                                                {usuarioLogueado.correo}
                                            </div>
                                           
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h4a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586a2 2 0 002 2h6a2 2 0 002-2L16 7"
                                        />
                                    </svg>
                                    {isEditing ? "Cancelar" : "Editar Perfil"}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Personal Information */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">Información Personal</h3>
                                            <p className="text-sm text-gray-600">Datos básicos del administrador</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={datosEditados.nombre}
                                                    onChange={(e) => handleInputChange("nombre", e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                />
                                            ) : (
                                                <p className="text-gray-900 py-3">{usuarioLogueado.nombre}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={datosEditados.apellido}
                                                    onChange={(e) => handleInputChange("apellido", e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                />
                                            ) : (
                                                <p className="text-gray-900 py-3">{usuarioLogueado.apellido}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Documento</label>
                                            {isEditing ? (
                                                <select
                                                    value={datosEditados.tipoDocumento}
                                                    onChange={(e) => handleInputChange("tipoDocumento", e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                >
                                                    <option value="Cédula de ciudadanía">Cédula de Ciudadanía</option>
                                                    <option value="Cédula de extranjería">Cédula de Extranjería</option>
                                                    <option value="Pasaporte">Pasaporte</option>
                                                    <option value="Tarjeta de identidad">Tarjeta de Identidad</option>
                                                </select>
                                            ) : (
                                                <p className="text-gray-900 py-3">{usuarioLogueado.tipoDocumento}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Número de Documento</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={datosEditados.numeroDocumento}
                                                    onChange={(e) => handleInputChange("numeroDocumento", e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                />
                                            ) : (
                                                <p className="text-gray-900 py-3">{usuarioLogueado.numeroDocumento}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                                            {isEditing ? (
                                                <input
                                                    type="tel"
                                                    value={datosEditados.telefono}
                                                    onChange={(e) => handleInputChange("telefono", e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                />
                                            ) : (
                                                <p className="text-gray-900 py-3">{usuarioLogueado.telefono}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Nacimiento</label>
                                            {isEditing ? (
                                                <input
                                                    type="date"
                                                    value={datosEditados.fechaNacimiento ? datosEditados.fechaNacimiento.split('T')[0] : ''}
                                                    onChange={(e) => handleInputChange("fechaNacimiento", e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                />
                                            ) : (
                                                <p className="text-gray-900 py-3">{new Date(usuarioLogueado.fechaNacimiento).toLocaleDateString()}</p>
                                            )}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
                                            {isEditing ? (
                                                <input
                                                    type="email"
                                                    value={datosEditados.correo}
                                                    onChange={(e) => handleInputChange("correo", e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                />
                                            ) : (
                                                <p className="text-gray-900 py-3">{usuarioLogueado.correo}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Professional Information */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">Información Profesional</h3>
                                            <p className="text-sm text-gray-600">Datos administrativos y permisos</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Cargo</label>
                                            <p className="text-gray-900 py-3">{usuarioLogueado.role} del Sistema</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Departamento</label>
                                            <p className="text-gray-900 py-3">{adminData.departamento}</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Ingreso</label>
                                            <p className="text-gray-900 py-3">{new Date(adminData.fechaIngreso).toLocaleDateString()}</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Nivel de Permisos</label>
                                            <p className="text-gray-900 py-3">
                                                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                                                    {usuarioLogueado.role} Total
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Security Section */}
                                {isEditing && (
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">Seguridad de la Cuenta</h3>
                                                <p className="text-sm text-gray-600">Actualiza tu contraseña para mantener tu cuenta segura</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña Actual</label>
                                                <input
                                                    type="password"
                                                    value={passwordData.currentPassword}
                                                    onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                    placeholder="Ingresa tu contraseña actual"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Nueva Contraseña</label>
                                                <input
                                                    type="password"
                                                    value={passwordData.newPassword}
                                                    onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                    placeholder="Ingresa tu nueva contraseña"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Nueva Contraseña</label>
                                                <input
                                                    type="password"
                                                    value={passwordData.confirmPassword}
                                                    onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                    placeholder="Confirma tu nueva contraseña"
                                                />
                                            </div>

                                            {/* Botón para cambiar contraseña */}
                                            <div className="pt-4">
                                                <button
                                                    onClick={cambiarContrasena}
                                                    className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2-2v6a2 2 0 002 2h6z" />
                                                    </svg>
                                                    Cambiar Contraseña
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Preferences */}
                                {isEditing && (
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">Preferencias</h3>
                                                <p className="text-sm text-gray-600">Personaliza tu experiencia en el sistema</p>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tema de la Interfaz</label>
                                                    <select
                                                        value={usuarioLogueado.tema}
                                                        onChange={(e) => handleInputChange("tema", e.target.value)}
                                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                    >
                                                        <option>Claro</option>
                                                        <option>Oscuro</option>
                                                        <option>Automático</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
                                                    <select
                                                        value={usuarioLogueado.idioma}
                                                        onChange={(e) => handleInputChange("idioma", e.target.value)}
                                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                    >
                                                        <option>Español</option>
                                                        <option>English</option>
                                                        <option>Português</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">Notificaciones Push</h4>
                                                        <p className="text-sm text-gray-600">Recibe notificaciones en tiempo real</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleInputChange("notificacionesPush", !usuarioLogueado.notificacionesPush)}
                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${usuarioLogueado.notificacionesPush ? "bg-blue-600" : "bg-gray-200"
                                                            }`}
                                                    >
                                                        <span
                                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${usuarioLogueado.notificacionesPush ? "translate-x-6" : "translate-x-1"
                                                                }`}
                                                        />
                                                    </button>
                                                </div>

                                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">Notificaciones por Email</h4>
                                                        <p className="text-sm text-gray-600">Recibe resúmenes y alertas por correo</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleInputChange("notificacionesEmail", !usuarioLogueado.notificacionesEmail)}
                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${usuarioLogueado.notificacionesEmail ? "bg-blue-600" : "bg-gray-200"
                                                            }`}
                                                    >
                                                        <span
                                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${usuarioLogueado.notificacionesEmail ? "translate-x-6" : "translate-x-1"
                                                                }`}
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                {isEditing && (
                                    <div className="flex gap-4">
                                        <button
                                            onClick={handleSave}
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Guardar Cambios
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Quick Stats */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas Rápidas</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Usuarios Gestionados</span>
                                            <span className="font-semibold text-blue-600">156</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Reportes Generados</span>
                                            <span className="font-semibold text-green-600">89</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Configuraciones</span>
                                            <span className="font-semibold text-purple-600">24</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Tiempo Activo</span>
                                            <span className="font-semibold text-orange-600">4 años</span>
                                        </div>
                                    </div>
                                </div>

                                {/* System Status */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado del Sistema</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                            <span className="text-sm text-gray-600">Servicios Operativos</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                            <span className="text-sm text-gray-600">Base de Datos</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                            <span className="text-sm text-gray-600">Mantenimiento Programado</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Activity */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
                                    <div className="space-y-3">
                                        <div className="text-sm">
                                            <p className="text-gray-900 font-medium">Usuario creado</p>
                                            <p className="text-gray-500">Hace 2 horas</p>
                                        </div>
                                        <div className="text-sm">
                                            <p className="text-gray-900 font-medium">Configuración actualizada</p>
                                            <p className="text-gray-500">Hace 5 horas</p>
                                        </div>
                                        <div className="text-sm">
                                            <p className="text-gray-900 font-medium">Reporte generado</p>
                                            <p className="text-gray-500">Ayer</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Perfil;