import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ConnectedUserService } from '../../app/service/ConnectedUserService';
import { UserSearchCriteria, UserService } from '../../app/service/UserService';
import { ResponseWithData } from '../../app/service/response';

import { DataRegion, SharedWith } from './../../app/model/common';
import { AppRole, CONSTANTES, RefereeCoachLevel, RefereeLevel, User } from './../../app/model/user';
import { forkJoin, Observable, of } from 'rxjs';
import { CompetitionService } from 'src/app/service/CompetitionService';
import { map, mergeMap } from 'rxjs/operators';
import { ToolService } from 'src/app/service/ToolService';
import { RefereeEditPage } from '../referee/referee-edit/referee-edit';

@Component({
    selector: 'app-user-selector',
    template: `
<ion-header>
    <ion-toolbar>
        <ion-buttons slot="start">
            <ion-button #backBt (click)="cancel()" detail>
                <ion-icon name="arrow-back"></ion-icon>
            </ion-button>
        </ion-buttons>
        <ion-title style="text-align: center;">
          <span>Select&nbsp;</span>
          <span *ngIf="role === 'REFEREE'">a referee</span>
          <span *ngIf="role === 'REFEREE_COACH'">a referee coach</span>
          <span *ngIf="role !== 'REFEREE_COACH' && role !== 'REFEREE'">an user</span>
        </ion-title>
    </ion-toolbar>
</ion-header>
<ion-content padding>
  <ion-fab vertical="bottom" horizontal="end" slot="fixed" *ngIf="role === 'REFEREE'">
    <ion-fab-button (click)="newReferee()">
      <ion-icon name="add"></ion-icon>
    </ion-fab-button>
  </ion-fab>
  <ion-list>
    <ion-item-group style="width: 100%;">
        <ion-item-divider color="light">Filtering criteria</ion-item-divider>
        <ion-item>
          <ion-label>Name</ion-label>
          <ion-searchbar [(ngModel)]="searchInput" [showCancelButton]="false" (ionChange)="loadUser()"></ion-searchbar>
        </ion-item>
        <ion-item>
            <ion-label>Country</ion-label>
            <ion-select [(ngModel)]="country" interface="action-sheet" (ionChange)="loadUser()">
              <ion-select-option value="">All</ion-select-option>
              <ion-select-option *ngFor="let c of constantes.countries" value="{{c[0]}}">{{c[1]}}</ion-select-option>
            </ion-select>
        </ion-item>
        <ion-item>
            <ion-label>Region</ion-label>
            <ion-select [(ngModel)]="region" interface="action-sheet" (ionChange)="loadUser()">
                <ion-select-option value="">All</ion-select-option>
                <ion-select-option *ngFor="let r of constantes.regions" value="{{r}}">{{r}}</ion-select-option>
            </ion-select>
        </ion-item>
        <ion-item *ngIf="showFilterRefereeLevel">
          <ion-label>Referee Level</ion-label>
          <ion-select [(ngModel)]="refereeLevel" interface="action-sheet" (ionChange)="loadUser()">
            <ion-select-option value="">All</ion-select-option>
            <ion-select-option *ngFor="let level of constantes.refereeLevels" value="{{level}}">{{level}}</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item *ngIf="showFilterRefereeCoachLevel">
          <ion-label>Referee coach Level</ion-label>
          <ion-select [(ngModel)]="refereeCoachLevel" interface="action-sheet" (ionChange)="loadUser()">
              <ion-select-option value="">All</ion-select-option>
              <ion-select-option *ngFor="let level of constantes.refereeCoachLevels" value="{{level}}">{{level}}</ion-select-option>
          </ion-select>
        </ion-item>
      </ion-item-group>
      <ion-item-group style="width: 100%;">
        <ion-item-divider color="light">Search result</ion-item-divider>
        <div *ngIf="loading" style="margin: 20px; text-align: center;"><ion-spinner></ion-spinner></div>
        <div *ngIf="!loading && (users === null || users.length === 0)" style="margin: 10px; text-align: center;">Empty result.</div>
        <div *ngIf="!loading && users">
          <ion-item *ngIf="userCreated">
              <ion-icon slot="start" *ngIf="userCreated.photo && !userCreated.photo.url" name="person"></ion-icon>
              <ion-avatar slot="start" *ngIf="userCreated.photo && userCreated.photo.url"><img src="{{userCreated.photo.url}}"></ion-avatar>
              <ion-label (click)="userSelected(userCreated)">{{userCreated.firstName}} {{userCreated.lastName}} ({{userCreated.country}})</ion-label>
              <ion-avatar slot="end" *ngIf="role === 'REFEREE' && userCreated.referee.refereeLevel"><img src="assets/imgs/badge/{{userCreated.referee.refereeLevel}}.png" alt="{{userCreated.referee.refereeLevel}}"/></ion-avatar>
              <ion-avatar slot="end" *ngIf="role === 'REFEREE_COACH' && userCreated.refereeCoach.refereeCoachLevel"><img src="assets/imgs/badge/coach_{{userCreated.refereeCoach.refereeCoachLevel}}.png" alt="{{userCreated.refereeCoach.refereeCoachLevel}}"/></ion-avatar>
          </ion-item>
          <ion-item *ngFor="let user of users">
              <ion-icon slot="start" *ngIf="user.photo && !user.photo.url" name="person"></ion-icon>
              <ion-avatar slot="start" *ngIf="user.photo && user.photo.url"><img src="{{user.photo.url}}"></ion-avatar>
              <ion-label (click)="userSelected(user)">{{user.firstName}} {{user.lastName}} ({{user.country}})</ion-label>
              <ion-avatar slot="end" *ngIf="role === 'REFEREE' && user.referee.refereeLevel"><img src="assets/imgs/badge/{{user.referee.refereeLevel}}.png" alt="{{user.referee.refereeLevel}}"/></ion-avatar>
              <ion-avatar slot="end" *ngIf="role === 'REFEREE_COACH' && user.refereeCoach.refereeCoachLevel"><img src="assets/imgs/badge/coach_{{user.refereeCoach.refereeCoachLevel}}.png" alt="{{user.refereeCoach.refereeCoachLevel}}"/></ion-avatar>
          </ion-item>
        </div>
      </ion-item-group>
    </ion-list>
</ion-content>`,
  })
export class UserSelectorComponent implements OnInit {
  @Input()
  role: AppRole = null;
  @Input()
  region: DataRegion = null;
  @Input()
  country: string = null;
  @Input()
  refereeLevel: RefereeLevel = null;
  @Input()
  refereeCoachLevel: RefereeCoachLevel = null;
  @Input()
  allowToCreateReferee = false;
  @Input()
  competitionId: string = null;

  users: User[];
  error;
  searchInput: string;
  showFilterRefereeLevel = false;
  showFilterRefereeCoachLevel = false;
  constantes = CONSTANTES;
  loading = false;
  userCreated: User = null;

    constructor(
      public userService: UserService,
      public modalCtrl: ModalController,
      public connectedUserService: ConnectedUserService,
      public competitionService: CompetitionService,
      public toolService: ToolService
      ) {}

    ngOnInit() {
      if (this.role !== 'REFEREE') {
        this.allowToCreateReferee = false;
      }
      this.showFilterRefereeLevel = this.role === 'REFEREE';
      this.showFilterRefereeCoachLevel = this.role === 'REFEREE_COACH';
      this.loadUser();
    }

    loadUser() {
      this.loading = true;
      if (this.competitionId) {
        this.getCompetitionReferees().subscribe((us) => {
          this.users = this.userService.sortUsers(us.filter(user => {
            if (this.toolService.isValidString(this.region) && user.region !== this.region) {
              return false;
            }
            if (this.toolService.isValidString(this.country) && user.country !== this.country) {
              return false;
            }
            if (this.role === 'REFEREE' && this.toolService.isValidString(this.refereeLevel)
              && user.referee && user.referee.refereeLevel !== this.refereeLevel) {
              return false;
            }
            if (this.role === 'REFEREE_COACH' && this.toolService.isValidString(this.refereeCoachLevel)
              && user.refereeCoach && user.refereeCoach.refereeCoachLevel !== this.refereeCoachLevel) {
              return false;
            }
            return true;
          }));
          this.loading = false;
        });
      } else {
        const criteria: UserSearchCriteria = {
          role : this.role,
          region : this.region,
          country : this.country,
          text : this.searchInput,
          refereeLevel : this.refereeLevel,
          refereeCoachLevel : this.refereeCoachLevel
        };
        this.userService.searchUsers(criteria).subscribe((response: ResponseWithData<User[]>) => {
          this.users = this.userService.sortUsers(response.data);
          this.error = response.error;
          this.loading = false;
        });
      }
    }

    private getCompetitionReferees(): Observable<User[]> {
        // load the competition
        const refereesDatabase = [];
        return this.competitionService.get(this.competitionId).pipe(
          mergeMap((rcomp) => {
            if (rcomp.data) {
              const obss: Observable<ResponseWithData<User>>[] = [];
              rcomp.data.referees.forEach((ref) => {
                obss.push(this.userService.get(ref.refereeId).pipe(
                  map( (rref) => {
                    if (rref.data) {
                      refereesDatabase.push(rref.data);
                    }
                    return rref;
                  })
                ));
              });
              return forkJoin(obss);
            } else {
              return of('');
            }
          }),
          map(() => refereesDatabase)
        );
    }
    public userSelected(user: User) {
      this.modalCtrl.dismiss({users : [user], groups: []});
    }
    public cancel() {
      this.modalCtrl.dismiss({users : [], groups: []});
    }
    async newReferee() {
      this.modalCtrl.dismiss({users : [], groups: [], create: true});
    }
}
