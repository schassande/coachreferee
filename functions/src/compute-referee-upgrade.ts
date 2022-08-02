import * as common          from './common';
import { CoachRef, CompetitionCategory, CompetitionRef } from './model/competition';
import { CompetitionDayPanelVote, UpgradeCriteria, RefereeUpgrade } from './model/upgrade';
import { RefereeLevel, User }  from './model/user';
const moment = require('moment');

/** 
1.Load panel votes from last 12 months
2.Sort panel votes by date (but Abstain at the end)
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

    let ru: RefereeUpgrade|null = await compute(day, referee, upgradeCriteria, ctx, response);
    if (ru) {
        ru = await persistUpgrade(ctx.db, ru, response)
    }
    response.send({ data: ru}); 
}

async function compute(day: Date, referee: User, upgradeCriteria: UpgradeCriteria, ctx: any, response:any): Promise<RefereeUpgrade|null> {
    const beginDate = moment(day.getTime()).subtract(upgradeCriteria.dayVoteDuration, 'months').toDate();

    const data: WorkingData = newWorkingData();
    data.restDayVotes = await findPanelVotes(ctx, referee, beginDate, day, referee.referee.nextRefereeLevel);
    if (data.restDayVotes.length === 0) {
        console.log('No panelVotes found');
        return null;
    }
    const competitionId: string = data.restDayVotes[0].competitionRef.competitionId;
    const lastDay = data.restDayVotes.length > 0 ? data.restDayVotes[0].day : day;
    console.log('competitionId=' + competitionId + ', lastDay=' + lastDay);
    if (!competitionId) {
        console.log('ERROR: CompetitionId is missing')
        return null;
    }

    const allDays: CompetitionDayPanelVote[] = data.restDayVotes.map(e=> e);
    console.log('panelVotes=' + JSON.stringify(allDays));

    extractDays(upgradeCriteria, data);
    console.log('AFTER extractDays, workingData=' + JSON.stringify(data));

    computeCriteria(upgradeCriteria, data);
    console.log('AFTER computeCriteria, workingData=' + JSON.stringify(data));

    const upgradeDecision = computeUpgradeStatus(data, upgradeCriteria);
    console.log('upgradeDecision=' + upgradeDecision);

    // get the existing upgrade, in order to upgrade it. Otherwise a new one will be created.
    const existingUpgrade: RefereeUpgrade|null = await getRefereeUpgrade(ctx.db, referee.id, lastDay, response);
    const id = existingUpgrade ? existingUpgrade.id : '';

    // build the upgrade from all data
    return {
        id,
        version: 0,
        creationDate: new Date(),
        lastUpdate: new Date(),
        dataStatus: 'CLEAN',
        referee: { refereeId: referee.id, refereeShortName: referee.shortName },
        upgradeLevel: upgradeCriteria.upgradeLevel,
        decision: upgradeDecision ? 'Yes' : 'No',
        decisionDate: common.to00h00(lastDay),
        competitionId,
        upgradeStatus: existingUpgrade ? existingUpgrade.upgradeStatus : 'DECIDED',
        multiDayCompetitionRefs: data.multiDayCompetitionRefs,
        yesRefereeCoaches: data.yesCoach,
        c3PanelVotes: data.c3dayVotes,
        c4PanelVotes: data.c4dayVotes,
        c5PanelVotes: data.c5dayVotes,
        upgradeCriteriaId: upgradeCriteria.id,
        allPanelVotes: allDays
    };
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
    /* Working var: the day can be used to meet the criteria */
    restDayVotes : CompetitionDayPanelVote[];
    /** the day/vote retained for the C3+ categories */
    c3dayVotes: CompetitionDayPanelVote[];
    /** the day/vote retained for the C4+ categories */
    c4dayVotes: CompetitionDayPanelVote[];
    /** the day/vote retained for the C5 category */
    c5dayVotes: CompetitionDayPanelVote[];
    /** Number of Yes C3+ days */
    c3Nb: boolean;
    /** Number of Yes C4+ days */
    c4Nb: boolean;
    /** Number of Yes C5 days */
    c5Nb: boolean;
    /** does the referee has enough number of days in the global window */
    windowSizeCheck: boolean;
    /** does the referee has enough number of yes days in the global window */
    globalNbYes: boolean;
    /** does the referee has enough number of yes days in the C3+ window */
    c3NbYes: boolean;
    /** does the referee has enough number of yes days in the C4 window */
    c4NbYes: boolean;
    /** does the referee has enough number of yes days in the C5 window */
    c5NbYes: boolean;
    /** The list of referee coach voting Yes */
    yesCoach: CoachRef[];
    /** the list of the multiday competition where the refere got a yes */
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
        throw new Error('Referee is not an allowed referee in the upgrade application.');
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
    // ignore abstein days
    const filteredPanelVotes: CompetitionDayPanelVote[] = panelVotes; //.filter(pv => pv.vote !== 'Abstein');
    
    console.log('findPanelVotes(' + referee.id + ',' + common.date2string(beginDate) + ',' + common.date2string(endDate) + '):' + JSON.stringify(filteredPanelVotes));
    return filteredPanelVotes;
}

async function loadPanelVotesByRefereeFromDB(db:any, refereeId: string, beginDate: Date, endDate: Date, upgradeLevel: RefereeLevel): Promise<CompetitionDayPanelVote[]> {
    console.log('loadPanelVotesByRefereeFromDB(' + refereeId + ',' + common.date2string(beginDate) + ',' + common.date2string(endDate) + ', ' + upgradeLevel + ')');
    const querySnapshot = await  db.collection(common.collectionCompetitionDayPanelVote)
        .where('referee.refereeId', '==', refereeId)
        .where('upgradeLevel', '==', upgradeLevel)
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
    // firstly sort days by putting Abstain days at the end. 
    // this ordering is done in memory because no database request permits to do it.
    // Why sorting Abstain day at the end: 
    // The Abstain day must not be a reason to refuse a badge. But it could help
    // to match the windows size globally and for each category.
    // ERC decision, June 2022
    data.restDayVotes.sort((a, b) => {
       if (a.vote === 'Abstein' && b.vote !== 'Abstein') {
       // If the result is positive b is sorted before a. => b,a
       return 1;
       }
       if (a.vote !== 'Abstein' && b.vote === 'Abstein') {
       // If the result is negative a is sorted before b. => a,b
       return -1;
       }
       // sort by the reverse day
       return b.day.getTime() - a.day.getTime();
    });
    // Second, extract days depending on their category compatibility. data.restDayVotes is updated at each step
    data.c5dayVotes = extractDaysOfLevel(upgradeCriteria.c5DaysRequired, data.restDayVotes, 'C5');
    data.c4dayVotes = extractDaysOfLevel(upgradeCriteria.c4DaysRequired, data.restDayVotes, 'C5', 'C4');
    data.c3dayVotes = extractDaysOfLevel(upgradeCriteria.c3DaysRequired, data.restDayVotes, 'C5', 'C4', 'C3');
}

/**
 * Extracts the required number of compatible days from an array
 * @param cXDaysRequired is the number of required day
 * @param restDayVotes is the array of available days. This array content is changed by the method. 
 *                     The extract elements are removed from this array.
 * @param categories is the list of the compatible category
 * @returns the extracted days.
 */
function extractDaysOfLevel(cXDaysRequired: number, 
                            restDayVotes: CompetitionDayPanelVote[],
                            ...categories: CompetitionCategory[]): CompetitionDayPanelVote[] {
    if (cXDaysRequired > 0) {
        // 1 - get votes with the right competition level
        let cXdayVotes = restDayVotes.filter(
            pv => categories.filter((c:CompetitionCategory) => c === pv.competitionCategory).length > 0);

        // 2 - Retain only the required number
        cXdayVotes = cXdayVotes.slice(0, cXDaysRequired);

        //3 - Remove the retained days from the rest
        removeElementsFrom(cXdayVotes, restDayVotes);
    }
    return [];
}
/**
 * Removes all elements containing in 'elementsToRemove', from the array 'ar'.
 * @param elementsToRemove is the list of the elements to remove from the array ar
 * @param ar is the array where the elements must be removed. It must not contain duplicated values.
 */
function removeElementsFrom(elementsToRemove: CompetitionDayPanelVote[], ar: CompetitionDayPanelVote[]) {
    elementsToRemove.forEach(pv => {
        ar.splice(ar.findIndex(rpv => rpv.id === pv.id), 1);
    });
}
/**
 * Computes if the referee meets the criteria of the level.
 * 
 * @param upgradeCriteria the criteria of the level
 * @param data the data of the referee
 */
function computeCriteria(upgradeCriteria: UpgradeCriteria, data: WorkingData) {
    data.windowSizeCheck = (data.c5dayVotes.length + data.c4dayVotes.length + data.c3dayVotes.length) === upgradeCriteria.daysRequired;

    const c3Yes = data.c3dayVotes.filter(v => v.vote === 'Yes').length;
    const c4Yes = data.c4dayVotes.filter(v => v.vote === 'Yes').length;
    const c5Yes = data.c5dayVotes.filter(v => v.vote === 'Yes').length;
    data.c3NbYes = c3Yes >= upgradeCriteria.c3YesRequired;
    data.c4NbYes = c4Yes >= upgradeCriteria.c4YesRequired;
    data.c5NbYes = c5Yes >= upgradeCriteria.c5YesRequired;
    data.globalNbYes = (c3Yes + c4Yes + c5Yes) >= upgradeCriteria.totalYesRequired;

    data.c5Nb = data.c5dayVotes.length >= upgradeCriteria.c5DaysRequired;
    data.c4Nb = data.c4dayVotes.length >= upgradeCriteria.c4DaysRequired;
    data.c3Nb = data.c3dayVotes.length >= upgradeCriteria.c3DaysRequired;

    // compute a set of the referee coach said Yes: data.yesCoach
    const retainVotes = data.c3dayVotes.concat(data.c4dayVotes).concat(data.c5dayVotes);
    retainVotes.filter(v => v.vote === 'Yes')
        .forEach((v => v.yesCoaches.forEach(c => common.addToSetById(data.yesCoach, c, 'coachId'))));

    // compute a set of the multiday competitions: data.multiDayCompetitionRefs
    data.multiDayCompetitionRefs = [];
    retainVotes.filter(v => v.isMultiDayCompetition).map(v => v.competitionRef)
        .forEach(cr => common.addToSetById(data.multiDayCompetitionRefs, cr, 'competitionId'));


}
async function getRefereeUpgrade(db:any, refereeId: string, day: Date, response:any): Promise<RefereeUpgrade|null> {
    console.log('getRefereeUpgrade(' + refereeId + ', ' + day + '): ' + day.getTime());
    const querySnapshot = await db.collection(common.collectionRefereeUpgrade)
        .where('referee.refereeId', '==', refereeId)
        .where('decisionDate', '==', day)
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
    }
    return item;
}
async function persistUpgrade(db:any, item: RefereeUpgrade, response:any): Promise<RefereeUpgrade> {
    const update = item.id && item.id.length > 0;
    console.log('BEFORE ' + (update?'update':'new') +': RefereeUpgrade=' + JSON.stringify(item));
    if (update) {
        const doc = await db.collection(common.collectionRefereeUpgrade).doc(item.id);
        await doc.update(item);
    } else {
        const doc = await db.collection(common.collectionRefereeUpgrade).add(item);
        item.id = doc.id;
        console.log('refereeUpgrade has now an id: ' + item.id);
        await doc.set(item);
    }    
    console.log('AFTER ' + (update?'update':'new') +': RefereeUpgrade=' + JSON.stringify(item));
    return item;
}
