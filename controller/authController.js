const User = require('../models/userModel');

const crypto = require('crypto');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const uploadImage = require('../utils/uploadImage');

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
  const { name, email, password, passwordConfirm, role } = req.body;

  // apploadingImage to cloudinary
  const image = await uploadImage(req, next);

  const newUser = new User({
    name,
    email,
    password,
    passwordConfirm,
    role,
    photo: image?.secure_url,
  });

  const user = await newUser.save();

  customResponse(user, 201, res);
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

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user)
    return next(new AppError('ResetToken is invalid or has expired!', 400));

  // Reset password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  // Removing these   data from database
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  // Saving the data
  await user.save();

  customResponse(user, 200, res);
});

exports.changePasswordForAuthUsers = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+password');

  if (!user)
    return next(
      new AppError('You are not logged in, PLeas log in to get access!', 401)
    );

  // Chech if  password credentials is correct
  const { currentPassword, newPassword, passwordConfirm } = req.body;

  if (!(currentPassword, newPassword, passwordConfirm))
    return next(new AppError('All The fields are required!', 400));

  if (!(await user.comparePassword(currentPassword)))
    return next(new AppError('Your current password is wrong!', 401));

  // if current password i correct then update the password
  user.password = newPassword;
  user.passwordConfirm = passwordConfirm;

  await user.save();

  customResponse(user, 200, res);
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError('Forbidden!', 403));

    next();
  };
};
