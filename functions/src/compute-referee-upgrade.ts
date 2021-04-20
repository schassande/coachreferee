import * as common          from './common';
import { CoachRef } from './model/competition';
import { CompetitionDayPanelVote, UpgradeCriteria, RefereeUpgrade,  } from './model/upgrade';
import { RefereeLevel, User }  from './model/user';

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
    try {
        console.log('coachId=' + request.body.data.coachId);
        const coach: User = await common.loadUser(ctx.db, request.body.data.coachId, response);
        console.log('coach=' + JSON.stringify(coach));
        checkCoach(coach);

        console.log('refereeId=' + request.body.data.refereeId);
        const referee: User = await common.loadFromDb(ctx.db, common.collectionUser, request.body.data.refereeId, response) as User;
        console.log('referee=' + JSON.stringify(referee));
        checkReferee(referee);

        const panelVotes: CompetitionDayPanelVote[] = await findPanelVotes(ctx.db, referee, response);
        console.log('panelVotes=' + JSON.stringify(panelVotes));

        const day = panelVotes[0].day;
        const upgradeCriteria: UpgradeCriteria = await getUpgradeCriteria(ctx.db, referee.referee.nextRefereeLevel, day, response);
        console.log('upgradeCriteria=' + JSON.stringify(upgradeCriteria));
        if (!upgradeCriteria) {
            throw new Error('No UpgradeCriteria found for the level ' + referee.referee.nextRefereeLevel + ' at the date ' + common.date2string(day));
        }
        const data: WorkingData = newWorkingData();
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
        data.multiDayCompetitionIds = [...new Set(retainVotes.filter(v => v.isMultiDayCompetition).map(v => v.competitionId))];
        console.log('workingData=' + JSON.stringify(data));
        let ru: RefereeUpgrade = await getRefereeUpgrade(ctx.db, referee.id, day, response);
        const id = ru ? ru.id : '';
        ru = {
            id,
            version: 0,
            creationDate: new Date(),
            lastUpdate: new Date(),
            dataStatus: 'CLEAN',
            referee: { refereeId: referee.id, refereeShortName: referee.shortName },
            upgradeLevel: upgradeCriteria.upgradeLevel,
            upgradeStatus: (
                data.c3Nb && data.c4Nb && data.c5Nb // Check category requirement : number of days
                && data.c3NbYes && data.c4NbYes && data.c4NbYes // Check category requirement : number of yes
                && data.windowSizeCheck // Check global window size
                && data.globalNbYes // Check global number of yes
                && data.yesCoach.length >= upgradeCriteria.yesRefereeCoachRequired // Check the number of different referee coaches
                && data.multiDayCompetitionIds.length >= upgradeCriteria.multiDayCompetitionRequired // Check the multiday
                ) ? 'Yes' : 'No',
            upagrdeStatusDate: common.to00h00(day),
            multiDayCompetitionIds: data.multiDayCompetitionIds,
            yesRefereeCoaches: data.yesCoach,
            c3PanelVoteIds: data.c3dayVotes.map(v => v.id),
            c4PanelVoteIds: data.c4dayVotes.map(v => v.id),
            c5PanelVoteIds: data.c5dayVotes.map(v => v.id)
        };
        if (id && id.length > 0) {
            console.log('BEFORE persist: RefereeUpgrade=' + JSON.stringify(ru));
            persistUpgrade(ctx.db, ru, response).then((refUp) => {
                console.log('AFTER persist: RefereeUpgrade=' + JSON.stringify(refUp));
                response.send({ data: refUp, error: null}); 
            });
        } else {
            console.log('BEFORE update: RefereeUpgrade=' + JSON.stringify(ru));
            updateUpgrade(ctx.db, ru, response).then((refUp) => {
                console.log('AFTER update: RefereeUpgrade=' + JSON.stringify(refUp));
                response.send({ data: refUp, error: null}); 
            });
        }
    } catch (err) {
        console.log(err);
        response.send({ data: null, error: err});
    } 
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
    multiDayCompetitionIds: string[];
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
        multiDayCompetitionIds: []
    }
}


function checkCoach(coach: User) {
    if (!coach) {
        throw new Error('Referee coach does not exist.');
    }
    if (coach.accountStatus !== 'ACTIVE') {
        throw new Error('Referee coach has not an active account.');
    }
    if (!coach.refereeCoach 
        || !coach.refereeCoach.refereeCoachLevel
        || coach.applications.filter(ar => ar.name === 'Upgrade' && ar.role === 'REFEREE_COACH')) {
        throw new Error('Referee does not exist.');
    }
}
function checkReferee(referee: User) {
    if (!referee) {
        throw new Error('Referee does not exist.');
    }
    if (!referee.referee 
        || !referee.referee.nextRefereeLevel
        || referee.applications.filter(ar => ar.name === 'Upgrade' && ar.role === 'REFEREE')) {
        throw new Error('Referee does not exist.');
    }
}
async function findPanelVotes(ctx:any, referee: User, response:any): Promise<CompetitionDayPanelVote[]> {
    let panelVotes: CompetitionDayPanelVote[] = await loadPanelVotesByRefereeFromDB(ctx.db, referee.id, response);
    if (panelVotes.length === 0) {
        throw new Error('No panel vote for the referee ' + referee.id);
    }
    const day = panelVotes[0].day;
    const pastLimit = day;
    panelVotes = panelVotes.filter(pv => pastLimit < pv.day);
    return panelVotes;
}

function loadPanelVotesByRefereeFromDB(db:any, refereeId: string, response:any): Promise<CompetitionDayPanelVote[]> {
    return db.collection(common.collectionCompetitionDayPanelVote)
        .where('referee.refereeId', '==', refereeId)
        .where('closed', '==', true)
        .orderBy('day', 'desc')
        .get()
        .then((docs:any) => docs.map((doc:any) => doc.data()))
        .catch((reason:any) => {
            response.send(reason);
            console.log('loadPanelVotesByReferee(' + refereeId + ') => ERROR:' + reason);
            return null;
        });
}

function getUpgradeCriteria(db:any, refereeLevel: RefereeLevel, applicationDate: Date, response:any): Promise<UpgradeCriteria> {
    return db.collection(common.collectionCompetitionDayPanelVote)
        .where('beginDate', '<=', applicationDate)
        .where('endDate', '>=', applicationDate)
        .where('upgradeLevel', '==', refereeLevel)
        .orderBy('beginDate', 'desc')
        .limit(1)
        .get()
        .then((docs:any) => docs.map((doc:any) => doc.data()))
        .catch((reason:any) => {
            response.send(reason);
            console.log('getUpgradeCriteria(' + refereeLevel + ') => ERROR:' + reason);
            return null;
        });
}

function extractDays(upgradeCriteria: UpgradeCriteria, data: WorkingData) {
    if (upgradeCriteria.c5DaysRequired) {
        // extract the expected number of votes
        data.c5dayVotes = data.restDayVotes
            .filter(pv => pv.competitionCategory === 'C5')
            .slice(0, upgradeCriteria.c5DaysRequired);
        // remove the votes from the rest
        data.c5dayVotes.forEach(pv => {
            data.restDayVotes.splice(data.restDayVotes.findIndex(rpv => rpv.id === pv.id), 1);
        });
    }
    if (upgradeCriteria.c4DaysRequired) {
        // extract the expected number of votes
        data.c4dayVotes = data.restDayVotes
            .filter(pv => pv.competitionCategory === 'C5' || pv.competitionCategory === 'C4')
            .slice(0, upgradeCriteria.c4DaysRequired);
        // remove the votes from the rest
        data.c4dayVotes.forEach(pv => {
            data.restDayVotes.splice(data.restDayVotes.findIndex(rpv => rpv.id === pv.id), 1);
        });
    }
    if (upgradeCriteria.c3DaysRequired) {
        // extract the expected number of votes
        data.c3dayVotes = data.restDayVotes
            .filter(pv => pv.competitionCategory === 'C5' || pv.competitionCategory === 'C4' || pv.competitionCategory === 'C3')
            .slice(0, upgradeCriteria.c3DaysRequired);
        // remove the votes from the rest
        data.c4dayVotes.forEach(pv => {
            data.restDayVotes.splice(data.restDayVotes.findIndex(rpv => rpv.id === pv.id), 1);
        });
    }
}
function getRefereeUpgrade(db:any, refereeId: string, day: Date, response:any): Promise<RefereeUpgrade> {
    return db.collection(common.collectionUpgradeCriteria)
        .where('referee.refereeId', '==', refereeId)
        .where('upagrdeStatusDate', '==', day)
        .limit(1)
        .get()
        .then((docs:any) => docs.map((doc:any) => doc.data()))
        .catch((reason:any) => {
            response.send(reason);
            console.log('getRefereeUpgrade(' + refereeId + ', ' + common.date2string(day) + ') => ERROR:' + reason);
            return null;
        });
}

function persistUpgrade(db:any, refereeUpgrade: RefereeUpgrade, response:any): Promise<any> {
    const doc = db.collection(common.collectionUpgradeCriteria).doc();
    refereeUpgrade.id = doc.id;
    return doc.set(refereeUpgrade);
}
function updateUpgrade(db:any, refereeUpgrade: RefereeUpgrade, response:any): Promise<any> {
    const doc = db.collection(common.collectionUpgradeCriteria).doc(refereeUpgrade.id);
    return doc.update(refereeUpgrade);
}
