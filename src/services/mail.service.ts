import * as nodemailer from 'nodemailer';
import { TransportOptions } from 'nodemailer';

// import * as sgMail from "@sendgrid/mail";

class MailService {
  async sendEmailNodeMailer(user, token, mailOptions) {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      type: 'SMTP',
      host: 'smtp.gmail.com',
      // port: 587,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.GMAIL_ACCOUNT,
        pass: process.env.GMAIL_PASSWORD,
      },
    } as TransportOptions);
    return await transporter
      .sendMail(mailOptions)
      .then((emailSent) => {
        return {
          message:
            'A verification email has been sent to ' +
            user.email +
            '. It will be expire after one day. If you not get verification Email click on resend token.',
          user: user,
        };
      })
      .catch((sendingEmailError) => {
        console.log('sendingEmailError: ', sendingEmailError);
        return {
          message:
            'Technical Issue!, Please click on resend for verify your Email.',
        };
      });
  }
}

export const mailService = new MailService();
