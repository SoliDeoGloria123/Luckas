import React, { useState, useEffect } from 'react';
import { Activity, Users, Calendar, TrendingUp, TrendingDown } from 'lucide-react';

// Simulador de métricas en tiempo real
export const useRealTimeMetrics = () => {
  const [metrics, setMetrics] = useState({
    activeUsers: 0,
    todayRegistrations: 0,
    systemLoad: 0,
    responseTime: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        activeUsers: Math.max(0, prev.activeUsers + Math.floor(Math.random() * 10 - 5)),
        todayRegistrations: prev.todayRegistrations + Math.floor(Math.random() * 2),
        systemLoad: Math.max(0, Math.min(100, prev.systemLoad + Math.floor(Math.random() * 20 - 10))),
        responseTime: Math.max(50, prev.responseTime + Math.floor(Math.random() * 100 - 50))
      }));
    }, 3000);

    // Inicializar con valores base
    setMetrics({
      activeUsers: 25,
      todayRegistrations: 5,
      systemLoad: 45,
      responseTime: 120
    });

    return () => clearInterval(interval);
  }, []);

  return metrics;
};

// Componente de métricas en tiempo real
const RealTimeMetrics = () => {
  const metrics = useRealTimeMetrics();

  const getSystemLoadColor = (load) => {
    if (load < 30) return 'text-emerald-600 bg-emerald-50/50';
    if (load < 70) return 'text-amber-600 bg-amber-50/50';
    return 'text-red-600 bg-red-50/50';
  };

  const getResponseTimeColor = (time) => {
    if (time < 100) return 'text-emerald-600';
    if (time < 200) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800">Métricas en Tiempo Real</h2>
        <div className="flex items-center space-x-2 text-sm text-slate-500">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span>En vivo</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50/50 backdrop-blur-xl rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 mb-1">{metrics.activeUsers}</div>
          <div className="text-sm text-slate-600">Usuarios Activos</div>
        </div>

        <div className="bg-purple-50/50 backdrop-blur-xl rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 mb-1">{metrics.todayRegistrations}</div>
          <div className="text-sm text-slate-600">Registros Hoy</div>
        </div>

        <div className={`backdrop-blur-xl rounded-xl p-4 border border-white/20 ${getSystemLoadColor(metrics.systemLoad)}`}>
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5" />
            {metrics.systemLoad > 70 ? 
              <TrendingDown className="w-4 h-4 text-red-600" /> : 
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            }
          </div>
          <div className="text-2xl font-bold text-slate-800 mb-1">{metrics.systemLoad}%</div>
          <div className="text-sm text-slate-600">Carga del Sistema</div>
        </div>

        <div className="bg-slate-50/50 backdrop-blur-xl rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-slate-600" />
            <div className={`w-4 h-4 ${getResponseTimeColor(metrics.responseTime)}`}>
              {metrics.responseTime < 150 ? 
                <TrendingUp className="w-4 h-4" /> : 
                <TrendingDown className="w-4 h-4" />
              }
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-800 mb-1">{metrics.responseTime}ms</div>
          <div className="text-sm text-slate-600">Tiempo Respuesta</div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeMetrics;
