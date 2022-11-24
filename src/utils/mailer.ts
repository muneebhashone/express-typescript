import nodemailer from "nodemailer";

// create reusable transporter object using the default SMTP transport
const mailer = nodemailer.createTransport({
  service: "gmail",
  secure: false, // true for 465, false for other ports
  auth: {
    user: "zander.fullstack@gmail.com", // generated ethereal user
    pass: "pedfobkypojunjlq",
  },
});

export default mailer;
