import nodemailer from "nodemailer";

const apiKey = process.env.SEND_GRID_API_KEY;

// create reusable transporter object using the default SMTP transport
const mailer = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "apikey", // generated ethereal user
    pass: apiKey,
  },
});

export default mailer;
