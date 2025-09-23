// frontend/src/components/External/PaymentModal.js
import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Smartphone, 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Hash,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

const PaymentModal = ({ item, onClose, onSuccess }) => {
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
  const [errors, setErrors] = useState({});

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
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'El nombre completo es requerido';
    if (!formData.email.trim()) newErrors.email = 'El correo electrónico es requerido';
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';
    if (!formData.identification.trim()) newErrors.identification = 'La identificación es requerida';
    if (!paymentMethod) newErrors.paymentMethod = 'Selecciona un método de pago';
    if (!formData.acceptTerms) newErrors.acceptTerms = 'Debes aceptar los términos y condiciones';

    if (paymentMethod === 'pse') {
      if (!formData.bankCode) newErrors.bankCode = 'Selecciona tu banco';
      if (!formData.accountType) newErrors.accountType = 'Selecciona el tipo de cuenta';
    }

    if (paymentMethod === 'nequi') {
      if (!formData.nequiPhone) newErrors.nequiPhone = 'Ingresa tu número de Nequi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Call success callback
      onSuccess(item, {
        paymentMethod,
        ...formData,
        amount: getItemCost()
      });
      
      onClose();
    } catch (error) {
      console.error('Payment error:', error);
      setErrors({ general: 'Error al procesar el pago. Intenta nuevamente.' });
    } finally {
      setLoading(false);
    }
  };

  const getItemCost = () => {
    return item?.costo || item?.precio || 0;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getItemTitle = () => {
    return item?.nombre || 'Item';
  };

  const getItemType = () => {
    return item?.tipo || 'curso';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Background with glass effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-blue-900/90 to-gray-900/90 rounded-2xl border border-white/20 backdrop-blur-xl" />
        
        {/* Content */}
        <div className="relative p-8 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2 font-figtree">
                Completar <span className="font-instrument-serif italic text-blue-400">Inscripción</span>
              </h2>
              <p className="text-white/60 text-sm">
                {getItemTitle()} • {getItemType().charAt(0).toUpperCase() + getItemType().slice(1)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Price Display */}
          <div className="mb-8 p-6 bg-blue-500/20 border border-blue-500/30 rounded-xl">
            <div className="flex justify-between items-center">
              <span className="text-white/80 text-lg">Total a pagar:</span>
              <span className="text-3xl font-bold text-white">{formatCurrency(getItemCost())}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-blue-400" />
                Información Personal
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium">Nombre Completo *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all"
                    placeholder="Juan Pérez García"
                    required
                  />
                  {errors.fullName && <p className="text-red-400 text-xs">{errors.fullName}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium">Correo Electrónico *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-4 h-4 text-white/50" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all"
                      placeholder="juan@ejemplo.com"
                      required
                    />
                  </div>
                  {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium">Teléfono *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 w-4 h-4 text-white/50" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all"
                      placeholder="300 123 4567"
                      required
                    />
                  </div>
                  {errors.phone && <p className="text-red-400 text-xs">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium">Número de Identificación *</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-3.5 w-4 h-4 text-white/50" />
                    <input
                      type="text"
                      name="identification"
                      value={formData.identification}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all"
                      placeholder="1234567890"
                      required
                    />
                  </div>
                  {errors.identification && <p className="text-red-400 text-xs">{errors.identification}</p>}
                </div>
              </div>
            </div>

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
