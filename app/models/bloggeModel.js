const mongoose = require('mongoose');

const bloggeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A blogge must have a title'],
      trim: true,
      minlength: [3, 'A title most have more or equal 3 characters'],
      maxlength: [15, 'A title most have less or equal 15 characters'],
    },

    text: {
      type: String,
      required: [true, 'A blogge must have a text'],
      trim: true,
      maxlength: [250, 'A blogger text can contain 250 characters at max'],
    },
  },
  {
    timestamps: true,
  }
);

const Blogge = new mongoose.model('Blogge', bloggeSchema);

module.exports = Blogge;
