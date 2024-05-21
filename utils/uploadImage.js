const cloudinary = require('cloudinary').v2;

require('dotenv').config({ path: `${__dirname}/../.env` });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const uploadImage = async (req, next) => {
  if (!req.file) return;

  return await cloudinary.uploader.upload(
    req.file.path,
    function (err, result) {
      if (err) {
        console.log(err);
        return next(new AppError(err, 400));
      }

      return result;
    }
  );
};

module.exports = uploadImage;
