import { useState, useEffect } from "react"
import { LogOut, Sparkles, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

const CerrarSesion = () => {
  const [mounted, setMounted] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleGoHome = () => {
    navigate("/")
  }

  // Función para obtener el color de fondo basado en el índice
  const getParticleColor = (index) => {
    if (index % 3 === 0) return "#2563eb"
    if (index % 3 === 1) return "#8b5cf6"
    return "#059669"
  }


  const secureRandomWithIndex = (i) => {
    if (typeof globalThis !== 'undefined' && globalThis.crypto?.getRandomValues) {
      const arr = new Uint32Array(1)
      globalThis.crypto.getRandomValues(arr)
      return arr[0] / (0xffffffff + 1)
    }
    // Deterministic fallback (not a pseudorandom generator): combine index and time
    // into a repeatable fractional value in [0,1). This is sufficient for visuals.
    const t = Date.now() % 100000
    const val = (t * (i + 1) * 2654435761) % 100000
    return val / 100000
  }

  const uniqueId = (i) => {
    if (typeof globalThis !== 'undefined' && globalThis.crypto?.randomUUID) {
      return `particle-${globalThis.crypto.randomUUID()}`
    }
    return `particle-${Date.now()}-${i}`
  }

  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: uniqueId(i),
    color: getParticleColor(i),
    width: Math.floor(secureRandomWithIndex(i) * 100) + 50,
    height: Math.floor(secureRandomWithIndex(i + 1) * 100) + 50,
    left: secureRandomWithIndex(i + 2) * 100,
    top: secureRandomWithIndex(i + 3) * 100,
    duration: secureRandomWithIndex(i + 4) * 10 + 10,
    delay: secureRandomWithIndex(i + 5) * 5
  }))

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full opacity-20"
            style={{
              width: particle.width + "px",
              height: particle.height + "px",
              left: particle.left + "%",
              top: particle.top + "%",
              background: particle.color,
              animation: `float ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Main content card */}
      <div
        className={`bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full relative z-10 transform transition-all duration-1000 ${
          mounted ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-95"
        }`}
      >
        {/* Animated icon container */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* Pulsing rings */}
            <div className="absolute inset-0 animate-ping opacity-20">
              <div className="w-24 h-24 rounded-full bg-[#2563eb]" />
            </div>
            <div
              className={`relative bg-gradient-to-br from-[#2563eb] to-[#8b5cf6] w-24 h-24 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-700 ${
                mounted ? "rotate-0" : "rotate-180"
              }`}
            >
              <LogOut className="w-12 h-12 text-white animate-bounce" />
            </div>
            {/* Sparkles */}
            <Sparkles
              className={`absolute -top-2 -right-2 w-6 h-6 text-[#059669] transition-all duration-500 ${
                mounted ? "opacity-100 scale-100" : "opacity-0 scale-0"
              }`}
              style={{ animationDelay: "0.3s" }}
            />
            <Sparkles
              className={`absolute -bottom-2 -left-2 w-5 h-5 text-[#8b5cf6] transition-all duration-500 ${
                mounted ? "opacity-100 scale-100" : "opacity-0 scale-0"
              }`}
              style={{ animationDelay: "0.5s" }}
            />
          </div>
        </div>

        {/* Success message */}
        <div className="text-center mb-8">
          <h1
            className={`text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#2563eb] via-[#8b5cf6] to-[#059669] bg-clip-text text-transparent transition-all duration-700 delay-200 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
            }`}
          >
            ¡Vuelve pronto!
          </h1>
          <p
            className={`text-[#334155] text-lg transition-all duration-700 delay-300 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
            }`}
          >
            Has cerrado sesión exitosamente
          </p>
        </div>

        {/* Success badge */}
        <div
          className={`flex items-center justify-center gap-2 mb-8 transition-all duration-700 delay-400 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          }`}
        >
          <div className="bg-[#059669] text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-md animate-pulse">
            <span className="w-2 h-2 bg-white rounded-full" /> Sesión cerrada
          </div>
        </div>

        {/* Decorative line */}
        <div className="mb-8">
          <div className="h-1 w-full bg-gradient-to-r from-[#2563eb] via-[#8b5cf6] to-[#059669] rounded-full" />
        </div>

        {/* Action button */}
        <button
          onClick={handleGoHome}
          className={`w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 group ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          }`}
          style={{ transitionDelay: "0.5s" }}
        >
          <span className="text-lg">Ir al inicio</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
        </button>

        {/* Additional info */}
        <p
          className={`text-center text-sm text-[#334155] mt-6 transition-all duration-700 delay-700 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          }`}
        >
          Gracias por visitarnos ✨
        </p>
      </div>

      <style>
        {`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) translateX(10px) rotate(90deg);
          }
          50% {
            transform: translateY(-40px) translateX(-10px) rotate(180deg);
          }
          75% {
            transform: translateY(-20px) translateX(10px) rotate(270deg);
          }
        }
        `}
      </style>
    </div>
  )
};

export default CerrarSesion;
