const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../helpers/catchAsync');
const AppError = require('../helpers/appError');

const checkToken = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization;

  /**
   * Check if token exist
   */
  if (!token) return next(new AppError('Not allowed', 403));

  const user = await jwt.decode(token, process.env.TOKEN_KEY);

  /**
   * Check if token is valid
   */
  if (!user) return next(new AppError('Invalid token', 403));

  const existUser = await User.findOne({ email: user.user_email });
  if (!existUser) {
    return next(new AppError('Not allowed', 403));
  }

  next();
});

module.exports = checkToken;
