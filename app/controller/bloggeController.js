const Blogge = require('../models/bloggeModel');
const APIFeatures = require('../helpers/apiFeatures');
const AppError = require('../helpers/appError');
const catchAsync = require('../helpers/catchAsync');

exports.getAllBlogges = catchAsync(async (req, res, next) => {
  const bloggeQueryes = new APIFeatures(Blogge.find(), req.query)
    .filter()
    .sort()
    .paginate();

  const blogges = await bloggeQueryes.model;

  res.status(200).json({
    status: 'seccuss',
    results: blogges.length,
    data: blogges,
  });
});

exports.getOneBlogge = catchAsync(async (req, res, next) => {
  const blogge = await Blogge.findById(req.params.id);

  if (!blogge) return next(new AppError('No data found with this ID!', 400));

  res.status(200).json({
    status: 'seccuss',
    data: blogge,
  });
});

exports.createBlogge = catchAsync(async (req, res, next) => {
  const { title, text } = req.body;

  const blogge = new Blogge({
    title,
    text,
  });

  const newBlogge = await blogge.save();

  res.status(201).json({
    status: 'created with seccuss',
    data: newBlogge,
  });
});

exports.updateBlogge = catchAsync(async (req, res, next) => {
  const blogge = await Blogge.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!blogge) return next(new AppError('No data found with this ID!', 400));

  res.status(200).json({
    status: 'updated with seccuss',
    data: blogge,
  });
});

exports.deleteBlogge = catchAsync(async (req, res, next) => {
  const blogge = await Blogge.findByIdAndDelete(req.params.id);

  if (!blogge) return next(new AppError('No data found with this ID!', 400));

  res.status(204).json({
    status: 'deleted with seccuss',
    data: null,
  });
});
