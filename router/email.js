require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

const transport = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USERNAME,
    pass: process.env.MAILTRAP_PASS,
  },
});

router.post('/send', (req, res) => {
  const mailOptions = {
    from: req.body.email,
    to: 'massimiliano.rizzuto87@gmail.com',
    subject: 'Message from Portfolio contact form',
    text: req.body.message,
  };

  transport.sendMail(mailOptions, (err, info) => {
    if (err) {
      res.status(500).json({
        code: 500,
        error: 'There are problems to send email, please try again later!',
      });
    } else {
      res.status(200).json({ code: 200, message: 'The e-mail has been sent!' });
    }
  });
});

module.exports = router;
