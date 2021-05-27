import * as common          from './common';
import * as mailer          from './mailer';
import * as fs              from 'fs';
import * as os              from 'os';
const moment = require('moment');
const path = require('path');
const pdfc = require("pdf-creator-node");

import { User }  from './model/user';
import { RefereeUpgrade }  from './model/upgrade';

const diplomaVersion: string = '1.0.0';


export async function func(request:any, response:any, ctx:any):Promise<any> {
    const refereeUpgrade: RefereeUpgrade = await loadRefereeUpgrade(request, response, ctx);
    const referee: User = await loadReferee(refereeUpgrade.referee.refereeId, response, ctx);
    //Build email
    const subject = `[CoachReferee.com] Referee Upgrade to ${refereeUpgrade.upgradeLevel}`;
    const certificateFile = await generateCertificate(refereeUpgrade, referee);
    const email = {
        from: ctx.gmailEmail,
        to: referee.email,
        cc: ctx.gmailEmail,
        subject,
        html: `Hi ${referee.firstName},<p>Congratulation!
            <br>The European Referee Commission awards you the referee level ${refereeUpgrade.upgradeLevel} at the date ${common.date2string(refereeUpgrade.decisionDate)}.
            </p>
            <br>Best regard
            <br>Upgrade Referee App administrator`,
        attachments: [{   
            filename: 'Referee_Certificate_' + refereeUpgrade.upgradeLevel + '_' + referee.firstName + '_' + referee.lastName + '.png',
            contentType: 'text/png',
            path: certificateFile
            }]
    };
    mailer.sendMail(email, response);
    return 'ok';
}

async function loadRefereeUpgrade(request:any, response:any, ctx:any): Promise<RefereeUpgrade> {
    const refereeUpgrade: RefereeUpgrade = await common.loadFromDb(ctx.db, common.collectionRefereeUpgrade, request.body.data.upgradeId, response) as RefereeUpgrade;
    adjustFieldOnLoadRefereeUpgrade(refereeUpgrade);
    if (!refereeUpgrade) {
        throw new Error('RefereeUpgrade does not exist.');
    }
    if (refereeUpgrade.upgradeStatus !== 'PUBLISHED') {
        throw new Error('RefereeUpgrade is not published.');
    }
    if (refereeUpgrade.decision !== 'Yes') {
        throw new Error('RefereeUpgrade decision is not a Yes.');
    }
    return refereeUpgrade;
}
function adjustFieldOnLoadRefereeUpgrade(item: RefereeUpgrade): RefereeUpgrade {
    if (item) {
        item.decisionDate = common.adjustDate(item.decisionDate);
    }
    return item;
}

async function loadReferee(refereeId: string, response: any, ctx:any): Promise<User> {
    const referee: User = await common.loadUser(ctx.db, refereeId, response) as User;
    if (!referee) {
        throw new Error('Referee does not exist.');
    }
    if (!referee.referee) {
        throw new Error('Referee has not complete referee data.');
    }
    if (referee.applications.filter(ar => ar.name === 'Upgrade' && ar.role === 'REFEREE').length === 0) {
        throw new Error('Referee is not an allowed referee in the upgrade application.');
    }
    return referee;
}

function generateCertificate(refereeUpgrade: RefereeUpgrade, referee: User): Promise<string> {
    const certificateTemplateUrl = 'src/certificate_europe_referee_' + refereeUpgrade.upgradeLevel + '.html';
    const tempLocalDir = os.tmpdir();      
    const template = fs.readFileSync(certificateTemplateUrl, 'utf8');
    const awardDate = common.adjustDate(refereeUpgrade.decisionDate);

    const awardDateStr: string = moment(awardDate).format('Do MMM YYYY');
    const html = template
        .replace('${learner}', referee.firstName + '<br>' + referee.lastName)
        .replace('${awardDate}', awardDateStr);
    const options = { 
        format: 'A4', 
        orientation: 'landscape',
        header: { height: '0' },
        footer: { height: '0' },
        zoomFactor: '1.0',
        border: '0'
    };
    console.log('options', JSON.stringify(options));
    const outputFile = path.join(tempLocalDir, `Referee_Certificate_${refereeUpgrade.upgradeLevel}_${referee.id}_${new Date().getTime()}.png`);
    const document = { 
        html: html,
        data: {
            learner: referee.firstName + '<br>' + referee.lastName,
            awardDate: awardDateStr,
            diplomaVersion: diplomaVersion
        },
        path: outputFile 
    };
    return new Promise<string>((resolve, reject) => {
        pdfc.create(document, options).then((res:any) => {
            console.log(`Document generated (version: ${diplomaVersion}): ${outputFile}`);
            console.log(res)
            resolve(outputFile);
        })
        .catch((error:any) => {
            console.error('Document generation: err=' + error);
        });
    });
}
