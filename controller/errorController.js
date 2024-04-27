const AppError = require('../utils/appError');

// ============== Handling Invalid IDs
const castHandlerErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;

  return new AppError(message, 400);
};

// ============== Handling duplicate fields
const handleDuplicateFieldsDB = (err) => {
  const value = err.message.match(/"([^"]*)"/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;

  return new AppError(message, 400);
};

// ============== Handling mongoose validation errors
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((value) => value.message);

  const message = `Invalid input data. ${errors.join('. ')}`;

  return new AppError(message, 400);
};

const handleJWTError = (err) =>
  new AppError(`${err.message}. Pleas log in again!`, 401);

const handleJWTExpiredError = (err) =>
  new AppError(`${err.message}, Pleas log in again`, 401);

// Sending error in development mode
const sendErrorDev = (err, res) => {
  // console.log(err.stack);
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

//  Sending error in production mode
const sendErrorProd = (err, res) => {
  // Operational: trust error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Programming or other unknown error: don't leak error details
  // console.error('ERROR', err); // console log the error to the client
  if (!err.isOperational) {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }

  if (process.env.NODE_ENV === 'production') {
    let error = { ...err, name: err.name, message: err.message };

    if (error.name === 'CastError') error = castHandlerErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
    if (error.name === 'TokenExpiredError')
      error = handleJWTExpiredError(error);

    sendErrorProd(error, res);
  }
};
