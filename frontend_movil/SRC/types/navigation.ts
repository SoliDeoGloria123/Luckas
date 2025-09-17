// Tipos de navegación para la aplicación móvil del seminario

export type RootStackParamList = {
    Login: undefined;
    Main: undefined;
    Loading: undefined;
};

export type MainTabParamList = {
    Home: undefined;
    Cursos: undefined;
    Eventos: undefined;
    Reservas: undefined;
    Profile: undefined;
    // Tabs adicionales según rol
    Programas?: undefined;
    Reportes?: undefined;
    Usuarios?: undefined;
    Cabanas?: undefined;
};

// Tipos para Stack Navigators específicos
export type CursosStackParamList = {
    CursosList: undefined;
    CursoDetail: { cursoId: string };
    CursoForm: { cursoId?: string };
    Inscripciones: { cursoId: string };
};

export type EventosStackParamList = {
    EventosList: undefined;
    EventoDetail: { eventoId: string };
    EventoForm: { eventoId?: string };
};

export type ReservasStackParamList = {
    ReservasList: undefined;
    ReservaDetail: { reservaId: string };
    ReservaForm: { reservaId?: string };
    CabanasList: undefined;
    CabanaDetail: { cabanaId: string };
};

export type ProgramasStackParamList = {
    ProgramasList: undefined;
    ProgramaDetail: { programaId: string };
    ProgramaForm: { programaId?: string };
};

export type ReportesStackParamList = {
    ReportesList: undefined;
    ReporteDetail: { reporteId: string };
    GenerarReporte: undefined;
};

export type UsuariosStackParamList = {
    UsuariosList: undefined;
    UsuarioDetail: { usuarioId: string };
    UsuarioForm: { usuarioId?: string };
};

export type ProfileStackParamList = {
    ProfileMain: undefined;
    EditProfile: undefined;
    ChangePassword: undefined;
    Settings: undefined;
};

// Tipos para parámetros de pantallas
export type ScreenProps<T extends keyof any> = {
    navigation: any;
    route: {
        params: T;
    };
};