const express = require('express');
const bodyParser = require('body-parser');
const corsMiddleware = require('./middlewares/corsMiddleware');
const userAgentMiddleware = require('./middlewares/userAgentMiddleware');
const rateLimiter = require('./middlewares/rateLimiter');

const app = express();

app.use(corsMiddleware);
app.use(userAgentMiddleware);
app.use(bodyParser.json());
app.use(rateLimiter);


app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/profile'));
//app.use('/api/users', require('./routes/userRoutes')); //Uncomment this to test crud operation

app.get('/api/public', (req, res) => {
    res.json({ message: 'Public route accessible!' });
});

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Secure App API'});
});

module.exports = app;
