const app = require('./app');

require('dotenv').config();
require('./config/database').connect();

const port = process.env.PORT || 5500;
app.listen(port, () => console.log(`Server running on: 127.0.0.1:${port}`));

// Catching Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exceptions!');
  console.log(err);
  server.close(() => process.exit(1));
});

// Catching unhandled rejection promises
process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection!');
  console.log(err);
  server.close(() => process.exit(1));
});
