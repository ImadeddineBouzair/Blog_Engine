const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const catchAsync = require('../helpers/catchAsync');
const AppError = require('../helpers/appError');

exports.userLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  /**
   * Fields check
   */
  if (!(email && password))
    return next(new AppError('email and password are required', 400));

  /**
   * Check if the email or password are valid
   */
  const user = await User.findOne({ email });
  if (!(user && (await bcrypt.compare(password, user.password))))
    return next(new AppError('Invalid email or password', 404));

  /**
   * Creating the token, and save
   */
  const token = jwt.sign(
    {
      user_id: user.id,
      user_email: user.email,
    },
    process.env.TOKEN_KEY,
    { expiresIn: '1h' }
  );

  user.token = token;

  res.status(200).json({
    status: 'User authenticated seccussfuly',
    token: user.token,
  });
});
