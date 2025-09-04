// frontend/src/components/External/PaymentModal.js
import React, { useState } from 'react';
import './PaymentModal.css';

const PaymentModal = ({ data, onClose, onSuccess }) => {
    const [paymentMethod, setPaymentMethod] = useState('');
    const [formData, setFormData] = useState({
        // Datos personales
        fullName: '',
        email: '',
        phone: '',
        identification: '',
        
        // Datos de pago PSE
        bankCode: '',
        accountType: '',
        
        // Datos de pago Nequi
        nequiPhone: '',
        
        // Términos y condiciones
        acceptTerms: false
    });
    const [loading, setLoading] = useState(false);

    const banks = [
        { code: '1001', name: 'Banco de Bogotá' },
        { code: '1002', name: 'Banco Popular' },
        { code: '1006', name: 'Banco Corpbanca' },
        { code: '1007', name: 'Bancolombia' },
        { code: '1009', name: 'Citibank' },
        { code: '1012', name: 'Banco GNB Sudameris' },
        { code: '1013', name: 'BBVA Colombia' },
        { code: '1014', name: 'Itaú' },
        { code: '1019', name: 'Banco Colpatria' },
        { code: '1023', name: 'Banco de Occidente' },
        { code: '1052', name: 'Banco AV Villas' },
        { code: '1053', name: 'Banco Davivienda' }
    ];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Simular proceso de pago
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // En un escenario real, aquí se procesaría el pago con PSE o Nequi
            const paymentInfo = {
                method: paymentMethod,
                amount: data.price,
                reference: `${data.type}_${data.id}_${Date.now()}`,
                userData: formData
            };

            onSuccess(paymentInfo);
            
        } catch (error) {
            console.error('Error al procesar pago:', error);
            alert('Error al procesar el pago. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="payment-modal-overlay">
            <div className="payment-modal">
                <div className="payment-header">
                    <h2>Proceso de Pago</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="payment-summary">
                    <h3>{data?.name}</h3>
                    <p>{data?.description}</p>
                    <div className="price-display">
                        <span className="price">Total: ${data?.price?.toLocaleString()}</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="payment-form">
                    {/* Información Personal */}
                    <div className="form-section">
                        <h4>Información Personal</h4>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Nombre Completo *</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Correo Electrónico *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Teléfono *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Número de Identificación *</label>
                                <input
                                    type="text"
                                    name="identification"
                                    value={formData.identification}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Método de Pago */}
                    <div className="form-section">
                        <h4>Método de Pago</h4>
                        <div className="payment-methods">
                            <div className="payment-method">
                                <input
                                    type="radio"
                                    id="pse"
                                    name="paymentMethod"
                                    value="pse"
                                    checked={paymentMethod === 'pse'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <label htmlFor="pse" className="payment-method-label">
                                    <div className="payment-icon">🏦</div>
                                    <div>
                                        <strong>PSE</strong>
                                        <span>Pago Seguro en Línea</span>
                                    </div>
                                </label>
                            </div>
                            
                            <div className="payment-method">
                                <input
                                    type="radio"
                                    id="nequi"
                                    name="paymentMethod"
                                    value="nequi"
                                    checked={paymentMethod === 'nequi'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <label htmlFor="nequi" className="payment-method-label">
                                    <div className="payment-icon">📱</div>
                                    <div>
                                        <strong>Nequi</strong>
                                        <span>Pago con celular</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Campos específicos para PSE */}
                    {paymentMethod === 'pse' && (
                        <div className="form-section">
                            <h4>Información PSE</h4>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Banco *</label>
                                    <select
                                        name="bankCode"
                                        value={formData.bankCode}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Seleccionar banco</option>
                                        {banks.map(bank => (
                                            <option key={bank.code} value={bank.code}>
                                                {bank.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Tipo de Cuenta *</label>
                                    <select
                                        name="accountType"
                                        value={formData.accountType}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Seleccionar tipo</option>
                                        <option value="ahorros">Cuenta de Ahorros</option>
                                        <option value="corriente">Cuenta Corriente</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Campos específicos para Nequi */}
                    {paymentMethod === 'nequi' && (
                        <div className="form-section">
                            <h4>Información Nequi</h4>
                            <div className="form-group">
                                <label>Número de Celular Nequi *</label>
                                <input
                                    type="tel"
                                    name="nequiPhone"
                                    value={formData.nequiPhone}
                                    onChange={handleInputChange}
                                    placeholder="3XX XXX XXXX"
                                    required
                                />
                            </div>
                            <div className="nequi-instructions">
                                <p>📱 <strong>Instrucciones:</strong></p>
                                <ol>
                                    <li>Tendrás 10 minutos para completar el pago</li>
                                    <li>Recibirás una notificación en tu app Nequi</li>
                                    <li>Confirma el pago en tu aplicación</li>
                                </ol>
                            </div>
                        </div>
                    )}

                    {/* Términos y Condiciones */}
                    <div className="form-section">
                        <div className="terms-checkbox">
                            <input
                                type="checkbox"
                                id="acceptTerms"
                                name="acceptTerms"
                                checked={formData.acceptTerms}
                                onChange={handleInputChange}
                                required
                            />
                            <label htmlFor="acceptTerms">
                                Acepto los <a href="#" target="_blank">términos y condiciones</a> del 
                                Seminario Bautista de Colombia y autorizo el procesamiento de mis datos.
                            </label>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="payment-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className="pay-btn" 
                            disabled={!paymentMethod || !formData.acceptTerms || loading}
                        >
                            {loading ? 'Procesando...' : `Pagar $${data?.price?.toLocaleString()}`}
                        </button>
                    </div>
                </form>

                {loading && (
                    <div className="loading-overlay">
                        <div className="loading-spinner"></div>
                        <p>Procesando pago...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentModal;
