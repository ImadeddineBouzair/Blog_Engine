# Blog_Engine API

Blog Engine is a backend API developed using Node.js and Express.js. The database used is MongoDB. The application provides CRUD operations for articles and includes an authentication part. It uses several libraries to ensure the highest level of security.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- MailGun (for sending emails)
- Cloudinary (for storing images)
- JSON Web Token
- bcrypt.js
- express-mongo-sanitize
- xss-clean
- express-rate-limit
- helmet
- hpp

## Environment Variables

The following environment variables are used in the application:

| Variable           | Default Value | Description                                         |
| ------------------ | ------------- | --------------------------------------------------- |
| PORT               | -             | The port on which the server runs                   |
| NODE_ENV           | development   | The environment in which the application is running |
| DB_PASSWORD        | -             | The password for the MongoDB database               |
| DB_URL             | -             | The URL for the MongoDB database                    |
| JWT_SECRET_KEY     | -             | The secret key for JSON Web Tokens                  |
| JWT_EXPIRESIN      | -             | The expiration time for JSON Web Tokens             |
| COOKIE_EXPIRES_IN  | -             | The expiration time for cookies                     |
| MAILGUN_API_KEY    | -             | The API key for MailGun                             |
| MAILGUN_DOMAIN     | -             | The domain for MailGun                              |
| MAIL_FROM          | -             | The email address from which emails are sent        |
| CLOUDINARY_NAME    | -             | The name for the Cloudinary account                 |
| CLOUDINARY_API_KEY | -             | The API key for Cloudinary                          |
| CLOUDINARY_SECRET  | -             | The secret for the Cloudinary account               |

## Getting Started

To get started with the app, navigate to the application directory and run `npm i` to install the necessary dependencies.

To run the application in development mode, use the command `npm start`.

For production mode, use `npm start:prod`.

The main difference between development and production modes lies in error handling - they are handled differently to provide detailed error information during development and user-friendly error messages in production.

## API Endpoints

The documentation for the API endpoints can be found at this [documentation](https://documenter.getpostman.com/view/25731393/2sA3QqhYYs).
If you have any questions or need further assistance, feel free to reach out (dev.dexteritydz@gmail.com). Happy coding!
