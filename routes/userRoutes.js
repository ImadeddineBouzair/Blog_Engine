const router = require('express').Router();

const { registerUser, logIn } = require('../controller/authController');

router.post('/register', registerUser);
router.post('/login', logIn);

module.exports = router;
