import * as common          from './common';
import * as mailer          from './mailer';
import * as account          from './account';

import { User }  from './model/user';

export function func(request:any, response:any, ctx:any):Promise<any> {
    return common.loadUser(ctx.db, request.body.data.userId, response)
    .then( (user: User) => {
        if (!user) {
            throw new Error('Referee does not exist.');
        }
        //Compute rights of the user
        const rights: string[] = account.computeRights(user.applications, user);
        const pendingRights: string[] = account.computeRights(user.demandingApplications, user);
        //Build email
        const subject = `[CoachReferee.com] Account validated`;
        let msg = `Hi ${user.firstName} ${user.lastName}, 
                    <p>Your account on the coachrefere.com domain has been validated !</p>`;
        if (rights.length > 0) {
            msg = msg + `<p>You have the following rights: <ul>`;
            msg = msg + rights.map(r => '<li>' + r + '</li>\n');
            msg = msg + '</ul></p>';
        }
        if (pendingRights.length > 0) {
            msg = msg + '<p>The following rights are still not validated:<ul>';
            msg = msg + rights.map(r => '<li>' + r + '</li>\n');
            msg = msg + '</ul></p>';
        }
        msg = msg + `<p><br>
        <br>Best regard
        <br>Coach Referee admin</p>`;

        const email = {
            from: ctx.gmailEmail,
            to: user.email,
            cc: ctx.gmailEmail,
            subject,
            html: msg
        };
        //Send email
        mailer.sendMail(email, response);
        return 'ok';
    });
}
