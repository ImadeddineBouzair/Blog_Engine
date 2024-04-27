const router = require('express').Router();

const {
  getAllArticles,
  getOneArticle,
  createArticle,
  updateArticle,
  deleteArticle,
} = require('../controller/bloggeController');

router.route('/').get(getAllArticles).post(createArticle);
router
  .route('/:id')
  .get(getOneArticle)
  .patch(updateArticle)
  .delete(deleteArticle);

module.exports = router;
