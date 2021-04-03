import { GameAllocation } from './../../../app/model/competition';
import { HelpService } from './../../../app/service/HelpService';
import { CompetitionSelectorComponent } from '../../widget/competition-selector';
import { CompetitionService } from '../../../app/service/CompetitionService';
import { UserGroup } from '../../../app/model/user';
import { UserGroupService } from '../../../app/service/UserGroupService';
import { UserSelectorComponent } from '../../widget/user-selector-component';
import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { flatMap, map, catchError } from 'rxjs/operators';
import { RefereeService } from '../../../app/service/RefereeService';
import { ResponseWithData } from '../../../app/service/response';
import { CoachingService } from '../../../app/service/CoachingService';
import { RefereeSelectPage } from '../../referee/referee-select/referee-select';
import { UserService } from '../../../app/service/UserService';
import { AppSettingsService } from '../../../app/service/AppSettingsService';
import { ConnectedUserService } from '../../../app/service/ConnectedUserService';
import { Coaching } from '../../../app/model/coaching';
import { User, Referee } from '../../../app/model/user';
import { SharedWith } from 'src/app/model/common';

/**
 * Generated class for the CoachingNewPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-coaching-edit',
  templateUrl: 'coaching-edit.html',
  styleUrls: ['coaching-edit.scss']
})
export class CoachingEditPage implements OnInit {

  coaching: Coaching = null;
  coachingCoach = '';
  coachingOwner = true;
  readonly = false;
  appCoach: User;
  id2referee: Map<string, Referee> = new Map<string, Referee>();
  refereesLoaded = false;
  sending = false;
  sharedWith: SharedWith = { users: [], groups: [] };
  param = {
     alloc: null as GameAllocation,
     competitionId: null as string,
     competitionName: null as string,
  };

  constructor(
    private modalController: ModalController,
    private route: ActivatedRoute,
    private navController: NavController,
    public connectedUserService: ConnectedUserService,
    private helpService: HelpService,
    public userService: UserService,
    public userGroupService: UserGroupService,
    public refereeService: RefereeService,
    public coachingService: CoachingService,
    private competitionService: CompetitionService,
    public appSettingsService: AppSettingsService,
    public toastController: ToastController) {
  }

  ngOnInit() {
    this.helpService.setHelp('coaching-edit');
    this.appCoach = this.connectedUserService.getCurrentUser();
    this.loadParams().pipe(
      flatMap(() => this.loadCoaching()),
      map((response: ResponseWithData<Coaching>) => {
        // console.log('CoachingEdit: loaded coaching, response=' + JSON.stringify(response));
        this.coaching = response.data;
        if (this.coaching) {
          this.computeCoachingValues();
          this.loadingReferees();
          this.computeSharedWith();
        } else if (this.param.alloc !== null) {
          this.createCoachingFromParam();
          this.loadingReferees();
          this.computeCoachingValues();
        } else {
          this.initCoaching();
        }
      }
    )).subscribe();
  }

  loadParams(): Observable<any> {
    return this.route.queryParams.pipe(
      map((params) => {
        const str = params.alloc;
        if (str) {
          this.param.alloc = JSON.parse(str);
        }
        this.param.competitionId = params.competitionId;
        this.param.competitionName = params.competitionName;
      }));
  }

  switchLockCoaching() {
    this.coaching.closed = !this.coaching.closed;
    this.computeCoachingValues();
    this.coachingService.save(this.coaching).subscribe();
  }
  get closed() {
    return this.coaching.closed;
  }

  private loadCoaching(): Observable<ResponseWithData<Coaching>> {
    return this.route.paramMap.pipe(
      flatMap( (paramMap) => {
        return this.coachingService.get(paramMap.get('id'));
      })
    );
  }
  createCoachingFromParam() {
    console.log('createCoachingFromParam');
    this.coaching = {
      id: null,
      version: 0,
      creationDate : new Date(),
      lastUpdate : new Date(),
      dataStatus: 'NEW',
      competition: this.param.competitionName,
      competitionId: this.param.competitionId,
      field: this.param.alloc.field,
      date : new Date(this.param.alloc.date),
      timeSlot: this.param.alloc.timeSlot,
      coachId: this.appCoach.id,
      gameCategory: this.param.alloc.gameCategory,
      gameSpeed: 'Medium',
      gameSkill: 'Medium',
      referees : this.param.alloc.referees.map((ref) => {
        return {
          refereeId: ref.refereeId,
          refereeShortName: ref.refereeShortName,
          feedbacks: [],
          positiveFeedbacks: [],
          upgrade: null,
          rank: 0
        };
      }),
      refereeIds: this.param.alloc.referees.map((ref) => ref.refereeId),
      currentPeriod : 1,
      closed: false,
      sharedWith: {
        users: [],
        groups: []
      }
    };
}
  initCoaching() {
    this.competitionService.get(this.appCoach.defaultCompetitionId).pipe(
      map((rcompetition) => {
        let defaultCompetitionName = this.appCoach.defaultCompetition;
        let defaultCompetitionId = '';
        if (rcompetition.data) {
          defaultCompetitionName = rcompetition.data.name;
          defaultCompetitionId = rcompetition.data.id;
        }
        this.coaching = {
          id: null,
          version: 0,
          creationDate : new Date(),
          lastUpdate : new Date(),
          dataStatus: 'NEW',
          competition: defaultCompetitionName,
          competitionId: defaultCompetitionId,
          field: '1',
          date : new Date(),
          timeSlot: this.computeTimeSlot(new Date()),
          coachId: this.appCoach.id,
          gameCategory: 'OPEN',
          gameSpeed: 'Medium',
          gameSkill: 'Medium',
          referees : [],
          refereeIds: [],
          currentPeriod : 1,
          closed: false,
          sharedWith: {
            users: [],
            groups: []
          }
        };
        this.computeCoachingValues();
      })
    ).subscribe();
  }

  computeCoachingValues() {
    if (!this.coaching.currentPeriod) {
      this.coaching.currentPeriod = 1;
    }
    this.coachingOwner =  this.coaching.coachId === this.appCoach.id;
    this.coachingCoach = (this.coachingOwner ? 'me' : 'another coach');
    this.readonly = !this.coachingOwner || this.coaching.closed;
  }

  private loadingReferees() {
    this.coachingService.loadingReferees(this.coaching, this.id2referee).subscribe(() => {
      this.refereesLoaded = true;
    });
  }

  getReferee(idx: number): string {
    if (idx >= this.coaching.referees.length) {
      return null;
    }
    const refereeId = this.coaching.referees[idx].refereeId;
    if (refereeId === null) {
      return '';
    }
    const referee: Referee = this.id2referee.get(refereeId);
    if (referee) {
      return referee.firstName + ' (' + referee.shortName + ')';
    } else {
      return this.coaching.referees[idx].refereeShortName;
    }
  }

  async onClickCompetition() {
    const modal = await this.modalController.create({
      component: CompetitionSelectorComponent,
      componentProps: { name: this.coaching.competition}
    });
    modal.onDidDismiss().then( (result) => {
      this.competitionInfoSelected(result.data.name, result.data.id).subscribe();
    });
    modal.present();
  }

  competitionInfoSelected(competitionName: string, competitionId: string): Observable<any> {
    this.coaching.competition = competitionName;
    this.coaching.competitionId = competitionId;
    this.connectedUserService.getCurrentUser().defaultCompetition = competitionName;
    this.connectedUserService.getCurrentUser().defaultCompetitionId = competitionId;
    return this.userService.update(this.coaching.coachId, (user: User) => {
      user.defaultCompetition = competitionName;
      user.defaultCompetitionId = competitionId;
      return user;
    });
  }

  get date() {
    return this.coachingService.getCoachingDateAsString(this.coaching);
  }

  set date(dateStr: string) {
    this.coachingService.setStringDate(this.coaching, dateStr);
  }

  async searchReferee(idx: number) {
    const modal = await this.modalController.create({
      component: RefereeSelectPage,
      componentProps: { competitionId: this.coaching.competitionId }});
    modal.onDidDismiss().then( (data) => {
      const referee = this.refereeService.lastSelectedReferee.referee;
      if (referee) {
        let coachRef;
        if (idx < this.coaching.referees.length) {
          coachRef = this.coaching.referees[idx];
        } else {
          coachRef = { refereeId: 0, refereeShortName: null, feedbacks: [], positiveFeedbacks: [], rank: 0, upgrade: 'DNS'};
          this.coaching.referees.push(coachRef);
        }
        coachRef.refereeId = referee.id;
        coachRef.refereeShortName = referee.shortName;
        this.coaching.refereeIds = this.coaching.referees.map((ref) => ref.refereeId);
        this.id2referee.set(referee.id, referee);
      }
    });
    return await modal.present();
  }

  computeTimeSlot(ts: Date): string {
    return this.coachingService.computeTimeSlot(ts);
  }

  saveNback() {
    if (!this.coaching || this.coaching.closed || !this.isValid() || !this.coachingOwner)  {
      this.navController.navigateRoot(`/coaching/list`);
    } else {
      this.coachingService.save(this.coaching).subscribe(() => {
        this.navController.navigateRoot(`/coaching/list`);
      });
    }
  }

  coach(event) {
    if (this.isValid()) {
      if (this.coaching.closed || !this.coachingOwner) {
        this.navController.navigateRoot(`/coaching/coach/${this.coaching.id}`);
      } else {
        this.coachingService.save(this.coaching).pipe(
          map((response: ResponseWithData<Coaching>) => this.navController.navigateRoot(`/coaching/coach/${response.data.id}`))
        ).subscribe();
      }
    }
  }

  sendCoaching() {
    this.sending = true;
    this.coachingService.sendCoachingByEmail(this.coaching.id)
      .pipe(
        map((res) => {
          this.sending = false;
          this.toastController.create({ message : 'An email has been sent with the assessment sheet.',
          position: 'bottom', color: 'light',
          duration: 3000 }).then((toast) => toast.present());
          // console.log('sendCoaching =>' + JSON.stringify(res));
        }),
        catchError( (err: any) => {
          this.sending = false;
          console.error(err);
          return of(err);
        })
      )
      .subscribe();
  }
  isValid(): boolean {
    return this.coaching.referees.length > 0
      && this.coaching.competition != null && this.coaching.competition.trim().length > 0;
  }

  async shareWith() {
    const modal = await this.modalController.create({ component: UserSelectorComponent});
    modal.onDidDismiss().then( (data) => {
      const sharedWith: SharedWith = data.data as SharedWith;
      if (sharedWith) {
        sharedWith.users.forEach((user) => {
          this.addToSet(user.id, this.coaching.sharedWith.users);
        });
        sharedWith.groups.forEach((group) => {
          this.addToSet(group.id, this.coaching.sharedWith.groups);
          group.members.forEach((userId) => {
            this.addToSet(userId, this.coaching.sharedWith.users);
          });
        });
        this.computeSharedWith();
      }
    });
    modal.present();
  }

  private addToSet(item: string, list: string[]) {
    if (!list.includes(item)) {
      list.push(item);
    }
  }

  computeSharedWith() {
    this.sharedWith.users = [];
    this.sharedWith.groups = [];
    this.coaching.sharedWith.users.forEach((userId) => {
      this.userService.get(userId).subscribe((ruser) => this.sharedWith.users.push(ruser.data));
    });
    this.coaching.sharedWith.groups.forEach((groupId) => {
      this.userGroupService.get(groupId).subscribe((rgroup) => this.sharedWith.groups.push(rgroup.data));
    });
  }
  deleteSharedUser(user: User) {
    this.deleteFromStringArray(user.id, this.coaching.sharedWith.users);
    this.computeSharedWith();
  }
  deleteSharedGroup(group: UserGroup) {
    this.deleteFromStringArray(group.id, this.coaching.sharedWith.groups);
    this.computeSharedWith();
  }
  deleteFromStringArray(item: string, stringArray: string[]) {
    const idx = stringArray.indexOf(item);
    if (idx >= 0) {
      stringArray.splice(idx, 1);
    }
  }
  onSwipe(event) {
    // console.log('onSwipe', event);
    if (event.direction === 2) {
      this.coach(null);

    } else if (event.direction === 4) {
      this.saveNback();
    }
  }
}
