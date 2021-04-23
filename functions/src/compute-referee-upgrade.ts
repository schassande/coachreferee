import * as common          from './common';
import { CoachRef, CompetitionRef } from './model/competition';
import { CompetitionDayPanelVote, UpgradeCriteria, RefereeUpgrade,  } from './model/upgrade';
import { RefereeLevel, User }  from './model/user';
const moment = require('moment');

/** 
1.Load panel votes from last 12 months
2.Sort panel votes by date
3.Retain panel votes by tournament category and globally limited to the window size
4.Check global window size
5.Check global number of yes
6.Check the number of different referee coaches
7.Check category requirement : number of days and number of yes
8.Check the multiday
*/
export async function func(request:any, response:any, ctx:any):Promise<any> {
    const referee: User = await loadReferee(request, response, ctx);
    const day = common.string2date(request.body.data.day, new Date());
    const upgradeCriteria: UpgradeCriteria = await loadUpgradeCriteria(referee, day, ctx, response);

    let ru: RefereeUpgrade = await compute(day, referee, upgradeCriteria, ctx, response);

    ru = await persistUpgrade(ctx.db, ru, response)
    response.send({ data: ru}); 
}

async function compute(day: Date, referee: User, upgradeCriteria: UpgradeCriteria, ctx: any, response:any): Promise<RefereeUpgrade> {
    const beginDate = moment(day.getTime()).subtract(upgradeCriteria.dayVoteDuration, 'months').toDate();

    const data: WorkingData = newWorkingData();
    data.restDayVotes = await findPanelVotes(ctx, referee, beginDate, day, response);
    console.log('panelVotes=' + JSON.stringify(data.restDayVotes));

    extractDays(upgradeCriteria, data);
    console.log('AFTER extractDays, workingData=' + JSON.stringify(data));
    data.windowSizeCheck = (data.c5dayVotes.length + data.c4dayVotes.length + data.c3dayVotes.length) === upgradeCriteria.daysRequired;

    const c3Yes = data.c3dayVotes.filter(v => v.vote === 'Yes').length;
    const c4Yes = data.c4dayVotes.filter(v => v.vote === 'Yes').length;
    const c5Yes = data.c5dayVotes.filter(v => v.vote === 'Yes').length;
    data.c3NbYes = c3Yes >= upgradeCriteria.c3YesRequired;
    data.c4NbYes = c4Yes >= upgradeCriteria.c4YesRequired;
    data.c5NbYes = c5Yes >= upgradeCriteria.c5YesRequired;
    data.globalNbYes = (c3Yes + c4Yes + c5Yes) >= upgradeCriteria.totalYesRequired;

    data.c3Nb = data.c3dayVotes.length >= upgradeCriteria.c3DaysRequired;
    data.c4Nb = data.c4dayVotes.length >= upgradeCriteria.c4DaysRequired;
    data.c5Nb = data.c5dayVotes.length >= upgradeCriteria.c5DaysRequired;

    const retainVotes = data.c3dayVotes.concat(data.c4dayVotes).concat(data.c5dayVotes);
    retainVotes.filter(v => v.vote === 'Yes').forEach((v => v.coaches.forEach(c => {
        if (data.yesCoach.findIndex(c2 => c.coachId === c2.coachId) < 0) {
            data.yesCoach.push(c);
        }
    })));
    data.multiDayCompetitionRefs = [...new Set(retainVotes.filter(v => v.isMultiDayCompetition).map(v => v.competitionRef))];
    console.log('workingData=' + JSON.stringify(data));
    let ru: RefereeUpgrade|null = await getRefereeUpgrade(ctx.db, referee.id, day, response);
    const id = ru ? ru.id : '';
    ru = {
        id,
        version: 0,
        creationDate: new Date(),
        lastUpdate: new Date(),
        dataStatus: 'CLEAN',
        referee: { refereeId: referee.id, refereeShortName: referee.shortName },
        upgradeLevel: upgradeCriteria.upgradeLevel,
        upgradeStatus: computeUpgradeStatus(data, upgradeCriteria) ? 'Yes' : 'No',
        upagrdeStatusDate: common.to00h00(day),
        multiDayCompetitionRefs: data.multiDayCompetitionRefs,
        yesRefereeCoaches: data.yesCoach,
        c3PanelVotes: data.c3dayVotes,
        c4PanelVotes: data.c4dayVotes,
        c5PanelVotes: data.c5dayVotes,
        upgradeCriteriaId: upgradeCriteria.id
    };
    return ru;
}

function computeUpgradeStatus(data: WorkingData, upgradeCriteria: UpgradeCriteria): boolean {
    return data.c3Nb && data.c4Nb && data.c5Nb // Check category requirement : number of days
        && data.c3NbYes && data.c4NbYes && data.c4NbYes // Check category requirement : number of yes
        && data.windowSizeCheck // Check global window size
        && data.globalNbYes // Check global number of yes
        && data.yesCoach.length >= upgradeCriteria.yesRefereeCoachRequired // Check the number of different referee coaches
        && data.multiDayCompetitionRefs.length >= upgradeCriteria.multiDayCompetitionRequired // Check the multiday
        ;
}
interface WorkingData {
    restDayVotes : CompetitionDayPanelVote[];
    c3dayVotes: CompetitionDayPanelVote[];
    c4dayVotes: CompetitionDayPanelVote[];
    c5dayVotes: CompetitionDayPanelVote[];
    c3Nb: boolean;
    c4Nb: boolean;
    c5Nb: boolean;
    windowSizeCheck: boolean;
    globalNbYes: boolean;
    c3NbYes: boolean;
    c4NbYes: boolean;
    c5NbYes: boolean;
    yesCoach: CoachRef[];
    multiDayCompetitionRefs: CompetitionRef[];
}
function newWorkingData(): WorkingData {
     return {
        restDayVotes: [],
        c3dayVotes: [],
        c4dayVotes: [],
        c5dayVotes: [],
        c3Nb: false,
        c4Nb: false,
        c5Nb: false,
        windowSizeCheck: false,
        globalNbYes: false,
        c3NbYes: false,
        c4NbYes: false,
        c5NbYes: false,
        yesCoach: [],
        multiDayCompetitionRefs: []
    }
}

async function loadReferee(request:any, response:any, ctx:any): Promise<User> {
    const referee: User = await common.loadFromDb(ctx.db, common.collectionUser, request.body.data.refereeId, response) as User;
    if (!referee) {
        throw new Error('Referee does not exist.');
    }
    if (!referee.referee) {
        throw new Error('Referee has not complete referee data.');
    }
    if (!referee.referee.nextRefereeLevel) {
        throw new Error('Referee has not a next referee level defined.');
    }
    if (referee.applications.filter(ar => ar.name === 'Upgrade' && ar.role === 'REFEREE').length === 0) {
        throw new Error('Referee is not an allowed coach in the upgrade application.');
    }
    return referee;
}
async function loadUpgradeCriteria(referee: User, day: Date, ctx:any, response:any): Promise<UpgradeCriteria> {
    console.log('loadUpgradeCriteria(' + referee.referee.nextRefereeLevel + ', ' + common.date2string(day) + ')');
    const upgradeCriteria: UpgradeCriteria|null = await getUpgradeCriteria(ctx.db, referee.referee.nextRefereeLevel, day, response);
    if (!upgradeCriteria) {
        throw new Error('No UpgradeCriteria found for the level ' + referee.referee.nextRefereeLevel + ' at the date ' + common.date2string(day));
    }
    console.log('loadUpgradeCriteria(' + referee.referee.nextRefereeLevel + ', ' + common.date2string(day) + ') => ' + JSON.stringify(upgradeCriteria));
    return upgradeCriteria;
}
async function findPanelVotes(ctx:any, referee: User, beginDate: Date, endDate: Date, response:any): Promise<CompetitionDayPanelVote[]> {
    const panelVotes: CompetitionDayPanelVote[] = await loadPanelVotesByRefereeFromDB(ctx.db, referee.id, beginDate, endDate, response);
    if (!panelVotes || panelVotes.length === 0) {
        throw new Error('No panel vote for the referee ' + referee.id);
    }
    console.log('findPanelVotes(' + referee.id + ',' + common.date2string(beginDate) + ',' + common.date2string(endDate) + '):' + JSON.stringify(panelVotes));
    return panelVotes;
}

async function loadPanelVotesByRefereeFromDB(db:any, refereeId: string, beginDate: Date, endDate: Date, response:any): Promise<CompetitionDayPanelVote[]> {
    console.log('loadPanelVotesByRefereeFromDB(' + refereeId + ',' + common.date2string(beginDate) + ',' + common.date2string(endDate) + ')');
    const querySnapshot = await  db.collection(common.collectionCompetitionDayPanelVote)
        .where('referee.refereeId', '==', refereeId)
        .where('day', '>=', beginDate)
        .where('day', '<=', endDate)
        .where('closed', '==', true)
        .orderBy('day', 'desc')
        .get();
    const docs: CompetitionDayPanelVote[] = [];
    querySnapshot.forEach((doc:any) => docs.push(adjustFieldOnLoadCompetitionDayPanelVote(doc.data() as CompetitionDayPanelVote)));
    return docs;
}
function adjustFieldOnLoadCompetitionDayPanelVote(item: CompetitionDayPanelVote): CompetitionDayPanelVote {
    if (item) {
        item.day = common.adjustDate(item.day);
    }
    return item;
}
async function getUpgradeCriteria(db:any, refereeLevel: RefereeLevel, applicationDate: Date, response:any): Promise<UpgradeCriteria|null> {
    const querySnapshot = await db.collection(common.collectionUpgradeCriteria)
        .where('upgradeLevel', '==', refereeLevel)
        .get();
    const docs: UpgradeCriteria[] = [];
    querySnapshot.forEach((doc:any) => {
        let item: UpgradeCriteria = doc.data() as UpgradeCriteria;
        item = adjustFieldOnLoadUpgradeCriteria(item);
        if (item.beginDate.getTime() <= applicationDate.getTime()
            && (!item.endDate || applicationDate.getTime() <= item.endDate.getTime())) {
            docs.push(item);
        }
    });
    return docs.length > 0 ? docs[0] : null;
}
function adjustFieldOnLoadUpgradeCriteria(item: UpgradeCriteria): UpgradeCriteria {
    if (item) {
        item.beginDate = common.adjustDate(item.beginDate);
        item.endDate = common.adjustDate(item.endDate);
    }
    return item;
}
function extractDays(upgradeCriteria: UpgradeCriteria, data: WorkingData) {
    if (upgradeCriteria.c5DaysRequired > 0) {
        // extract the expected number of votes
        data.c5dayVotes = data.restDayVotes.filter(pv => pv.competitionCategory === 'C5');
        // console.log('extractDays: After filtering C5: data.c5dayVotes.length=' + data.c5dayVotes.length);
        data.c5dayVotes = data.c5dayVotes.slice(0, upgradeCriteria.c5DaysRequired);
        // console.log('extractDays: After slice C5: data.c5dayVotes.length=' + data.c5dayVotes.length);
        // remove the votes from the rest
        data.c5dayVotes.forEach(pv => {
            data.restDayVotes.splice(data.restDayVotes.findIndex(rpv => rpv.id === pv.id), 1);
        });
    }
    if (upgradeCriteria.c4DaysRequired > 0) {
        // extract the expected number of votes
        data.c4dayVotes = data.restDayVotes
            .filter(pv => pv.competitionCategory === 'C5' || pv.competitionCategory === 'C4');
        // console.log('extractDays: After filtering C4: data.c4dayVotes.length=' + data.c4dayVotes.length);
        data.c4dayVotes = data.c4dayVotes.slice(0, upgradeCriteria.c4DaysRequired);
        // console.log('extractDays: After slice C4: data.c4dayVotes.length=' + data.c4dayVotes.length);
        // remove the votes from the rest
        data.c4dayVotes.forEach(pv => {
            data.restDayVotes.splice(data.restDayVotes.findIndex(rpv => rpv.id === pv.id), 1);
        });
    }
    if (upgradeCriteria.c3DaysRequired > 0) {
        // extract the expected number of votes
        data.c3dayVotes = data.restDayVotes
            .filter(pv => pv.competitionCategory === 'C5' || pv.competitionCategory === 'C4' || pv.competitionCategory === 'C3');
        // console.log('extractDays: After filtering C3: data.c3dayVotes.length=' + data.c3dayVotes.length);
        data.c3dayVotes = data.c3dayVotes.slice(0, upgradeCriteria.c3DaysRequired);
        // console.log('extractDays: After slice C3: data.c3dayVotes.length=' + data.c3dayVotes.length);
        // remove the votes from the rest
        data.c3dayVotes.forEach(pv => {
            data.restDayVotes.splice(data.restDayVotes.findIndex(rpv => rpv.id === pv.id), 1);
        });
    }
}
async function getRefereeUpgrade(db:any, refereeId: string, day: Date, response:any): Promise<RefereeUpgrade|null> {
    const querySnapshot = await db.collection(common.collectionUpgradeCriteria)
        .where('referee.refereeId', '==', refereeId)
        .where('upagrdeStatusDate', '==', day)
        .limit(1)
        .get();
    const docs: RefereeUpgrade[] = [];
    querySnapshot.forEach((doc:any) => {
        let item: RefereeUpgrade = doc.data() as RefereeUpgrade;
        item = adjustFieldOnLoadRefereeUpgrade(item);
        docs.push(item);
    });
    return docs.length > 0 ? docs[0] : null;
}
function adjustFieldOnLoadRefereeUpgrade(item: RefereeUpgrade): RefereeUpgrade {
    if (item) {
        item.upagrdeStatusDate = common.adjustDate(item.upagrdeStatusDate);
    }
    return item;
}
async function persistUpgrade(db:any, item: RefereeUpgrade, response:any): Promise<RefereeUpgrade> {
    const update = item.id && item.id.length > 0;
    // console.log('BEFORE ' + (update?'update':'new') +': RefereeUpgrade=' + JSON.stringify(item));
    if (update) {
        const doc = await db.collection(common.collectionRefereeUpgrade).document(item.id);
        await doc.update(item);
    } else {
        const doc = await db.collection(common.collectionRefereeUpgrade).add(item);
        item.id = doc.id;
        // console.log('refereeUpgrade has now an id: ' + item.id);
        await doc.set(item);
    }    
    // console.log('AFTER ' + (update?'update':'new') +': RefereeUpgrade=' + JSON.stringify(item));
    return item;
}
