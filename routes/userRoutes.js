const router = require('express').Router();

const {
  registerUser,
  logIn,
  forgotPassword,
} = require('../controller/authController');

router.post('/register', registerUser);
router.post('/login', logIn);
router.post('/forgotpassword', forgotPassword);

module.exports = router;
