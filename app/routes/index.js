const router = require('express').Router();

const bloggeRoutes = require('./bloggeRoutes');
const userRoutes = require('./userRoutes');

router.use('/user', userRoutes);
router.use('/blogge', bloggeRoutes);

module.exports = router;
