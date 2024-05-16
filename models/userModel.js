const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const crypto = require('crypto');

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

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;

  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });

  next();
});

// Inheretance methods
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.checkIfPassswordChanged = function (JWTIat) {
  // False means not changed
  if (!this.passwordChangedAt) return false;

  const changedTimestap = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

  return JWTIat < changedTimestap;
};

userSchema.methods.generateRandomResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hashing the token
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
