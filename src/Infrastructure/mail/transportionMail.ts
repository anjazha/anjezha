import nodeMiiler from 'nodemailer';
import {EMAIL_USER, EMAIL_PASS, EMAIL_HOST} from '../../Config';



//  const transporter = nodeMiiler.createTransport({
//     service: 'gmail',
//     host:EMAIL_HOST,
//     port: 465,
//     logger: true,
//     debug: true,
//     secure: true,
//     secureConnection: false,
//     auth: {
//         user:EMAIL_PASS,
//         pass: EMAIL_PASS,

//     },
//     tls: {
//         rejectUnauthorized: true
//     }
// });


let transporter = nodeMiiler.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "7b3ae9001@smtp-brevo.com", // generated brevo user
      pass: "Dd8EC9zZ0w37h14B", // generated brevo password
    },
  });




export const sendMail = async (to: string, subject: string, html: string) => {
    // console.log(EMAIL_USER, EMAIL_PASS, EMAIL_HOST);


    try {
        const mailOptions = {
            from: EMAIL_USER,
            to:to,
            subject: subject,
            html: html
        };

        const info = await transporter.sendMail(mailOptions);

        // console.log(`Message sent: ${info.messageId}`);
        // return info;
    } catch (error) {
        return new Error(error);
    }

}


