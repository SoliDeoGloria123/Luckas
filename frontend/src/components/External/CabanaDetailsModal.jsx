import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Users, MapPin, Bed, Wifi, Tv, CookingPot, Snowflake, Sun } from 'lucide-react';
import './ExternalDashboard.css';

const icons = {
  Wifi: <Wifi className="inline-block mr-1" />, Tv: <Tv className="inline-block mr-1" />, Cocina: <CookingPot className="inline-block mr-1" />, "A/C": <Snowflake className="inline-block mr-1" />,
  "Vista al bosque": <Sun className="inline-block mr-1" />,
  Chimenea: <Sun className="inline-block mr-1" />, // fallback to Sun icon
  "Terraza privada": <Sun className="inline-block mr-1" />,
  Parrilla: <CookingPot className="inline-block mr-1" /> // fallback to CookingPot icon
};

const CabanaDetailsModal = ({ cabana, onClose, onReservar }) => {
  const [imgIdx, setImgIdx] = useState(0);
  if (!cabana) return null;
  // Usar cabana.imagen como array de imágenes (modelo backend)
  const imgs = Array.isArray(cabana.imagen) && cabana.imagen.length > 0 ? cabana.imagen : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-xl shadow-lg p-0 w-full max-w-4xl relative external-modal overflow-y-auto" style={{maxHeight:'90vh'}}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 z-50 text-gray-500 hover:text-black text-2xl flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span className="sr-only">Cerrar</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {/* Carrusel de imágenes */}
        <div className="relative w-full h-64 bg-gray-100 rounded-t-xl flex items-center justify-center">
          <button className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white" onClick={()=>setImgIdx((imgIdx-1+imgs.length)%imgs.length)}><ChevronLeft /></button>
          <img src={imgs[imgIdx]} alt={cabana.nombre} className="h-56 object-cover rounded-xl mx-auto" style={{maxWidth:'80%'}} />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white" onClick={()=>setImgIdx((imgIdx+1)%imgs.length)}><ChevronRight /></button>
        </div>
        <div className="flex flex-col md:flex-row gap-8 p-8">
          {/* Columna izquierda */}
          <div className="flex-1 min-w-[260px]">
            <h2 className="text-2xl font-bold mb-1 text-gray-800">{cabana.nombre || 'No disponible'}</h2>
            <div className="flex items-center gap-2 mb-2 text-yellow-500 font-semibold">
              {cabana.calificacion && <span>★ {cabana.calificacion}</span>}
              {cabana.reseñas && <span className="text-gray-500">({cabana.reseñas} reseñas)</span>}
              <span className="text-gray-500"><MapPin className="inline-block w-4 h-4 mr-1" />{cabana.ubicacion || 'No disponible'}</span>
            </div>
            <p className="mb-3 text-gray-700">{cabana.descripcion || ''}</p>
            {/* Capacidad y espacios */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-2"><Users className="w-5 h-5 text-blue-500" /> <span className="font-bold">{cabana.capacidad ?? 'No disponible'}</span> Personas</div>
              <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-2"><Bed className="w-5 h-5 text-blue-500" /> <span className="font-bold">{cabana.habitaciones ?? 'No disponible'}</span> Habitaciones</div>
              <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-2"><Bed className="w-5 h-5 text-blue-500" /> <span className="font-bold">{cabana.banos ?? 'No disponible'}</span> Baños</div>
              <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-2"><MapPin className="w-5 h-5 text-blue-500" /> {cabana.zona || 'No disponible'}</div>
            </div>
            {/* Servicios incluidos */}
            <div className="mb-4">
              <div className="font-semibold mb-1">Servicios Incluidos</div>
              <div className="grid grid-cols-2 gap-2">
                {Array.isArray(cabana.servicios) && cabana.servicios.length > 0 ? cabana.servicios.map(s => (
                  <div key={s} className="border rounded-lg px-3 py-2 flex items-center text-gray-700">{icons[s] || null}{s}</div>
                )) : <div className="text-gray-400">No disponible</div>}
              </div>
            </div>
            {/* Características especiales */}
            <div className="mb-4">
              <div className="font-semibold mb-1">Características Especiales</div>
              <div className="grid grid-cols-2 gap-2">
                {Array.isArray(cabana.caracteristicas) && cabana.caracteristicas.length > 0 ? cabana.caracteristicas.map(c => (
                  <div key={c} className="bg-yellow-50 rounded-lg px-3 py-2 flex items-center text-yellow-700">{icons[c] || null}{c}</div>
                )) : <div className="text-gray-400">No disponible</div>}
              </div>
            </div>
            {/* Políticas */}
            <div className="mb-2">
              <div className="font-semibold mb-1">Políticas de la Cabaña</div>
              {Array.isArray(cabana.politicas) && cabana.politicas.length > 0 ? (
                <ul className="text-sm text-gray-600 list-disc pl-5">
                  {cabana.politicas.map((p, idx) => <li key={idx}>{p}</li>)}
                </ul>
              ) : <div className="text-gray-400">No disponible</div>}
            </div>
          </div>
          {/* Columna derecha */}
          <div className="w-full md:w-80 bg-gray-50 rounded-xl p-6 flex flex-col items-center justify-start border border-gray-200">
            <div className="text-green-500 text-lg font-bold mb-1">{cabana.precioOriginal ? `$${cabana.precioOriginal.toLocaleString()}` : ''}</div>
            <div className="text-2xl font-bold text-orange-500 mb-2">{cabana.precio ? `$${cabana.precio.toLocaleString()}` : 'No disponible'} <span className="text-base text-gray-500">por noche</span></div>
            {/* Aquí puedes mostrar fechas reales si las tienes en la reserva o cabana */}
            {/* Aquí puedes mostrar el cálculo real del precio si tienes los datos */}
            <button className="w-full bg-orange-500 text-white py-2 rounded font-bold hover:bg-orange-600 transition mt-2 mb-1 text-lg" onClick={onReservar}>Proceder con la Reserva</button>
            <div className="mt-1 text-xs text-gray-500 text-center">No se realizará ningún cargo hasta confirmar</div>
            <div className="mt-2"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">Reservada</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CabanaDetailsModal;
