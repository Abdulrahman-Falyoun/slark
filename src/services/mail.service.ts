import * as nodemailer from "nodemailer";
import {operationsCodes} from "../utils/operation-codes";
import {TransportOptions} from "nodemailer";

// import * as sgMail from "@sendgrid/mail";

class MailService {
    async sendEmailViaSendGrid(user, token) {
        // sgMail.setApiKey(process.env.SNED_GRID_API_KEY);
        // const msg = {
        //     to: user.email,
        //     from: "slark@sy.com", // Use the email address or domain you verified above
        //     subject: "Account Verification Link",
        //     text:
        //         "Hello " +
        //         user.name +
        //         ",\n\n" +
        //         "Please verify your account by clicking the link: \nhttps://localhost:3000" /*+ req.headers.host*/ +
        //         "/account/" +
        //         "/verify/" +
        //         user.email +
        //         "/" +
        //         token +
        //         "\n\nThank You!\n",
        // };
        // return await sgMail.send(msg).then(
        //     () => {
        //         return {
        //             message:
        //                 "A verification email has been sent to " +
        //                 user.email +
        //                 ". It will be expire after one day. If you not get verification Email click on resend token.",
        //             user: user,
        //             code: operationsCodes.SUCCESS,
        //         };
        //     },
        //     (error) => {
        //         console.error(error);
        //         if (error.response) {
        //             console.error(error.response.body);
        //         }
        //         return {
        //             message:
        //                 "Technical Issue!, Please click on resend for verify your Email.",
        //             code: operationsCodes.FAILED,
        //         };
        //     }
        // );
    }

    async sendEmailNodeMailer(user, token, mailOptions) {
        /*const transporter = nodemailer.createTransport({
                service: 'Sendgrid',
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD
                }
            });*/
        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            service: "gmail",
            type: "SMTP",
            host: "smtp.gmail.com",
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
                        "A verification email has been sent to " +
                        user.email +
                        ". It will be expire after one day. If you not get verification Email click on resend token.",
                    user: user,
                    code: operationsCodes.SUCCESS,
                };
            })
            .catch((sendingEmailError) => {
                console.log("sendingEmailError: ", sendingEmailError);
                return {
                    message:
                        "Technical Issue!, Please click on resend for verify your Email.",
                    code: operationsCodes.FAILED,
                };
            });
    }
}

export const mailService = new MailService();