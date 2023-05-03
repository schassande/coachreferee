import { UserSelectorComponent } from './../../widget/user-selector-component';
import { ConnectedUserService } from './../../../app/service/ConnectedUserService';
import { HelpService } from './../../../app/service/HelpService';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';

import { CompetitionService } from './../../../app/service/CompetitionService';
import { DateService } from './../../../app/service/DateService';
import { UserService } from './../../../app/service/UserService';

import { Competition, CompetitionCategories, GameAllocation } from './../../../app/model/competition';
import { CONSTANTES, Referee, User } from './../../../app/model/user';
import { mergeMap, map, catchError } from 'rxjs/operators';

import { DATA_REGIONS, SharedWith } from './../../../app/model/common';

@Component({
  selector: 'app-competition-edit',
  templateUrl: './competition-edit.component.html',
  styleUrls: ['./competition-edit.component.scss'],
})
export class CompetitionEditComponent implements OnInit {

  competition: Competition;
  referees: Referee[] = [];
  coaches: User[] = [];
  loading = false;
  regions = DATA_REGIONS;
  constantes = CONSTANTES;
  categories = CompetitionCategories;
  errors: string[] = [];
  owner: string;
  readonly = true;

  constructor(
    private alertCtrl: AlertController,
    private connectedUserService: ConnectedUserService,
    private competitionService: CompetitionService,
    public dateService: DateService,
    private helpService: HelpService,
    private modalController: ModalController,
    private navController: NavController,
    private route: ActivatedRoute,
    private userService: UserService
    ) {
  }

  ngOnInit() {
    this.helpService.setHelp('competition-edit');
    this.loadCompetition().subscribe();
  }

  private loadCompetition(): Observable<Competition> {
    this.loading = true;
    // load id from url path
    return this.route.paramMap.pipe(
      // load competition from the id
      mergeMap( (paramMap) => this.competitionService.get(paramMap.get('id'))),
      map( (rcompetition) => {
        this.competition = rcompetition.data;
        if (!this.competition) {
          // the competition has not been found => create it
          this.createCompetition();
        } else if (!this.connectedUserService.isAdmin()
            && !this.competitionService.authorized(this.competition, this.connectedUserService.getCurrentUser().id)) {
          // the coach is not allowed to access to this competition
          console.log('the coach is not allowed to access to this competition');
          this.navController.navigateRoot('/competition/list');
        }

        return this.competition;
      }),
      mergeMap( () => {
        this.owner = '';
        this.readonly = this.competition.ownerId !== this.connectedUserService.getCurrentUser().id;
        if (this.competition && this.competition.ownerId) {
          return this.userService.get(this.competition.ownerId).pipe(
            map( (ruser) => {
              if (ruser.data) {
                this.owner = ruser.data.firstName + ' ' + ruser.data.lastName + '(' + ruser.data.shortName + ')';
              }
              return this.owner;
            })
          );
        }
        return of(this.owner);
      }),
      // TODO load owner
      catchError((err) => {
        console.log('loadCompetition error: ', err);
        this.loading = false;
        return of(this.competition);
      }),
      map (() => {
        this.loading = false;
        return this.competition;
      })
    );
  }

  private createCompetition() {
    this.competition = {
      id: null,
      version: 0,
      creationDate : new Date(),
      lastUpdate : new Date(),
      dataStatus: 'NEW',
      name: '',
      date: new Date(),
      days: [],
      ownerId: this.connectedUserService.getCurrentUser().id,
      year: new Date().getFullYear(),
      region : this.connectedUserService.getCurrentUser().region,
      country : '',
      referees: [],
      refereeCoaches: [],
      allocations: [],
      category: 'C1',
      categorySenior: 'C1',
      completed: false
    };
    this.competition.days.push(this.competition.date);
    this.readonly = false;
  }



  get name() {
    return this.competition.name;
  }

  set name(nameStr: string) {
    // TODO check the competition name : not already exist, include a date
    this.competition.name = nameStr;
  }

  get date() {
    return this.dateService.date2string(this.competition.date);
  }

  set date(dateStr: string) {
    this.competition.date = this.dateService.string2date(dateStr, this.competition.date);
    this.competition.year = this.competition.date.getFullYear();
    this.computeDays();
  }

  private computeDays() {
    // compute next days
    let previousDate = this.competition.date;
    this.competition.days = this.competition.days.map((d: Date, idx: number) => {
      const nextDate = idx === 0 ? previousDate : this.dateService.nextDay(previousDate);
      previousDate = nextDate;
      return nextDate;
    });
  }

  get nbDays(): number {
    return this.competition.days.length;
  }

  set nbDays(val: number) {
    if (val < 1 || val > 10) {
      return;
    }
    const delta = val - this.competition.days.length;
    if (delta > 0) {
      while (this.competition.days.length < val) {
        const nextDate = this.dateService.nextDay(this.competition.days[this.competition.days.length - 1]);
        this.competition.days.push(nextDate);
      }
    } else if (delta < 0) {
      this.competition.days.splice(val, -delta);
    }
  }

  saveNback() {
    this.isValid().pipe(
      mergeMap((valid) => {
        if (valid) {
          const isNew = this.competition.dataStatus === 'NEW';
          return this.competitionService.save(this.competition).pipe(
            map((rcompetition) => {
              if (rcompetition.data) {
                this.competition = rcompetition.data;
                this.setUserDefaultCompetition(this.competition);
                this.back();
              } else {
                this.alertCtrl.create({ message: 'Error when saving the competition: ' + rcompetition.error.error })
                  .then( (alert) => alert.present() );
              }
            })
          );
        } else {
          return of('');
        }
      })
    ).subscribe();
  }

  setUserDefaultCompetition(competition: Competition) {
    const user = this.connectedUserService.getCurrentUser();
    user.defaultCompetition = competition.name
    user.defaultCompetitionId = competition.id;
    this.userService.save(user).subscribe();
  }

  back() {
    if (this.competition.id) {
      this.navController.navigateRoot(`/competition/${this.competition.id}/home`);
    } else {
      this.navController.navigateRoot(`/competition/list`);
    }
  }

  isValid(): Observable<boolean> {
    const errors: string[] = [];
    if (!this.competition.name) {
      errors.push('Name field is missing');
    } else if (this.competition.name.indexOf('' + this.competition.year) < 0) {
      errors.push('The competition name must include the year number ' + this.competition.year);
    } else if (this.competition.name.trim() === ('' + this.competition.year)) {
      errors.push('The competition name contains more than the year number.');
    }
    if (!this.competition.region) {
      errors.push('Region field is missing');
    }
    if (!this.competition.country) {
      errors.push('Country field is missing');
    }
    return this.competitionService.getCompetitionByName(this.competition.name).pipe(
      map((rcomp) => {
        if (rcomp.data && rcomp.data.id !== this.competition.id) {
          errors.push('The competition name already exist');
        }
        return rcomp;
      }),
      map(() => {
        this.errors = errors;
        return this.errors.length === 0;
      })
    );
  }

  onSwipe(event) {
    // console.log('onSwipe', event);
    if (event.direction === 4) {
      this.saveNback();
    }
  }

  allocSelected(alloc: GameAllocation) {
    this.alertCtrl.create({
      header: 'Game actions',
      message: `You selected the following game:<ul>
      <li>Date: ${this.dateService.date2string(alloc.date)}</li>
      <li>Slot: ${alloc.timeSlot}</li>
      <li>Field: ${alloc.field} Cat:${alloc.gameCategory}</li>
      <li>Referees: ${alloc.referees.map((ref) => ref.refereeShortName).join(',')}</li>
      <li>Coaches: ${alloc.refereeCoaches.map((ref) => ref.coachShortName).join(',')}</li>
      </ul>
      What do you wan to do about this game?`,
      buttons: [
        { text: 'Cancel', role: 'cancel'},
        {
          text: 'Delete',
          cssClass: 'Danger',
          handler: () => {
            const idx = this.competition.allocations.findIndex((a) => alloc.id === a.id);
            if (idx >= 0) {
              this.competition.allocations.splice(idx, 1);
            }
          }
        },
        {
          text: 'Coach It',
          cssClass: 'Success',
          handler: () => {
            const currentUserId = this.connectedUserService.getCurrentUser().id;
            const refco = alloc.refereeCoaches.find((rc) => rc.coachId === currentUserId);
            if (refco && refco.coachingId) {
              // the current user is an allocated coach on the game and he has a coaching objet
              this.navController.navigateRoot(`/coaching/coach/${refco.coachingId}`);
            } else {
              // Go on CoachingEdit page with the game info
              this.navController.navigateRoot(`/coaching/edit/-1`, { queryParams: {
                alloc: JSON.stringify(alloc),
                competitionId: this.competition.id,
                competitionName: this.competition.name
              }});
            }
          }
        }
      ]
    }).then( (alert) => alert.present() );
  }
  async searchOwner() {
    const modal = await this.modalController.create({ component: UserSelectorComponent});
    modal.onDidDismiss().then( (data) => {
      const sharedWith: SharedWith = data.data as SharedWith;
      console.log('data=', data);
      if (sharedWith && sharedWith.users) {
        const newOwner = sharedWith.users[0];
        this.competition.ownerId = newOwner.id;
        this.owner = newOwner.firstName + ' ' + newOwner.lastName + '(' + newOwner.shortName + ')';
      }
    });
    modal.present();
  }
}
