const sgMail = require('@sendgrid/mail');
const fs = require("fs");

sgMail.setApiKey('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');

export function sendMail(email: any, response?: any): Promise<void> { 
    email.from = 'CoachReferee <no-reply@coachreferee.com>';
    email.replyTo = 'CoachReferee <coachreferee@gmail.com>';
    console.log('sendEmail: ' + JSON.stringify(email));

    return sgMail.send(email)
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