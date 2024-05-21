const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Article title is required!'],
    },

    text: {
      type: String,
      required: [true, 'Article text is required'],
      minlength: 3,
      maxlength: 300,
    },

    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },

    tags: [String],

    image: String,
  },
  {
    timestamps: true,
  }
);

articleSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'author',
    select: 'name',
  });

  next();
});

articleSchema.methods.checkAuthor = function (userId) {
  if (this.author.id === userId) return true;

  return false;
};

const Article = mongoose.model('Article', articleSchema);

Article.syncIndexes();

module.exports = Article;
