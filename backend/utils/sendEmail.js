const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user:'soporteluckas@gmail.com',
        pass: 'huzt reot hhza vanj'
    }
});

async function sendEmail(to, subject, text){
    await transporter.sendMail({
        from: 'Luckas <soporteluckas@gmail.com>',
        to,
        subject,
        text

    });
}

module.exports= sendEmail;