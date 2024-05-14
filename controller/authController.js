const User = require('../models/userModel');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

const asyncVerifyToken = (token) => {
  return new Promise(function (resolve, reject) {
    return resolve(jwt.verify(token, process.env.JWT_SECRET_KEY));
  });
};

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

  const user = await User.findOne({ email }).select('+password');

  // Checking if the user exists and the password is correct
  if (!(user && (await user.comparePassword(password))))
    return next(new AppError('Invalid email or password!', 401));

  customResponse(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token)
    return next(
      new AppError('You are not logged in, Pleas log in to get access!', 401)
    );

  const decode = await asyncVerifyToken(token);
  // console.log(decode.iat * 1000, Date.now());

  const currentUser = await User.findById(decode.id);

  if (!currentUser)
    return next(
      new AppError(
        'The user belonging to this token does no longer exist!',
        401
      )
    );

  if (currentUser.checkIfPassswordChanged(decode.iat))
    return next(
      new AppError('User recently changed password, Pleas log in again!', 401)
    );

  req.user = currentUser;

  next();
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) return next(new AppError('Your email address is required!', 400));

  const user = await User.findOne({ email });

  if (!user)
    return next(new AppError('Ther is no user with this email address', 404));

  // Generate random reset token
  const resetToken = user.generateRandomResetToken();
  await user.save({ validateBeforeSave: false });

  // Creating Reset password URL to send it via email
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetpassword/${resetToken}`;

  const message = `Forgot your password? submit a 'Patch' request with your new password to: ${resetUrl}. \n If you did not forgot your password, Pleas ignore this email!`;

  try {
    // Sending en email
    await sendEmail(
      process.env.MAIL_FROM,
      email,
      'Your passwrod reset token (valid for 10 min)',
      message
    );

    res.status(200).json({
      status: 'success',
      message: 'Token send to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    next(
      new AppError(
        'We got an error when sending an email, Try again later!',
        400
      )
    );
  }
});
