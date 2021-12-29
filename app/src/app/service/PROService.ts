import { AppSettingsService } from './AppSettingsService';
import { map } from 'rxjs/operators';
import { ConnectedUserService } from './ConnectedUserService';
import { Firestore, query, Query, where } from '@angular/fire/firestore';
import { Observable, forkJoin } from 'rxjs';
import { ResponseWithData } from './response';
import { Injectable } from '@angular/core';
import { RemotePersistentDataService } from './RemotePersistentDataService';
import { PersistentPRO } from './../model/coaching';
import { ToastController } from '@ionic/angular';

@Injectable()
export class PROService extends RemotePersistentDataService<PersistentPRO> {

    constructor(
        appSettingsService: AppSettingsService,
        db: Firestore,
        private connectedUserService: ConnectedUserService,
        toastController: ToastController
    ) {
        super(appSettingsService, db, toastController);
    }

    getLocalStoragePrefix() {
        return 'pro';
    }

    getPriority(): number {
        return 4;
    }

    /** Overide to restrict to the coachings of the user */
    public all(): Observable<ResponseWithData<PersistentPRO[]>> {
        return forkJoin(
            this.query(this.getBaseQueryMyAssessments(), 'default'),
            this.query(this.getBaseQueryPublicAssessments(), 'default')
         ).pipe(
           map((list) => this.mergeObservables(list, true))
         );
    }

    /** Query basis for assessment limiting access to the assessments of the user */
    private getBaseQueryMyAssessments(): Query {
        return query(this.getCollectionRef(), where('coachId', '==', this.connectedUserService.getCurrentUser().id));
    }

    /** Query basis for assessment limiting access to the public assessments */
    private getBaseQueryPublicAssessments(): Query {
        return query(this.getCollectionRef(), where('sharedPublic', '==', true));
    }

    public searchPros(text: string): Observable<ResponseWithData<PersistentPRO[]>> {
        if (text) {
            const texts = text.trim().split(' ');
            return super.filter(this.all(), (pro: PersistentPRO) => {
                return texts.filter((txt) =>
                    this.stringContains(text, pro.problemShortDesc)
                    || this.stringContains(text, pro.problem)
                    || this.stringContains(text, pro.remedy)
                    || this.stringContains(text, pro.outcome)
                    ).length > 0;
            });
        } else {
            return this.all();
        }
    }
}
