import React, { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './olvidarpassword.css'
import {mostrarAlerta} from '../utils/alertas';

import { enviarCodigoRecuperacion, cambiarContraseñaService, verificarCodigoService } from '../../services/authService';

// Componente pequeño para cada requisito (fuera del componente principal para bajar complejidad)
function RequirementItem({ id, ok, children }) {
    return (
        <li id={id} className={ok ? 'req-item valid' : 'req-item invalid'}>
            <i className={`fas ${ok ? 'fa-check-circle' : 'fa-times-circle'}`} aria-hidden="true"></i>
            <span className="req-text">{children}</span>
        </li>
    );
}

RequirementItem.propTypes = {
    id: PropTypes.string.isRequired,
    ok: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
};


/* Componentes por pasos para reducir la complejidad del componente principal */
function EmailStep({ email, setEmail, handleEmailSubmit, loading, error, successMsg }) {
    return (
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
                                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.com" required  autoComplete="off"/>
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
                                <i className="fas fa-arrow-left"></i>
                                <span>Volver al inicio de sesión</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
EmailStep.propTypes = {
    email: PropTypes.string.isRequired,
    setEmail: PropTypes.func.isRequired,
    handleEmailSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    successMsg: PropTypes.string,
};

function CodeStep({ code, setCode, handleCodeSubmit, resendCode, resendButtonLabel, loading, resendTimer, error, sentToEmail, goToEmailPage }) {
    const maskedEmail = sentToEmail ? (() => {
        const parts = sentToEmail.split('@');
        if (parts.length === 2) {
            const name = parts[0];
            const domain = parts[1];
            const visible = name.length > 2 ? name.slice(0,2) : name.slice(0,1);
            return `${visible}${'*'.repeat(Math.max(2, name.length-2))}@${domain}`;
        }
        return sentToEmail;
    })() : '';

    return (
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
                                <span id="sentToEmail">{maskedEmail}</span>
                            </div>

                            {sentToEmail && (
                                <output className="email-preview-card-olvidarp">
                                    <div className="card-left-olvidarp">
                                        <i className="fas fa-envelope fa-2x"></i>
                                    </div>
                                    <div className="card-body-olvidarp">
                                        <h3>Revisa tu correo</h3>
                                        <p>Hemos enviado un código de verificación a <strong>{sentToEmail}</strong>.</p>
                                        <p className="muted-olvidarp">Si no lo ves, revisa la carpeta <em>Spam</em> o espera unos minutos.</p>
                                    </div>
                                </output>
                            )}
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
                                            const digits = (e.target.value || '').replaceAll(/\D/g, '').slice(0,6);
                                            setCode(digits);
                                            if (digits.length === 6) {
                                                setTimeout(() => handleCodeSubmit({ preventDefault: () => {} }), 0);
                                            }
                                        }}
                                        onPaste={e => {
                                            const pasted = (e.clipboardData || globalThis.clipboardData).getData('text') || '';
                                            const digits = pasted.replaceAll(/\D/g, '').slice(0,6);
                                            if (digits) {
                                                e.preventDefault();
                                                setCode(digits);
                                                setTimeout(() => handleCodeSubmit({ preventDefault: () => {} }), 0);
                                            }
                                        }}
                                        inputMode="numeric"
                                        pattern="\d{6}"
                                        maxLength={6}
                                        placeholder="000000"
                                        autoFocus
                                        aria-label="Código de verificación de 6 dígitos"
                                        autoComplete="one-time-code"
                                    />
                                </div>
                                {error && <div className="error-message" id="codeError">{error}</div>}
                            </div>

                            <div className="resend-container-olvidarp">
                                <p>¿No recibiste el código?</p>
                                <button
                                    type="button"
                                    className="resend-btn-olvidarp"
                                    id="resendBtn"
                                    disabled={loading || resendTimer > 0}
                                    onClick={resendCode}
                                >
                                    <i className="fas fa-redo"></i>
                                    <span className="resend-label">{resendButtonLabel}</span>
                                </button>
                            </div>

                            <button type="submit" className="btn-primary-olvidarp">
                                <span>Verificar Código</span>
                                <i className="fas fa-check"></i>
                            </button>
                        </form>

                        <div className="form-footer">
                                    <button type="button" className="back-link" onClick={goToEmailPage}>
                                        <i className="fas fa-arrow-left"></i>
                                        <span>Cambiar correo electrónico</span>
                                    </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
CodeStep.propTypes = {
    code: PropTypes.string.isRequired,
    setCode: PropTypes.func.isRequired,
    handleCodeSubmit: PropTypes.func.isRequired,
    resendCode: PropTypes.func.isRequired,
    resendButtonLabel: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    resendTimer: PropTypes.number.isRequired,
    error: PropTypes.string,
    sentToEmail: PropTypes.string,
    goToEmailPage: PropTypes.func.isRequired,
};

function PasswordStep({ newPassword, setNewPassword, confirmPassword, setConfirmPassword, showNewPassword, setShowNewPassword, showConfirmPassword, setShowConfirmPassword, pwValid, handlePasswordSubmit, loading, error }) {
    return (
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
                                <div
                                    className="password-strength"
                                    id="passwordStrength"
                                    data-strength={Object.values(pwValid).filter(Boolean).length}
                                ></div>
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
                            </div>

                            <div className="password-requirements-olvidarp">
                                <h4>La contraseña debe contener:</h4>
                                <ul>
                                    <RequirementItem id="req-length" ok={pwValid.length}>Al menos 8 caracteres</RequirementItem>
                                    <RequirementItem id="req-uppercase" ok={pwValid.uppercase}>Una letra mayúscula</RequirementItem>
                                    <RequirementItem id="req-lowercase" ok={pwValid.lowercase}>Una letra minúscula</RequirementItem>
                                    <RequirementItem id="req-number" ok={pwValid.number}>Un número</RequirementItem>
                                    <RequirementItem id="req-special" ok={pwValid.special}>Un carácter especial</RequirementItem>
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
    );
}
PasswordStep.propTypes = {
    newPassword: PropTypes.string.isRequired,
    setNewPassword: PropTypes.func.isRequired,
    confirmPassword: PropTypes.string.isRequired,
    setConfirmPassword: PropTypes.func.isRequired,
    showNewPassword: PropTypes.bool.isRequired,
    setShowNewPassword: PropTypes.func.isRequired,
    showConfirmPassword: PropTypes.bool.isRequired,
    setShowConfirmPassword: PropTypes.func.isRequired,
    pwValid: PropTypes.object.isRequired,
    handlePasswordSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
};

function SuccessStep({ handleLoginClick }) {
    return (
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
    );
}
SuccessStep.propTypes = {
    handleLoginClick: PropTypes.func.isRequired,
};

const OlvidarPassword = () => {
    const [step, setStep] = useState("email"); // email | code | password | success
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resetToken, setResetToken] = useState(""); // Token temporal para resetPassword
    const navigate = useNavigate();

    // Validaciones en tiempo real para la nueva contraseña
    const [pwValid, setPwValid] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
    });

    useEffect(() => {
        const pwd = newPassword || "";
        setPwValid({
            length: pwd.length >= 8,
            uppercase: /[A-Z]/.test(pwd),
            lowercase: /[a-z]/.test(pwd),
            number: /\d/.test(pwd),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
        });
    }, [newPassword]);


    // --- Handlers conectados a la API ---
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [sentToEmail, setSentToEmail] = useState("");
    const [resendTimer, setResendTimer] = useState(0);
    const resendIntervalRef = useRef(null);

    useEffect(() => {
        return () => {
            if (resendIntervalRef.current) {
                clearInterval(resendIntervalRef.current);
                resendIntervalRef.current = null;
            }
        };
    }, []);

    const startResendTimer = (seconds = 60) => {
        setResendTimer(seconds);
        if (resendIntervalRef.current) {
            clearInterval(resendIntervalRef.current);
        }
        resendIntervalRef.current = setInterval(() => {
            setResendTimer(s => {
                if (s <= 1) {
                    clearInterval(resendIntervalRef.current);
                    resendIntervalRef.current = null;
                    return 0;
                }
                return s - 1;
            });
        }, 1000);
    };

    const resendCode = async () => {
        setError("");
        const targetEmail = (sentToEmail && sentToEmail.trim()) || (email && email.trim());
        if (!targetEmail) {
            const msg = 'No hay correo válido para reenviar el código';
            setError(msg);
            mostrarAlerta('Error', msg, 'error');
            return;
        }
        setLoading(true);
        try {
            await enviarCodigoRecuperacion.enviarCodigo(targetEmail);
            const success = 'Código reenviado a tu correo electrónico';
            setSuccessMsg(success);
            setSentToEmail(targetEmail);
            mostrarAlerta('Éxito', success, 'success');
            startResendTimer(60);
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || 'Error reenviando el código';
            setError(msg);
            mostrarAlerta('Error', msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    // 1. Enviar código al correo
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMsg("");

        const emailTrim = (email || '').trim();
        const emailLower = emailTrim.toLowerCase();
        const basicEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const gmailRegex = /^[^\s@]+@gmail\.com$/i;

        if (!emailTrim) {
            const msg = 'Por favor ingresa un correo';
            setError(msg);
            mostrarAlerta('Error', msg, 'error');
            return;
        }

        if (!basicEmailRegex.test(emailLower)) {
            const msg = 'Correo inválido';
            setError(msg);
            mostrarAlerta('Error', msg, 'error');
            return;
        }

        if (!gmailRegex.test(emailLower)) {
            const msg = 'Solo se permiten correos con dominio @gmail.com';
            setError(msg);
            mostrarAlerta('Error', msg, 'error');
            return;
        }

        setLoading(true);
        try {
            await enviarCodigoRecuperacion.enviarCodigo(emailTrim);
            setStep("code");
            const success = 'Código enviado a tu correo electrónico';
            setSuccessMsg(success);
            setSentToEmail(emailTrim);
            mostrarAlerta('Éxito', success, 'success');
            startResendTimer(60);
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || "Error enviando el código";
            // Mapear 404 / not found a mensaje claro
            if (err?.response?.status === 404 || /no\s+encontr|not\s+found|no\s+existe/i.test(msg)) {
                const notFoundMsg = 'Correo no encontrado en la base de datos';
                setError(notFoundMsg);
                mostrarAlerta('No encontrado', notFoundMsg, 'error');
            } else {
                setError(msg);
                mostrarAlerta('Error', msg, 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    // 2. Verificar código consultando al backend antes de avanzar
    const handleCodeSubmit = async (e) => {
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
        setError("");

        if (code.length !== 6) {
            const msg = "El código debe tener 6 dígitos";
            setError(msg);
            mostrarAlerta('Error', msg, 'error');
            return;
        }

        const targetEmail = (sentToEmail && sentToEmail.trim()) || (email && email.trim());
        if (!targetEmail) {
            const msg = 'No se encontró el correo asociado al código';
            setError(msg);
            mostrarAlerta('Error', msg, 'error');
            return;
        }

        setLoading(true);
        try {
            const res = await verificarCodigoService.verificarCodigo(targetEmail, code);
            if (res && res.success && res.resetToken) {
                setResetToken(res.resetToken); // Guardar el token temporal
                setStep("password");
            } else {
                const msg = res?.message || 'Código inválido o expirado';
                setError(msg);
                mostrarAlerta('Error', msg, 'error');
            }
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || 'Error verificando el código';
            setError(msg);
            mostrarAlerta('Error', msg, 'error');
        } finally {
            setLoading(false);
        }
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
        if (!resetToken) {
            setError("Token de restablecimiento no válido. Verifica el código nuevamente.");
            return;
        }
        setLoading(true);
        try {
            await cambiarContraseñaService.cambiarContraseña(resetToken, newPassword);
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

    // Volver a la pantalla de email (para reingresar/modificar correo)
    const goToEmailPage = () => {
        setStep("email");
        setError("");
        setSuccessMsg("");
        setCode("");
        setNewPassword("");
        setConfirmPassword("");
        setResetToken(""); // Limpiar el token temporal
    };

    // Evitar ternario anidado para sonar (legibilidad)
    let resendButtonLabel = "Reenviar código";
    if (loading) {
        resendButtonLabel = "Reenviando...";
    } else if (resendTimer > 0) {
        resendButtonLabel = `Reenviar en ${resendTimer}s`;
    }



    return (
        <div className="princpial">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue:wght@400&display=swap" />
            {step === 'email' && (
                <EmailStep
                    email={email}
                    setEmail={setEmail}
                    handleEmailSubmit={handleEmailSubmit}
                    loading={loading}
                    error={error}
                    successMsg={successMsg}
                />
            )}

            {step === 'code' && (
                <CodeStep
                    code={code}
                    setCode={setCode}
                    handleCodeSubmit={handleCodeSubmit}
                    resendCode={resendCode}
                    resendButtonLabel={resendButtonLabel}
                    loading={loading}
                    resendTimer={resendTimer}
                    error={error}
                    sentToEmail={sentToEmail}
                    goToEmailPage={goToEmailPage}
                />
            )}
            {step === 'password' && (
                <PasswordStep
                    newPassword={newPassword}
                    setNewPassword={setNewPassword}
                    confirmPassword={confirmPassword}
                    setConfirmPassword={setConfirmPassword}
                    showNewPassword={showNewPassword}
                    setShowNewPassword={setShowNewPassword}
                    showConfirmPassword={showConfirmPassword}
                    setShowConfirmPassword={setShowConfirmPassword}
                    pwValid={pwValid}
                    handlePasswordSubmit={handlePasswordSubmit}
                    loading={loading}
                    error={error}
                />
            )}

            {step === 'success' && (
                <SuccessStep handleLoginClick={handleLoginClick} />
            )}





        </div>
    );
};

export default OlvidarPassword