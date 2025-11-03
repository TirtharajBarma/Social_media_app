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

// Flexible helper: accept either (to, subject, html) or an options object { to, subject, html }
const sendEmail = async (toOrOpts, subject, html) => {
    try {
        let mail = {};
        if (typeof toOrOpts === 'object' && toOrOpts !== null) {
            mail.to = toOrOpts.to;
            mail.subject = toOrOpts.subject;
            mail.html = toOrOpts.html ?? toOrOpts.text;
        } else {
            mail.to = toOrOpts;
            mail.subject = subject;
            mail.html = html;
        }

        const response = await transporter.sendMail({
            from: process.env.SENDER_EMAIL || '',
            ...mail
        });
        return response;
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export default sendEmail;
