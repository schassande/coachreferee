import { AppSettingsService } from './AppSettingsService';
import { DateService } from './DateService';
import { ConnectedUserService } from './ConnectedUserService';
import { AngularFirestore, Query } from '@angular/fire/firestore';
import { Referee } from './../model/user';
import { RefereeService } from './RefereeService';
import { ResponseWithData } from './response';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { RemotePersistentDataService } from './RemotePersistentDataService';
import { Coaching } from './../model/coaching';
import { ToastController } from '@ionic/angular';
import { AngularFireFunctions } from '@angular/fire/functions';
import { DataRegion } from '../model/common';
import { ToolService } from './ToolService';

const TIME_SLOT_SEP = ':';
const DATE_SEP = '-';

@Injectable()
export class CoachingService extends RemotePersistentDataService<Coaching> {

    constructor(
      appSettingsService: AppSettingsService,
      db: AngularFirestore,
      protected refereeService: RefereeService,
      private connectedUserService: ConnectedUserService,
      private angularFireFunctions: AngularFireFunctions,
      private dateService: DateService,
      toastController: ToastController,
      private toolService: ToolService
    ) {
        super(appSettingsService, db, toastController);
    }

    getLocalStoragePrefix() {
        return 'coaching';
    }

    getPriority(): number {
        return 5;
    }
    protected adjustFieldOnLoad(item: Coaching) {
      const d: any = item.date;
      if (!(d instanceof Date) ) {
        item.date = d.toDate();
      }
    }

    getCoachingByReferee(refereeId: string): Observable<ResponseWithData<Coaching[]>> {
      return forkJoin(
        this.query(this.getBaseQueryMyCoahchings()
          .where('refereeIds', 'array-contains', refereeId), 'default'),
        this.query(this.getBaseQuerySharedCoahchings(), 'default').pipe(
          map((rcoa) => {
            // query does not support double array contain in where clause
            if (rcoa.data) {
              rcoa.data = rcoa.data.filter((c: Coaching) => c.refereeIds.indexOf(refereeId) > -1);
            }
            return rcoa;
          })
        )
     ).pipe(
       map((list) => this.mergeObservables(list))
     );
    }
    getCoachingByRefereeCompetition(refereeId: string, competitionId: string): Observable<ResponseWithData<Coaching[]>> {
      return forkJoin(
        this.query(this.getBaseQueryMyCoahchings()
          .where('refereeIds', 'array-contains', refereeId).where('competitionId', '==', competitionId), 'default'),
        this.query(this.getBaseQuerySharedCoahchings(), 'default').pipe(
          map((rcoa) => {
            // query does not support double array contain in where clause
            if (rcoa.data) {
              rcoa.data = rcoa.data.filter((c: Coaching) => c.refereeIds.indexOf(refereeId) > -1);
            }
            return rcoa;
          })
        )
     ).pipe(
       map((list) => this.mergeObservables(list, true))
     );
    }
    public getCoachingByCompetition(competitionId: string): Observable<ResponseWithData<Coaching[]>> {
      return this.query( this.getCollectionRef().where('competitionId', '==', competitionId), 'default');
    }

    /**
     * Overide to restrict to the coachings of the user.
     * Provide option to define the source of the data: 'default' | 'server' | 'cache'
     */
    public all(options: 'default' | 'server' | 'cache' = 'default'): Observable<ResponseWithData<Coaching[]>> {
      return forkJoin(
        this.query(this.getBaseQueryMyCoahchings(), options),
        this.query(this.getBaseQuerySharedCoahchings(), options)
      ).pipe(
        map((list) => this.mergeObservables(list))
      );
    }

    public allFromAllUsers(beginDate: Date,  endDate: Date, region: DataRegion): Observable<ResponseWithData<Coaching[]>> {
      let q: Query<Coaching> = this.getCollectionRef();
      if (beginDate) {
        q = q.where('date', '>=', this.dateService.to00h00(this.adjustDate(beginDate, this.dateService)));
      }
      if (endDate) {
        q = q.where('date', '<=', this.dateService.to00h00(this.adjustDate(endDate, this.dateService)));
      }
      if (this.toolService.isValidString(region)) {
        q = q.where('region', '==', region);
      }
      return this.query(q, 'server');
    }

    /** Query basis for coaching limiting access to the coachings of the user */
    private getBaseQueryMyCoahchings(): Query {
      return this.getCollectionRef().where('coachId', '==', this.connectedUserService.getCurrentUser().id);
    }

    /** Query basis for coaching limiting access to the coachings of the user */
    private getBaseQuerySharedCoahchings(): Query {
      return this.getCollectionRef().where('sharedWith.users', 'array-contains', this.connectedUserService.getCurrentUser().id);
    }

    public sortCoachings(coachings: Coaching[], reverse: boolean = false): Coaching[] {
        let array: Coaching[] = coachings.sort(this.compareCoaching.bind(this));
        if (reverse) {
            array = array.reverse();
        }
        return array;
    }

    public searchCoachings(text: string, options: 'default' | 'server' | 'cache' = 'default'): Observable<ResponseWithData<Coaching[]>> {
        const str = text !== null && text && text.trim().length > 0 ? text.trim() : null;
        return str ?
            super.filter(this.all(options), (coaching: Coaching) => {
                return this.stringContains(str, coaching.competition)
                || (coaching.referees[0] && this.stringContains(str, coaching.referees[0].refereeShortName))
                || (coaching.referees[1] && this.stringContains(str, coaching.referees[1].refereeShortName))
                || (coaching.referees[2] && this.stringContains(str, coaching.referees[2].refereeShortName))
                || this.stringContains(str, coaching.field)
                || this.stringContains(str, this.getCoachingDateAsString(coaching));
            })
            : this.all(options);
    }

    public compareCoaching(coaching1: Coaching, coaching2: Coaching): number {
      let res = 0;
      if (res === 0) {
        // Compare date
        res = this.dateService.compareDate(coaching1.date, coaching2.date);
      }
      if (res === 0) {
        // compare competition name
        res = coaching1.competition.localeCompare(coaching2.competition);
      }
      if (res === 0) {
        // Compare timeslot
        const timeSlotElems1: string[] = coaching1.timeSlot.split(TIME_SLOT_SEP);
        const timeSlotElems2: string[] = coaching2.timeSlot.split(TIME_SLOT_SEP);
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
        res = Number.parseInt(coaching1.field, 0) - Number.parseInt(coaching2.field, 0);
      }
      return res;
    }
    public computeTimeSlot(ts: Date): string {
        return this.to2Digit(ts.getHours()) + TIME_SLOT_SEP + this.to2Digit(ts.getMinutes());
    }
    public to2Digit(nb: number): string {
        return (nb < 10 ? '0' : '') + nb;
    }
    public getCoachingDateAsString(coaching: Coaching) {
        return coaching.date.getFullYear()
          + DATE_SEP + this.to2Digit(coaching.date.getMonth() + 1)
          + DATE_SEP + this.to2Digit(coaching.date.getDate());
    }
    public setStringDate(coaching: Coaching, dateStr: string) {
        const elements = dateStr.split(DATE_SEP);
        if (!coaching.date) {
            coaching.date = new Date();
        }
        coaching.date.setFullYear(Number.parseInt(elements[0], 0));
        coaching.date.setMonth(Number.parseInt(elements[1], 0) - 1);
        coaching.date.setDate(Number.parseInt(elements[2], 0));
    }

    public loadingReferees(coaching: Coaching, id2referee: Map<string, Referee>): Observable<any> {
        if (coaching) {
          const obs: Observable<Referee>[] = [];
          coaching.referees.forEach((ref) => {
            if (ref.refereeId !== null) {
              obs.push(this.refereeService.get(ref.refereeId).pipe(
                    map((res: ResponseWithData<Referee>) => {
                        if (res.data) {
                            id2referee.set(res.data.id, res.data);
                        } else {
                            console.error('Referee ' + ref.refereeId + ' does not exist !');
                        }
                        return res.data;
                    }))
                 );
            }
          });
          return forkJoin(obs);
        }  else {
          return of('');
        }
    }

    public sendCoachingByEmail(coachingId: string): Observable<any> {
      return this.angularFireFunctions.httpsCallable('sendCoaching')({
        coachingId,
        userId: this.connectedUserService.getCurrentUser().id
      });
    }
}
