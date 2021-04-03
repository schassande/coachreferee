import * as common          from './common';
import * as mailer          from './mailer';

import { User }  from './model/user';

export function func(request:any, response:any, ctx:any):Promise<any> {
    return common.loadUser(ctx.db, request, response)
    .then( (user: User) => {
        //Build email
        const subject = `[CoachReferee.com] Account not validated`;
        const email = {
            from: ctx.gmailEmail,
            to: user.email,
            cc: ctx.gmailEmail,
            subject,
            html: `Hi ${user.firstName} ${user.lastName}, 
                    <br>Your account on the app CoachRefere.com has NOT been validated !
                    <br>
                    <br>Best regard
                    <br>Coach Referee App`
        };
        //Send email
        mailer.sendMail(email, response);
        return 'ok';
    });
}