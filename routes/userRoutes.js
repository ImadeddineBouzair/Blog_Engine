const router = require('express').Router();

const {
  registerUser,
  logIn,
  forgotPassword,
  resetPassword,
  changePasswordForAuthUsers,
  protect,
} = require('../controller/authController');

router.post('/register', registerUser);
router.post('/login', logIn);
router.post('/forgotpassword', forgotPassword);
router.patch('/resetPassword/:resetToken', resetPassword);
router.patch('/updatepassword', protect, changePasswordForAuthUsers);

module.exports = router;
