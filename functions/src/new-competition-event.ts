import { Context } from './index';
import * as common from './common';
import * as mailer from './mailer';
import { Competition } from './model/competition';
import { User } from './model/user';

export async function func(compet:Competition, ctx:Context):Promise<any> {
  const competition = adjustFieldOnLoadCompetition(compet);
  const owner: User = await common.loadUser(ctx.db, competition.ownerId, null);

  // Building Email message.
  const mailOptions: any = {
    to: ctx.email,
    subject: 'CoachReferee: New competition',
    html : `Hi,<br>
<p>A new competition has been created in the coaching or upgrade applications:</p>
<ul>
  <li>Name: ${competition.name}</li>
  <li>Region: ${competition.region}</li>
  <li>Country: ${competition.country}</li>
  <li>Days: ${competition.days.map(d => common.date2string(d)).join(', ')}</li>
  <li>Category for open referees: ${competition.category}</li>
  <li>Category for senior referees: ${competition.categorySenior}</li>
  <li>Owner: ${owner.firstName} ${owner.lastName} (${owner.shortName} ${competition.ownerId})</li>
  <li>Id: ${competition.id}</li>
</ul>
  <br>Best regards`
  };
  console.log('Sending message: ' + JSON.stringify(mailOptions, null, 2));
  try {
    return mailer.sendMail(ctx, mailOptions).then(() => console.log('New competition email sent to admin.'));
  } catch(error) {
    console.error('There was an error while sending the email:', error);
  }
}
function adjustFieldOnLoadCompetition(item: Competition): Competition {
  if (item.days) {
      item.days = item.days.map(d => common.adjustDate(d))
  }
  item.date = common.adjustDate(item.date);
  return item;
}
