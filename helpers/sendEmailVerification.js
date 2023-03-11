const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user:"camilapinz18@gmail.com",
    pass: "Jackson19721"
  }
})

const sendMailVerification = emailTo => {
  console.log('mailto', emailTo)
  transporter.sendMail(
    {
      from: process.env.EMAIL,
      to: emailTo,
      subject: 'Prueba de envío de correo electrónico',
      text: 'Este es un mensaje de prueba'
    },
    (error, info) => {
      if (error) {
        console.error(error)
      } else {
        console.log('Correo electrónico enviado:', info.response)
      }
    }
  )
}

module.exports = transporter

// const twilio = require('twilio');

// const accountSid = process.env.ACCOUNT_SID;
// const authToken = process.env.AUTH_TOKEN;
// const client = new twilio(accountSid, authToken);

// module.exports=client
