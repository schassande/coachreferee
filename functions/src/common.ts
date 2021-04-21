import { PersistentData } from './model/common';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import { User }  from './model/user';

export const collectionCoaching = 'coaching';
export const collectionAssessment = 'assessment';
export const collectionUser = 'user';
export const collectionInvitation = 'invitation';
// export const collectionReferee = 'referee';
export const collectionSkillprofile = 'skillprofile';
export const collectionCompetitionDayPanelVote = 'competitionDayPanelVote';
export const collectionCompetitionDayRefereeCoachVote = 'competitionDayRefereeCoachVote';
export const collectionUpgradeCriteria = 'upgradeCriteria';
export const DATE_SEP = '-';

export function toFileName(str: String): string {
    return str.replace(',','').replace(':','').replace(' ', '_') + '.html';
}
export function to2Digit(nb: number): string {
    return (nb < 10 ? '0' : '') + nb;
}
export function date2string(aDate: Date) {
    if (!aDate) {
      return 'error';
    }
    return aDate.getFullYear()
      + DATE_SEP + to2Digit(aDate.getMonth() + 1)
      + DATE_SEP + to2Digit(aDate.getDate());
}
export function string2date(dateStr: string, aDate: Date|null): Date {
    const elements = dateStr.split(DATE_SEP);
    let res = aDate;
    if (!res) {
        res = new Date();
    }
    res.setFullYear(Number.parseInt(elements[0], 0));
    res.setMonth(Number.parseInt(elements[1], 0) - 1);
    res.setDate(Number.parseInt(elements[2], 0));
    return res;
}
export function loadFromDb(db:any, collection: string, id: string, response:any): Promise<PersistentData|null> {
    return db.collection(collection).doc(id).get()
        .then( (doc:DocumentSnapshot) => {
            if (doc.exists) {
                const data = doc.data() as PersistentData;
                data.id = id;
                console.log('loadFromDb(' + collection +', ' + id + ') => ' + data);
                return data;
            } else {
                console.log('loadFromDb(' + collection +', ' + id + ') => null');
                return null;
            }
        }).catch((reason:any) => {
            response.send(reason);
            console.log('loadFromDb(' + collection +', ' + id + ') => ERROR:' + reason);
            return null;
        });
}

export async function loadUser(db:any, userId: string, response: any): Promise<User> {
    const user: User = await loadFromDb(db, collectionUser, userId, response) as User;
    return user;
}
export function to00h00(day: Date): Date {
    day.setUTCMinutes(0);
    day.setUTCSeconds(0);
    day.setUTCHours(0);
    day.setUTCMilliseconds(0);
    return day;
}
export function adjustDate(d: any): Date {
    // console.log('adjustDate: type=' + (typeof d) + ', instanceof Date=' + (d instanceof Date) + ', value=' + JSON.stringify(d));
    if (d && !(d instanceof Date) ) {
        if (typeof d === 'string') {
            return string2date(d, null);
        } else {
            return d.toDate();
        }
    } else {
        return d as Date;
    }
}

