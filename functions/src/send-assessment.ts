import * as common          from './common';
import * as mailer          from './mailer';

import { Assessment, Competency } from './model/assessment';
import { User, Referee }  from './model/user';
import { SkillProfile }   from './model/skill';


export function func(request:any, response:any, ctx:any):Promise<any> {
    console.log('send-assessement: request')
    return loadAssessmentData(request, response, ctx)
    .then( (data: AssessmentData) => {
        console.log('send-assessement: data=' + JSON.stringify(data))
        //Build email
        const subject = assessmentAsEmailSubject(data.assessment);
        const html = assessmentAsEmailBody(data.assessment, data.skillProfile, data.user, data.referee);
        const email = {
            to: data.user.email,
            cc: ctx.gmailEmail,
            subject,
            html: `Hi ${data.user.firstName},<br> The assessment sheet is attached to this email.<br>Best regard<br>Coach Referee App`,
            attachments: [{   
                filename: common.toFileName(subject),
                contentType: 'text/html',
                content: mailer.stringToBase64(html)
                }]
        };
        return mailer.sendMail(email, response);
    });
}

interface AssessmentData {
    assessment: Assessment;
    user: User;
    referee: Referee;
    skillProfile: SkillProfile;
}

async function loadAssessmentData(request:any, response: any, ctx: any): Promise<AssessmentData> {
    const assessment: Assessment = await common.loadFromDb(ctx.db, common.collectionAssessment, request.body.data.assessmentId, response) as Assessment;
    if (assessment) {
        const d: any = assessment.date;
        if (!(d instanceof Date) ) {
            assessment.date = d.toDate();
        }
    }
    const user: User = await common.loadUser(ctx.db, request.body.data.userId, response);
    const referee: Referee = await common.loadFromDb(ctx.db, common.collectionUser, request.body.data.refereeId, response) as Referee;
    const skillProfile: SkillProfile = await common.loadFromDb(ctx.db, common.collectionSkillprofile, request.body.data.skillProfileId, response) as SkillProfile;

    const data: AssessmentData = { assessment, user, referee, skillProfile};
    console.log('skillProfile=' + JSON.stringify(skillProfile, null, 2));
    console.log('assessment=' + JSON.stringify(assessment, null, 2));
    console.log('referee=' + JSON.stringify(referee, null, 2));
    console.log('user=' + JSON.stringify(user, null, 2));
    return data;
}

function assessmentAsEmailBody(assessment: Assessment, profile: SkillProfile, coach: User, referee: Referee): string {
    const nbLines = assessment.skillSetEvaluation
        .map((sse) => sse.skillEvaluations.length + 1)
        .reduce((prev, cur) => prev + cur);
    const zoom = nbLines > 40 ? '62%' : '80%';
    let body = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <style>
        body {
            margin: 0 auto;
            width: 1024px;
        }
        @media print {
            body { 
                page-break-before: avoid;
                padding: 0.8cm;
                zoom: ${zoom};
            }
        }
        table { width: 100%; }
        table, th, td {
            border: 1px solid black;
            border-collapse: collapse;
        }
        td {
            padding: 5px;
        }
        .title {
            text-align: center; 
            background-color:${profile.backgroundColor}; 
            color:${profile.color}; 
            width: 100%;
        }
        .assessment-header {}
        .assessment-main {}
        .section-name, .global-title {
            background-color: #cccccc;
            font-weight: bold;
            padding: 5px;
        }
        .section-competency, .skill-competency{
            padding: 5px 15px;
            text-align: center;
        }
        .section-competency{
            background-color: #eeeeee;
            font-variant-caps: all-small-caps;
        }
        .section-name, .global-title, .section-competency{
            font-size: 1.2em;
        }
        .skill-name {
            padding: 5px;
        }
        .assessment-global { margin-bottom: 20px; }
        .global-main{
            padding-top: 10px;
            padding-bottom: 30px;
        }
        .competent { color: green; font-weight: bold;}
        .notCompetent { color: red;}
    </style>
</head>
<body>    
    <table class="assessment-header">
        <tr><td colspan="3" class="title"><h1>${assessment.profileName} Referee Assessment</h1></td></tr>
        <tr><td colspan="2"><strong>Referee:</strong> ${referee.firstName} ${referee.lastName} ${assessment.refereeShortName}</td><td><strong>Referee NTA:</strong> ${referee.country}</td></tr>
        <tr><td colspan="2"><strong>Competition:</strong> ${assessment.competition}</td><td><strong>Date:</strong> ${getAssessmentDateAsString(assessment)}</td></tr>
        <tr><td><strong>Game category:</strong> ${assessment.gameCategory}</td><td><strong>Game speed:</strong> ${assessment.gameSpeed}</td><td><strong>Game skill:</strong> ${assessment.gameSkill}</td></tr>
    </table>\n`;

    body += `\t<table class="assessment-main">\n`;
    assessment.skillSetEvaluation.forEach( (skillSetEval) => {
        body += `\n\t\t<tr class="assessment-section">\n`;
        body += `\t\t\t<th class="section-name">${skillSetEval.skillSetName}`;
        if (skillSetEval.comment && skillSetEval.comment !== '-') {
            body += `<br>Comment: ${skillSetEval.comment}`;
        }
        body += `</th>\n`;
        body += `\t\t\t<td class="section-competency ${competency2class(skillSetEval.competency)}">${competency2str(skillSetEval.competency)}</td>\n`;
        body += `\t\t</tr>\n`;
        skillSetEval.skillEvaluations.forEach( (skillEval) => {
            body += `\t\t<tr>\n\t\t\t<td class="skill-name">${skillEval.skillName}`
            if (skillEval.comment && skillEval.comment !== '-') {
                body += `<br>Comment: ${skillEval.comment}`;
            }
            body += `</td>\n\t\t\t<td class="skill-competency ${competency2class(skillEval.competency)}">${competency2str(skillEval.competency)}</td>\n\t\t</tr>\n`;
        });
    });
    body += `\t</table>\n`;
    body += `\t<table class="assessment-global">\n`;
    body += `\t\t<tr><th class="global-title">Conclusion</th>\n`;
    body += `\t\t<tr><td class="global-main">The referee coach ${coach.firstName} ${coach.lastName} declares the referee is ${assessment.competency === 'YES' ? '' : '<strong>NOT</strong> '}competent for the level ${assessment.profileName}.`
    if (assessment.comment && assessment.comment !== '-') {
        body += `<br>Comment: ${assessment.comment}`;
    }
    body += `</td></th>\n`;
    body += `\t</table>`;
    body += `</body>\n</html>`;

    return body;
}

function competency2str(comp: Competency): string {
    if (comp === 'YES') {
        return 'Yes';
    } else if (comp === 'NO') {
        return 'No';
    } else {
        return ''
    }
}
function competency2class(comp: Competency): string {
    if (comp === 'YES') {
        return 'competent';
    } else if (comp === 'NO') {
        return 'notCompetent';
    } else {
        return ''
    }
}

function assessmentAsEmailSubject(assessment: Assessment): string {
    return `[CoachReferee.com] Referee Assessment ${assessment.competition} ${assessment.profileName} ${getAssessmentDateAsString(assessment)} ${assessment.refereeShortName}`;
}

function getAssessmentDateAsString(assessment: Assessment) {
    return assessment.date.getFullYear()
      + common.DATE_SEP + common.to2Digit(assessment.date.getMonth() + 1)
      + common.DATE_SEP + common.to2Digit(assessment.date.getDate());
}