import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import './olvidarpassword.css'

import { enviarCodigoRecuperacion, cambiarContraseñaService } from '../../services/authService';

const OlvidarPassword = () => {
    const [step, setStep] = useState("email"); // email | code | password | success
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();


    // --- Handlers conectados a la API ---
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    // 1. Enviar código al correo
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMsg("");
        if (!email.includes("@")) {
            setError("Correo inválido");
            return;
        }
        setLoading(true);
        try {
            await enviarCodigoRecuperacion.enviarCodigo(email);
            setStep("code");
            setSuccessMsg("Código enviado a tu correo electrónico");
        } catch (err) {
            setError(err?.response?.data?.message || "Error enviando el código");
        } finally {
            setLoading(false);
        }
    };

    // 2. Verificar código (solo validación local, el backend lo valida al cambiar contraseña)
    const handleCodeSubmit = (e) => {
        e.preventDefault();
        setError("");
        if (code.length !== 6) {
            setError("El código debe tener 6 dígitos");
            return;
        }
        setStep("password");
    };

    // 3. Cambiar contraseña
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (newPassword !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }
        if (newPassword.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres");
            return;
        }
        setLoading(true);
        try {
            await cambiarContraseñaService.cambiarContraseña(email, code, newPassword);
            setStep("success");
        } catch (err) {
            setError(err?.response?.data?.message || "Error actualizando la contraseña");
        } finally {
            setLoading(false);
        }
    };

    const  handleLoginClick =() =>{
        navigate('/login')
    };

    return (
        <div className="princpial">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue:wght@400&display=swap" />
            {step === "email" && (
                <div className="page-container-olvidarp" id="emailPage">
                    <div className="split-container-olvidarp">
                        <div className="left-section-olvidarp">
                            <div className="logo-container-olvidarp">
                                <i className="fas fa-book"></i>
                                <h1>LUCKAS</h1>
                            </div>
                            <div className="system-info-olvidarp">
                                <h2>Sistema de Gestión Integral</h2>
                                <p>Plataforma digital para la administración eficiente de las actividades del Seminario Bautista de Colombia</p>
                            </div>
                            <div className="features-grid-olvidarp">
                                <div className="feature-card-olvidarp">
                                    <i className="fas fa-users"></i>
                                    <span>Gestión de Usuarios</span>
                                </div>
                                <div className="feature-card-olvidarp">
                                    <i className="fas fa-calendar-alt"></i>
                                    <span>Control de Eventos</span>
                                </div>
                                <div className="feature-card-olvidarp">
                                    <i className="fas fa-dollar-sign"></i>
                                    <span>Gestión de Pagos</span>
                                </div>
                                <div className="feature-card-olvidarp">
                                    <i className="fas fa-chart-bar"></i>
                                    <span>Reportes Analíticos</span>
                                </div>
                            </div>
                        </div>


                        <div className="right-section-olvidarp">
                            <div className="form-container-olvidarp">
                                <div className="form-header-olvidarp">
                                    <i className="fas fa-key"></i>
                                    <h2>Recuperar Contraseña</h2>
                                    <p>Ingresa tu correo electrónico para recibir el código de verificación</p>
                                </div>

                                <form className="recovery-form" onSubmit={handleEmailSubmit}>
                                    <div className="form-group-olvidarp">
                                        <label htmlFor="email">Correo Electrónico</label>
                                        <div className="input-container-olvidarp">
                                            <i className="fas fa-envelope"></i>
                                            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.com" required />
                                        </div>
                                        {error && <div className="error-message" id="emailError">{error}</div>}
                                        {successMsg && <div className="success-message">{successMsg}</div>}
                                    </div>

                                    <button type="submit" className="btn-primary-olvidarp" disabled={loading}>
                                        <span>{loading ? "Enviando..." : "Enviar Código"}</span>
                                        <i className="fas fa-paper-plane"></i>
                                    </button>
                                </form>

                                <div className="form-footer">
                                    <a href="/login" className="back-link" >
                                        <i className="fas fa-arrow-left"/>Volver al inicio de sesión
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            )}

            {step === "code" && (
                <div className="page-container-olvidarp" id="codePage">
                    <div className="split-container-olvidarp">
                        <div className="left-section-olvidarp">
                            <div className="logo-container-olvidarp">
                                <i className="fas fa-book"></i>
                                <h1>LUCKAS</h1>
                            </div>
                            <div className="system-info-olvidarp">
                                <h2>Sistema de Gestión Integral</h2>
                                <p>Plataforma digital para la administración eficiente de las actividades del Seminario Bautista de Colombia</p>
                            </div>
                            <div className="features-grid-olvidarp">
                                <div className="feature-card-olvidarp">
                                    <i className="fas fa-shield-alt"></i>
                                    <span>Seguridad Avanzada</span>
                                </div>
                                <div className="feature-card-olvidarp">
                                    <i className="fas fa-lock"></i>
                                    <span>Protección de Datos</span>
                                </div>
                                <div className="feature-card-olvidarp">
                                    <i className="fas fa-key"></i>
                                    <span>Acceso Seguro</span>
                                </div>
                                <div className="feature-card-olvidarp">
                                    <i className="fas fa-check-circle"></i>
                                    <span>Verificación</span>
                                </div>
                            </div>
                        </div>

                        <div className="right-section-olvidarp">
                            <div className="form-container-olvidarp">
                                <div className="form-header-olvidarp">
                                    <i className="fas fa-shield-alt"></i>
                                    <h2>Verificar Código</h2>
                                    <p>Hemos enviado un código de 6 dígitos a tu correo electrónico</p>
                                    <div className="email-sent-olvidarp">
                                        <i className="fas fa-envelope-open"></i>
                                        <span id="sentToEmail"></span>
                                    </div>
                                </div>

                                <form onSubmit={handleCodeSubmit} className="recovery-form">
                                    <div className="form-group-olvidarp">
                                        <label htmlFor="verificationCode">Código de Verificación</label>
                                        <div className="code-input-container-olvidarp">
                                            <input
                                                type="text"
                                                className="code-digit-olvidarp"
                                                value={code}
                                                onChange={e => {
                                                    // Solo permitir números y máximo 6 dígitos
                                                    const val = e.target.value.replaceAll(/\D/g, '').slice(0,6);
                                                    setCode(val);
                                                }}
                                                maxLength={6}
                                                placeholder="000000"
                                                autoFocus
                                                
                                            />
                                        </div>
                                        {error && <div className="error-message" id="codeError">{error}</div>}
                                    </div>

                                    <div className="resend-container-olvidarp">
                                        <p>¿No recibiste el código?</p>
                                        <button type="button" className="resend-btn-olvidarp" id="resendBtn" disabled={loading}
                                            onClick={() => handleEmailSubmit({ preventDefault: () => {} })}>
                                            <i className="fas fa-redo"></i>
                                            {loading ? "Reenviando..." : "Reenviar código"}
                                        </button>
                                    </div>

                                    <button type="submit" className="btn-primary-olvidarp">
                                        <span>Verificar Código</span>
                                        <i className="fas fa-check"></i>
                                    </button>
                                </form>

                                <div className="form-footer">
                                    <button type="button" className="back-link" onClick={goToEmailPage}>
                                        <i className="fas fa-arrow-left"/>Cambiar correo electrónico
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {step === "password" && (
                <div className="page-container-olvidarp" >
                    <div className="split-container-olvidarp">
                        <div className="left-section-olvidarp">
                            <div className="logo-container-olvidarp">
                                <i className="fas fa-book"></i>
                                <h1>LUCKAS</h1>
                            </div>
                            <div className="system-info-olvidarp">
                                <h2>Sistema de Gestión Integral</h2>
                                <p>Plataforma digital para la administración eficiente de las actividades del Seminario Bautista de Colombia</p>
                            </div>
                            <div className="features-grid-olvidarp">
                                <div className="feature-card-olvidarp">
                                    <i className="fas fa-lock"></i>
                                    <span>Nueva Contraseña</span>
                                </div>
                                <div className="feature-card-olvidarp">
                                    <i className="fas fa-shield-alt"></i>
                                    <span>Seguridad Mejorada</span>
                                </div>
                                <div className="feature-card-olvidarp">
                                    <i className="fas fa-check-double"></i>
                                    <span>Confirmación</span>
                                </div>
                                <div className="feature-card-olvidarp">
                                    <i className="fas fa-user-check"></i>
                                    <span>Acceso Restaurado</span>
                                </div>
                            </div>
                        </div>

                        <div className="right-section-olvidarp">
                            <div className="form-container-olvidarp">
                                <div className="form-header-olvidarp">
                                    <i className="fas fa-lock"></i>
                                    <h2>Nueva Contraseña</h2>
                                    <p>Crea una contraseña segura para tu cuenta</p>
                                </div>

                                <form className="recovery-form-olvidarp" onSubmit={handlePasswordSubmit}>
                                    <div className="form-group-olvidarp">
                                        <label htmlFor="newPassword">Nueva Contraseña</label>
                                        <div className="input-container-olvidarp">
                                            <i className="fas fa-lock"></i>
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="••••••••"
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="toggle-password-olvidarp"
                                                onClick={() => setShowNewPassword((v) => !v)}
                                                tabIndex={-1}
                                            >
                                                <i className={showNewPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                                            </button>
                                        </div>
                                        <div className="password-strength" id="passwordStrength"></div>
                                        {error && <div className="error-message" id="passwordError">{error}</div>}
                                    </div>
                    
                                    <div className="form-group-olvidarp">
                                        <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                                        <div className="input-container-olvidarp">
                                            <i className="fas fa-lock"></i>
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="••••••••"
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="toggle-password-olvidarp"
                                                onClick={() => setShowConfirmPassword((v) => !v)}
                                                tabIndex={-1}
                                            >
                                                <i className={showConfirmPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                                            </button>
                                        </div>
                                        {/* ...existing code... */}
                                    </div>

                                    <div className="password-requirements-olvidarp">
                                        <h4>La contraseña debe contener:</h4>
                                        <ul>
                                            <li id="req-length"><i className="fas fa-times"></i> Al menos 8 caracteres</li>
                                            <li id="req-uppercase"><i className="fas fa-times"></i> Una letra mayúscula</li>
                                            <li id="req-lowercase"><i className="fas fa-times"></i> Una letra minúscula</li>
                                            <li id="req-number"><i className="fas fa-times"></i> Un número</li>
                                            <li id="req-special"><i className="fas fa-times"></i> Un carácter especial</li>
                                        </ul>
                                    </div>

                                    <button type="submit" className="btn-primary-olvidarp" disabled={loading}>
                                        <span>{loading ? "Actualizando..." : "Actualizar Contraseña"}</span>
                                        <i className="fas fa-check"></i>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {step === "success" && (
                <div className="page-container-olvidarp" id="successPage">
                    <div className="split-container-olvidarp">
                        <div className="left-section-olvidarp">
                            <div className="logo-container-olvidarp">
                                <i className="fas fa-book"></i>
                                <h1>LUCKAS</h1>
                            </div>
                            <div className="system-info-olvidarp">
                                <h2>Sistema de Gestión Integral</h2>
                                <p>Plataforma digital para la administración eficiente de las actividades del Seminario Bautista de Colombia</p>
                            </div>
                            <div className="features-grid-olvidarp">
                                <div className="feature-card-olvidarp">
                                    <i className="fas fa-check-circle"></i>
                                    <span>Proceso Completado</span>
                                </div>
                                <div className="feature-card-olvidarp">
                                    <i className="fas fa-shield-alt"></i>
                                    <span>Cuenta Segura</span>
                                </div>
                                <div className="feature-card-olvidarp">
                                    <i className="fas fa-key"></i>
                                    <span>Acceso Restaurado</span>
                                </div>
                                <div className="feature-card-olvidarp">
                                    <i className="fas fa-user-check"></i>
                                    <span>Listo para Usar</span>
                                </div>
                            </div>
                        </div>

                        <div className="right-section-olvidarp">
                            <div className="form-container-olvidarp">
                                <div className="success-content-olvidarp">
                                    <div className="success-icon-olvidarp">
                                        <i className="fas fa-check-circle"></i>
                                    </div>
                                    <h2>¡Contraseña Actualizada!</h2>
                                    <p>Tu contraseña ha sido cambiada exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.</p>

                                    <button className="btn-primary-olvidarp" type="button" onClick={handleLoginClick}>
                                        <span>Iniciar Sesión</span>
                                        <i className="fas fa-sign-in-alt"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}





        </div>
    );
};

export default OlvidarPassword