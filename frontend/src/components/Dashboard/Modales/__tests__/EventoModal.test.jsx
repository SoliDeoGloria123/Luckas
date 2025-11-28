import { render, screen, fireEvent } from '@testing-library/react';
import EventoModal from '../EventoModal';

describe('EventoModal', () => {
    const mockProps = {
        mostrar: true,
        modoEdicion: false,
        nuevoEvento: {
            nombre: '',
            descripcion: '',
            precio: 0,
            categoria: '',
            fechaEvento: '',
            horaInicio: '',
            horaFin: '',
            lugar: '',
            direccion: '',
            duracionDias: 1,
            cuposTotales: 0,
            cuposDisponibles: 0,
            prioridad: 'Media',
            active: true,
            etiquetas: '',
            observaciones: '',
            imagen: ''
        },
        setNuevoEvento: jest.fn(),
        categorias: [
            { _id: '1', nombre: 'Retiro', estado: 'activo' },
            { _id: '2', nombre: 'Campamento', estado: 'activo' }
        ],
        onClose: jest.fn(),
        onSubmit: jest.fn(),
        selectedImages: [],
        setSelectedImages: jest.fn(),
        eventoSeleccionado: null,
        setEventoSeleccionado: jest.fn()
    };

    test('renders modal when mostrar is true', () => {
        render(<EventoModal {...mockProps} />);
        expect(screen.getByText(/Nueva Evento/i)).toBeInTheDocument();
    });

    test('does not render modal when mostrar is false', () => {
        render(<EventoModal {...mockProps} mostrar={false} />);
        expect(screen.queryByText(/Nueva Evento/i)).not.toBeInTheDocument();
    });

    test('nombre field has name attribute', () => {
        render(<EventoModal {...mockProps} />);
        const nombreInput = screen.getByLabelText(/Nombre Evento/i);
        expect(nombreInput).toHaveAttribute('name', 'nombre');
        expect(nombreInput).toHaveAttribute('id', 'nombre-evento');
    });

    test('lugar field has name attribute', () => {
        render(<EventoModal {...mockProps} />);
        const lugarInput = screen.getByLabelText(/Lugar/i);
        expect(lugarInput).toHaveAttribute('name', 'lugar');
        expect(lugarInput).toHaveAttribute('id', 'lugar-evento');
    });

    test('calls onClose when close button is clicked', () => {
        render(<EventoModal {...mockProps} />);
        const closeButton = screen.getByText('✕');
        fireEvent.click(closeButton);
        expect(mockProps.onClose).toHaveBeenCalled();
    });

    test('displays edit mode title when modoEdicion is true', () => {
        render(<EventoModal {...mockProps} modoEdicion={true} />);
        expect(screen.getByText(/Editar Evento/i)).toBeInTheDocument();
    });

    test('renders all category options', () => {
        render(<EventoModal {...mockProps} />);
        expect(screen.getByText('Retiro')).toBeInTheDocument();
        expect(screen.getByText('Campamento')).toBeInTheDocument();
    });

    test('calls onSubmit when form is submitted', () => {
        render(<EventoModal {...mockProps} />);
        const form = screen.getByRole('form', { hidden: true });
        fireEvent.submit(form);
        expect(mockProps.onSubmit).toHaveBeenCalled();
    });
});
