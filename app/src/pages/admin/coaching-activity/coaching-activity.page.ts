import { UserService } from './../../../app/service/UserService';
import { DateService } from './../../../app/service/DateService';
import { Coaching } from './../../../app/model/coaching';
import { CoachingService } from './../../../app/service/CoachingService';
import { Component, OnInit } from '@angular/core';
import { map, flatMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-coaching-activity',
  templateUrl: './coaching-activity.page.html',
  styleUrls: ['./coaching-activity.page.scss'],
})
export class CoachingActivityPage implements OnInit {

  labels: string[] = null;
  nbCoachings: number[] = null;
  nbUsers: number[] = null;
  dataReady = false;
  users: string[];
  coachingByUsers: number[];

  constructor(
    private coachingService: CoachingService,
    private dateService: DateService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.coachingService.allFromAllUsers().subscribe((rcoaching) => {
      if (rcoaching.data) {
        this.computeChartData(rcoaching.data);
      }
    });
  }

  computeChartData(coachings: Coaching[]) {
    this.labels = [];
    const filledCoaching = coachings.filter(this.filledCoaching.bind(this));
    filledCoaching.forEach( (coaching) => {
      const dateStr = this.dateService.date2string(coaching.date);
      if (this.labels.indexOf(dateStr) < 0) {
        this.labels.push(dateStr);
      }
    });
    this.labels = this.labels.sort();

    this.nbCoachings = this.labels.map(() => 0);
    const usersByDate: string[][] = this.labels.map(() => []);
    filledCoaching.forEach( (coaching) => {
      const dateStr = this.dateService.date2string(coaching.date);
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
    console.log('labels:', this.labels);
    console.log('nbCoachings:', this.nbCoachings);
    console.log('usersByDate:', usersByDate);
    console.log('nbUsers:', this.nbUsers);

    let nbCoachingByUser: {coach: string, nb: number}[] = [];
    filledCoaching.forEach( (coaching) => {
      const elem = nbCoachingByUser.find( e => e.coach === coaching.coachId);
      if (elem) {
        elem.nb ++;
      } else {
        nbCoachingByUser.push({coach: coaching.coachId, nb: 1});
      }
    });
    nbCoachingByUser = nbCoachingByUser.sort( (elem1, elem2) => elem1.nb - elem2.nb);
    let obs: Observable<any> = of('');
    nbCoachingByUser.forEach(elem => {
      const newObs: Observable<any> = this.userService.get(elem.coach).pipe(
        map((ruser) => {
          if (ruser.data) {
            elem.coach = ruser.data.shortName;
          }
      }));
      obs = obs.pipe(flatMap(() => newObs));
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
