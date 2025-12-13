const request = require('supertest');
const express = require('express');
const userRoutes = require('../../routes/userRoutes');
const User = require('../../models/User');

// Mock dependencies
jest.mock('../../models/User');

// Mock middlewares
jest.mock('../../middlewares/authJwt', () => ({
    verifyToken: (req, res, next) => {
        req.userId = 'admin-id';
        req.userRole = 'admin';
        next();
    },
    isAdmin: (req, res, next) => next(),
    isTesorero: (req, res, next) => next()
}));

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('User Routes & Controllers', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/users', () => {
        it('should return all users', async () => {
            const mockUsers = [
                { _id: '1', nombre: 'User 1' },
                { _id: '2', nombre: 'User 2' }
            ];

            User.find.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUsers)
            });

            const res = await request(app).get('/api/users');

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveLength(2);
        });
    });

    describe('GET /api/users/:id', () => {
        it('should return user by id', async () => {
            const mockUser = { _id: '1', nombre: 'User 1' };

            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser)
            });

            const res = await request(app).get('/api/users/1');

            expect(res.statusCode).toBe(200);
            expect(res.body.user).toEqual(mockUser);
        });

        it('should return 404 if user not found', async () => {
            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(null)
            });

            const res = await request(app).get('/api/users/1');

            expect(res.statusCode).toBe(404);
        });
    });

    describe('PUT /api/users/:id', () => {
        it('should update user successfully', async () => {
            const updateData = { nombre: 'Updated Name' };
            const mockUser = { _id: '1', ...updateData };

            User.findById.mockResolvedValue({ _id: '1', nombre: 'Old' });
            User.findByIdAndUpdate.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser)
            });

            const res = await request(app)
                .put('/api/users/1')
                .send(updateData);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });

    describe('DELETE /api/users/:id', () => {
        it('should delete user successfully', async () => {
            User.findByIdAndDelete.mockResolvedValue({ _id: '1' });

            const res = await request(app).delete('/api/users/1');

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should return 404 if user not found', async () => {
            User.findByIdAndDelete.mockResolvedValue(null);

            const res = await request(app).delete('/api/users/1');

            expect(res.statusCode).toBe(404);
        });
    });
});
