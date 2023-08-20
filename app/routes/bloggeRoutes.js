const router = require('express').Router();

const {
  getAllBlogges,
  getOneBlogge,
  createBlogge,
  updateBlogge,
  deleteBlogge,
} = require('../controller/bloggeController');

router.route('/').get(getAllBlogges).post(createBlogge);
router.route('/:id').get(getOneBlogge).patch(updateBlogge).delete(deleteBlogge);

module.exports = router;
