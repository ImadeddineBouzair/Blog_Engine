const router = require('express').Router();

const {
  getAllArticles,
  getOneArticle,
  createArticle,
  updateArticle,
  deleteArticle,
} = require('../controller/bloggeController');

const { protect, restrictTo } = require('../controller/authController');

router
  .route('/')
  .get(protect, restrictTo('admin'), getAllArticles)
  .post(createArticle);
router
  .route('/:id')
  .get(getOneArticle)
  .patch(updateArticle)
  .delete(deleteArticle);

module.exports = router;
