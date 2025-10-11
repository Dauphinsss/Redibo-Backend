const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '',
    pass: '',
  },
});

async function sendEmail({ from, to, subject, html }) {
  try {
    const mailOptions = { from, to, subject, html };
    const result = await transporter.sendMail(mailOptions);
    console.log(`Correo enviado de ${from} a ${to}:`, result);
    return result;
  } catch (error) {
    console.error('Error al enviar el correo:', {
      error: error.message,
      mailOptions
    });
    throw new Error('Error al enviar el correo');
  }
}

module.exports = { sendEmail };