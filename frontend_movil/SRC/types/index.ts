// Tipos TypeScript para la aplicación móvil

import { ReactNode } from 'react';

// Re-exportar tipos de navegación
export * from './navigation';

// Tipo de usuario según el modelo del backend
export interface User extends BaseModel {
    _id: string;
    nombre: string;
    apellido: string;
    correo: string;
    telefono: string;
    tipoDocumento: 'Cédula de ciudadanía' | 'Cédula de extranjería' | 'Pasaporte' | 'Tarjeta de identidad';
    numeroDocumento: string;
    role: 'admin' | 'tesorero' | 'seminarista' | 'externo';
    estado: 'activo' | 'inactivo';
}

// Credenciales para login
export interface LoginCredentials {
    correo: string;
    password: string;
}

// Respuesta del login
export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        token: string;
        expiresIn: number;
    };
}

// Datos para registro
export interface SignupData {
    nombre: string;
    apellido: string;
    correo: string;
    telefono: string;
    tipoDocumento: string;
    numeroDocumento: string;
    password: string;
    role?: 'admin' | 'tesorero' | 'seminarista' | 'externo';
}

// Respuesta genérica de la API
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}

// Tipo para configuración de la API
export interface ApiConfig {
    baseURL: string;
    timeout: number;
    headers: {
        'Content-Type': string;
        'Authorization'?: string;
    };
}

// Tipos para almacenamiento local
export interface StorageKeys {
    TOKEN: 'auth_token';
    USER_DATA: 'user_data';
    REMEMBER_USER: 'remember_user';
}

// Tipos para navegación
export type RootStackParamList = {
    Login: undefined;
    Dashboard: undefined;
    Profile: undefined;
    Settings: undefined;
};

// Tipos para formularios
export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'phone' | 'select';
    required: boolean;
    placeholder?: string;
    options?: Array<{ label: string; value: string }>;
}

// Error de validación
export interface ValidationError {
    field: string;
    message: string;
}

// Tipo para tareas
export interface Tarea extends BaseModel {
    _id: string;
    titulo: string;
    descripcion: string;
    fechaLimite: string;
    estado: 'pendiente' | 'en_progreso' | 'completada' | 'cancelada';
    prioridad: 'alta' | 'media' | 'baja';
    asignadoA: string | User;
    asignadoPor: string | User;
    comentarios?: string[];
}

// Estado de carga
export interface LoadingState {
    isLoading: boolean;
    error: string | null;
    success: boolean;
}

// Interfaz base para modelos con timestamps
export interface BaseModel {
    createdAt: string;
    updatedAt: string;
}

// Tipos basados en los modelos del backend

// Tipo Evento basado en models/Eventos.js
export interface Evento extends BaseModel {
    cupos: ReactNode;
    _id: string;
    nombre: string;
    descripcion: string;
    imagen?: string[];
    precio: number;
    categoria: string; // ObjectId como string
    etiquetas: string[];
    fechaEvento: string; // ISO date string
    horaInicio: string; // "09:00"
    horaFin: string; // "17:00"
    lugar: string;
    direccion?: string;
    duracionDias: number;
    cuposTotales: number;
    cuposDisponibles: number;
    programa: ProgramaEvento[];
    prioridad: 'Alta' | 'Media' | 'Baja';
    observaciones?: string;
    categorizadoPor?: string; // ObjectId como string
    fechaCategorizacion?: string;
    active: boolean;
}

export interface ProgramaEvento extends BaseModel {
    horaInicio: string;
    horaFin: string;
    _id: string;
    titulo: string;
    descripcion: string;
    fechaLimite: string;
    estado: 'pendiente' | 'en_progreso' | 'completada' | 'cancelada';
    prioridad: 'alta' | 'media' | 'baja';
    asignadoA: string; // ID del usuario
    asignadoPor: string; // ID del usuario
    categoria?: string;
    etiquetas?: string[];
    observaciones?: string;
    fechaCompletada?: string;
    creadoPor?: string; // ObjectId como string
    imagen: string[];
}

// Tipo Reserva basado en models/Reservas.js
// Tipo Cabana basado en models/Cabana.js
export interface Cabana extends BaseModel {
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
}

export interface Reserva {
    _id: string;
    usuario: string | User; // ObjectId como string o Usuario poblado
    cabana: string | Cabana; // ObjectId como string o Cabaña poblada
    fechaInicio: string; // ISO date string
    fechaFin: string; // ISO date string
    precio: number;
    estado: 'Pendiente' | 'Confirmada' | 'Cancelada' | 'finalizada' | 'En curso' | 'Completada';
    activo: boolean;
    observaciones?: string;
    solicitud?: string; // ObjectId como string
    createdAt: string;
    updatedAt: string;
}

// Tipo Programa Técnico basado en models/ProgramaTecnico.js
export interface ProgramaTecnico {
    _id: string;
    nombre: string;
    descripcion: string;
    area: 'tecnologia' | 'administracion' | 'oficios' | 'arte_diseno' | 'salud' | 'otros';
    nivel: 'tecnico_laboral' | 'tecnico_profesional' | 'especializacion_tecnica';
    duracion: {
        meses: number;
        horas: number;
    };
    modalidad: 'presencial' | 'virtual' | 'semipresencial';
    coordinador: string;
    fechaInicio: string;
    fechaFin: string;
    horarios: HorarioPrograma[];
    requisitos: string[];
    objetivos: string[];
    competencias: string[];
    estado: 'planificacion' | 'inscripciones_abiertas' | 'en_curso' | 'finalizado' | 'suspendido';
    cuposDisponibles: number;
    cuposTotales: number;
    costoInscripcion: number;
    costoMensualidad: number;
    certificacion: string;
    createdAt: string;
    updatedAt: string;
}

export interface HorarioPrograma {
    dia: string;
    horaInicio: string;
    horaFin: string;
}

// Tipo Curso basado en models/Curso.js
export interface Curso {
    _id: string;
    nombre: string;
    descripcion: string;
    instructor?: string;
    duracion: string;
    precio?: number;
    categoria?: string;
    fechaInicio?: string;
    fechaFin?: string;
    cupos?: number;
    estado: 'activo' | 'inactivo';
    createdAt: string;
    updatedAt: string;
}

// Tipo Categorización
export interface Categorizacion {
    _id: string;
    nombre: string;
    tipo: string;
    codigo: string;
    activo: boolean;
    creadoPor?: string;
}

// Tipo Reporte
export interface Reporte {
    _id: string;
    titulo: string;
    tipo: string;
    fechaGeneracion: string;
    generadoPor: string;
    datos: any;
    filtros?: any;
    createdAt: string;
    updatedAt: string;
}

// Formularios para crear/editar
export interface EventoForm {
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string; // ObjectId
  etiquetas: string[];
  fechaEvento: string | Date; // Enviar string ISO
  horaInicio: string;
  horaFin: string;
  lugar: string;
  direccion?: string;
  cuposDisponibles: number;
  cuposTotales: number;
  programa: ProgramaEvento[];
  prioridad: 'Alta' | 'Media' | 'Baja';
  observaciones?: string;
  imagen?: string[]; // Opcional, si usas imágenes
}

export interface CabanaForm {
    nombre: string;
    descripcion?: string;
    capacidad: number;
    categoria: string;
    precio: number;
    ubicacion?: string;
    estado: 'disponible' | 'ocupada' | 'mantenimiento';
    creadoPor?: string; // ObjectId como string
    imagen: string[];   // Requerido
}

export interface ReservaForm {
    cabana: string;
    fechaInicio: string;
    fechaFin: string;
    observaciones?: string;
}