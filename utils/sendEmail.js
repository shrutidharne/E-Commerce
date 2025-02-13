const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SMPT_SERVICE,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASS,
    },
  });

  const mailOptions = {
    to: options.to,
    from: process.env.SMPT_MAIL,
    subject: options.subject,
    html: `<a href=${options.resetPasswordUrl}>${options.resetPasswordMessage}</a>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
