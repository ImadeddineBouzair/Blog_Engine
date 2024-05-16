const router = require('express').Router();

const {
  registerUser,
  logIn,
  forgotPassword,
  resetPassword,
  changePasswordForAuthUsers,
  protect,
  restrictTo,
} = require('../controller/authController');

const {
  getAllUsers,
  updateAuthenticatedUser,
  deleteAuthenticatedUser,
} = require('../controller/userController');

router.get('/', protect, restrictTo('admin'), getAllUsers);
router.patch('/updateAuthenticatedUser', protect, updateAuthenticatedUser);
router.delete('/deleteAuthenticatedUser', protect, deleteAuthenticatedUser);

router.post('/register', registerUser);
router.post('/login', logIn);
router.post('/forgotpassword', forgotPassword);
router.patch('/updatepassword', protect, changePasswordForAuthUsers);

router.patch('/resetPassword/:resetToken', resetPassword);

module.exports = router;
