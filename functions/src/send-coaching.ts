import { Context } from './index';
import * as common          from './common';
import * as mailer          from './mailer';

import { User, Referee }  from './model/user';
import { Coaching }       from './model/coaching';


export function func(request:any, response:any, ctx:Context):Promise<any> {
    return loadCoachingData(request, response, ctx)
    .then( (data: CoachingData) => {
        //Build email
        const subject = coachingAsEmailSubject(data.coaching);
        const html = coachingAsEmailBody(data);
        const email = {
            to: data.user.email,
            subject,
            html: `Hi ${data.user.firstName},<br> The coaching sheet is attached to this email.<br>Best regard<br>Coach Referee App`,
            attachments: [{   
                filename: common.toFileName(subject),
                contentType: 'text/html',
                content: mailer.stringToBase64(html)
                }]
        };
        return mailer.sendMail(email, response);
    });
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
// COACHING PRIVATE FUNCTIONS //
//////////////////////////////////////////////////////////////////////////////////////////////////////

interface CoachingData {
    coaching: Coaching;
    user: User;
    referees: Referee[];
}

async function loadCoachingData(request:any, response: any, ctx: any): Promise<CoachingData> {
    const coaching: Coaching = await common.loadFromDb(ctx.db, common.collectionCoaching, request.body.data.coachingId, response) as Coaching;
    // console.log('coaching=' + JSON.stringify(coaching, null, 2));
    if (coaching) {
        const d: any = coaching.date;
        if (!(d instanceof Date) ) {
            coaching.date = d.toDate();
        }
    }
    const referees: Referee[] = []
    if (coaching.referees[0] && coaching.referees[0].refereeId) {
        referees.push(await common.loadFromDb(ctx.db, common.collectionUser, coaching.referees[0].refereeId, response) as Referee);        
    }
    if (coaching.referees[1] && coaching.referees[1].refereeId) {
        referees.push(await common.loadFromDb(ctx.db, common.collectionUser, coaching.referees[1].refereeId, response) as Referee);        
    }
    if (coaching.referees[2] && coaching.referees[2].refereeId) {
        referees.push(await common.loadFromDb(ctx.db, common.collectionUser, coaching.referees[2].refereeId, response) as Referee);        
    }
    const user: User = await common.loadFromDb(ctx.db, common.collectionUser, request.body.data.userId, response) as User;
    // console.log('user=' + JSON.stringify(user, null, 2));
    return { coaching, user, referees};
}

function coachingAsEmailBody(data: CoachingData): string {
    let body = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <style>
    body { 
        margin: 0 auto;
        max-width: 800px;
        padding: 0 20px;
        font-family: "Times New Roman", Times, serif;
        font-size: 100%;
    }
    body{counter-reset: h1 h2 h3;}
    h1:before {
        content: counter(h1) "  ";
        counter-increment: h1;
    }
    h2:before {
        content: counter(h1) "." counter(h2) "  ";
        counter-increment: h2;
    }
    h3:before {
        content: counter(h1) "." counter(h2) "." counter(h3) "  ";
        counter-increment: h3;
    }
    h1 { counter-reset: h2; }
    h2 { counter-reset: h3; }
    h1.unnumbered, h2.unnumbered { counter-reset: none;}
    h1.unnumbered:before,  h2.unnumbered:before, h3.unnumbered:before{
        content: none;
        counter-increment: none;
    }
    table { width: 100%; }
    table, th, td {
        border: 1px solid black;
        border-collapse: collapse;
    }
    td { padding: 5px; }
    .title {
        text-align: center; 
        background-color: #cccccc;
        width: 100%;
    }
    main article header h1 {
        background-color: #cccccc;
        font-size: 1.5em;
        font-weight: bold;
        padding: 10px;
    }
    main article section h1 {
        background-color: #dddddd;
        font-size: 1.2em;
        font-weight: bold;
    }
    main article section, main article section article {
        padding-left: 20px;
    }
    </style>
</head>
<body>
    <header>  
        <table class="assessment-header">
        <tr><td colspan="3" class="title">Referee Coaching</td></tr>
        <tr><td colspan="3"><strong>Competition:</strong> ${data.coaching.competition}</td></tr>
        <tr>`;
        data.referees.forEach( (ref) => {
            body += `
            <td style="width: 30%;"><strong>Referee:</strong> ${ref.firstName} ${ref.lastName} ${ref.shortName} ${ref.referee.refereeLevel}</td>`;
        })
        if (data.referees.length < 3) {
            body += `
            <td style="width: 30%;"><strong>Referee:</strong></td>`;
        }
        if (data.referees.length < 2) {
            body += `
            <td style="width: 30%;"><strong>Referee:</strong></td>`;
        }
        body += `
        </tr>
        <tr>
            <td><strong>Field:</strong> ${data.coaching.field}</td>
            <td><strong>Slot:</strong> ${data.coaching.timeSlot}</td>
            <td><strong>Date:</strong> ${getCoachingDateAsString(data.coaching)}</td>
        </tr>
        <tr>
            <td><strong>Game category:</strong> ${data.coaching.gameCategory}</td>
            <td><strong>Game speed:</strong> ${data.coaching.gameSpeed}</td>
            <td><strong>Game skill:</strong> ${data.coaching.gameSkill}</td>
        </tr>
        </table>
    </header>
    <main>`;
    data.coaching.referees.forEach((referee, index) => {
      if (referee.refereeShortName) {
        const ref: Referee = data.referees[index];
        body += `
        <article>
            <header><h1>Referee ${ref.firstName} ${ref.lastName} ${ref.shortName} ${ref.referee.refereeLevel}</h1></header>
            <section>
                <ul>`;
        if (ref.referee.nextRefereeLevel) {
            body += `
                    <li>Upgrade ${ref.referee.nextRefereeLevel}: ${referee.upgrade}</li>`;
        }
        body += `
                    <li>Rank: ${referee.rank === 0 ? 'Not ranked' : referee.rank}</li>
                </ul>
            </section>
            <section><h2>Strengths</h2>
                <article>
                    <ul>`;
        referee.positiveFeedbacks.forEach(positiveFeedback => {
          body += `
                        <li>${positiveFeedback.skillName}: ${positiveFeedback.description}</li>`;
        });
        body += `
            </ul>
                </article>
            </section>
            <section><h2>Axis of improvment</h2>`;
        referee.feedbacks.forEach(feedback => {
          body += `
                <article><h3>${feedback.problemShortDesc}</h3>
                    <table>
                        <tr><td colspan="4"><strong>Problem:</strong> ${feedback.problem}</td></tr>
                        <tr><td colspan="4"><strong>Remedy:</strong> ${feedback.remedy}</td></tr>
                        <tr><td colspan="4"><strong>Outcome:</strong> ${feedback.outcome}</td></tr>
                        <tr><td colspan="4"><strong>Skill:</strong> ${feedback.skillName}</td></tr>
                        <tr>
                            <td><strong>Period:</strong> ${feedback.period}</td>
                            <td><strong>Improvement during the game:</strong> ${feedback.appliedLater ? 'Yes': 'No'}</td>
                            <td><strong>Delivered:</strong> ${feedback.deliver ? 'Yes' : 'No'}</td>
                            <td><strong>Priority:</strong> ${feedback.priority}</td>
                        </tr>
                    </table>
                </article>`;
        });
        body += `
            </section>
        </article>`;
      }
    });
    body += `
    </main>
</body>
</html>`;
    return body;
}

function coachingAsEmailSubject(coaching: Coaching): string {
    return `[CoachReferee.com] Referee Coaching ${coaching.competition}, ${getCoachingDateAsString(coaching)}, ${
        coaching.timeSlot}, Field ${coaching.field}`;
}
function getCoachingDateAsString(coaching: Coaching) {
    return coaching.date.getFullYear()
      + common.DATE_SEP + common.to2Digit(coaching.date.getMonth() + 1)
      + common.DATE_SEP + common.to2Digit(coaching.date.getDate());
}
