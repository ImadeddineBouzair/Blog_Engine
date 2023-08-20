const router = require('express').Router();

const {
  getAllUsers,
  getOneUser,
  registerUser,
  updateUser,
  deleteUser,
  deleteAllUsers,
} = require('../controller/userController');

router.route('/').get(getAllUsers).post(registerUser);
router.route('/:id').get(getOneUser).patch(updateUser).delete(deleteUser);
router.route('/:order').delete(deleteAllUsers);

module.exports = router;
