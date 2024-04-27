const router = require('express').Router();

const { registerUser } = require('../controller/authController');

router.post('/register', registerUser);

module.exports = router;
