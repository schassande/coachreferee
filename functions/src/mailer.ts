import { Context } from ".";

const fs = require("fs");
const nodemailer = require("nodemailer");


export function sendMail(ctx: Context, email: any, response?: any): Promise<void> { 
    // Configuration de l'email OVH
    const transporter = nodemailer.createTransport({
        host: "ssl0.ovh.net",
        port: 465,
        secure: true,
        auth: {
          user: ctx.email,
          pass: process.env.SMTP_EMAIL_PASSWORD,
        },
    });
    // Set/Force sender and replyTo
    email.from = 'CoachReferee <'+ctx.email+'>';
    email.replyTo = 'CoachReferee <'+ctx.email+'>';

    console.log('sendEmail: ' + JSON.stringify(email));
    return transporter.sendMail(email)
        .then(() => {
            console.log('Email sent')
            if (response) {
                return response.send({ data: 'ok', error: null});
            }
        }).catch((error: any) => {
            console.error(JSON.stringify(error));
            if (response) {
                return response.send({error});
            }
        })
}

export function stringToBase64(str: string): string {
    return Buffer.from(str, 'utf-8').toString('base64')
}
export function fileToBase64(file: any){
    return Buffer.from(fs.readFileSync(file)).toString('base64');
 }