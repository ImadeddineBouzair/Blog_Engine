const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, 'UserName is required'],
      unique: true,
      minlength: [3, 'User name must have more or equal 3 characters'],
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
      maxlength: [9, 'Phone number must have 9 digits'],
      minlength: [9, 'Phone number must have 9 digits'],
      validate: {
        validator: function (val) {
          return !val.startsWith('0');
        },
        message: `Do not start with '0' digit`,
      },
    },

    birthDate: {
      type: Date,
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      validate: {
        validator: function (val) {
          return new RegExp(/\S+@\S+\.\S+/).test(val);
        },
        message: 'Invalide email',
      },
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      trim: true,
    },

    passwordConfirm: {
      type: String,
      required: [true, 'Password confirm is required'],
    },

    token: String,
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  // Formating the phone number
  this.phoneNumber = `+213 ${this.phoneNumber}`;

  // Hashing the password
  this.password = await bcrypt.hash(this.password, 10);
  this.passwordConfirm = await bcrypt.hash(this.passwordConfirm, 10);

  next();
});

const User = new mongoose.model('User', userSchema);

module.exports = User;
