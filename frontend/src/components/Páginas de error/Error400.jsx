

//import { useRouter } from "next/navigation"

export default function Error400() {
  //const router = useRouter()

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-20 left-10 w-32 h-32 bg-[#2563eb]/10 rounded-full animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        />
        <div
          className="absolute bottom-20 right-20 w-40 h-40 bg-[#8b5cf6]/10 rounded-full animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        />
        <div
          className="absolute top-1/2 right-1/4 w-24 h-24 bg-[#2563eb]/10 rounded-full animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "5s" }}
        />
      </div>

      <div className="max-w-md w-full relative">
        {/* Error Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center animate-fade-in-up">
          {/* Icon with animation */}
          <div className="mb-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] rounded-full animate-shake">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          {/* Error code badge */}
          <div className="mb-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <span className="inline-block px-4 py-1 bg-[#8b5cf6] text-white text-sm font-semibold rounded-full">
              Error 400
            </span>
          </div>

          {/* Error title */}
          <h1 className="text-3xl font-bold text-[#334155] mb-3 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            Solicitud Incorrecta
          </h1>

          {/* Error description */}
          <p className="text-[#334155]/70 mb-6 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
            Lo sentimos, la solicitud que enviaste contiene datos incorrectos o está mal formada. Por favor, verifica la
            información e intenta nuevamente.
          </p>

          {/* Divider */}
          <div
            className="w-full h-px bg-gradient-to-r from-transparent via-[#334155]/20 to-transparent mb-6 animate-fade-in-up"
            style={{ animationDelay: "1s" }}
          />

          {/* Action buttons */}
          <div className="flex flex-col gap-3 animate-fade-in-up" style={{ animationDelay: "1.2s" }}>
            <button
              onClick={() => router.back()}
              className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver Atrás
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
