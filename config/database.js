const mongoose = require('mongoose');

const db_string = process.env.DB_URL.replace(
  '<password>',
  process.env.DB_PASSWORD
);

const connect = async () => {
  try {
    await mongoose.connect(db_string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to database seccussfuly!');
  } catch (err) {
    console.log(err);
  }
};

module.exports = { connect };
