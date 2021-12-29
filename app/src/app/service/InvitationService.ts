import { DateService } from './DateService';
import { Invitation } from './../model/invitation';
import { Injectable } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { ToastController } from '@ionic/angular';
import { Firestore, query, Query, where } from '@angular/fire/firestore';
import { from, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { AppSettingsService } from './AppSettingsService';
import { ConnectedUserService } from './ConnectedUserService';
import { RefereeService } from './RefereeService';
import { RemotePersistentDataService } from './RemotePersistentDataService';
import { ResponseWithData } from './response';

@Injectable()
export class InvitationService extends RemotePersistentDataService<Invitation> {

    constructor(
        appSettingsService: AppSettingsService,
        db: Firestore,
        protected refereeService: RefereeService,
        private connectedUserService: ConnectedUserService,
        private dateService: DateService,
        private angularFireFunctions: Functions,
        toastController: ToastController
    ) {
        super(appSettingsService, db, toastController);
    }

    getLocalStoragePrefix() {
        return 'invitation';
    }
    getPriority(): number {
        return 5;
    }

    protected adjustFieldOnLoad(item: Invitation) {
        item.expirationDate = this.adjustDate(item.expirationDate, this.dateService);
    }

    public getByEmail(email: string): Observable<ResponseWithData<Invitation>> {
        if (!email) {
            return of({data: null, error: null});
        }
        return this.queryOne(query(this.getCollectionRef(), where('email', '==', email)));
    }

    public getExpirationDate(): Date {
        const date: Date = new Date();
        date.setDate(date.getDate() + 30);
        return date;
    }

    public invite(email: string): Observable<ResponseWithData<Invitation>> {
        if (!email || email.indexOf('@') < 1) {
            return of({
                data: null as Invitation,
                error: { error: 'wrong email address', errorCode: 1 }});
        }
        return this.getByEmail(email).pipe(
            mergeMap( (rinv) => {
                if (rinv.data) { // invitation already exists
                    if (rinv.data.expirationDate.getTime() < new Date().getTime()) {
                        // Postpone the expiration date
                        rinv.data.expirationDate = this.getExpirationDate();
                        return this.save(rinv.data);
                    } else { // invitation is not expired
                        return of(rinv);
                    }
                } else { // there is no invitation for this email => create one
                    return this.save({
                        id: '',
                        creationDate: new Date(),
                        dataStatus: 'NEW',
                        lastUpdate: new Date(),
                        version: 0,
                        expirationDate: this.getExpirationDate(),
                        email,
                        sponsor: this.connectedUserService.getCurrentUser().firstName
                            + ' ' + this.connectedUserService.getCurrentUser().lastName
                    } as Invitation);
                }
            }),
            mergeMap( (rinv) => {
                if (rinv.data) {
                  return from(
                      httpsCallable(this.angularFireFunctions, 'sendInvitation')({ invitationId: rinv.data.id })
                        .then(() => rinv)
                        .catch(() => rinv)
                    );
                } else {
                  return of(rinv);
                }
             })
        );
    }
}
