const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: process.env.NODEMAILER_PORT,
  secure: true,
  service: process.env.NODEMAILER_SERVICE,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS
  }
});

transporter.verify().then(() => {
  console.log("Nodemailer Ready");
}).catch((err) => {
  console.log("Error: ", err);
});

module.exports = transporter;
