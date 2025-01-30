import { Context } from './index';
import { Invitation }  from './model/invitation';
import * as common          from './common';
import * as mailer     from './mailer';


export function func(request:any, response:any, ctx:Context):Promise<any> {
    return loadInvitation(request, response, ctx)
    .then( (invitation: Invitation) => {
        //Build email
        const subject = `[CoachReferee.com] Invitation`;
        const email = {
            cc: ctx.gmailEmail,
            to: invitation.email,
            subject,
            html: `Hi, 
                    <br>${invitation.sponsor} invites you to use the web application coachreferee.com.
                    <br>The application is a tool for the touch referee coaches.
                    <br>
                    <br>To test the application, please go on web site and create an account:
                    <br> <a href="https://coach.coachreferee.com">https://coach.coachreferee.com</a>
                    <br>
                    <br>Best regard
                    <br>Coach Referee App`
        };
        //Send email
        return mailer.sendMail(email, response);
    })
}

async function loadInvitation(request:any, response: any, ctx: any): Promise<Invitation> {
    const invitation: Invitation = await common.loadFromDb(ctx.db, common.collectionInvitation, request.body.data.invitationId, response) as Invitation;
    return invitation;
}