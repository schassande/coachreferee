import * as func            from 'firebase-functions';
import * as nodemailer      from 'nodemailer';

const gmailEmail = func.config().gmail.email;
const gmailPassword = func.config().gmail.password;

/**
* Here we're using Gmail to send 
*/
const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
        user: gmailEmail,
        pass: gmailPassword
    }
});

export function sendMail(email: any, response?: any) { 
    transporter.sendMail(email, 
        (erro: any) => {
            if (response) {
                if(erro){
                    return response.send(erro.toString());
                } else {
                    return response.send({ data: 'ok', error: null});
                }
            } else if (erro){
                console.error(erro.toString());
            }
        });
}
