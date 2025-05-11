import { Context } from './index';
import * as common          from './common';
import * as mailer          from './mailer';
import * as account          from './account';

import { User }  from './model/user';

export function func(request:any, response:any, ctx:Context):Promise<any> {
    return common.loadUser(ctx.db, request.body.data.userId, response)
    .then( (user: User) => {
        if (!user) {
            throw new Error('Referee does not exist.');
        }
        //Compute rights of the user
        const rights: string[] = account.computeRights(user.applications, user);
        const pendingRights: string[] = account.computeRights(user.demandingApplications, user);

        //Build email
        let msg = `Hi ${user.firstName} ${user.lastName}, 
                    <p>Your account on the coachrefere.com domain has NOT been validated !</p>`;
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


        const subject = `[CoachReferee.com] Account not validated`;
        const email = {
            to: user.email,
            cc: ctx.email,
            subject,
            html: `Hi ${user.firstName} ${user.lastName}, 
                    <br>Your account on the coachrefere.com has NOT been validated !
                    <br>
                    <br>Best regard
                    <br>Coach Referee App`
        };
        //Send email
        return mailer.sendMail(ctx, email, response);
    });
}