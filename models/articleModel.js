const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    body: {
      type: String,
      required: true,
    },

    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },

    tags: [String],

    imageUrl: String,
  },
  {
    timestamps: true,
  }
);

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
