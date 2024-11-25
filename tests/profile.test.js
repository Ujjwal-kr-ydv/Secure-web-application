const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { decrypt } = require('../utils/encryption');
const profileRoutes = require('../routes/profile');

const app = express();
app.use(express.json());
app.use('/api/profile', profileRoutes);

jest.mock('../models/User');
jest.mock('../utils/encryption', () => ({
    decrypt: jest.fn(),
}));

describe('Profile API', () => {
    describe('GET /api/profile/fetch/users/:id', () => {
        it('should return user data successfully', async () => {
            const mockUser = {
                encryptedPayload: JSON.stringify({ name: 'John Doe' }),
            };

            User.findById = jest.fn().mockResolvedValue(mockUser);
            decrypt.mockReturnValue(JSON.stringify({ name: 'John Doe' }));

            const response = await request(app).get('/api/profile/fetch/users/123');
            
            expect(response.status).toBe(200);
            expect(response.body.name).toBe('John Doe');
            expect(User.findById).toHaveBeenCalledWith('123');
            expect(decrypt).toHaveBeenCalledWith(mockUser.encryptedPayload);
        });

        it('should return 404 if user is not found', async () => {
            User.findById = jest.fn().mockResolvedValue(null);

            const response = await request(app).get('/api/profile/fetch/users/123');
            
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('User not found.');
            expect(User.findById).toHaveBeenCalledWith('123');
        });

        it('should return 500 if an error occurs', async () => {
            User.findById = jest.fn().mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/api/profile/fetch/users/123');
            
            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Database error');
            expect(User.findById).toHaveBeenCalledWith('123');
        });
    });
});
