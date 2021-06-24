import { User }        from './model/user';
import * as common     from './common';
import * as mailer     from './mailer';


//sendValidationRequired(userId: string, rolesToValidate: AppRole[], toEmails: string[], ccEmails: string[])
export function func(request:any, response:any, ctx:any):Promise<any> {
    return common.loadUser(ctx.db, request.body.data.userId, response)
    .then( (user: User) => {
        //Build email
        const subject = '[Upgrade.CoachReferee.com] validation required';
        let ccEmails: string[] = [ctx.gmailEmail, user.email];
        if (request.body.data.ccEmails && request.body.data.ccEmails.length > 0) {
            ccEmails = ccEmails.concat(request.body.data.ccEmails);
        }
        let rolesToValidate = '';
        if (request.body.data.rolesToValidate && request.body.data.rolesToValidate.length > 0) {
            rolesToValidate = request.body.data.rolesToValidate.join(', ');
        }
        let toEmails: string = request.body.data.toEmails;
        let hi: string;
        if (toEmails.length === 0) {
            hi = '';
        } else if (rolesToValidate === 'REFEREE') {
            hi = 'the NDR of ' + user.country;
        } else {
            hi = 'Admin';
        }
        // ensure to have at one toEmail destination
        if (toEmails.length === 0) {
            if (request.body.data.ccEmails && request.body.data.ccEmails.length > 0) {
                toEmails = request.body.data.ccEmails;            
            }
            if (toEmails.length === 0) {
                toEmails = ctx.gmailEmail;
            }
        }
        const email = {
            from: ctx.gmailEmail,
            cc: ccEmails,
            to: toEmails,
            subject,
            html: `Hi ${hi}, 
                <p>${user.firstName} ${user.lastName} asks new role(s) in the Upgrade web application: ${rolesToValidate}
                <br>Please go to the <a href="https://upgrade.coachreferee.com">Upgrade application</a> in order to validate the asked role(s).</p>
                <p>Best regard
                <br>Coach Referee App</p>`
        };
        //Send email
        mailer.sendMail(email, response);
        return 'ok';
    });
}