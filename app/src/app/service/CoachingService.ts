import { AppSettingsService } from './AppSettingsService';
import { DateService } from './DateService';
import { ConnectedUserService } from './ConnectedUserService';
import { Firestore, query, Query, where } from '@angular/fire/firestore';
import { Referee } from './../model/user';
import { RefereeService } from './RefereeService';
import { ResponseWithData } from './response';
import { Observable, of, forkJoin, from } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { RemotePersistentDataService } from './RemotePersistentDataService';
import { Coaching } from './../model/coaching';
import { ToastController } from '@ionic/angular';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { DataRegion } from '../model/common';
import { ToolService } from './ToolService';
import { UserService } from './UserService';
import { Competition } from '../model/competition';

const TIME_SLOT_SEP = ':';
const DATE_SEP = '-';
export const CSV_HEADER = 'gameId,competition	date,timeSlot,field,category,referee1,referee2,referee3,refereeCoach1,refereeCoach2,refereeCoach3';

@Injectable()
export class CoachingService extends RemotePersistentDataService<Coaching> {

    constructor(
      appSettingsService: AppSettingsService,
      db: Firestore,
      protected refereeService: RefereeService,
      private connectedUserService: ConnectedUserService,
      private angularFireFunctions: Functions,
      private dateService: DateService,
      toastController: ToastController,
      private toolService: ToolService,
      private userService: UserService
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
      return forkJoin([
        this.query(query(this.getBaseQueryMyCoahchings(),
          where('refereeIds', 'array-contains', refereeId))),
        this.query(this.getBaseQuerySharedCoahchings()).pipe(
          map((rcoa) => {
            // query does not support double array contain in where clause
            if (rcoa.data) {
              rcoa.data = rcoa.data.filter((c: Coaching) => c.refereeIds.indexOf(refereeId) > -1);
            }
            return rcoa;
          })
        )
      ]).pipe(map((list) => this.mergeObservables(list)));
    }
    getCoachingByRefereeCompetition(refereeId: string, competitionId: string): Observable<ResponseWithData<Coaching[]>> {
      return forkJoin([
        this.query(query(this.getBaseQueryMyCoahchings(),
          where('refereeIds', 'array-contains', refereeId),
          where('competitionId', '==', competitionId))),
        this.query(this.getBaseQuerySharedCoahchings()).pipe(
          map((rcoa) => {
            // query does not support double array contain in where clause
            if (rcoa.data) {
              rcoa.data = rcoa.data.filter((c: Coaching) => c.refereeIds.indexOf(refereeId) > -1);
            }
            return rcoa;
          })
        )
      ]).pipe(
        map((list) => this.mergeObservables(list, true))
      );
    }
    getCoachingByRefereeCoachCompetition(coachId: string, beginDate: Date, endDate: Date): Observable<ResponseWithData<Coaching[]>> {
      return this.query(query(this.getBaseQuery(),
          where('coachId', '==', coachId),
          where('date', '>=', this.dateService.to00h00(this.adjustDate(beginDate, this.dateService))),
          where('date', '<=', this.dateService.to00h00(this.adjustDate(endDate, this.dateService)))
        ));
    }
    getCoachingByCoachNCompetition(coachId: string, competitionId: string): Observable<ResponseWithData<Coaching[]>> {
      return this.query(query(this.getBaseQuery(),
          where('competitionId', '==', competitionId),
          where('coachId', '==', coachId)
        ));
    }

    public getCoachingByCompetition(competitionId: string): Observable<ResponseWithData<Coaching[]>> {
      return this.query(query(this.getCollectionRef(), where('competitionId', '==', competitionId)));
    }

    /**
     * Overide to restrict to the coachings of the user.
     * Provide option to define the source of the data: 'default' | 'server' | 'cache'
     */
    public all(options: 'default' | 'server' | 'cache' = 'default'): Observable<ResponseWithData<Coaching[]>> {
      return forkJoin([
        this.query(this.getBaseQueryMyCoahchings(), options),
        this.query(this.getBaseQuerySharedCoahchings(), options)
      ]).pipe(
        map((list) => this.mergeObservables(list))
      );
    }

    public allFromAllUsers(beginDate: Date,  endDate: Date, region: DataRegion): Observable<ResponseWithData<Coaching[]>> {
      let q: Query<Coaching> = this.getCollectionRef();
      if (beginDate) {
        q = query(q, where('date', '>=', this.dateService.to00h00(this.adjustDate(beginDate, this.dateService))));
      }
      if (endDate) {
        q = query(q, where('date', '<=', this.dateService.to00h00(this.adjustDate(endDate, this.dateService))));
      }
      if (this.toolService.isValidString(region)) {
        q = query(q, where('region', '==', region));
      }
      return this.query(q, 'server');
    }

    /** Query basis for coaching limiting access to the coachings of the user */
    private getBaseQueryMyCoahchings(): Query {
      return query(this.getCollectionRef(), where('coachId', '==', this.connectedUserService.getCurrentUser().id));
    }

    /** Query basis for coaching limiting access to the coachings of the user */
    private getBaseQuerySharedCoahchings(): Query {
      return query(this.getCollectionRef(), where('sharedWith.users', 'array-contains', this.connectedUserService.getCurrentUser().id));
    }

    public sortCoachings(coachings: Coaching[], reverse: boolean = false): Coaching[] {
        let array: Coaching[] = coachings.sort(this.compareCoaching.bind(this));
        if (reverse) {
            array = array.reverse();
        }
        return array;
    }

    public searchCoachings(text: string, year: number|undefined, 
          options: 'default' | 'server' | 'cache' = 'default'): Observable<ResponseWithData<Coaching[]>> {
        const str = text !== null && text && text.trim().length > 0 ? text.trim() : null;
        const q: Observable<ResponseWithData<Coaching[]>> = year ? this.coachingOfYear(year, options) : this.all(options);
        return str ?
            super.filter(q, (coaching: Coaching) => {
                return this.stringContains(str, coaching.competition)
                || (coaching.referees[0] && this.stringContains(str, coaching.referees[0].refereeShortName))
                || (coaching.referees[1] && this.stringContains(str, coaching.referees[1].refereeShortName))
                || (coaching.referees[2] && this.stringContains(str, coaching.referees[2].refereeShortName))
                || this.stringContains(str, coaching.field)
                || this.stringContains(str, this.getCoachingDateAsString(coaching));
            })
            : q;
    }

    private coachingOfYear(year: number, options: 'default' | 'server' | 'cache' = 'default'): Observable<ResponseWithData<Coaching[]>> {
        const beginDate = this.dateService.to00h00(new Date());
        beginDate.setFullYear(year)
        beginDate.setMonth(0);
        beginDate.setDate(1);
        const endDate = this.dateService.to00h00(new Date());
        endDate.setFullYear(year+1)
        endDate.setMonth(0);
        endDate.setDate(1);
        console.log('coachingOfYear: year='+ year, beginDate, endDate);

        return forkJoin([
          this.query(query(this.getBaseQueryMyCoahchings(), where('date', '>=', beginDate), where('date', '<', endDate)), options),
          this.query(query(this.getBaseQuerySharedCoahchings(), where('date', '>=', beginDate), where('date', '<', endDate)), options),
        ]).pipe(
          map((list) => this.mergeObservables(list))
        );
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
        return this.getDateAsString(coaching.date);
    }
    public getDateAsString(date: Date) {
      return date.getFullYear()
        + DATE_SEP + this.to2Digit(date.getMonth() + 1)
        + DATE_SEP + this.to2Digit(date.getDate());
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
        if (coaching && coaching.referees.length > 0) {
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
      return from(httpsCallable(this.angularFireFunctions, 'sendCoaching')({
        coachingId,
        userId: this.connectedUserService.getCurrentUser().id
      }));
    }
    
    public computeCoachingLists(coachings: Coaching[]): CoachingList[] {
      const lists: CoachingList[] = [];
      let currentIndex = -1;
      coachings.forEach((c: Coaching) => {
        const cd: string = this.getCoachingDateAsString(c);
        if (currentIndex >= 0
            && lists[currentIndex].day === cd
            && lists[currentIndex].competitionName === c.competition) {
          lists[currentIndex].coachings.push(c);
        } else {
          currentIndex ++;
          const today = this.dateService.isToday(c.date);
          lists.push({
            day: cd,
            today,
            competitionName: c.competition,
            coachings : [c],
            visible: today
          });
        }
      });
      return lists;
    }

    public getTimeSlotAsDate(coaching: Coaching): Date {
      const res = this.dateService.to00h00(new Date(coaching.date));
      const timeSlotElems: string[] = coaching.timeSlot.split(TIME_SLOT_SEP);
      res.setHours(Number.parseInt(timeSlotElems[0], 0));
      res.setMinutes(Number.parseInt(timeSlotElems[1], 0));
      return res;
    }

    public exportCoachingAsGames(competitionId: string): Observable<string> {
      return this.getCoachingByCompetition(competitionId).pipe(
        mergeMap(rcoachings => {
          if (!rcoachings.data || rcoachings.data.length === 0) {
            console.log('No coaching for the competition ' + competitionId);
            return of('');
          }
          // console.log(rcoachings.data.length + ' coachings for the competition ' + competitionId);
          // Step 1 : Group coaching by game
          const game2coachings = new Map();
          rcoachings.data.forEach(c => {
            let key = c.importGameId;
            if (!key) {
              key = c.date.getTime() + '-' + c.timeSlot + '-' + c.field;
            }
            let cs: Coaching[] = game2coachings.get(key);
            if (cs) {
              cs.push(c)
            } else {
              game2coachings.set(key, [c]);
            }
          });

          // array of coaching grouped by game
          const css = Array.from(game2coachings.values());

          // Step 2 :  Sort coachings by date, field, timeslot
          css.sort((cs1, cs2) => this.compareCoaching(cs1[0], cs2[0]));
          
          // Step 3 :  Fetch Coaches
          const id2coach = new Map();
          id2coach.set(this.connectedUserService.getCurrentUser().id, this.connectedUserService.getCurrentUser());
          const obs = [of(null)];
          css.forEach((cs: Coaching[]) => {
            cs.forEach(c => {
              let coach = id2coach.get(c.coachId);
              if (coach) {
                console.log('Coach ' + coach.shortName + ' already found.');
              } else {
                obs.push(this.userService.get(c.coachId).pipe(
                  map(ruser => {
                    if (ruser.data) {
                      console.log('Add Coach ' + coach.shortName);
                      id2coach.set(ruser.data.id, ruser.data);
                    }
                  })
                ));
              }
            })
          });

          // Step 4:  compute csv lines
          return forkJoin(obs).pipe(
            map(() => {
              return CSV_HEADER + '\n' + css.map((cs: Coaching[]) => {
                const nbMissingRef = 3 - cs[0].referees.length;
                let missingRef = '';
                for(let i=0; i<nbMissingRef; i++) {
                  missingRef += ',';
                }
                let csv = (cs[0].importGameId ? cs[0].importGameId : '')
                  +  ',' + cs[0].competition
                  +  ',' + this.getCoachingDateAsString(cs[0])
                  +  ',' + cs[0].timeSlot
                  +  ',' + cs[0].field
                  + cs[0].referees.map(ref => ',' + ref.refereeShortName).join('')
                  + missingRef
                  + cs.map(c => {
                    const coach = id2coach.get(c.coachId);
                    return coach ? ',' + coach.shortName : ''; 
                  });
                return csv;
              }).join('\n');    
            })
          );
        })
      );
    }
    public getCsvExemple(competition: Competition) {
      return CSV_HEADER + '\n'
        + '"1","' + competition.name 
        +'","' + this.getDateAsString(competition.date) 
        + '","10:00","1","REF1","REF2","REF3","COACH1","COACH2","COACH3"';
    }
}
export interface CoachingList {
  day: string;
  today: boolean;
  competitionName: string;
  coachings: Coaching[];
  visible: boolean;
}
