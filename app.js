const express = require('express');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');

const userRoutes = require('./routes/userRoutes');
const articleRoutes = require('./routes/articleRoutes');

const app = express();

app.use(express.json());

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
