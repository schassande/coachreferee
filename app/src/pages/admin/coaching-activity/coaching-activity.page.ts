import { UserService } from './../../../app/service/UserService';
import { DateService } from './../../../app/service/DateService';
import { Coaching } from './../../../app/model/coaching';
import { CoachingService } from './../../../app/service/CoachingService';
import { Component, OnInit } from '@angular/core';
import { map, mergeMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { DataRegion } from 'src/app/model/common';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-coaching-activity',
  templateUrl: './coaching-activity.page.html',
  styleUrls: ['./coaching-activity.page.scss'],
})
export class CoachingActivityPage implements OnInit {

  beginDate: Date = null;
  endDate: Date = null;
  region: DataRegion = null;

  labels: string[] = null;
  nbCoachings: number[] = null;
  nbUsers: number[] = null;
  dataReady = false;
  users: string[];
  coachingByUsers: number[];
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: { min: 0 }
    },
    plugins: {
      legend: {
        display: false,
      }
    }
  };
  
  constructor(
    private coachingService: CoachingService,
    public dateService: DateService,
    private userService: UserService
  ) { }

  ngOnInit() {
    const b = new Date();
    b.setMonth(0);
    b.setDate(1);
    b.setFullYear(b.getFullYear() - 1);
    this.beginDate = b;
    this.endDate = new Date();
    this.loadData();
  }
  get beginD() {
    return this.dateService.date2string(this.beginDate);
  }
  set beginD(dateStr: string) {
    this.beginDate = this.dateService.string2date(dateStr, this.beginDate);
  }
  get endD() {
    return this.dateService.date2string(this.endDate);
  }
  set endD(dateStr: string) {
    this.endDate = this.dateService.string2date(dateStr, this.endDate);
  }

  onBeginDateChange(value) {
    this.beginD = value[0];
    this.loadData();
  }
  onEndDateChange(value) {
    this.endD = value[0];
    this.loadData();
  }
  public loadData() {
    this.coachingService.allFromAllUsers(this.beginDate, this.endDate, this.region).subscribe((rcoaching) => {
      if (rcoaching.data) {
        this.computeChartData(rcoaching.data);
      }
    });
  }

  computeChartData(coachings: Coaching[]) {
    this.labels = [];
    let curDate = this.dateService.to1stOfMonth(this.beginDate);
    while(curDate.getTime() < this.endDate.getTime()) {
      this.labels.push(this.dateService.month2string(curDate));
      curDate = this.dateService.nextMonth(curDate);
    }

    this.nbCoachings = this.labels.map(() => 0);
    const usersByDate: string[][] = this.labels.map(() => []);
    const filledCoaching = coachings.filter(this.filledCoaching.bind(this));
    filledCoaching.forEach( (coaching) => {
      let monthDate = this.dateService.to1stOfMonth(coaching.date);
      const dateStr = this.dateService.month2string(monthDate);
      const idx = this.labels.indexOf(dateStr);
      if (idx < 0) {
        console.log('Not found date for the coaching ' + coaching.id, dateStr);
      } else {
        this.nbCoachings[idx] ++;
        if (usersByDate[idx]) {
          if (usersByDate[idx].indexOf(coaching.coachId) < 0) {
            usersByDate[idx].push(coaching.coachId);
          }
        } else {
          usersByDate[idx] = [coaching.coachId];
        }
      }
    });
    this.nbUsers = usersByDate.map( u => u.length);
    // console.log('labels:', this.labels);
    // console.log('nbCoachings:', this.nbCoachings);
    // console.log('usersByDate:', usersByDate);
    // console.log('nbUsers:', this.nbUsers);

    let nbCoachingByUser: {coach: string, nb: number}[] = [];
    filledCoaching.forEach( (coaching) => {
      const elem = nbCoachingByUser.find( e => e.coach === coaching.coachId);
      if (elem) {
        elem.nb ++;
      } else {
        nbCoachingByUser.push({coach: coaching.coachId, nb: 1});
      }
    });
    nbCoachingByUser = nbCoachingByUser.filter(elem => elem.nb > 1).sort( (elem1, elem2) => elem1.nb - elem2.nb);
    let obs: Observable<any> = of('');
    nbCoachingByUser.forEach(elem => {
      const newObs: Observable<any> = this.userService.get(elem.coach).pipe(
        map((ruser) => {
          if (ruser.data) {
            elem.coach = ruser.data.shortName;
          }
      }));
      obs = obs.pipe(mergeMap(() => newObs));
    });
    obs.subscribe(() => {
      this.coachingByUsers = nbCoachingByUser.map( (elem) => elem.nb);
      this.users = nbCoachingByUser.map( (elem) => elem.coach);
      this.dataReady = true;
    });
  }
  private filledCoaching(coaching: Coaching): boolean {
    return coaching.referees.filter( ref => ref.feedbacks.length + ref.positiveFeedbacks.length).length > 0;
  }
}
