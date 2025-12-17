import { useNavigate } from 'react-router-dom';
import styles from './Error403.module.css';

export default function Error403() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-20 left-10 w-32 h-32 bg-[#ef4444]/10 rounded-full animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        />
        <div
          className="absolute bottom-20 right-20 w-40 h-40 bg-[#ef4444]/10 rounded-full animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        />
        <div
          className="absolute top-1/2 right-1/4 w-24 h-24 bg-[#ef4444]/10 rounded-full animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "5s" }}
        />
      </div>

      <div className="max-w-md w-full relative">
        {/* Error Card */}
        <div className={`bg-white rounded-2xl shadow-xl p-8 text-center ${styles.animateFadeInUp}`}>
          {/* Icon with animation */}
          <div className={`mb-6 ${styles.animateFadeInUp}`} style={{ animationDelay: "0.2s" }}>
            <div className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#ef4444] to-[#dc2626] rounded-full ${styles.animateShake}`}>
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>

          {/* Error code badge */}
          <div className={`mb-4 ${styles.animateFadeInUp}`} style={{ animationDelay: "0.4s" }}>
            <span className="inline-block px-4 py-1 bg-[#ef4444] text-white text-sm font-semibold rounded-full">
              Error 403
            </span>
          </div>

          {/* Error title */}
          <h1 className={`text-3xl font-bold text-[#334155] mb-3 ${styles.animateFadeInUp}`} style={{ animationDelay: "0.6s" }}>
            Acceso Denegado
          </h1>

          {/* Error description */}
          <p className={`text-[#64748b] text-sm mb-8 ${styles.animateFadeInUp}`} style={{ animationDelay: "0.8s" }}>
            No tienes permiso para acceder a este recurso. Tu rol actual no tiene suficientes privilegios.
          </p>

          {/* Action buttons */}
          <div className={`space-y-3 ${styles.animateFadeInUp}`} style={{ animationDelay: "1s" }}>
            <button
              onClick={() => navigate(-1)}
              className="w-full px-6 py-3 bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              Volver Atrás
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full px-6 py-3 bg-[#f1f5f9] text-[#334155] font-semibold rounded-lg hover:bg-[#e2e8f0] transition-all duration-300"
            >
              Ir al Inicio
            </button>
          </div>

          {/* Help text */}
          <p className={`text-[#94a3b8] text-xs mt-6 ${styles.animateFadeInUp}`} style={{ animationDelay: "1.2s" }}>
            Si crees que esto es un error, contacta a soporte técnico
          </p>
        </div>
      </div>
    </div>
  );
}
