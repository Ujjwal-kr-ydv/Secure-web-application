const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../models/User');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../utils/encryption', () => ({
    encrypt: jest.fn(),
}));

const { encrypt } = require('../utils/encryption');

describe('Auth API', () => {
    describe('POST api/auth/register', () => {
      it('should register a new user successfully', async () => {
        const mockSave = jest.fn().mockResolvedValue();
        User.mockImplementation(() => ({ save: mockSave }));

        const response = await request(app)
            .post('/api/auth/register')
            .send({ name: 'John Blaze', email: 'john@example.com', password: '123456' });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User registered successfully.');
        expect(mockSave).toHaveBeenCalledTimes(1);
        expect(encrypt).toHaveBeenCalledWith(JSON.stringify({ email: 'john@example.com', name: 'John Blaze' }));
    });

        it('should return error if user save fails', async () => {
            const mockSave = jest.fn().mockRejectedValue(new Error('Failed to save user'));
            User.mockImplementation(() => ({
                save: mockSave,
            }));

            encrypt.mockReturnValue('encrypted-payload');

            const response = await request(app)
                .post('/api/auth/register')
                .send({ name: 'John Doe', email: 'john@example.com', password: '123456' });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Failed to save user');
        });
    });

    describe('POST /login', () => {
        it('should login an existing user and return a token', async () => {
            const mockUser = { _id: 'mock-id', email: 'john@example.com', password: 'hashed-password' };
            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('mock-token');

            const response = await request(app)
                .post('/api/auth/login')
                .send({ email: 'john@example.com', password: '123456' });

            expect(response.status).toBe(200);
            expect(response.body.token).toBe('mock-token');
            expect(User.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
            expect(bcrypt.compare).toHaveBeenCalledWith('123456', 'hashed-password');
        });

        it('should return error if user is not found', async () => {
            User.findOne.mockResolvedValue(null);

            const response = await request(app)
                .post('/api/auth/login')
                .send({ email: 'john@example.com', password: '123456' });

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('User not found.');
        });

        it('should return error if password is incorrect', async () => {
            const mockUser = { _id: 'mock-id', email: 'john@example.com', password: 'hashed-password' };
            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);

            const response = await request(app)
                .post('/api/auth/login')
                .send({ email: 'john@example.com', password: 'wrongpassword' });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Invalid credentials.');
        });
    });
});
