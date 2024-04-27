const Article = require('../models/articleModel');

const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllArticles = catchAsync(async (req, res, next) => {
  const articleQueryes = new APIFeatures(Article.find(), req.query)
    .filter()
    .sort()
    .paginate();

  const articles = await articleQueryes.model;

  res.status(200).json({
    status: 'seccuss',
    results: articles.length,
    data: articles,
  });
});

exports.getOneArticle = catchAsync(async (req, res, next) => {
  const article = await Article.findById(req.params.id);

  if (!article) return next(new AppError('No data found with this ID!', 400));

  res.status(200).json({
    status: 'seccuss',
    data: article,
  });
});

exports.createArticle = catchAsync(async (req, res, next) => {
  const { title, text } = req.body;

  const article = new Article({
    title,
    text,
  });

  const newArticle = await article.save();

  res.status(201).json({
    status: 'created with seccuss',
    data: newArticle,
  });
});

exports.updateArticle = catchAsync(async (req, res, next) => {
  const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!article) return next(new AppError('No data found with this ID!', 400));

  res.status(200).json({
    status: 'updated with seccuss',
    data: article,
  });
});

exports.deleteArticle = catchAsync(async (req, res, next) => {
  const article = await Article.findByIdAndDelete(req.params.id);

  if (!article) return next(new AppError('No data found with this ID!', 400));

  res.status(204).json({
    status: 'deleted with seccuss',
    data: null,
  });
});
