import { Context } from './index';
import { User }        from './model/user';
import * as common     from './common';
import * as mailer     from './mailer';


//sendValidationRequired(userId: string, rolesToValidate: AppRole[], toEmails: string[], ccEmails: string[])
export function func(request:any, response:any, ctx:Context):Promise<any> {
    return common.loadUser(ctx.db, request.body.data.userId, response)
    .then( (user: User) => {
        //Build email
        const subject = '[Upgrade.CoachReferee.com] Validation required: ' + user.shortName;
        let rolesToValidate = '';
        if (request.body.data.rolesToValidate && request.body.data.rolesToValidate.length > 0) {
            rolesToValidate = request.body.data.rolesToValidate.join(', ');
        }
        let toEmails: string[] = request.body.data.toEmails;
        let hi: string;
        if (toEmails.length === 0) {
            hi = 'Hi';
        } else if (rolesToValidate === 'REFEREE') {
            hi = 'Hi the NDR of ' + user.country;
        } else {
            hi = 'Hi Admin';
        }
        const minCCEmails = [ctx.email, user.email]; // emails always in CC
        let ccEmails: string[] = [];
        const hasCC = request.body.data.ccEmails && request.body.data.ccEmails.length > 0;
        if (hasCC) {
            ccEmails = ccEmails.concat(request.body.data.ccEmails);
        }
        // ensure to have at least one toEmail destination
        if (toEmails.length === 0) {
            if (hasCC) {
                // put the cc email as to
                toEmails = ccEmails;
                ccEmails = [];
            }
            if (toEmails.length === 0) {
                // put the application manager as to
                toEmails = [ctx.email];
            }
        }
        const email = {
            cc: ccEmails.concat(minCCEmails),
            to: toEmails,
            subject,
            html: `${hi}, 
                <p>${user.firstName} ${user.lastName} asks new role(s) in the Upgrade web application: ${rolesToValidate}
                <br>Please go to the <a href="https://upgrade.coachreferee.com">Upgrade application</a> in order to validate the asked role(s).</p>
                <p>Best regard
                <br>Coach Referee App</p>`
        };
        //Send email
        return mailer.sendMail(ctx, email, response);
    });
}