const transporter = require('../config/nodemailer')

const sendEmailVerification = async (user, token) => {
  await transporter.sendMail({
    from: '"Clinify Accounts" <camilapinz96@gmail.com>',
    to: user.email,
    subject: 'Verify your Clinify account',
    text: 'Este es un mensaje de prueba',
    html: ` <h1>CLINIFY</h1>
              <h2>Verify your Clinify account</h2>
              <br>
              <span>Login into your account and provide the following code:</span>
              <h2> ${token}</h2>
              <br>
              <h4>User information:</h4>
              <div>
              <b>Identification:</b> ${user.identification}
              <b>Phone:</b> ${user.phone}
              <b>Email:</b> ${user.email}
              <b>Role:</b> ${user.role}
              </div>`
  })

  console.log('Email successfully sent')
}

const sendEmailInformation = async user => {
  await transporter.sendMail({
    from: '"Clinify Accounts" <camilapinz96@gmail.com>',
    to: user.email,
    subject: 'Verify your Clinify account',
    text: 'Este es un mensaje de prueba',
    html: ` <h1>CLINIFY</h1>
              <h2>Verify your Clinify account</h2>
              <br>
              <span>Your account has been created. Please login into Clinify with the following credentials:
              </span>
              <h3>Identification: ${user.identification}</h3>
              <h3>Password: ${user.password}</h3>
              
              <h4>User information:</h4>
              <div>
              <b>Identification:</b> ${user.identification}
              <b>Phone:</b> ${user.phone}
              <b>Email:</b> ${user.email}
              <b>Role:</b> ${user.role}
              </div>`
  })

  console.log('Email successfully sent')
}

module.exports = { sendEmailVerification, sendEmailInformation }
