import nodemailer from 'nodemailer';
import Logging from "../application/Logging.js";

class Mailer {
    email = [];
    subject = '';
    content = '';

    createTransport() {
        const config = {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
        };

        if( process.env.SMTP_USER && process.env.SMTP_PASSWORD ) {
            config.auth = {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            }
        }

        return nodemailer.createTransport(config);
    }

    setRecipient(email) {
        this.email.push(email);
    }

    getRecipient() {
        return this.email;
    }

    setSubject(subject) {
        this.subject = subject;
    }

    getSubject() {
        return this.subject;
    }

    setContent(content) {
        this.content = content;
    }

    getContent() {
        return this.content;
    }

    async send(attachments = []) {
        const transport = this.createTransport();

        const data = {
            from: process.env.SMTP_FROM,
            to: this.getRecipient(),
            subject: this.getSubject(),
            text: this.getContent(),
        };

        if( attachments && attachments.length > 0 ) {
            data.attachments = attachments;
        }

        const info = await transport.sendMail(data);

        Logging.info(`Message sent: ${info.messageId}`);
    }
}

export default Mailer;