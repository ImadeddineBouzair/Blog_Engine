const User = require('../models/userModel');

const catchAsynch = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObject = (bodyObj, ...allowedFields) => {
  const newObj = {};

  Object.keys(bodyObj).forEach((key) => {
    if (allowedFields.includes(key)) newObj[key] = bodyObj[key];
  });

  return newObj;
};

exports.getAllUsers = catchAsynch(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.updateAuthenticatedUser = catchAsynch(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        'This route not for password updates!, Pleas use: .../updatepassword',
        400
      )
    );

  // Filtring unwanted fields from the body;
  const filtredBody = filterObject(req.body, 'name', 'email', 'photo');

  console.log(filtredBody);

  //   Updating the user data
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filtredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteAuthenticatedUser = catchAsynch(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
