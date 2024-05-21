const router = require('express').Router();

const {
  getAllArticles,
  getOneArticle,
  createArticle,
  updateArticle,
  deleteArticle,
} = require('../controller/articleController');

const upload = require('../middlewares/multer');

const { protect } = require('../controller/authController');

router
  .route('/')
  .get(getAllArticles)
  .post(protect, upload.single('image'), createArticle);
router
  .route('/:id')
  .get(getOneArticle)
  .patch(protect, updateArticle)
  .delete(protect, deleteArticle);

module.exports = router;
