import * as common from './common';
import * as mailer from './mailer';
import { CoachRef, Competition } from './model/competition';
import { CompetitionDayPanelVote, CompetitionDayRefereeCoachVote, RefereeUpgrade } from './model/upgrade';
import { User }  from './model/user';

/** 
For each competition notCompleted
	for each refereeCoach
		for each day
			for each referee
				find CoachVote
				find PanelVote
				if (not exist coachVote and panelVote not closed) then
					remind missing vote
		if missing votes then 
			send email to the refereeCoach with missing votes
	for each day
		for each referee
			find RefereeUpgrade
			if (not exist refereeUpgrade or not publish) then 
				remind missing refereeUpgrade
				find PanelVote
				if (not exist panelVote or not closed)
					then remind missing vote
	if missing votes or missing published upgrade then
		send email to the panel director with missing panel votes and not published upgrades
	if (no missing coachVote, panelVote, published upgrade) then
		set competition completed
 */
export async function func(ctx:any):Promise<any> {
    // init competition
    const all = await findAllCompetitions(ctx.db);
    // tslint:disable-next-line:prefer-for-of
    await Promise.all(all.map(async c => {
        if (!c.completed) {
            c.completed = c.region !=='Europe' || 
                (c.category !== 'C3' && c.category !== 'C4' && c.category !== 'C5' 
                && c.categorySenior !== 'C3' && c.categorySenior !== 'C4' && c.categorySenior !== 'C5');
            console.log('Mark competition "' + c.name + '" as ' + (c.completed? '' : 'NOT') + ' completed.');
            await updateCompetition(ctx.db, c);
        }
    }));

    // real begin
    const competitions = await findNotCompletedCompetition(ctx.db);
    console.log(competitions.length + ' competitions to analyse.');
    await Promise.all(competitions.map(async competition => {
        console.log('Analyse the competitions "' + competition.name + `" (${competition.category}/${competition.categorySenior}/${competition.region}).`);
        const missings: Missing[] = [];
        let promises: Promise<void>[] = [];
        const directorId = competition.refereePanelDirectorId ? competition.refereePanelDirectorId : competition.ownerId;
        promises = promises.concat(competition.referees.map(async ref => {
            const referee: User = await loadUser(ref.refereeId, ctx);
            if (!isRefereeUpgradable(referee, competition)) {
                console.log('At "' + competition.name + '", the referee ' + ref.refereeShortName + ' is not upgrdable');
                return; // next referee
            }
            // the referee is upgradable
            // tslint:disable-next-line:prefer-for-of
            for (let d=0; d<competition.days.length; d++) {
                const day = competition.days[d];
                const upgrade: RefereeUpgrade|null = await getRefereeUpgrade(ctx.db, ref.refereeId, day, competition.id);
                if (upgrade && upgrade.upgradeStatus === 'PUBLISHED') {
                    console.log('At "' + competition.name + '", the referee ' + ref.refereeShortName + ' already has a published upgrade on day' + common.date2string(day) + '.');
                    continue; // next day
                }
                // no published referee upgrade
                if (upgrade) {
                    missings.push({ type: 'PUBLISH', to: directorId, referee, day });
                    console.log('At "' + competition.name + '", the referee ' + ref.refereeShortName + ' has an unpublished upgrade on day' + common.date2string(day) + '.');
                } else {
                    missings.push({ type: 'UPGRADE', to: directorId, referee, day });
                    console.log('At "' + competition.name + '", the referee ' + ref.refereeShortName + ' has no upgrade on day' + common.date2string(day) + '.');
                    // no referee upgrade
                    const panelVote: CompetitionDayPanelVote|null = await getPanelVote(ctx.db, competition.id, day, ref.refereeId);
                    if (panelVote && panelVote.closed) {
                        // closed panel vote already exists
                        console.log('At "' + competition.name + '", the referee ' + ref.refereeShortName + ' already has a closed panel vote on day' + common.date2string(day) + '.');
                        continue; // next day
                    }
                    missings.push({  type: panelVote ? 'PANEL_CLOSE' : 'PANEL_VOTE', to: directorId, referee, day });
                    console.log('At "' + competition.name + '", the referee ' + ref.refereeShortName + ' has no panel vote on day' + common.date2string(day) + '.');
                    // tslint:disable-next-line:prefer-for-of
                    for(let i=0; i<competition.refereeCoaches.length; i++) {
                        const coach = competition.refereeCoaches[i];
                        const coachVote: CompetitionDayRefereeCoachVote|null = await getCoachVote(ctx.db, competition.id, day, coach.coachId, ref.refereeId);
                        if (coachVote) {
                            console.log('At "' + competition.name + '", the referee ' + ref.refereeShortName + ' already has a coach vote by ' +  coach.coachShortName + ' on day' + common.date2string(day) + '.');
                        } else {
                            missings.push({ type: 'COACH_VOTE', to: coach.coachId, referee, coach, day });
                            console.log('At "' + competition.name + '", the referee ' + ref.refereeShortName + ' has no coach vote by ' +  coach.coachShortName + ' on day' + common.date2string(day) + '.');
                        }
                    }
                }
            }
        }));
        await Promise.all(promises).then(async () => {
            console.log('At "' + competition.name + '", ' +  missings.length + ' missing action(s).');
            if (missings.length) {
                let missingsByTo: any = {};
                for(const m of missings) {
                    const existing = missingsByTo[m.to] || [];
                    missingsByTo = { ...missingsByTo, [m.to] : [...existing, m] };
                }
                await Promise.all(Object.keys(missingsByTo).map(to => 
                    sendEmail(to, directorId, missingsByTo[to], competition, ctx)
                ));
            } else {
                console.log('Marking the competition "' + competition.name + '" has completed.');
                competition.completed = true;
                await updateCompetition(ctx.db, competition)
            }
        }).catch(err => console.error(err))
    }));
}
type MissingType = 
    'COACH_VOTE' // the referee coach vote is missing
    | 'PANEL_VOTE' // the panel vote is missing
    | 'PANEL_CLOSE' // the panel vote is not closed
    | 'UPGRADE' // the referee upgrade is missing
    | 'PUBLISH' // the referee upgrade is not published
const missingTypesSorted: MissingType[] = ['COACH_VOTE', 'PANEL_VOTE', 'PANEL_CLOSE', 'UPGRADE', 'PUBLISH']
interface Missing {
    type: MissingType;
    to: string;
    referee: User;
    day: Date,
    coach?: CoachRef;
}
function sortMissings(m1: Missing, m2: Missing): number {
    let res = m1.day.getTime() - m2.day.getTime();
    if (res === 0) {
        res = (m1.referee.firstName+m1.referee.lastName).localeCompare(m2.referee.firstName+m2.referee.lastName);
        if (res === 0) {
            res = missingTypesSorted.indexOf(m1.type) - missingTypesSorted.indexOf(m2.type);
        }
    }
    return res;
}
async function sendEmail(to: string, cc: string, missings: Missing[], competition: Competition, ctx:any): Promise<void> {
    let ccUser = null;
    if (cc && cc !== to) {
        ccUser = await loadUser(cc, ctx);
    }
    const toUser: User = await loadUser(to, ctx);
    const subject = `Referee Upgrade(${competition.name}): reminder of missing actions (${common.date2string(new Date())})`;
    const html = `Hi ${toUser.firstName},<br> 
<p>In the referee upgrade web application, you need to perform actions for the competition ${competition.name} (${competition.category}/${competition.categorySenior}/${competition.region}). The following action are required:</p><ul>`
+ missings.sort(sortMissings).map(m => {
    switch(m.type) {
    case 'COACH_VOTE':
        return `<li>Coach vote by ${m.coach?.coachShortName} is missing for the referee ${m.referee.firstName} ${m.referee.lastName} on day ${common.date2string(m.day)}.</li>`
    case 'PANEL_CLOSE':
        return `<li>Panel vote is not closed for the referee ${m.referee.firstName} ${m.referee.lastName} on day ${common.date2string(m.day)}.</li>`
    case 'PANEL_VOTE':
        return `<li>Panel vote is missing for the referee ${m.referee.firstName} ${m.referee.lastName} on day ${common.date2string(m.day)}.</li>`
    case 'PUBLISH':
        return `<li>Panel vote is not published for the referee ${m.referee.firstName} ${m.referee.lastName} on day ${common.date2string(m.day)}.</li>`
    case 'UPGRADE':
        return `<li>Upgrade decision is missing for the referee ${m.referee.firstName} ${m.referee.lastName} on day ${common.date2string(m.day)}.</li>`
    }
}).join('')
+ `</ul>
<p>Please perfom the missing actions as soon as possible.</p>
<p>Best regards`;
    const email: any = {
        to: toUser.email,
        cc: ctx.gmailEmail,
        subject,
        html,
    };
    if (ccUser) {
        email.cc = ccUser.email;
    }
    console.log('Send the email:\n' + JSON.stringify(email, null, 2));
    return mailer.sendMail(email);
}
function isRefereeUpgradable(referee: User, competition: Competition): boolean {
    return referee && referee.referee 
        && common.valueIn(referee.referee.nextRefereeLevel, 'EURO_3', 'EURO_4', 'EURO_5')
        && referee.applications.filter(app => app.name === 'Upgrade' && app.role === 'REFEREE').length === 1
        && (
            (referee.referee.refereeCategory === 'OPEN' && common.valueIn(competition.category, 'C3', 'C4', 'C5'))
            || (referee.referee.refereeCategory === 'SENIOR' && common.valueIn(competition.categorySenior, 'C3', 'C4', 'C5'))
        );
}
async function findNotCompletedCompetition(db:any): Promise<Competition[]> {
    console.log('findNotCompletedCompetition()');
    const querySnapshot = await db.collection(common.collectionCompetition)
        .where('region', '==', 'Europe')
        .where('completed', '==', false)
        .get();
    const docs: Competition[] = [];
    querySnapshot.forEach((doc:any) => {
        let item: Competition = doc.data() as Competition;
        item = adjustFieldOnLoadCompetition(item);
        docs.push(item);
    });
    return docs;
}
async function findAllCompetitions(db:any): Promise<Competition[]> {
    console.log('findAllCompetitions()');
    const querySnapshot = await db.collection(common.collectionCompetition)
        .where('region', '==', 'Europe')
        .get();
    const docs: Competition[] = [];
    querySnapshot.forEach((doc:any) => {
        let item: Competition = doc.data() as Competition;
        item = adjustFieldOnLoadCompetition(item);
        docs.push(item);
    });
    return docs;
}
function adjustFieldOnLoadCompetition(item: Competition): Competition {
    if (item.days) {
        item.days = item.days.map(d => common.adjustDate(d))
    }
    item.date = common.adjustDate(item.date);
    return item;
}

async function loadUser(refereeId:string, ctx:any): Promise<User> {
    return await common.loadFromDb(ctx.db, common.collectionUser, refereeId) as User;
}


async function getCoachVote(db:any, competitionId: string, day: Date, coachId: string, refereeId: string): Promise<CompetitionDayRefereeCoachVote|null> {
    console.log('getCoachVote(' + competitionId + ',' + common.date2string(day) + ',' + coachId + ', ' + refereeId + ')');
    const querySnapshot = await db.collection(common.collectionCompetitionDayRefereeCoachVote)
        .where('competitionRef.competitionId', '==', competitionId)    
        .where('day', '==', common.to00h00(day))
        .where('coach.coachId', '==', coachId)
        .where('referee.refereeId', '==', refereeId)
        .limit(1)
        .get();
    const docs: CompetitionDayRefereeCoachVote[] = [];
    querySnapshot.forEach((doc:any) => {
        let item: CompetitionDayRefereeCoachVote = doc.data() as CompetitionDayRefereeCoachVote;
        item = adjustFieldOnLoadCompetitionDayRefereeCoachVote(item);
        docs.push(item);
    });
    const result = docs.length > 0 ? docs[0] : null;
    console.log('getCoachVote(' + competitionId + ',' + common.date2string(day) + ',' + coachId + ', ' + refereeId + ') => ' + (result ? result.id : null));
    return result;
}
function adjustFieldOnLoadCompetitionDayRefereeCoachVote(item: CompetitionDayRefereeCoachVote): CompetitionDayRefereeCoachVote {
    if (item) {
        item.day = common.adjustDate(item.day);
    }
    return item;
}

async function getPanelVote(db:any, competitionId: string, day: Date, refereeId: string): Promise<CompetitionDayPanelVote|null> {
    console.log('getPanelVote(' + competitionId + ',' + common.date2string(day) +  ',' + refereeId + ')');
    const querySnapshot = await db.collection(common.collectionCompetitionDayPanelVote)
        .where('competitionRef.competitionId', '==', competitionId)    
        .where('day', '==', common.to00h00(day))
        .where('referee.refereeId', '==', refereeId)
        .limit(1)
        .get();
    const docs: CompetitionDayPanelVote[] = [];
    querySnapshot.forEach((doc:any) => {
        let item: CompetitionDayPanelVote = doc.data() as CompetitionDayPanelVote;
        item = adjustFieldOnLoadCompetitionDayPanelVote(item);
        docs.push(item);
    });
    const result = docs.length > 0 ? docs[0] : null;
    console.log('getPanelVote(' + competitionId + ',' + common.date2string(day) +  ',' + refereeId + ') => ' + (result ? result.id : null));
    return result;
}
function adjustFieldOnLoadCompetitionDayPanelVote(item: CompetitionDayPanelVote): CompetitionDayPanelVote {
    if (item) {
        item.day = common.adjustDate(item.day);
    }
    return item;
}

async function getRefereeUpgrade(db:any, refereeId: string, day: Date, competitionId: string): Promise<RefereeUpgrade|null> {
    console.log('getRefereeUpgrade(' + refereeId + ', ' + day + '): ' + day.getTime());
    const querySnapshot = await db.collection(common.collectionRefereeUpgrade)
        .where('referee.refereeId', '==', refereeId)
        .where('decisionDate', '==', common.to00h00(day))
        .where('competitionId', '==', competitionId)
        .limit(1)
        .get();
    const docs: RefereeUpgrade[] = [];
    querySnapshot.forEach((doc:any) => {
        let item: RefereeUpgrade = doc.data() as RefereeUpgrade;
        item = adjustFieldOnLoadRefereeUpgrade(item);
        docs.push(item);
    });
    const result = docs.length > 0 ? docs[0] : null;
    console.log('getRefereeUpgrade(' + refereeId + ', '+ day + ') => ' + (result ? result.id : null));
    return result;
}
function adjustFieldOnLoadRefereeUpgrade(item: RefereeUpgrade): RefereeUpgrade {
    if (item) {
        item.decisionDate = common.adjustDate(item.decisionDate);
        item.allPanelVotes.forEach(v => v.day = common.adjustDate(v.day));
        item.c5PanelVotes.forEach(v => v.day = common.adjustDate(v.day));
        item.c4PanelVotes.forEach(v => v.day = common.adjustDate(v.day));
        item.c3PanelVotes.forEach(v => v.day = common.adjustDate(v.day));
    }
    return item;
}
async function updateCompetition(db:any, item: Competition): Promise<Competition> {
    const doc = await db.collection(common.collectionCompetition).doc(item.id);
    await doc.update(item);
    return item;
}
