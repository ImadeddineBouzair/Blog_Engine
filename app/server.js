const express = require('express');
const app = express();

const appRoutes = require('./routes/index');
const AppError = require('./helpers/appError');
const globalErrorHandler = require('./controller/errorController');

app.use(express.json());

require('dotenv').config();
require('./config/database').connect();

app.use('/api/v1/bloggeApp', appRoutes);

// Handeling unhandeld routes
app.use('*', (req, res, next) => {
  const message = `Can't find ${req.originalUrl} on this server`;
  const statusCode = 400;

  next(new AppError(message, statusCode));
});

app.use(globalErrorHandler);

app.listen(process.env.PORT, () =>
  console.log(`Server running on: 127.0.0.1:${process.env.PORT}`)
);
