const cors = require('cors');

const allowedOrigins = process.env.NODE_ENV === 'production'
    ? ['https://api.example.com']
    : ['http://localhost:5000'];

const corsMiddleware = cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error(`CORS not allowed for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
});

module.exports = corsMiddleware;
