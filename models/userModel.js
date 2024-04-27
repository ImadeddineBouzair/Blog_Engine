const mongoose = require('mongoose');

const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required!'],
    },

    email: {
      type: String,
      require: [true, 'Email is required!'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Pleas provide a valid email!'],
    },

    photo: String,

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    password: {
      type: String,
      required: [true, 'Password is required!'],
      minlength: 8,
      select: false,
    },

    passwordConfirm: {
      type: String,
      required: [true, ['PasswordConfirm is required!']],
      validate: {
        // This only work on save
        validator: function (val) {
          return val === this.password;
        },
        message: 'Password fields are not the same!',
      },
    },

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: String,

    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {});

const User = new mongoose.model('User', userSchema);

module.exports = User;
