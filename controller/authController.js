const User = require('../models/userModel');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });
};

const customResponse = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),

    httpOnly: true, // scure against cross site scripting
  };

  if (process.env.NODE_ENV === 'prodcution') cookieOptions.secure = ture; // Adding scure propertie in production env and set it to true
  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.registerUser = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, role, photo } = req.body;

  const newUser = new User({
    name,
    email,
    password,
    passwordConfirm,
    role,
    photo,
  });

  const user = await newUser.save();

  customResponse(user, 200, res);
});

exports.logIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!(email && password))
    return next(new AppError('Email and password fields are required!', 400));

  const user = await User.find({ email }).select('+password');
  if (!(user && (await user.comparePassword(user.password))))
    return next(new AppError('Invalid email or password!', 401));

  customResponse(user, 200, res);
});
