import { HelpService } from './../../../app/service/HelpService';
import { DateService } from '../../../app/service/DateService';
import { NavController, ToastController } from '@ionic/angular';
import { UserService } from '../../../app/service/UserService';
import { Xp, CoachingDay } from '../../../app/model/xphistory';
import { map, flatMap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ConnectedUserService } from '../../../app/service/ConnectedUserService';
import { User } from '../../../app/model/user';
import { Component, OnInit } from '@angular/core';

import { XpService } from '../../../app/service/XpService';

@Component({
  selector: 'app-xp-list',
  templateUrl: './xp-list.component.html',
  styleUrls: ['./xp-list.component.scss'],
})
export class XpListComponent implements OnInit {

  /** indicate if the user is admin */
  isAdmin = false;
  /** The list of coach */
  coaches: User[] = [];
  /** The select coach */
  selectedCoach: User;
  /** the identifier of the selected coach */
  selectedCoachId: string = null;

  /** The selected year */
  selectedYear: number;
  /** A map between a year to its list of Xp for the current selected coach */
  year2xps: Map<number, Xp[]> = new Map<number, Xp[]>();
  years: number[] = [];
  /** the list of Xp of the selected year of the select coach */
  xps: Xp[];
  /** the total duration of the year for the selected coach. */
  yearDuration = 0;

  sending = false;

  constructor(
    private navController: NavController,
    private helpService: HelpService,
    private xpService: XpService,
    private connectedUserService: ConnectedUserService,
    private userService: UserService,
    private dateService: DateService,
    public toastController: ToastController
    ) { }

  public ngOnInit() {
    this.helpService.setHelp('xp-list');
    this.computeCoaches().pipe(
      flatMap(() => this.computeXps())
    ).subscribe();
  }

  /** the user selected a coach. */
  public onCoachChange() {
    console.log('onCoachChange(): ' + this.selectedCoachId);
    this.coaches.forEach( (coach: User) => {
      if (coach.id === this.selectedCoachId) {
        this.selectedCoach = coach;
      }
    });
    this.computeXps().subscribe();
  }

  /** The user selects a new year */
  public onYearChange() {
    console.log('onYearChange(): ' + this.selectedYear);
    if (this.years && this.years.length) {
      if (typeof this.selectedYear === 'string') {
        this.selectedYear = Number.parseInt(this.selectedYear, 10);
      }
      this.xps = this.year2xps.get(this.selectedYear);
      if (!this.xps) {
        this.xps = [];
      }
    } else {
      this.xps = [];
    }
    this.yearDuration = 0;
    this.xps.forEach((xp) => xp.days.forEach((cd) => this.yearDuration += cd.coachingDuration));
  }

  /** compute the amount of coaching for an Xp */
  public computeAmount(xp: Xp): string {
    let amount = 0;
    if (xp && xp.days) {
      xp.days.forEach( (cd: CoachingDay) => amount += cd.coachingDuration);
    }
    return this.amount2str(amount);
  }

  public amount2str(amount: number): string {
    if (amount > 60) {
      return Math.trunc(amount / 60) + 'h' + this.dateService.to2Digit(amount % 60);
    } else {
      return amount + 'm';
    }
  }

  /** the user askes to create a new Xp */
  public newXp() {
    this.navController.navigateRoot('/xp/create');
  }

  public sendYearlyXp() {
    this.xpService.sendYearlyXp(this.selectedCoachId, this.selectedYear)
      .pipe(
        map((res) => {
          this.sending = false;
          this.toastController.create({
            message : 'An email has been sent with the yearly XP report sheet.',
            position: 'bottom', color: 'light',
            duration: 3000 }).then((toast) => toast.present());
        }),
        catchError( (err: any) => {
          this.sending = false;
          console.error(err);
          return of(err);
        })
      )
      .subscribe();
  }

  public xpSelected(xp: Xp) {
    this.navController.navigateRoot(`/xp/edit/${xp.id}`);
  }
  private computeCoaches(): Observable<User> {
    this.isAdmin = this.connectedUserService.getCurrentUser().role === 'ADMIN';
    this.selectedCoach = this.connectedUserService.getCurrentUser();
    this.selectedCoachId = this.selectedCoach.id;
    this.coaches = [this.selectedCoach];
    if (this.isAdmin) {
      return this.userService.all().pipe(
        map((ruser) => {
          if (ruser.data) {
            this.coaches = ruser.data;
          } else {
            this.coaches = [this.selectedCoach];
          }
          return this.selectedCoach;
        })
      );
    } else {
      return of(this.selectedCoach);
    }
  }

  private computeXps(): Observable<number> {
    return this.xpService.findXps(this.selectedCoach).pipe(
      map((rxps) => {
        const y2x = new Map<number, Xp[]>();
        this.years = [];
        if (rxps.data) {
          rxps.data.forEach(xp => {
            console.log('xp.year' + xp.year);
            let xps: Xp[] = y2x.get(xp.year);
            if (!xps) {
              xps = [];
              y2x.set(xp.year, xps);
              this.years.push(xp.year);
            }
            xps.push(xp);
          });
        } else {
          console.log('Error on service: ', rxps.error);
        }
        this.year2xps = y2x;
      }),
      map(() => {
        const initialSelectedYear = this.year2xps.size ? this.year2xps.keys().next().value : null;
        this.setSelectYear(initialSelectedYear);
        return this.selectedYear;
        })
    );
  }

  private setSelectYear(year: number) {
    this.selectedYear = year;
    this.onYearChange();
  }
  onSwipe(event) {
    // console.log('onSwipe', event);
    if (event.direction === 4) {
      this.navController.navigateRoot(`/home`);
    }
  }
}
