const router = require('express').Router();

const {
  getAllUsers,
  getOneUser,
  registerUser,
  updateUser,
  deleteUser,
  deleteAllUsers,
} = require('../controller/userController');

const { userLogin } = require('../controller/logIn');
const checkToken = require('../middleware/auth');

router.route('/logIn').post(userLogin);
router.route('/').get(checkToken, getAllUsers).post(registerUser);
router
  .route('/:id')
  .get(checkToken, getOneUser)
  .patch(checkToken, updateUser)
  .delete(checkToken, deleteUser);
router.route('/:order').delete(checkToken, deleteAllUsers);

module.exports = router;
