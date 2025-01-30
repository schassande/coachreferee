import { Context } from './index';
import { User }        from './model/user';
import * as common     from './common';
import * as mailer     from './mailer';


export function func(request:any, response:any, ctx:Context):Promise<any> {
    return common.loadUser(ctx.db, request.body.data.userId, response)
    .then( (user: User) => {
        //Build email
        const subject = `[CoachReferee.com] Account created`;
        const email = {
            cc: ctx.gmailEmail,
            to: user.email,
            subject,
            html: `Hi ${user.firstName} ${user.lastName}, 
                    <br>You created an account on the app CoachRefere.com. Welcome !`
                    + (user.accountStatus === 'VALIDATION_REQUIRED' 
                        ? `<br>In order to control the data access a validation is required by the application admin.` 
                        : '')
                    + `<br>
                    <br>Best regard
                    <br>Coach Referee App`
        };
        //Send email
        return mailer.sendMail(email, response);
    });
}