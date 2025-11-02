const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    // Email validation
    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    // Content validation
    if (!name || !subject || !message) {
      return res.status(400).json({ message: 'Please fill in all fields.' });
    }

    // Configure email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'emirhangngr2009@gmail.com', // Change this to your receiving email
      subject: `Contact Form: ${subject}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

module.exports = router;