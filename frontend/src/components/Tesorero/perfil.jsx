
import React, { useState } from "react";
import Header from './Header/Header-tesorero';
import Footer from '../footer/Footer';
import { userService } from '../../services/userService';
import './Gestion.css';

const Perfil = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

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
    };

    const handleInputChange = (field, value) => {
        setDatosEditados((prev) => ({ ...prev, [field]: value }));
    };

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
    };

    const handlePasswordChange = (field, value) => {
        setPasswordData(prev => ({ ...prev, [field]: value }));
    };

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
    };

    return (
        <>
            <Header />
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
                                        {usuarioLogueado?.nombre?.charAt(0)}
                                        {usuarioLogueado?.apellido?.charAt(0)}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold">
                                        {usuarioLogueado?.nombre} {usuarioLogueado?.apellido}
                                    </h1>
                                    <p className="text-blue-100 text-lg">{usuarioLogueado?.role}</p>
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
                                            {usuarioLogueado?.correo}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => isEditing ? handleCancelEdit() : setIsEditing(true)}
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
                                        <p className="text-sm text-gray-600">Datos básicos del tesorero</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={datosEditados.nombre}
                                                onChange={(e) => handleInputChange("nombre", e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                        ) : (
                                            <p className="text-gray-900 py-3">{usuarioLogueado?.nombre}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={datosEditados.apellido}
                                                onChange={(e) => handleInputChange("apellido", e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                        ) : (
                                            <p className="text-gray-900 py-3">{usuarioLogueado?.apellido}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="tipoDocumento" className="block text-sm font-medium text-gray-700 mb-2">Tipo de Documento</label>
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
                                            <p className="text-gray-900 py-3">{usuarioLogueado?.tipoDocumento}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="numeroDocumento" className="block text-sm font-medium text-gray-700 mb-2">Número de Documento</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={datosEditados.numeroDocumento}
                                                onChange={(e) => handleInputChange("numeroDocumento", e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                        ) : (
                                            <p className="text-gray-900 py-3">{usuarioLogueado?.numeroDocumento}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                                        {isEditing ? (
                                            <input
                                                type="tel"
                                                value={datosEditados.telefono}
                                                onChange={(e) => handleInputChange("telefono", e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                        ) : (
                                            <p className="text-gray-900 py-3">{usuarioLogueado?.telefono}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-gray-700 mb-2">Fecha de Nacimiento</label>
                                        {isEditing ? (
                                            <input
                                                type="date"
                                                value={datosEditados.fechaNacimiento ? datosEditados.fechaNacimiento.split('T')[0] : ''}
                                                onChange={(e) => handleInputChange("fechaNacimiento", e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                        ) : (
                                            <p className="text-gray-900 py-3">{usuarioLogueado?.fechaNacimiento ? new Date(usuarioLogueado.fechaNacimiento).toLocaleDateString() : 'No especificada'}</p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                value={datosEditados.correo}
                                                onChange={(e) => handleInputChange("correo", e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                        ) : (
                                            <p className="text-gray-900 py-3">{usuarioLogueado?.correo}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Botón de guardar */}
                                {isEditing && (
                                    <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
                                        <button
                                            onClick={handleSave}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Guardar Cambios
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Security Section */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Seguridad</h3>
                                        <p className="text-sm text-gray-600">Gestiona tu contraseña y configuraciones de seguridad</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">Contraseña Actual</label>
                                        <input
                                            type="password"
                                            value={passwordData.currentPassword}
                                            onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            placeholder="Ingresa tu contraseña actual"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">Nueva Contraseña</label>
                                            <input
                                                type="password"
                                                value={passwordData.newPassword}
                                                onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                placeholder="Nueva contraseña"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirmar Contraseña</label>
                                            <input
                                                type="password"
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                placeholder="Confirmar nueva contraseña"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <button
                                            onClick={cambiarContrasena}
                                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                                />
                                            </svg>
                                            Cambiar Contraseña
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Professional Info */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Profesional</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="cargo" className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                                        <p className="text-gray-900">{usuarioLogueado?.role}</p>
                                    </div>
                                    <div>
                                        <label htmlFor="departamento" className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                                        <p className="text-gray-900">Administración Financiera</p>
                                    </div>
                                    <div>
                                        <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></div>
                                            Activo
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Account Stats */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas de Cuenta</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Última conexión</span>
                                        <span className="text-sm font-medium text-gray-900">Hoy</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Perfil completado</span>
                                        <span className="text-sm font-medium text-green-600">95%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Miembro desde</span>
                                        <span className="text-sm font-medium text-gray-900">2020</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Perfil;
             