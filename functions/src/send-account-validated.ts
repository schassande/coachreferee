import * as common          from './common';
import * as mailer          from './mailer';

import { User }  from './model/user';

export function func(request:any, response:any, ctx:any):Promise<any> {
    return common.loadUser(ctx.db, request.body.data.userId, response)
    .then( (user: User) => {
        //Build email
        const subject = `[CoachReferee.com] Account validated`;
        const email = {
            from: ctx.gmailEmail,
            to: user.email,
            cc: ctx.gmailEmail,
            subject,
            html: `Hi ${user.firstName} ${user.lastName}, 
                    <br>Your account on the app CoachRefere.com has been validated !
                    <br>Now you can go on app: <a href="https://app.coachreferee.com">https://app.coachreferee.com</a>
                    <br>
                    <br>Best regard
                    <br>Coach Referee App`
        };
        //Send email
        mailer.sendMail(email, response);
        return 'ok';
    });
}