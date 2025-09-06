// frontend/src/components/External/PaymentModalNew.js
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
      // Preparar datos para el pago
      const paymentData = {
        amount: getItemCost(),
        currency: 'COP',
        description: `Inscripción a ${getItemTitle()}`,
        reference: `${getItemType()}_${item?.id || Date.now()}_${Date.now()}`,
        customerData: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          identification: formData.identification
        },
        paymentMethod: paymentMethod,
        ...(paymentMethod === 'pse' && {
          bankCode: formData.bankCode,
          accountType: formData.accountType
        }),
        ...(paymentMethod === 'nequi' && {
          nequiPhone: formData.nequiPhone
        })
      };

      // Realizar integración real con pasarela de pagos
      if (paymentMethod === 'pse') {
        // Integración PSE real
        const response = await fetch('http://localhost:3001/api/pagos/pse', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(paymentData)
        });

        if (response.ok) {
          const result = await response.json();
          // Redireccionar al banco seleccionado
          if (result.redirectUrl) {
            window.location.href = result.redirectUrl;
            return;
          }
        }
      } else if (paymentMethod === 'nequi') {
        // Integración Nequi real
        const response = await fetch('http://localhost:3001/api/pagos/nequi', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(paymentData)
        });

        if (response.ok) {
          const result = await response.json();
          // Mostrar código QR o redireccionar a Nequi
          if (result.qrCode || result.redirectUrl) {
            // Abrir ventana emergente para Nequi
            const nequiWindow = window.open(
              result.redirectUrl || '/nequi-payment', 
              'nequi-payment',
              'width=400,height=600,scrollbars=yes,resizable=yes'
            );
            
            // Monitor payment status
            const checkPaymentStatus = setInterval(async () => {
              try {
                const statusResponse = await fetch(`http://localhost:3001/api/pagos/status/${result.transactionId}`);
                const status = await statusResponse.json();
                
                if (status.state === 'approved') {
                  clearInterval(checkPaymentStatus);
                  nequiWindow?.close();
                  onSuccess(item, { ...paymentData, transactionId: result.transactionId });
                  onClose();
                } else if (status.state === 'rejected' || status.state === 'expired') {
                  clearInterval(checkPaymentStatus);
                  nequiWindow?.close();
                  setErrors({ general: 'Pago cancelado o expirado. Intenta nuevamente.' });
                }
              } catch (error) {
                console.error('Error checking payment status:', error);
              }
            }, 3000);
            
            return;
          }
        }
      }

      // Si no hay integración real disponible, mostrar modal informativo
      showPaymentInstructions(paymentData);
      
    } catch (error) {
      console.error('Payment error:', error);
      setErrors({ general: 'Error al procesar el pago. Intenta nuevamente.' });
    } finally {
      setLoading(false);
    }
  };

  const showPaymentInstructions = (paymentData) => {
    // Crear modal con instrucciones de pago manual
    const instructionsModal = document.createElement('div');
    instructionsModal.className = 'fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm';
    
    const content = document.createElement('div');
    content.className = 'bg-white rounded-2xl p-8 max-w-md w-full';
    
    if (paymentMethod === 'pse') {
      content.innerHTML = `
        <div class="text-center">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-2 0h2m0 0h2m-2 0h-2m-2 0h2m0 0v-4m0 0h-2m2 0h2m-2-4v4m2-4v4"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-4">Pago PSE</h3>
          <p class="text-gray-600 mb-6">Para completar tu pago, serás redirigido al sitio web de tu banco.</p>
          <div class="bg-gray-50 rounded-lg p-4 mb-6">
            <div class="text-sm text-gray-600">
              <p><strong>Monto:</strong> ${paymentData.amount.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>
              <p><strong>Concepto:</strong> ${paymentData.description}</p>
              <p><strong>Referencia:</strong> ${paymentData.reference}</p>
            </div>
          </div>
          <button onclick="this.parentElement.parentElement.parentElement.remove(); window.open('https://pse.com.co/', '_blank')" 
                  class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 mb-3">
            Ir a PSE
          </button>
          <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                  class="w-full text-gray-600 py-2 rounded-lg hover:bg-gray-100">
            Cancelar
          </button>
        </div>
      `;
    } else if (paymentMethod === 'nequi') {
      content.innerHTML = `
        <div class="text-center">
          <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-4">Pago con Nequi</h3>
          <p class="text-gray-600 mb-6">Para completar tu pago, abre la app Nequi en tu celular.</p>
          <div class="bg-gray-50 rounded-lg p-4 mb-6">
            <div class="text-sm text-gray-600">
              <p><strong>Monto:</strong> ${paymentData.amount.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>
              <p><strong>Concepto:</strong> ${paymentData.description}</p>
              <p><strong>Número:</strong> ${paymentData.nequiPhone}</p>
            </div>
          </div>
          <div class="mb-6">
            <h4 class="font-semibold text-gray-900 mb-2">Instrucciones:</h4>
            <ol class="text-sm text-gray-600 text-left space-y-1">
              <li>1. Abre tu app Nequi</li>
              <li>2. Ve a "Enviar plata"</li>
              <li>3. Ingresa el número: <strong>300-123-4567</strong></li>
              <li>4. Monto: <strong>${paymentData.amount.toLocaleString()}</strong></li>
              <li>5. Concepto: <strong>${paymentData.description}</strong></li>
            </ol>
          </div>
          <button onclick="this.parentElement.parentElement.parentElement.remove(); window.open('nequi://send', '_self').catch(() => window.open('https://play.google.com/store/apps/details?id=com.nequi.MobileApp', '_blank'))" 
                  class="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 mb-3">
            Abrir Nequi
          </button>
          <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                  class="w-full text-gray-600 py-2 rounded-lg hover:bg-gray-100">
            Cancelar
          </button>
        </div>
      `;
    }
    
    instructionsModal.appendChild(content);
    document.body.appendChild(instructionsModal);
    
    // Cerrar modal principal después de mostrar instrucciones
    setTimeout(() => {
      onClose();
    }, 500);
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

            {/* Payment Methods */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-400" />
                Método de Pago
              </h3>
              
              <div className="space-y-3">
                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'pse' 
                      ? 'border-blue-500 bg-blue-500/20' 
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                  onClick={() => setPaymentMethod('pse')}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="pse"
                      checked={paymentMethod === 'pse'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-blue-500 focus:ring-blue-500"
                    />
                    <Building2 className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-white font-medium">PSE - Pagos Seguros en Línea</p>
                      <p className="text-white/60 text-sm">Paga directamente desde tu cuenta bancaria</p>
                    </div>
                  </div>
                </div>

                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'nequi' 
                      ? 'border-blue-500 bg-blue-500/20' 
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                  onClick={() => setPaymentMethod('nequi')}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="nequi"
                      checked={paymentMethod === 'nequi'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-blue-500 focus:ring-blue-500"
                    />
                    <Smartphone className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-white font-medium">Nequi</p>
                      <p className="text-white/60 text-sm">Paga con tu billetera digital Nequi</p>
                    </div>
                  </div>
                </div>
              </div>
              {errors.paymentMethod && <p className="text-red-400 text-xs">{errors.paymentMethod}</p>}
            </div>

            {/* PSE Form Fields */}
            {paymentMethod === 'pse' && (
              <div className="space-y-4 p-6 bg-white/5 rounded-xl border border-white/10">
                <h4 className="text-lg font-medium text-white">Datos PSE</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-white/80 text-sm font-medium">Banco *</label>
                    <select
                      name="bankCode"
                      value={formData.bankCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all"
                      required
                    >
                      <option value="">Selecciona tu banco</option>
                      {banks.map(bank => (
                        <option key={bank.code} value={bank.code} className="bg-gray-900 text-white">
                          {bank.name}
                        </option>
                      ))}
                    </select>
                    {errors.bankCode && <p className="text-red-400 text-xs">{errors.bankCode}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-white/80 text-sm font-medium">Tipo de Cuenta *</label>
                    <select
                      name="accountType"
                      value={formData.accountType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all"
                      required
                    >
                      <option value="">Selecciona tipo de cuenta</option>
                      <option value="savings" className="bg-gray-900 text-white">Ahorros</option>
                      <option value="current" className="bg-gray-900 text-white">Corriente</option>
                    </select>
                    {errors.accountType && <p className="text-red-400 text-xs">{errors.accountType}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Nequi Form Fields */}
            {paymentMethod === 'nequi' && (
              <div className="space-y-4 p-6 bg-white/5 rounded-xl border border-white/10">
                <h4 className="text-lg font-medium text-white">Datos Nequi</h4>
                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium">Número de Nequi *</label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-3.5 w-4 h-4 text-white/50" />
                    <input
                      type="tel"
                      name="nequiPhone"
                      value={formData.nequiPhone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all"
                      placeholder="300 123 4567"
                      required
                    />
                  </div>
                  {errors.nequiPhone && <p className="text-red-400 text-xs">{errors.nequiPhone}</p>}
                </div>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                  className="mt-1 text-blue-500 focus:ring-blue-500 rounded"
                  required
                />
                <div className="text-sm">
                  <p className="text-white/80">
                    Acepto los{' '}
                    <button type="button" className="text-blue-400 hover:text-blue-300 underline">
                      términos y condiciones
                    </button>{' '}
                    y autorizo el procesamiento de mis datos personales para el proceso de inscripción.
                  </p>
                </div>
              </div>
              {errors.acceptTerms && <p className="text-red-400 text-xs">{errors.acceptTerms}</p>}
            </div>

            {/* Error Display */}
            {errors.general && (
              <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">{errors.general}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/25"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Procesando Pago...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Completar Pago - {formatCurrency(getItemCost())}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
