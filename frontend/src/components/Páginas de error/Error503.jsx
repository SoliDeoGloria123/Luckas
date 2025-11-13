

//import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function ServerDown() {
  //const router = useRouter()
  const [dots, setDots] = useState(".")

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "." : prev + "."))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated wave background */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute bottom-0 left-0 w-full">
          <svg className="w-full h-32" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              className="fill-[#2563eb] animate-[wave_10s_ease-in-out_infinite]"
            />
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              className="fill-[#2563eb] animate-[wave_7s_ease-in-out_infinite]"
            />
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              className="fill-[#2563eb] animate-[wave_5s_ease-in-out_infinite]"
            />
          </svg>
        </div>
      </div>

      {/* Floating connection icons */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 animate-float">
          <div className="w-12 h-12 text-[#2563eb]/20">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
        </div>
        <div
          className="absolute bottom-1/4 right-1/4 animate-float"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        >
          <div className="w-12 h-12 text-[#8b5cf6]/20">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4c-1.48 0-2.85.43-4.01 1.17l1.46 1.46C10.21 6.23 11.08 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3 0 1.13-.64 2.11-1.56 2.62l1.45 1.45C23.16 18.16 24 16.68 24 15c0-2.64-2.05-4.78-4.65-4.96zM3 5.27l2.75 2.74C2.56 8.15 0 10.77 0 14c0 3.31 2.69 6 6 6h11.73l2 2L21 20.73 4.27 4 3 5.27zM7.73 10l8 8H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h1.73z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="max-w-md w-full relative">
        {/* Error Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center animate-fade-in-up">
          {/* Server icon with disconnection animation */}
          <div className="mb-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="relative inline-block">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#334155] to-[#2563eb] rounded-2xl shadow-lg animate-pulse">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                  />
                </svg>
              </div>
              {/* Disconnection indicator */}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#334155] rounded-full flex items-center justify-center animate-bounce">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>

          {/* Status badge */}
          <div className="mb-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <span className="inline-block px-4 py-1 bg-[#334155] text-white text-sm font-semibold rounded-full">
              Servidor No Disponible
            </span>
          </div>

          {/* Error title */}
          <h1 className="text-3xl font-bold text-[#334155] mb-3 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            Servidor Caído
          </h1>

          {/* Error description */}
          <p className="text-[#334155]/70 mb-6 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
            No podemos conectarnos con el servidor en este momento. Puede estar en mantenimiento o experimentando
            problemas técnicos.
          </p>

          {/* Loading status */}
          <div className="bg-[#f1f5f9] rounded-xl p-4 mb-6 animate-fade-in-up" style={{ animationDelay: "1s" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#334155]">Estado de conexión</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#334155] rounded-full animate-pulse" />
                <span className="text-xs text-[#334155]/60">Verificando{dots}</span>
              </div>
            </div>
            <div className="w-full bg-white rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#2563eb] to-[#8b5cf6] animate-[pulse_2s_ease-in-out_infinite]"
                style={{ width: "60%" }}
              />
            </div>
          </div>

          {/* Tips */}
          <div
            className="text-left bg-[#8b5cf6]/5 rounded-xl p-4 mb-6 animate-fade-in-up"
            style={{ animationDelay: "1.2s" }}
          >
            <h3 className="text-sm font-semibold text-[#334155] mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Sugerencias:
            </h3>
            <ul className="text-sm text-[#334155]/70 space-y-1 pl-6">
              <li className="list-disc">Verifica tu conexión a internet</li>
              <li className="list-disc">Espera unos minutos e intenta de nuevo</li>
              <li className="list-disc">Contacta con soporte si persiste</li>
            </ul>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 animate-fade-in-up" style={{ animationDelay: "1.4s" }}>
            <button
              onClick={() => router.refresh()}
              className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reintentar Conexión
            </button>

            <button
              onClick={() => router.push("/login")}
              className="w-full bg-white hover:bg-[#f1f5f9] text-[#334155] font-semibold py-3 px-6 rounded-xl border-2 border-[#334155]/20 transform hover:scale-105 transition-all duration-200"
            >
              Volver más tarde
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes wave {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-25%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  )
}
