import { AppSettingsService } from './AppSettingsService';
import { AngularFireFunctions } from '@angular/fire/functions';
import { ConnectedUserService } from './ConnectedUserService';
import { AngularFirestore, Query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ResponseWithData } from './response';
import { Injectable } from '@angular/core';
import { RemotePersistentDataService } from './RemotePersistentDataService';
import { Xp } from '../model/xphistory';
import { ToastController } from '@ionic/angular';
import { User } from '../model/user';

@Injectable()
export class XpService extends RemotePersistentDataService<Xp> {

    constructor(
        appSettingsService: AppSettingsService,
        db: AngularFirestore,
        private connectedUserService: ConnectedUserService,
        private angularFireFunctions: AngularFireFunctions,
        toastController: ToastController
    ) {
        super(appSettingsService, db, toastController);
    }

    getLocalStoragePrefix() {
        return 'xp';
    }

    getPriority(): number {
        return 4;
    }
    protected adjustFieldOnLoad(item: Xp) {
        if (item.days) {
            item.days.forEach((cd) => {
                const d: any = cd.coachingDate;
                if (!(d instanceof Date) ) {
                    cd.coachingDate = d.toDate();
                }
            });
        }
    }

    /** Overide to restrict to the coachings of the user */
    public all(): Observable<ResponseWithData<Xp[]>> {
        return this.query(this.getBaseQueryMyAssessments().orderBy('year', 'desc'), 'default');
    }

    /** Query basis for coaching limiting access to the coachings of the user */
    private getBaseQueryMyAssessments(): Query {
        return this.getBaseQuery(this.connectedUserService.getCurrentUser().id);
    }
    private getBaseQuery(coachId: string): Query {
        return this.getCollectionRef().where('coachId', '==', coachId);
    }

    public searchXps(text: string): Observable<ResponseWithData<Xp[]>> {
        if (text) {
            const texts = text.trim().split(' ');
            return super.filter(this.all(), (xp: Xp) => {
                return texts.filter((txt) =>
                    this.stringContains(text, xp.eventName)
                    ).length > 0;
            });
        } else {
            return this.all();
        }
    }

    findXps(coach: User = null): Observable<ResponseWithData<Xp[]>> {
        const coachId = coach === null ? this.connectedUserService.getCurrentUser().id : coach.id;
        return this.query(this.getBaseQuery(coachId).orderBy('year', 'desc'), 'default');
    }

    sendYearlyXp(coachId: string, year: number) {
        return this.angularFireFunctions.httpsCallable('sendXpReport')({
            coachId,
            year
          });
    }
}
