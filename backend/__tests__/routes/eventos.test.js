const request = require('supertest');
const express = require('express');
const eventosRoutes = require('../../routes/eventosRoutes');
const Evento = require('../../models/Eventos');
const Categorizacion = require('../../models/categorizacion');
const Usuario = require('../../models/User');

// Mock dependencies
jest.mock('../../models/Eventos');
jest.mock('../../models/categorizacion');
jest.mock('../../models/User');
jest.mock('../../config/cloudinary', () => ({
    uploader: {
        upload_stream: jest.fn((options, callback) => {
            if (callback) callback(null, { secure_url: 'https://mock-url.com/image.jpg' });
            return { end: jest.fn() };
        }),
        destroy: jest.fn().mockResolvedValue({ result: 'ok' })
    }
}));

// Mock middlewares
jest.mock('../../middlewares/authJwt', () => ({
    verifyToken: (req, res, next) => {
        req.userId = 'user-id';
        req.userRole = 'admin';
        next();
    },
    isAdmin: (req, res, next) => next(),
    isTesorero: (req, res, next) => next()
}));

const app = express();
app.use(express.json());
app.use('/api/eventos', eventosRoutes);

describe('Eventos Routes & Controllers', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/eventos', () => {
        it('should return all events', async () => {
            const mockEvents = [
                { _id: '1', nombre: 'Event 1' },
                { _id: '2', nombre: 'Event 2' }
            ];

            Evento.countDocuments.mockResolvedValue(2);
            Evento.find.mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockEvents)
            });

            const res = await request(app).get('/api/eventos');

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveLength(2);
        });

        it('should handle errors', async () => {
            Evento.countDocuments.mockRejectedValue(new Error('DB Error'));

            const res = await request(app).get('/api/eventos');

            expect(res.statusCode).toBe(500);
        });
    });

    describe('POST /api/eventos', () => {
        const newEvent = {
            nombre: 'New Event',
            descripcion: 'Desc',
            precio: 100,
            categoria: '507f1f77bcf86cd799439011', // Valid ObjectId
            fechaEvento: '2024-12-31'
        };

        it('should create event successfully', async () => {
            Categorizacion.findById.mockResolvedValue(true);
            Evento.prototype.save = jest.fn().mockResolvedValue(newEvent);

            const res = await request(app)
                .post('/api/eventos')
                .send(newEvent);

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
        });

        it('should return 404 if category does not exist', async () => {
            Categorizacion.findById.mockResolvedValue(null);

            const res = await request(app)
                .post('/api/eventos')
                .send(newEvent);

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('La categoría no existe.');
        });
    });

    describe('PUT /api/eventos/:id', () => {
        it('should update event successfully', async () => {
            const updateData = { nombre: 'Updated Name' };

            Evento.findById.mockResolvedValue({ _id: '1', nombre: 'Old Name' });
            Evento.findOne.mockResolvedValue(null); // Ensure no duplicate name found
            Evento.findByIdAndUpdate.mockResolvedValue({ _id: '1', ...updateData });

            const res = await request(app)
                .put('/api/eventos/1')
                .send(updateData);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should return 404 if event not found', async () => {
            Evento.findById.mockResolvedValue(null);

            const res = await request(app)
                .put('/api/eventos/1')
                .send({ nombre: 'New' });

            expect(res.statusCode).toBe(404);
        });
    });

    describe('DELETE /api/eventos/:id', () => {
        it('should delete event successfully', async () => {
            Evento.findByIdAndDelete.mockResolvedValue({ _id: '1', imagen: [] });
            // Mock Inscripcion.deleteMany (it's required inside controller)
            jest.mock('../../models/Inscripciones', () => ({
                deleteMany: jest.fn().mockResolvedValue({ deletedCount: 0 })
            }));

            const res = await request(app).delete('/api/eventos/1');

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });
});
