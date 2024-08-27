import nodeMiiler from 'nodemailer';
import {EMAIL_USER, EMAIL_PASS} from '../../Config';

 const transporter = nodeMiiler.createTransport({
    service: 'gmail',
    auth: {
        user:EMAIL_PASS,
        pass: EMAIL_PASS
    }
});

export const sendMail = async (to: string, subject: string, html: string) => {
    try {
        const mailOptions = {
            from: EMAIL_PASS,
            to:to,
            subject: subject,
            html: html
        };

        const info = await transporter.sendMail(mailOptions);

        console.log(`Message sent: ${info.messageId}`);
    } catch (error) {
        console.log(error);
    }

}


