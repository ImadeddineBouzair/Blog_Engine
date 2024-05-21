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

// Multer middleware
const upload = require('../middlewares/multer');

router.get('/', protect, restrictTo('admin'), getAllUsers);
router.patch(
  '/updateAuthenticatedUser',
  protect,
  upload.single('photo'),
  updateAuthenticatedUser
);
router.delete('/deleteAuthenticatedUser', protect, deleteAuthenticatedUser);

router.post('/register', upload.single('photo'), registerUser);
router.post('/login', logIn);
router.post('/forgotpassword', forgotPassword);
router.patch('/updatepassword', protect, changePasswordForAuthUsers);

router.patch('/resetPassword/:resetToken', resetPassword);

module.exports = router;
