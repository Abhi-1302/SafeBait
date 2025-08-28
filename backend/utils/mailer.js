const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "in.mailjet.com",
  port: 2525,
  secure: false,
  auth: {
    user: process.env.MAILJET_API_KEY,
    pass: process.env.MAILJET_API_SECRET,
  },
});

/**
 * Send an email using Mailjet SMTP
 * @param {Object} options { to, subject, html }
 */
async function sendMail({ to, subject, html }) {
  return transporter.sendMail({
    from: `"SafeBait" <${process.env.MAILJET_FROM}>`,
    to,
    subject,
    html,
  });
}

module.exports = { sendMail };
