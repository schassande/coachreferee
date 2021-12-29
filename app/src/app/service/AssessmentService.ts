import { AppSettingsService } from './AppSettingsService';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { ConnectedUserService } from './ConnectedUserService';
import { Firestore, query, Query, where } from '@angular/fire/firestore';
import { RefereeService } from './RefereeService';
import { Referee } from './../model/user';
import { Response, ResponseWithData } from './response';
import { Injectable } from '@angular/core';
import { RemotePersistentDataService } from './RemotePersistentDataService';
import { Assessment } from './../model/assessment';
import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';

const TIME_SLOT_SEP = ':';
const DATE_SEP = '-';

@Injectable()
export class AssessmentService extends RemotePersistentDataService<Assessment> {

    /** The current edited assessment */
    public currentAssessment: Assessment = null;

    constructor(
        appSettingsService: AppSettingsService,
        db: Firestore,
        protected refereeService: RefereeService,
        private connectedUserService: ConnectedUserService,
        private angularFireFunctions: Functions,
        toastController: ToastController
    ) {
        super(appSettingsService, db, toastController);
    }

    getLocalStoragePrefix() {
        return 'assessment';
    }
    getPriority(): number {
        return 5;
    }

    protected adjustFieldOnLoad(item: Assessment) {
        const d: any = item.date;
        if (!(d instanceof Date) ) {
            item.date = d.toDate();
        }
        if (item.competitionId === undefined) {
            item.competitionId = '';
        }
    }

    getAssessmentByReferee(refereeId: string): Observable<ResponseWithData<Assessment[]>> {
        return this.query(query(this.getBaseQueryMyAssessments(), where('refereeId', '==', refereeId)));
    }

    /** Overide to restrict to the coachings of the user */
    public all(): Observable<ResponseWithData<Assessment[]>> {
        return this.query(this.getBaseQueryMyAssessments());
    }

    /** Query basis for coaching limiting access to the coachings of the user */
    private getBaseQueryMyAssessments(): Query {
        return query(this.getCollectionRef(), where('coachId', '==', this.connectedUserService.getCurrentUser().id));
    }
    public sortAssessments(assessments: Assessment[], reverse: boolean = false): Assessment[] {
        let array: Assessment[] = assessments.sort(this.compareAssessment.bind(this));
        if (reverse) {
            array = array.reverse();
        }
        return array;
    }

    public searchAssessments(text: string): Observable<ResponseWithData<Assessment[]>> {
        const str = text !== null && text && text.trim().length > 0 ? text.trim() : null;
        return str
            ?  super.filter(this.all(), (assessment: Assessment) => {
                return this.stringContains(str, assessment.competition)
                        || this.stringContains(str, assessment.refereeShortName)
                        || this.stringContains(str, assessment.profileName)
                        || this.stringContains(str, assessment.field)
                        || this.stringContains(str, this.getAssessmentDateAsString(assessment));
                })
            : this.all();
    }

    public compareDate(day1: Date, day2: Date): number {
        // Compare date
        let res: number = day1.getFullYear() - day2.getFullYear();
        if (res === 0) {
        res = day1.getMonth() - day2.getMonth();
        }
        if (res === 0) {
        res = day1.getDate() - day2.getDate();
        }
        return res;
    }
    public compareAssessment(assessment1: Assessment, assessment2: Assessment): number {
        let res = 0;
        if (res === 0) {
          // Compare date
          res = this.compareDate(assessment1.date, assessment2.date);
        }
        if (res === 0) {
            // compare competition name
            res = assessment1.competition.localeCompare(assessment2.competition);
        }
        if (res === 0) {
          // Compare timeslot
          const timeSlotElems1: string[] = assessment1.timeSlot.split(TIME_SLOT_SEP);
          const timeSlotElems2: string[] = assessment2.timeSlot.split(TIME_SLOT_SEP);
          const h1 = Number.parseInt(timeSlotElems1[0], 0);
          const h2 = Number.parseInt(timeSlotElems2[0], 0);
          res = h1 - h2;

          if (res === 0) {
            const m1 = Number.parseInt(timeSlotElems1[1], 0);
            const m2 = Number.parseInt(timeSlotElems2[1], 0);
            res = m1 - m2;
          }
        }
        if (res === 0) {
          // Compare field
          res = Number.parseInt(assessment1.field, 0) - Number.parseInt(assessment2.field, 0);
        }
        return res;
    }
    public computeTimeSlot(ts: Date): string {
        return this.to2Digit(ts.getHours()) + TIME_SLOT_SEP + this.to2Digit(ts.getMinutes());
    }
    public to2Digit(nb: number): string {
        return (nb < 10 ? '0' : '') + nb;
    }
    public getAssessmentDateAsString(assessment: Assessment) {
        return assessment.date.getFullYear()
          + DATE_SEP + this.to2Digit(assessment.date.getMonth() + 1)
          + DATE_SEP + this.to2Digit(assessment.date.getDate());
    }
    public setStringDate(assessment: Assessment, dateStr: string) {
        const elements = dateStr.split(DATE_SEP);
        if (!assessment.date) {
            assessment.date = new Date();
        }
        assessment.date.setFullYear(Number.parseInt(elements[0], 0));
        assessment.date.setMonth(Number.parseInt(elements[1], 0) - 1);
        assessment.date.setDate(Number.parseInt(elements[2], 0));
    }

    public loadingReferees(assessment: Assessment, id2referee: Map<string, Referee>): Observable<string> {
        if (assessment && assessment.refereeId && assessment.refereeId.trim().length > 0) {
            return this.refereeService.get(assessment.refereeId).pipe(
                map((res: ResponseWithData<Referee>) => {
                if (res.data) {
                    id2referee.set(res.data.id, res.data);
                } else {
                    console.error('Referee ' + assessment.refereeId + ' does not exist !');
                }
                return '';
            }));
        }  else {
            return of('');
        }
    }

    public sendAssessmentByEmail(assessmentId: string, skillProfileId: string, refereeId: string): Observable<any> {
        return from(httpsCallable(this.angularFireFunctions, 'sendAssessment')({
          assessmentId,
          skillProfileId,
          refereeId,
          userId: this.connectedUserService.getCurrentUser().id
        })
        .then(() => { return {}; } )
        .catch(err => { return { error: err}; }));
      }
}
