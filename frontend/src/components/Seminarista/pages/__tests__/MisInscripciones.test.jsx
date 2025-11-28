import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MisInscripciones from '../MisInscripciones';
import { inscripcionService } from '../../../../services/inscripcionService';

// Mock the service
jest.mock('../../../../services/inscripcionService');

// Mock localStorage
const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
};
global.localStorage = mockLocalStorage;

const mockInscripciones = [
    {
        _id: '1',
        id: '1',
        titulo: 'Retiro Espiritual',
        estado: 'inscrito',
        fechaEvento: '2024-12-01',
        tipo: 'Evento'
    },
    {
        _id: '2',
        id: '2',
        titulo: 'Campamento de Verano',
        estado: 'preinscrito',
        fechaEvento: '2024-12-15',
        tipo: 'Evento'
    }
];

describe('MisInscripciones', () => {
    beforeEach(() => {
        mockLocalStorage.getItem.mockReturnValue(JSON.stringify({ _id: 'user123', nombre: 'Test User' }));
        inscripcionService.getIncripcionesPorUsuario = jest.fn().mockResolvedValue(mockInscripciones);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders page title', async () => {
        render(
            <BrowserRouter>
                <MisInscripciones />
            </BrowserRouter>
        );

        expect(screen.getByText('Mis Inscripciones')).toBeInTheDocument();
    });

    test('fetches and displays inscripciones', async () => {
        render(
            <BrowserRouter>
                <MisInscripciones />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(inscripcionService.getIncripcionesPorUsuario).toHaveBeenCalledWith('user123');
        });

        await waitFor(() => {
            expect(screen.getByText('Retiro Espiritual')).toBeInTheDocument();
            expect(screen.getByText('Campamento de Verano')).toBeInTheDocument();
        });
    });

    test('displays empty state when no inscripciones', async () => {
        inscripcionService.getIncripcionesPorUsuario = jest.fn().mockResolvedValue([]);

        render(
            <BrowserRouter>
                <MisInscripciones />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/No tienes inscripciones registradas/i)).toBeInTheDocument();
        });
    });

    test('displays correct statistics', async () => {
        render(
            <BrowserRouter>
                <MisInscripciones />
            </BrowserRouter>
        );

        await waitFor(() => {
            // 1 confirmada (inscrito), 1 pendiente (preinscrito), 0 canceladas, 2 total
            expect(screen.getByText('Confirmadas')).toBeInTheDocument();
            expect(screen.getByText('Pendientes')).toBeInTheDocument();
            expect(screen.getByText('Canceladas')).toBeInTheDocument();
            expect(screen.getByText('Total')).toBeInTheDocument();
        });
    });

    test('handles service error gracefully', async () => {
        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => { });
        inscripcionService.getIncripcionesPorUsuario = jest.fn().mockRejectedValue(new Error('API Error'));

        render(
            <BrowserRouter>
                <MisInscripciones />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(consoleError).toHaveBeenCalled();
        });

        consoleError.mockRestore();
    });
});
