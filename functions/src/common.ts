import { PersistentData } from './model/common';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import { Referee, User }  from './model/user';

export const collectionCoaching = 'coaching';
export const collectionAssessment = 'assessment';
export const collectionUser = 'user';
export const collectionInvitation = 'invitation';
export const collectionReferee = 'referee';
export const collectionSkillprofile = 'skillprofile';
export const DATE_SEP = '-';

export function toFileName(str: String): string {
    return str.replace(',','').replace(':','').replace(' ', '_') + '.html';
}
export function to2Digit(nb: number): string {
    return (nb < 10 ? '0' : '') + nb;
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
export async function loadReferee(db:any, refereeId: string, response: any): Promise<Referee> {
    const referee: Referee = await loadFromDb(db, collectionReferee, refereeId, response) as Referee;
    return referee;
}