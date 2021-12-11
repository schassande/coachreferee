import * as common from './common';
import { CompetitionDayVote, RefereeUpgrade } from './model/upgrade';
import { User }  from './model/user';
const CSV_SEP: string = ',';

/** 
 */
export async function func(request:any, response:any, ctx:any):Promise<any> {
    const refereeIds: string[] = request.body.data.refereeIds;
    const day = common.string2date(request.body.data.day, new Date());

    let csv = getCsvHeader();
    Promise.all(refereeIds.map(async refereeId => {
        const referee: User = await loadReferee(refereeId, response, ctx);
        if (!referee || !referee.referee || !referee.referee.nextRefereeLevel 
            || referee.applications.filter(ar => ar.name === 'Upgrade' && ar.role === 'REFEREE').length === 0) {
            console.log('Referee ' + refereeId + ' ignored');
            return;
        }
        let ru: RefereeUpgrade|null = await getRefereeUpgrade(ctx.db, refereeId, day, response);
        if (ru && ru.upgradeLevel !== referee.referee.nextRefereeLevel) {
            ru = null;
        }
        const csvLine: string = await getCsvLine(referee, ru, ctx, response);
        console.log('Referee ' + refereeId + ':' + csvLine);
        csv = csv + '\n' + csvLine
    })).then(() => {
        console.log('csv file:\n' + csv);
        response.status(200).send({data: csv})
    }).catch((err) => {
        response.status(500).send(err);
    });
}

async function loadReferee(refereeId:string, response:any, ctx:any): Promise<User> {
    return await common.loadFromDb(ctx.db, common.collectionUser, refereeId, response) as User;
}
async function getRefereeUpgrade(db:any, refereeId: string, day: Date, response:any): Promise<RefereeUpgrade|null> {
    console.log('getRefereeUpgrade(' + refereeId + ', ' + day + '): ' + day.getTime());
    const querySnapshot = await db.collection(common.collectionRefereeUpgrade)
        .where('referee.refereeId', '==', refereeId)
        .where('decisionDate', '<=', day)
        .orderBy('decisionDate', 'desc')
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
function getCsvHeader(): string {
    return 'First Name' 
    + CSV_SEP + 'Last Name' 
    + CSV_SEP + 'Short Name' 
    + CSV_SEP + 'Current Level' 
    + CSV_SEP + 'Upgrade Level' 
    + CSV_SEP + 'Referee Category' 
    + CSV_SEP + 'Status date' 
    + CSV_SEP + 'Number of competition day' 
    + CSV_SEP + 'Number of yes days' 
    + CSV_SEP + 'Number of yes coach'
    + headerToColumn('C5', 3)
    + headerToColumn('C4', 4)
    + headerToColumn('C3', 3)
    + CSV_SEP + 'Upgrade Id';
}
function getCsvLine(referee: User, ru: RefereeUpgrade|null, ctx:any, response:any): string {
    const str =  ''
        + referee.firstName // First Name
        + CSV_SEP + referee.lastName // Last Name
        + CSV_SEP + referee.shortName // Short Name 
        + CSV_SEP + referee.referee.refereeLevel // Current Level 
        + CSV_SEP + referee.referee.nextRefereeLevel // Upgrade Level
        + CSV_SEP + referee.referee.refereeCategory // Referee Category
        ;
    if (ru) {
        return str
            + CSV_SEP + common.date2string(ru.decisionDate) // Status date
            + CSV_SEP + (ru.c5PanelVotes.length  + ru.c4PanelVotes.length + ru.c3PanelVotes.length) // Number of competition day 
            + CSV_SEP + (ru.c5PanelVotes.filter(v => v.vote === 'Yes').length 
                + ru.c4PanelVotes.filter(v => v.vote === 'Yes').length
                + ru.c3PanelVotes.filter(v => v.vote === 'Yes').length)
                // Number of yes days
            + CSV_SEP + ru.yesRefereeCoaches.length // Number of yes coach
            + (ru.upgradeLevel === 'EURO_5'
                ? votesToColumn(ru.c5PanelVotes, 3)
                : votesToColumn(null, 3)) // C5 days
            + (ru.upgradeLevel === 'EURO_5' || ru.upgradeLevel === 'EURO_4'
                ? votesToColumn(ru.c4PanelVotes, 4) 
                : votesToColumn(null, 4)) // C4 days
            + votesToColumn(ru.c3PanelVotes, 3) // C3 days
            + CSV_SEP + ru.id; // Upgrade Id
    } else {
        return str 
            + CSV_SEP // Status date
            + CSV_SEP + 0 // Number of competition day 
            + CSV_SEP + 0 // Number of yes days
            + CSV_SEP + 0 // Number of yes coach
            + votesToColumn(null, 3) // C5 days
            + votesToColumn(null, 4) // C4 days
            + votesToColumn(null, 3) // C3 days
            + CSV_SEP; // Upgrade Id
    }
}
function headerToColumn(categoryName:string, nbVote: number): string {
    let str = CSV_SEP + '"' + categoryName + ' days count"';
    for(let i = 0; i < nbVote; i++) {
        str = str + CSV_SEP + '"' + categoryName + ' D' + (i+1) + ' Date"';
        str = str + CSV_SEP + '"' + categoryName + ' D' + (i+1) + ' Competition"';
        str = str + CSV_SEP + '"' + categoryName + ' D' + (i+1) + ' Vote"';
    }
    return str;
}
function votesToColumn(votes: CompetitionDayVote[]|null, nbVote: number): string {
    let str = CSV_SEP + (votes ? votes.length : 0);
    for(let i = 0; i < nbVote; i++) {
        if (votes && i < votes.length) {
            str = str + voteToColumn(votes[i]);
        } else {
            str = str + voteToColumn(null);
        }
    }
    return str;
}
function voteToColumn(vote: CompetitionDayVote|null): string {
    if (vote) {
        return CSV_SEP + '"' + common.date2string(vote.day) + '"'
            + CSV_SEP + '"' + vote.competitionRef.competitionName + '"'
            + CSV_SEP + '"' + vote.vote + '"';
    } else {
        return CSV_SEP + CSV_SEP + CSV_SEP;
    }
}
