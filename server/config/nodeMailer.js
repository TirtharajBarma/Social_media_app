import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
    }
});

const sendEmail = async (to, subject, text) => {
    try {
        const response = await transporter.sendMail({
            from: process.env.SENDER_EMAIL || '',
            to,
            subject,
            html: text
        });
        return response;
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export default sendEmail;
