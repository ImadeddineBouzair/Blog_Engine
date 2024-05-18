const router = require('express').Router();

const {
  getAllArticles,
  getOneArticle,
  createArticle,
  updateArticle,
  deleteArticle,
} = require('../controller/articleController');

const { protect } = require('../controller/authController');

router.route('/').get(getAllArticles).post(protect, createArticle);
router
  .route('/:id')
  .get(getOneArticle)
  .patch(protect, updateArticle)
  .delete(protect, deleteArticle);

module.exports = router;
