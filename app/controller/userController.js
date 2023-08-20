const User = require('../models/userModel');
const APIFeatures = require('../helpers/apiFeatures');
const AppError = require('../helpers/appError');
const catchAsync = require('../helpers/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const userQueryes = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .paginate();

  const users = await userQueryes.model;

  res.status(200).json({
    status: 'Seccuss',
    resultes: users.length,
    data: users,
  });
});

exports.getOneUser = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ _id: req.params.id });

  if (!user) return next(new AppError('Invalid ID, Not found', 404));

  res.status(200).json({
    status: 'Seccuss',
    data: user,
  });
});

exports.registerUser = catchAsync(async (req, res, next) => {
  const { userName, phoneNumber, birthDate, email, password, passwordConfirm } =
    req.body;

  if (password !== passwordConfirm)
    return next(new AppError('Incorrect passwordConfirm', 400));

  const existingUser = await User.findOne({ email });
  if (existingUser) return next(new AppError('Email already used', 400));

  const user = new User({
    userName,
    phoneNumber,
    birthDate,
    email,
    password,
    passwordConfirm,
  });
  const newUser = await user.save();

  res.status(201).json({
    status: 'Created with seccuss',
    data: newUser,
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) return next(new AppError('Invalid ID, Not found', 404));

  res.status(200).json({
    status: 'Updated with seccuss',
    data: user,
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) return next(new AppError('Invalid ID, Not found', 404));

  res.status(204).json({
    status: 'Deleted with seccuss',
    data: null,
  });
});

// Sensitive query, Be careful with it
exports.deleteAllUsers = catchAsync(async (req, res, next) => {
  console.log(req.params.order);
  if (req.params.order !== 'delete')
    return next(new AppError(`Write 'delete' to remove all the data`, 400));

  await User.deleteMany();

  res.status(204).json({
    status: 'Deleted with seccuss',
    data: null,
  });
});
