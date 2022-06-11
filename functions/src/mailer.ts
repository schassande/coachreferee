const sgMail = require('@sendgrid/mail');
const fs = require("fs");

const a = 'SG.Dr3emM2vRhONd' 
    + 'QlPuawK_Q.z30o_' + ''
    + '0HhmF4TZzuYiGYSGTtLJ'
    +'75U9syUPezPMO__oCE';
sgMail.setApiKey(a);

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