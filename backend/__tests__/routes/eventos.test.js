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
    isTesorero: (req, res, next) => next(),
    checkRole: (...roles) => (req, res, next) => next()
}));

// Mock role middleware explicitly since it's used in routes
jest.mock('../../middlewares/role', () => ({
    checkRole: (...roles) => (req, res, next) => next(),
    isAdmin: (req, res, next) => next()
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
            Evento.find.mockImplementation(() => {
                throw new Error('DB Error');
            });

            const res = await request(app).get('/api/eventos');

            expect(res.statusCode).toBe(500);
        });
    });

    describe('GET /api/eventos/:id', () => {
        it('should return event by id', async () => {
            const mockEvent = { _id: '1', nombre: 'Event 1' };
            Evento.findById.mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockEvent)
            });

            const res = await request(app).get('/api/eventos/1');

            expect(res.statusCode).toBe(200);
            expect(res.body.data).toEqual(mockEvent);
        });

        it('should return 404 if event not found', async () => {
            Evento.findById.mockReturnValue({
                populate: jest.fn().mockResolvedValue(null)
            });

            const res = await request(app).get('/api/eventos/nonexistent');

            expect(res.statusCode).toBe(404);
        });

        it('should handle errors', async () => {
            Evento.findById.mockImplementation(() => {
                throw new Error('DB Error');
            });

            const res = await request(app).get('/api/eventos/1');

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

        it('should return 400 if category ID is invalid', async () => {
            const isValidSpy = jest.spyOn(require('mongoose').Types.ObjectId, 'isValid');
            isValidSpy.mockReturnValueOnce(false); // For categoria check
            
            const invalidEvent = { ...newEvent, categoria: 'invalid-id' };
            const res = await request(app).post('/api/eventos').send(invalidEvent);
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('ID de categoría inválido.');
        });

        it('should return 400 if categorizadoPor ID is invalid', async () => {
            const isValidSpy = jest.spyOn(require('mongoose').Types.ObjectId, 'isValid');
            isValidSpy.mockReturnValueOnce(true); // For categoria check (valid)
            isValidSpy.mockReturnValueOnce(false); // For categorizadoPor check (invalid)

            const invalidEvent = { ...newEvent, categorizadoPor: 'invalid-id' };
            const res = await request(app).post('/api/eventos').send(invalidEvent);
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('ID de usuario categorizador inválido.');
        });

        it('should return 404 if categorizadoPor user does not exist', async () => {
            Categorizacion.findById.mockResolvedValue(true);
            Usuario.findById.mockResolvedValue(null);
            const eventWithUser = { ...newEvent, categorizadoPor: '507f1f77bcf86cd799439011' };
            
            const res = await request(app).post('/api/eventos').send(eventWithUser);
            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('El usuario categorizador no existe.');
        });

        it('should return 404 if category does not exist', async () => {
            Categorizacion.findById.mockResolvedValue(null);
            const res = await request(app).post('/api/eventos').send(newEvent);
            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('La categoría no existe.');
        });

        it('should handle errors during creation', async () => {
             Categorizacion.findById.mockResolvedValue(true);
             Evento.prototype.save = jest.fn().mockRejectedValue(new Error('DB Error'));
             
             const res = await request(app).post('/api/eventos').send(newEvent);
             expect(res.statusCode).toBe(500);
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

        it('should return 400 if name is duplicated', async () => {
            Evento.findById.mockResolvedValue({ _id: '1', nombre: 'Old Name' });
            Evento.findOne.mockResolvedValue({ _id: '2', nombre: 'New Name' }); // Duplicate found

            const res = await request(app)
                .put('/api/eventos/1')
                .send({ nombre: 'New Name' });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Ya existe un evento con ese nombre');
        });

        it('should handle errors', async () => {
            Evento.findById.mockRejectedValue(new Error('DB Error'));
            const res = await request(app).put('/api/eventos/1').send({ nombre: 'New' });
            expect(res.statusCode).toBe(500);
        });

        it('should return 404 if event not found', async () => {
            Evento.findById.mockResolvedValue(null);
            const res = await request(app).put('/api/eventos/1').send({ nombre: 'New' });
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

        it('should return 404 if event not found', async () => {
            Evento.findByIdAndDelete.mockResolvedValue(null);
            const res = await request(app).delete('/api/eventos/1');
            expect(res.statusCode).toBe(404);
        });

        it('should handle errors', async () => {
            Evento.findByIdAndDelete.mockRejectedValue(new Error('DB Error'));
            const res = await request(app).delete('/api/eventos/1');
            expect(res.statusCode).toBe(500);
        });

        it('should handle cloudinary deletion error gracefully', async () => {
            Evento.findByIdAndDelete.mockResolvedValue({ _id: '1', imagen: ['https://res.cloudinary.com/demo/image/upload/v1/Luckas/eventos/img.jpg'] });
            require('../../config/cloudinary').uploader.destroy.mockRejectedValue(new Error('Cloudinary Error'));
            
            const res = await request(app).delete('/api/eventos/1');
            expect(res.statusCode).toBe(200);
        });
    });

    describe('PUT /api/eventos/:id - Same Name', () => {
        it('should handle same name update', async () => {
            Evento.findById.mockResolvedValue({ _id: '1', nombre: 'Same Name' });
            Evento.findByIdAndUpdate.mockResolvedValue({ _id: '1', nombre: 'Same Name' });

            const res = await request(app)
                .put('/api/eventos/1')
                .send({ nombre: 'Same Name' });

            expect(res.statusCode).toBe(200);
        });
    });

    describe('PATCH /api/eventos/:id/disable', () => {
        it('should disable event successfully', async () => {
            const mockEvent = { _id: '1', active: false };
            Evento.findByIdAndUpdate.mockResolvedValue(mockEvent);

            const res = await request(app).patch('/api/eventos/1/disable');

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Evento deshabilitado');
        });

        it('should return 404 if event not found', async () => {
            Evento.findByIdAndUpdate.mockResolvedValue(null);

            const res = await request(app).patch('/api/eventos/1/disable');

            expect(res.statusCode).toBe(404);
        });

        it('should handle errors', async () => {
            Evento.findByIdAndUpdate.mockRejectedValue(new Error('DB Error'));

            const res = await request(app).patch('/api/eventos/1/disable');

            expect(res.statusCode).toBe(500);
        });
    });

    describe('PATCH /api/eventos/:id/categorizar', () => {
        it('should categorize event successfully', async () => {
            const mockEvent = { _id: '1', categoria: 'cat1' };
            Evento.findByIdAndUpdate.mockResolvedValue(mockEvent);

            const res = await request(app)
                .patch('/api/eventos/1/categorizar')
                .send({ categoria: 'cat1', etiquetas: ['tag1'] });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Evento categorizado exitosamente');
        });

        it('should return 400 if category is missing', async () => {
            const res = await request(app)
                .patch('/api/eventos/1/categorizar')
                .send({ etiquetas: ['tag1'] });

            expect(res.statusCode).toBe(400);
        });

        it('should return 404 if event not found', async () => {
            Evento.findByIdAndUpdate.mockResolvedValue(null);

            const res = await request(app)
                .patch('/api/eventos/1/categorizar')
                .send({ categoria: 'cat1' });

            expect(res.statusCode).toBe(404);
        });

        it('should handle errors', async () => {
            Evento.findByIdAndUpdate.mockRejectedValue(new Error('DB Error'));

            const res = await request(app)
                .patch('/api/eventos/1/categorizar')
                .send({ categoria: 'cat1' });

            expect(res.statusCode).toBe(500);
        });
    });

    describe('GET /api/eventos/categoria', () => {
        it('should return events by category', async () => {
            const mockEvents = [{ _id: '1' }];
            Evento.find.mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    sort: jest.fn().mockResolvedValue(mockEvents)
                })
            });

            const res = await request(app).get('/api/eventos/categoria').query({ categoria: 'cat1' });

            expect(res.statusCode).toBe(200);
            expect(res.body.data).toEqual(mockEvents);
        });

        it('should handle errors', async () => {
            Evento.find.mockImplementation(() => { throw new Error('DB Error'); });

            const res = await request(app).get('/api/eventos/categoria');

            expect(res.statusCode).toBe(500);
        });
    });

    describe('PATCH /api/eventos/activar-todos', () => {
        it('should activate all events', async () => {
            Evento.updateMany = jest.fn().mockResolvedValue({ modifiedCount: 5 });

            const res = await request(app).patch('/api/eventos/activar-todos');

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toContain('Se activaron 5 eventos');
        });

        it('should handle errors', async () => {
            Evento.updateMany = jest.fn().mockRejectedValue(new Error('DB Error'));

            const res = await request(app).patch('/api/eventos/activar-todos');

            expect(res.statusCode).toBe(500);
        });
    });

    describe('GET /api/eventos/estadisticas', () => {
        it('should return statistics', async () => {
            Evento.countDocuments = jest.fn()
                .mockResolvedValueOnce(10) // total
                .mockResolvedValueOnce(5)  // upcoming
                .mockResolvedValueOnce(3)  // completed
                .mockResolvedValueOnce(2); // cancelled

            const res = await request(app).get('/api/eventos/estadisticas');

            expect(res.statusCode).toBe(200);
            expect(res.body.data).toEqual({
                totalEvents: 10,
                upcoming: 5,
                completed: 3,
                cancelled: 2
            });
        });

        it('should handle errors', async () => {
            Evento.countDocuments.mockRejectedValue(new Error('DB Error'));

            const res = await request(app).get('/api/eventos/estadisticas');

            expect(res.statusCode).toBe(500);
        });
    });
});
