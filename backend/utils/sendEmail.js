const nodemailer = require('nodemailer');

// Preferir variables de entorno. Si no existen, nodemailer seguirá fallando al enviar.
const SMTP_USER = process.env.SMTP_USER || 'soporteluckas@gmail.com';
const SMTP_PASS = process.env.SMTP_PASS || 'huzt reot hhza vanj';
const SMTP_SERVICE = process.env.SMTP_SERVICE || 'gmail';
const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465;
const SMTP_SECURE = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : true;

const transporter = nodemailer.createTransport({
    service: SMTP_SERVICE,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
    }
});

/**
 * sendEmail
 * @param {string} to
 * @param {string} subject
 * @param {string} text - plain text fallback
 * @param {string} html - html body
 * @param {Array} attachments - nodemailer attachments array (optional)
 */
async function sendEmail(to, subject, text, html, attachments) {
    const mailOptions = {
        from: `Luckas <${SMTP_USER}>`,
        to,
        subject,
        text: text || undefined,
        html: html || undefined,
        attachments: attachments || undefined
    };

    // Enviar correo (nodemailer manejará el fallback text/html)
    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;