import nodemailer from "nodemailer";

// create reusable transporter object using the default SMTP transport
const mailer = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "apikey", // generated ethereal user
    pass: "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",
  },
});

export default mailer;
