const express = require('express');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');

const router = express.Router();

const validateEmailData = [
  body('fullName').notEmpty().trim().escape(),
  body('email').notEmpty().isEmail().normalizeEmail(),
  body('message').notEmpty().trim().escape(),
];

const transport = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USERNAME,
    pass: process.env.MAILTRAP_PASS,
  },
});

router.post('/send', validateEmailData, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ code: 422, errors: errors.array() });
  }

  const { fullName, email, message } = req.body;

  const mailOptions = {
    from: email,
    to: 'Massimiliano Rizzuto',
    subject: `Message from ${fullName}`,
    text: message,
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
