
import React, { useState } from "react";
import PropTypes from 'prop-types';
import Header from './Header/Header-tesorero';
import Footer from '../footer/Footer';
import { Check, Mail, Edit, User, Lock, Eye, EyeOff } from 'lucide-react';
import { userService } from '../../services/userService';
import './Gestion.css';
import { mostrarAlerta } from "../utils/alertas";

// Constantes para mensajes de validación de credenciales
const CREDENTIAL_MESSAGES = {
  CURRENT_REQUIRED: 'Credencial actual requerida',
  NEW_REQUIRED: 'Nueva credencial requerida',
  MIN_LENGTH: 'Debe tener al menos 6 caracteres',
  NO_MATCH: 'Las credenciales no coinciden',
};

// Helpers fuera del componente para reducir complejidad
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
function validateEmailFormat(email) {
    return emailRegex.test(String(email || ''));
}

function computePasswordErrors(credentialData) {
    const errs = {};
    const current = credentialData.currentPassword;
    const newCred = credentialData.newPassword;
    const confirm = credentialData.confirmPassword;

    if (current !== undefined && current === '') errs.currentPassword = CREDENTIAL_MESSAGES.CURRENT_REQUIRED;

    if (newCred !== undefined) {
        if (!newCred) errs.newPassword = CREDENTIAL_MESSAGES.NEW_REQUIRED;
        else if (newCred.length < 6) errs.newPassword = CREDENTIAL_MESSAGES.MIN_LENGTH;
    }
    if (confirm !== undefined && newCred !== undefined && newCred && confirm !== newCred) {
        errs.confirmPassword = CREDENTIAL_MESSAGES.NO_MATCH;
    }

    return errs;
}

function isPlainObject(val) {
    return val && typeof val === 'object' && !Array.isArray(val);
}

function processErrorsObject(errorsObj, target) {
    for (const [k, v] of Object.entries(errorsObj || {})) {
        target[k] = Array.isArray(v) ? v.join(' ') : String(v);
    }
}

function processErrorsArray(errorsArr, target) {
    for (const errItem of (errorsArr || [])) {
        if (errItem && errItem.param) target[errItem.param] = errItem.msg || errItem.message || '';
    }
}

function mapServiceErrorDetailsToFieldErrors(details) {
    const fieldErrs = {};
    if (!details || typeof details !== 'object') return fieldErrs;

    if (isPlainObject(details.errors)) {
        processErrorsObject(details.errors, fieldErrs);
    } else if (Array.isArray(details.errors)) {
        processErrorsArray(details.errors, fieldErrs);
    }

    if (!Object.keys(fieldErrs).length && details.message) fieldErrs.currentPassword = details.message;
    return fieldErrs;
}

function validatePersonalData(datos) {
    const errors = {};
    if (!datos.nombre || datos.nombre.trim() === '') errors.nombre = 'El nombre es requerido';
    if (!datos.apellido || datos.apellido.trim() === '') errors.apellido = 'El apellido es requerido';
    if (!datos.correo || datos.correo.trim() === '') errors.correo = 'El correo es requerido';
    else if (!validateEmailFormat(datos.correo)) errors.correo = 'Correo con formato inválido';
    return errors;
}

function canEnableSave(datos, isEditing) {
    if (!isEditing) return false;
    const nombre = datos.nombre ? datos.nombre.trim() : '';
    const apellido = datos.apellido ? datos.apellido.trim() : '';
    const correo = datos.correo ? datos.correo.trim() : '';
    if (!nombre || !apellido || !correo) return false;
    return validateEmailFormat(correo);
}

function PerfilView({
    usuarioLogueado,
    isEditing,
    setIsEditing,
    handleCancelEdit,
    datosEditados,
    handleInputChange,
    datosErrors,
    canSave,
    handleSave,
    passwordData,
    passwordErrors,
    handlePasswordChange,
    showCurrentPassword,
    setShowCurrentPassword,
    showNewPassword,
    setShowNewPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    cambiarContrasena
}) {
    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50">
                <ProfileHeader
                    usuarioLogueado={usuarioLogueado}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    handleCancelEdit={handleCancelEdit}
                />

                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <PersonalInfoCard
                                usuarioLogueado={usuarioLogueado}
                                isEditing={isEditing}
                                datosEditados={datosEditados}
                                handleInputChange={handleInputChange}
                                datosErrors={datosErrors}
                                canSave={canSave}
                                handleSave={handleSave}
                            />

                            <SecurityCard
                                passwordData={passwordData}
                                handlePasswordChange={handlePasswordChange}
                                passwordErrors={passwordErrors}
                                showCurrentPassword={showCurrentPassword}
                                setShowCurrentPassword={setShowCurrentPassword}
                                showNewPassword={showNewPassword}
                                setShowNewPassword={setShowNewPassword}
                                showConfirmPassword={showConfirmPassword}
                                setShowConfirmPassword={setShowConfirmPassword}
                                cambiarContrasena={cambiarContrasena}
                            />
                        </div>
                        <SidebarSection usuarioLogueado={usuarioLogueado} />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

// Subcomponentes para reducir complejidad de PerfilView
function ProfileHeader({ usuarioLogueado, isEditing, setIsEditing, handleCancelEdit }) {
    return (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold backdrop-blur-sm">
                                {usuarioLogueado?.nombre?.charAt(0)}{usuarioLogueado?.apellido?.charAt(0)}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">{usuarioLogueado?.nombre} {usuarioLogueado?.apellido}</h1>
                            <p className="text-blue-100 text-lg">{usuarioLogueado?.role}</p>
                            <div className="flex items-center gap-4 mt-2 text-blue-100">
                                <div className="flex items-center gap-1"><Mail className="w-4 h-4" />{usuarioLogueado?.correo}</div>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => isEditing ? handleCancelEdit() : setIsEditing(true)}
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                    >
                        <Edit className="w-5 h-5" />{isEditing ? 'Cancelar' : 'Editar Perfil'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function PersonalInfoCard({ usuarioLogueado, isEditing, datosEditados, handleInputChange, datosErrors, canSave, handleSave }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><User className="w-5 h-5 text-blue-600" /></div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Información Personal</h3>
                    <p className="text-sm text-gray-600">Datos básicos del tesorero</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                    {isEditing ? (
                        <input id="nombre" name="nombre" type="text" value={datosEditados.nombre} onChange={(e) => handleInputChange('nombre', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
                    ) : (<p className="text-gray-900 py-3">{usuarioLogueado?.nombre}</p>)}
                    {datosErrors.nombre && <p className="text-red-600 text-sm mt-1">{datosErrors.nombre}</p>}
                </div>

                <div>
                    <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                    {isEditing ? (
                        <input id="apellido" name="apellido" type="text" value={datosEditados.apellido} onChange={(e) => handleInputChange('apellido', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
                    ) : (<p className="text-gray-900 py-3">{usuarioLogueado?.apellido}</p>)}
                    {datosErrors.apellido && <p className="text-red-600 text-sm mt-1">{datosErrors.apellido}</p>}
                </div>

                <div>
                    <label htmlFor="tipoDocumento" className="block text-sm font-medium text-gray-700 mb-2">Tipo de Documento</label>
                    {isEditing ? (
                        <select id="tipoDocumento" name="tipoDocumento" value={datosEditados.tipoDocumento} onChange={(e) => handleInputChange('tipoDocumento', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                            <option value="Cédula de ciudadanía">Cédula de Ciudadanía</option>
                            <option value="Cédula de extranjería">Cédula de Extranjería</option>
                            <option value="Pasaporte">Pasaporte</option>
                            <option value="Tarjeta de identidad">Tarjeta de Identidad</option>
                        </select>
                    ) : (<p className="text-gray-900 py-3">{usuarioLogueado?.tipoDocumento}</p>)}
                </div>

                <div>
                    <label htmlFor="numeroDocumento" className="block text-sm font-medium text-gray-700 mb-2">Número de Documento</label>
                    {isEditing ? (
                        <input id="numeroDocumento" name="numeroDocumento" type="text" value={datosEditados.numeroDocumento} onChange={(e) => handleInputChange('numeroDocumento', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
                    ) : (<p className="text-gray-900 py-3">{usuarioLogueado?.numeroDocumento}</p>)}
                </div>

                <div>
                    <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                    {isEditing ? (
                        <input id="telefono" name="telefono" type="tel" value={datosEditados.telefono} onChange={(e) => handleInputChange('telefono', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
                    ) : (<p className="text-gray-900 py-3">{usuarioLogueado?.telefono}</p>)}
                </div>

                <div>
                    <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-gray-700 mb-2">Fecha de Nacimiento</label>
                    {isEditing ? (
                        <input id="fechaNacimiento" name="fechaNacimiento" type="date" value={datosEditados.fechaNacimiento ? datosEditados.fechaNacimiento.split('T')[0] : ''} onChange={(e) => handleInputChange('fechaNacimiento', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
                    ) : (<p className="text-gray-900 py-3">{usuarioLogueado?.fechaNacimiento ? new Date(usuarioLogueado.fechaNacimiento).toLocaleDateString() : 'No especificada'}</p>)}
                </div>

                <div className="md:col-span-2">
                    <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
                    {isEditing ? (
                        <input id="correo" name="correo" type="email" value={datosEditados.correo} onChange={(e) => handleInputChange('correo', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
                    ) : (<p className="text-gray-900 py-3">{usuarioLogueado?.correo}</p>)}
                    {datosErrors.correo && <p className="text-red-600 text-sm mt-1">{datosErrors.correo}</p>}
                </div>
            </div>

            {isEditing && (
                <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
                    <button type="button" onClick={handleSave} disabled={!canSave} aria-disabled={!canSave} className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 text-white ${canSave ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 opacity-50 cursor-not-allowed'}`}>
                        <Check className="w-5 h-5" /> Guardar Cambios
                    </button>
                </div>
            )}
        </div>
    );
}

function SecurityCard({ passwordData, handlePasswordChange, passwordErrors, showCurrentPassword, setShowCurrentPassword, showNewPassword, setShowNewPassword, showConfirmPassword, setShowConfirmPassword, cambiarContrasena }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center"><Lock className="w-5 h-5 text-red-600" /></div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Seguridad</h3>
                    <p className="text-sm text-gray-600">Gestiona tus credenciales y configuraciones de seguridad</p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">Credencial Actual</label>
                    <div className="relative">
                        <input id="currentPassword" name="currentPassword" type={showCurrentPassword ? 'text' : 'password'} value={passwordData.currentPassword} onChange={(e) => handlePasswordChange('currentPassword', e.target.value)} className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="Ingresa tu credencial actual" />
                        <button type="button" onClick={() => setShowCurrentPassword(s => !s)} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700" aria-label={showCurrentPassword ? 'Ocultar credencial actual' : 'Mostrar credencial actual'}>{showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                    </div>
                    {passwordErrors.currentPassword && <p className="text-red-600 text-sm mt-1">{passwordErrors.currentPassword}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">Nueva Credencial</label>
                            <div className="relative">
                                <input id="newPassword" name="newPassword" type={showNewPassword ? 'text' : 'password'} value={passwordData.newPassword} onChange={(e) => handlePasswordChange('newPassword', e.target.value)} className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="Nueva credencial" />
                                <button type="button" onClick={() => setShowNewPassword(s => !s)} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700" aria-label={showNewPassword ? 'Ocultar nueva credencial' : 'Mostrar nueva credencial'}>{showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                            </div>
                            {passwordErrors.newPassword && <p className="text-red-600 text-sm mt-1">{passwordErrors.newPassword}</p>}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirmar Credencial</label>
                        <div className="relative">
                            <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={passwordData.confirmPassword} onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)} className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="Confirmar nueva credencial" />
                            <button type="button" onClick={() => setShowConfirmPassword(s => !s)} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700" aria-label={showConfirmPassword ? 'Ocultar confirmación de credencial' : 'Mostrar confirmación de credencial'}>{showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                        </div>
                        {passwordErrors.confirmPassword && <p className="text-red-600 text-sm mt-1">{passwordErrors.confirmPassword}</p>}
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button onClick={cambiarContrasena} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2">
                        <Lock className="w-5 h-5" /> Cambiar Credencial
                    </button>
                </div>
            </div>
        </div>
    );
}

function SidebarSection({ usuarioLogueado }) {
    return (
        <div className="space-y-6">
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
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1" />Activo</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas de Cuenta</h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center"><span className="text-sm text-gray-600">Última conexión</span><span className="text-sm font-medium text-gray-900">Hoy</span></div>
                    <div className="flex justify-between items-center"><span className="text-sm text-gray-600">Perfil completado</span><span className="text-sm font-medium text-green-600">95%</span></div>
                    <div className="flex justify-between items-center"><span className="text-sm text-gray-600">Miembro desde</span><span className="text-sm font-medium text-gray-900">2020</span></div>
                </div>
            </div>
        </div>
    );
}


const Perfil = ()   =>{
    const [isEditing, setIsEditing] = useState(false);

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

    // Errores de validación para información personal
    const [datosErrors, setDatosErrors] = useState({});

    // Estado para cambio de contraseña
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    // Errores de validación para contraseña
    const [passwordErrors, setPasswordErrors] = useState({});

    // Mostrar/ocultar contraseñas
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Función para guardar cambios
    const actualizarPerfil = async () => {
        try {
            await userService.updateOwnProfile(datosEditados);
            // Actualizar localStorage con los nuevos datos
            const usuarioActualizado = { ...usuarioLogueado, ...datosEditados };
            localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));

            mostrarAlerta('Éxito', 'Perfil actualizado correctamente', 'success');
        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
            throw error;
        }
    };

    const handleSave = async () => {
        const errors = validatePersonalData(datosEditados);
        setDatosErrors(errors);
        if (Object.keys(errors).length > 0) return;

        try {
            await actualizarPerfil();
            setIsEditing(false);
        } catch (error) {
            console.error('Error al guardar el perfil:', error);
            mostrarAlerta('Error', 'Error al guardar los cambios', 'error');
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
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setDatosErrors({});
        setPasswordErrors({});
        setIsEditing(false);
    };

    const handlePasswordChange = (field, value) => {
        setPasswordData(prev => {
            const updated = { ...prev, [field]: value };
            // Validación en tiempo real tras cada cambio
            const errs = computePasswordErrors(updated);
            setPasswordErrors(errs);
            return updated;
        });
    };

    const cambiarContrasena = async () => {
        // Validación final antes de enviar
        const errs = computePasswordErrors(passwordData);
        setPasswordErrors(errs);
        if (Object.keys(errs).length > 0) return;

        try {
            await userService.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            mostrarAlerta('Éxito', 'Credencial actualizada correctamente', 'success');

            // Limpiar campos de contraseña y errores
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            setPasswordErrors({});
        } catch (error) {
            console.error('Error al cambiar credencial:', error);
            const details = error?.details || null;
            const msg = details?.message || error.message || 'Error al actualizar la credencial';
            const fieldErrs = mapServiceErrorDetailsToFieldErrors(details);
            if (Object.keys(fieldErrs).length) setPasswordErrors(prev => ({ ...prev, ...fieldErrs }));
            mostrarAlerta('Error', msg, 'error');
        }
    };

    // Determina si se puede habilitar el botón Guardar
    const canSave = canEnableSave(datosEditados, isEditing);

    return (
        <PerfilView
            usuarioLogueado={usuarioLogueado}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            handleCancelEdit={handleCancelEdit}
            datosEditados={datosEditados}
            handleInputChange={handleInputChange}
            datosErrors={datosErrors}
            canSave={canSave}
            handleSave={handleSave}
            passwordData={passwordData}
            passwordErrors={passwordErrors}
            handlePasswordChange={handlePasswordChange}
            showCurrentPassword={showCurrentPassword}
            setShowCurrentPassword={setShowCurrentPassword}
            showNewPassword={showNewPassword}
            setShowNewPassword={setShowNewPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            cambiarContrasena={cambiarContrasena}
        />
    );
};
PerfilView.propTypes = {
    usuarioLogueado: PropTypes.object,
    isEditing: PropTypes.bool,
    setIsEditing: PropTypes.func,
    handleCancelEdit: PropTypes.func,
    datosEditados: PropTypes.object,
    handleInputChange: PropTypes.func,
    datosErrors: PropTypes.object,
    canSave: PropTypes.bool,
    handleSave: PropTypes.func,
    passwordData: PropTypes.object,
    passwordErrors: PropTypes.object,
    handlePasswordChange: PropTypes.func,
    showCurrentPassword: PropTypes.bool,
    setShowCurrentPassword: PropTypes.func,
    showNewPassword: PropTypes.bool,
    setShowNewPassword: PropTypes.func,
    showConfirmPassword: PropTypes.bool,
    setShowConfirmPassword: PropTypes.func,
    cambiarContrasena: PropTypes.func
}


// PropTypes para validar props y evitar las advertencias S6774
ProfileHeader.propTypes = {
    usuarioLogueado: PropTypes.object,
    isEditing: PropTypes.bool,
    setIsEditing: PropTypes.func,
    handleCancelEdit: PropTypes.func
};

PersonalInfoCard.propTypes = {
    usuarioLogueado: PropTypes.object,
    isEditing: PropTypes.bool,
    datosEditados: PropTypes.object,
    handleInputChange: PropTypes.func,
    datosErrors: PropTypes.object,
    canSave: PropTypes.bool,
    handleSave: PropTypes.func
};

SecurityCard.propTypes = {
    passwordData: PropTypes.object,
    handlePasswordChange: PropTypes.func,
    passwordErrors: PropTypes.object,
    showCurrentPassword: PropTypes.bool,
    setShowCurrentPassword: PropTypes.func,
    showNewPassword: PropTypes.bool,
    setShowNewPassword: PropTypes.func,
    showConfirmPassword: PropTypes.bool,
    setShowConfirmPassword: PropTypes.func,
    cambiarContrasena: PropTypes.func
};

SidebarSection.propTypes = { usuarioLogueado: PropTypes.object };


export default Perfil;
             