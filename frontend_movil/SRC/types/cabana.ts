// Tipo Cabana basado en models/Cabana.js
export interface Cabana {
    _id: string;
    nombre: string;
    descripcion?: string;
    capacidad: number;
    categoria: string; // ObjectId como string
    precio: number;
    ubicacion?: string;
    estado: 'disponible' | 'ocupada' | 'mantenimiento';
    creadoPor?: string; // ObjectId como string
    imagen: string[];
    createdAt: string;
    updatedAt: string;
}