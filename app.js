const express = require('express');

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');

const userRoutes = require('./routes/userRoutes');
const articleRoutes = require('./routes/articleRoutes');

const app = express();

// Set security HTTP headers
app.use(helmet());

// Limiting the requests
const limiter = rateLimit({
  max: 50,
  windowMs: 60 * 60 * 1000,
  message: 'To many requests, Pleas try again later!',
});
app.use('/api', limiter);

app.use(express.json({ limit: '30kb' }));

// MongoSanitize need to use it after express.json()
app.use(mongoSanitize());

// Protection against "Cross site scripting" attacks
app.use(xss());

// Preventing paramiter pollution
app.use(hpp());

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/articles', articleRoutes);

// Handeling unhandeld routes
app.use('*', (req, res, next) => {
  const message = `Can't find ${req.originalUrl} on this server`;
  const statusCode = 400;

  next(new AppError(message, statusCode));
});

app.use(globalErrorHandler);

module.exports = app;
