const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  service: 'gmail',
  auth: {
    user: 'camilapinz96@gmail.com',
    pass: 'hnvlzqsryecqcwcu'
  }
})

transporter.verify().then(()=>{
    console.log("Nodemailer Ready")
}).catch((err)=>{
    console.log("Error: ", err)
})


module.exports=transporter