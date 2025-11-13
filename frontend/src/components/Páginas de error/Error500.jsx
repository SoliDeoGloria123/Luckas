

//import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Error500() {
  //const router = useRouter()
  const [isRetrying, setIsRetrying] = useState(false)

  const handleRetry = () => {
    setIsRetrying(true)
    setTimeout(() => {
      router.refresh()
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated glitch lines */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-1/4 left-0 w-full h-px bg-[#334155] animate-pulse" />
        <div
          className="absolute top-1/2 left-0 w-full h-px bg-[#334155] animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute top-3/4 left-0 w-full h-px bg-[#334155] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Floating alert icons */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-10 right-10 w-8 h-8 text-[#2563eb]/20 animate-bounce"
          style={{ animationDuration: "3s" }}
        >
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        </div>
        <div
          className="absolute bottom-10 left-10 w-8 h-8 text-[#8b5cf6]/20 animate-bounce"
          style={{ animationDuration: "4s", animationDelay: "1s" }}
        >
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        </div>
      </div>

      <div className="max-w-md w-full relative">
        {/* Error Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center animate-fade-in-up">
          {/* Icon with pulsing rings */}
          <div className="mb-6 relative inline-block animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div
              className="absolute inset-0 bg-[#2563eb]/20 rounded-full animate-ping"
              style={{ animationDuration: "2s" }}
            />
            <div
              className="absolute inset-0 bg-[#2563eb]/20 rounded-full animate-ping"
              style={{ animationDuration: "2s", animationDelay: "0.5s" }}
            />
            <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] rounded-full">
              <svg
                className="w-12 h-12 text-white animate-bounce"
                style={{ animationDuration: "1.5s" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Error code badge */}
          <div className="mb-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <span className="inline-block px-5 py-2 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white text-sm font-bold rounded-full shadow-lg">
              ERROR 500
            </span>
          </div>

          {/* Error title */}
          <h1 className="text-3xl font-bold text-[#334155] mb-3 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            Error del Servidor
          </h1>

          {/* Error description */}
          <p className="text-[#334155]/70 mb-2 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
            Algo salió mal en nuestros servidores. Nuestro equipo ya fue notificado y está trabajando para solucionar el
            problema.
          </p>

          <p className="text-sm text-[#334155]/50 mb-6 animate-fade-in-up" style={{ animationDelay: "1s" }}>
            Por favor, intenta nuevamente en unos momentos.
          </p>

          {/* Status indicator */}
          <div
            className="flex items-center justify-center gap-2 mb-6 animate-fade-in-up"
            style={{ animationDelay: "1.1s" }}
          >
            <div className="w-3 h-3 bg-[#8b5cf6] rounded-full animate-pulse" />
            <span className="text-sm text-[#334155]/60 font-medium">Equipo técnico trabajando...</span>
          </div>

          {/* Divider */}
          <div
            className="w-full h-px bg-gradient-to-r from-transparent via-[#334155]/20 to-transparent mb-6 animate-fade-in-up"
            style={{ animationDelay: "1.2s" }}
          />

          {/* Action buttons */}
          <div className="flex flex-col gap-3 animate-fade-in-up" style={{ animationDelay: "1.4s" }}>
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isRetrying ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Reintentando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Reintentar
                </>
              )}
            </button>

            <button
              onClick={() => router.push("/login")}
              className="w-full bg-white hover:bg-[#f1f5f9] text-[#2563eb] font-semibold py-3 px-6 rounded-xl border-2 border-[#2563eb] transform hover:scale-105 transition-all duration-200"
            >
              Ir al Inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
