import { User }        from './model/user';
import * as common     from './common';
import * as mailer     from './mailer';


export function func(request:any, response:any, ctx:any):Promise<any> {
    return common.loadUser(ctx.db, request.body.data.userId, response)
    .then( (user: User) => {
        //Build email
        const subject = `[CoachReferee.com] Account validation required: ${user.firstName} ${user.lastName}`;
        const email = {
            from: ctx.gmailEmail,
            to: ctx.gmailEmail,
            subject,
            html: `Hi Admin, 
                    <br>${user.firstName} ${user.lastName} has created an account.`
                    + (user.accountStatus === 'VALIDATION_REQUIRED' ? `A validation from an admin is required.` : '')
                    + `<br><a href="https://coach.coachreferee.com/admin/users">https://coach.coachreferee.com/admin/users</a>
                    <br>
                    <br>Best regard
                    <br>Coach Referee App`
        };
        //Send email
        mailer.sendMail(email, response);
        return 'ok';
    })
}