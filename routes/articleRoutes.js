const router = require('express').Router();

const {
  getAllArticles,
  getOneArticle,
  createArticle,
  updateArticle,
  deleteArticle,
} = require('../controller/bloggeController');

const { protect } = require('../controller/authController');

router.route('/').get(protect, getAllArticles).post(createArticle);
router
  .route('/:id')
  .get(getOneArticle)
  .patch(updateArticle)
  .delete(deleteArticle);

module.exports = router;
