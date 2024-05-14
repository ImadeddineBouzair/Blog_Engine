const formData = require('form-data');
const Mailgun = require('mailgun.js');

const sendEmail = async function (from, to, subject, text) {
  const mailgun = new Mailgun(formData);
  const client = mailgun.client({
    username: 'BloggApp',
    key: process.env.MAILGUN_API_KEY,
  });

  const messageData = {
    from,
    to,
    subject,
    text,
  };

  try {
    await client.messages.create(process.env.MAILGUN_DOMAIN, messageData);
  } catch (err) {
    console.log(err);
  }
};

module.exports = sendEmail;
