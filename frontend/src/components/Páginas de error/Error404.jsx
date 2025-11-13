import { useNavigate } from 'react-router-dom';

export default function Error404() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
            animation: "grid-move 20s linear infinite",
          }}
        />
      </div>

      <div className="max-w-md w-full relative">
        {/* Error Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center animate-fade-in-up">
          {/* 404 Large number */}
          <div className="mb-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-9xl font-bold bg-gradient-to-br from-[#2563eb] via-[#8b5cf6] to-[#1d4ed8] bg-clip-text text-transparent animate-pulse">
              404
            </h2>
          </div>

          {/* Sad face icon */}
          <div className="mb-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <div
              className="inline-flex items-center justify-center w-20 h-20 bg-[#8b5cf6]/10 rounded-full animate-bounce"
              style={{ animationDuration: "2s" }}
            >
              <svg className="w-10 h-10 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Error title */}
          <h1 className="text-3xl font-bold text-[#334155] mb-3 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            Página No Encontrada
          </h1>

          {/* Error description */}
          <p className="text-[#334155]/70 mb-6 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
            Parece que la página que buscas no existe o fue movida a otra ubicación. No te preocupes, te ayudaremos a
            encontrar lo que necesitas.
          </p>

          {/* Decorative elements */}
          <div className="flex justify-center gap-2 mb-6 animate-fade-in-up" style={{ animationDelay: "1s" }}>
            <div className="w-2 h-2 bg-[#2563eb] rounded-full animate-ping" />
            <div className="w-2 h-2 bg-[#8b5cf6] rounded-full animate-ping" style={{ animationDelay: "0.2s" }} />
            <div className="w-2 h-2 bg-[#2563eb] rounded-full animate-ping" style={{ animationDelay: "0.4s" }} />
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 animate-fade-in-up" style={{ animationDelay: "1.2s" }}>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Ir al Inicio
            </button>

            <button
              onClick={() => navigate(-1)}
              className="w-full bg-white hover:bg-[#f1f5f9] text-[#334155] font-semibold py-3 px-6 rounded-xl border-2 border-[#334155]/20 transform hover:scale-105 transition-all duration-200"
            >
              Volver Atrás
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes grid-move {
          0% { transform: translateY(0); }
          100% { transform: translateY(50px); }
        }
      `}</style>
    </div>
  )
}
