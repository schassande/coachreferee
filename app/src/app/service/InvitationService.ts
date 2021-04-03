import { DateService } from './DateService';
import { Invitation } from './../model/invitation';
import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { ToastController } from '@ionic/angular';
import { AngularFirestore, Query } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
import { Assessment } from './../model/assessment';
import { Referee } from './../model/user';
import { AppSettingsService } from './AppSettingsService';
import { ConnectedUserService } from './ConnectedUserService';
import { RefereeService } from './RefereeService';
import { RemotePersistentDataService } from './RemotePersistentDataService';
import { ResponseWithData } from './response';

const TIME_SLOT_SEP = ':';
const DATE_SEP = '-';

@Injectable()
export class InvitationService extends RemotePersistentDataService<Invitation> {

    constructor(
        appSettingsService: AppSettingsService,
        db: AngularFirestore,
        protected refereeService: RefereeService,
        private connectedUserService: ConnectedUserService,
        private dateService: DateService,
        private angularFireFunctions: AngularFireFunctions,
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
        return this.queryOne(this.getCollectionRef().where('email', '==', email), 'default');
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
            flatMap( (rinv) => {
                if (rinv.data) { // invitation already exists
                    if (rinv.data.expirationDate.getTime() < new Date().getTime()) {
                        // Postpone the expiration date
                        rinv.data.expirationDate = this.getExpirationDate();
                        return this.save(rinv.data);
                    } else { // invitation is not expired
                        return of(rinv);
                    }
                } else { // there is no invitation for this email => create one
                    const invitation: Invitation = {
                        id: '',
                        creationDate: new Date(),
                        dataStatus: 'NEW',
                        lastUpdate: new Date(),
                        version: 0,
                        expirationDate: this.getExpirationDate(),
                        email,
                        sponsor: this.connectedUserService.getCurrentUser().firstName
                            + ' ' + this.connectedUserService.getCurrentUser().lastName
                    };
                    return this.save(invitation);
                }
            }),
           flatMap( (rinv) => {
               if (rinv.data) {
                return this.angularFireFunctions.httpsCallable('sendInvitation')({ invitationId: rinv.data.id });
               } else {
                return of(rinv);
               }
            })
        );
    }

}
