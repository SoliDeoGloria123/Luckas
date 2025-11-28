const request = require('supertest');
const express = require('express');
const authRoutes = require('../../routes/authRoutes');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../../utils/sendEmail');

// Mock dependencies
jest.mock('../../models/User');
jest.mock('jsonwebtoken');
jest.mock('bcryptjs');
jest.mock('../../utils/sendEmail');
jest.mock('../../config/auth.config', () => ({
    secret: 'test-secret',
    jwtExpiration: 3600
}));

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes & Controllers', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/auth/signup', () => {
        const validUser = {
            nombre: 'Test',
            apellido: 'User',
            correo: 'test@example.com',
            telefono: '1234567890',
            tipoDocumento: 'CC',
            numeroDocumento: '123456789',
            fechaNacimiento: '1990-01-01',
            password: 'password123'
        };

        it('should register a new user successfully', async () => {
            // Mock User.findOne to return null (user doesn't exist)
            User.findOne.mockResolvedValue(null);

            // Mock User.save
            User.prototype.save = jest.fn().mockResolvedValue({
                _id: 'user-id',
                ...validUser,
                role: 'externo',
                toObject: () => ({ ...validUser, _id: 'user-id', role: 'externo' })
            });

            jwt.sign.mockReturnValue('mock-token');

            const res = await request(app)
                .post('/api/auth/signup')
                .send(validUser);

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.token).toBe('mock-token');
        });

        it('should return 400 if required fields are missing', async () => {
            const res = await request(app)
                .post('/api/auth/signup')
                .send({ nombre: 'Test' });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toContain('Faltan campos obligatorios');
        });

        it('should handle duplicate email error', async () => {
            // Middleware passes (user not found yet)
            User.findOne.mockResolvedValue(null);

            User.prototype.save = jest.fn().mockRejectedValue({
                code: 11000,
                keyPattern: { correo: 1 }
            });

            const res = await request(app)
                .post('/api/auth/signup')
                .send(validUser);

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toContain('ya está en uso');
        });
    });

    describe('POST /api/auth/signin', () => {
        const loginData = {
            correo: 'test@example.com',
            password: 'password123'
        };

        it('should login successfully with valid credentials', async () => {
            const mockUser = {
                _id: 'user-id',
                correo: loginData.correo,
                password: 'hashed-password',
                role: 'externo',
                comparePassword: jest.fn().mockResolvedValue(true),
                toObject: () => ({ _id: 'user-id', correo: loginData.correo, role: 'externo' })
            };

            User.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser)
            });

            jwt.sign.mockReturnValue('mock-token');

            const res = await request(app)
                .post('/api/auth/signin')
                .send(loginData);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.token).toBe('mock-token');
        });

        it('should return 404 if user not found', async () => {
            User.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue(null)
            });

            const res = await request(app)
                .post('/api/auth/signin')
                .send(loginData);

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Usuario no encontrado');
        });

        it('should return 401 if password is incorrect', async () => {
            const mockUser = {
                comparePassword: jest.fn().mockResolvedValue(false)
            };

            User.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser)
            });

            const res = await request(app)
                .post('/api/auth/signin')
                .send(loginData);

            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe('Credenciales inválidas');
        });
    });

    describe('POST /api/auth/forgot-password', () => {
        it('should send recovery email if user exists', async () => {
            const mockUser = {
                correo: 'test@example.com',
                save: jest.fn().mockResolvedValue(true)
            };

            User.findOne.mockResolvedValue(mockUser);
            sendEmail.mockResolvedValue(true);

            const res = await request(app)
                .post('/api/auth/forgot-password')
                .send({ correo: 'test@example.com' });

            expect(res.statusCode).toBe(200);
            expect(sendEmail).toHaveBeenCalled();
        });

        it('should return 404 if user does not exist', async () => {
            User.findOne.mockResolvedValue(null);

            const res = await request(app)
                .post('/api/auth/forgot-password')
                .send({ correo: 'nonexistent@example.com' });

            expect(res.statusCode).toBe(404);
        });
    });
});
