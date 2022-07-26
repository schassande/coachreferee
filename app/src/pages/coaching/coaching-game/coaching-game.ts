import { AssessmentService } from './../../../app/service/AssessmentService';
import { Assessment } from './../../../app/model/assessment';
import { HelpService } from './../../../app/service/HelpService';
import { LocalAppSettings } from '../../../app/model/settings';
import { AppSettingsService } from '../../../app/service/AppSettingsService';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { AlertController, NavController, IonSegment, ModalController, ToastController } from '@ionic/angular';
import { Observable, of, Subscription } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';

import { EmailService } from '../../../app/service/EmailService';
import { ConnectedUserService } from '../../../app/service/ConnectedUserService';
import { RefereeService } from '../../../app/service/RefereeService';
import { UserService } from '../../../app/service/UserService';
import { ResponseWithData } from '../../../app/service/response';
import { CoachingService } from '../../../app/service/CoachingService';
import { BookmarkService, Bookmark } from '../../../app/service/BookmarkService';
import { Referee, User, UserGroup } from '../../../app/model/user';
import { Coaching, PositiveFeedback, Feedback } from '../../../app/model/coaching';
import { DateService } from 'src/app/service/DateService';
import { RefereeSelectorService } from 'src/pages/referee/referee-selector-service';
import { CompetitionSelectorComponent } from 'src/pages/widget/competition-selector';
import { GameAllocation } from 'src/app/model/competition';
import { SharedWith } from 'src/app/model/common';
import { UserGroupService } from 'src/app/service/UserGroupService';
import { UserSelectorComponent } from 'src/pages/widget/user-selector-component';
import { CompetitionService } from 'src/app/service/CompetitionService';

/**
 * Generated class for the CoachingGamePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'app-page-coaching-game',
  templateUrl: 'coaching-game.html',
  styleUrls: ['coaching-game.scss']
})
export class CoachingGamePage implements OnInit {

  coaching: Coaching;
  currentRefereeIdx = 3;
  currentReferee: Referee;
  id2referee: Map<string, Referee> = new Map<string, Referee>();
  id2assessments: Map<string, Assessment[]> = new Map<string, Assessment[]>();
  refereesLoaded = false;
  periods: number[] = [1, 2];
  currentPeriod = 1;
  coachingCoach = '';
  coachingOwner = true;
  readonly = false;
  appCoach: User;
  sending = false;
  sharedWith: SharedWith = { users: [], groups: [] };
  param = {
     alloc: null as GameAllocation,
     competitionId: null as string,
     competitionName: null as string,
  };
  refereeName0: string;
  refereeName1: string;
  refereeName2: string;

  @ViewChild(IonSegment) segment: IonSegment;

  constructor(
    public alertCtrl: AlertController,
    private appSettingsService: AppSettingsService,
    private assessmentService: AssessmentService,
    private bookmarkService: BookmarkService,
    private changeDetectorRef: ChangeDetectorRef,
    public coachingService: CoachingService,
    private competitionService: CompetitionService,
    public connectedUserService: ConnectedUserService,
    public dateService: DateService,
    private modalController: ModalController,
    private navController: NavController,
    private helpService: HelpService,
    private refereeSelectorService: RefereeSelectorService,
    public refereeService: RefereeService,
    private route: ActivatedRoute,
    public toastController: ToastController,
    public userGroupService: UserGroupService,
    public userService: UserService) {
      this.coaching = null;
  }

  ngOnInit() {
    this.helpService.setHelp('coaching-game');
    this.appSettingsService.get().subscribe( (setting: LocalAppSettings) => {
      this.periods = [];
      for (let i = 0; i < setting.nbPeriod; i++) { this.periods.push(i + 1); }
    });
    this.coaching = null;
    this.appCoach = this.connectedUserService.getCurrentUser();
    this.loadParams().pipe(
      mergeMap(() => this.loadCoaching()),
      map((response: ResponseWithData<Coaching>) => {
        this.coaching = response.data;
        if (this.coaching) {
          this.clean(this.coaching);
          this.computeRefereeNames();
          this.computeCoachingValues();
          this.loadingReferees();
          this.computeSharedWith();
          this.bookmarkPage();
          this.loadAssessments();
        } else if (this.param.alloc !== null) {
          this.createCoachingFromParam();
          this.loadingReferees();
          this.computeCoachingValues();
        } else {
          this.initCoaching();
          this.loadingReferees();
          }
      })
    ).subscribe();
  }
  computeRefereeNames() {
    this.refereeName0 = this.getReferee(0);
    this.refereeName1 = this.getReferee(1);
    this.refereeName2 = this.getReferee(2);
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

  private createCoachingFromParam() {
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

  private clean(coaching: Coaching): Coaching {
    if (coaching && coaching.referees) {
      let idx = 0;
      while (idx < coaching.referees.length) {
        if (coaching.referees[idx].refereeShortName) {
          idx++;
        } else {
          coaching.referees.splice(idx, 1);
        }
      }
    }
    return coaching;
  }

  setPeriod(period: number) {
    console.log('setPeriod', period);
    this.coaching.currentPeriod = period;
    this.saveCoaching();
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
  public onCoachingChange() {
    this.saveCoaching();
  }
  public saveCoaching() {
    if (this.coaching && !this.coaching.closed && this.isValid() && this.coachingOwner)  {
      const reload = this.coaching.dataStatus === 'NEW';
      this.coachingService.save(this.coaching).subscribe((rc) => {
        if (reload) {
          this.navController.navigateRoot(`/coaching/edit/${rc.data.id}`);
        }
      });  
    }
  }
  public getReferee(idx: number): string {
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

  public coachAsEmail(): boolean {
    const coachEmmail: string = this.connectedUserService.getCurrentUser().email;
    return coachEmmail && coachEmmail.trim().length > 0;
  }

  private loadCoaching(): Observable<ResponseWithData<Coaching>> {
    return this.route.paramMap.pipe(
      mergeMap( (paramMap: ParamMap) => {
        const id = paramMap.get('id');
        return this.coachingService.get(id);
      })
    );
  }

  private loadingReferees() {
    this.coachingService.loadingReferees(this.coaching, this.id2referee).pipe(
      mergeMap( () => {
        // referee loaded
        this.refereesLoaded = true;
        return this.route.queryParamMap;
      }),
      map((queryParamMap) => {
          // search if a tab is expected in url, otherwise select the first tab
          const refereeIdxStr: string = queryParamMap.get('refereeIdx');
          const refereeIdx = refereeIdxStr ? Number.parseInt(refereeIdxStr, 10) : 3;
          this.refereeSelected(refereeIdx);
          return refereeIdx;
      })
    ).subscribe();
  }

  private loadAssessments() {
    this.coaching.refereeIds.forEach((refId) => {
      this.assessmentService.getAssessmentByReferee(refId).pipe(
        map((rassessments) => {
          this.id2assessments.set(refId, rassessments.data);
          console.log('Assessment of ', refId, rassessments.data);
        })
      ).subscribe();
    });
  }

  private bookmarkPage() {
    const refereeNames: string[] = this.coaching.referees.map((referee) => referee.refereeShortName);
    const datestring = ('0' + this.coaching.date.getDate()).slice(-2) + '/'
      + ('0' + (this.coaching.date.getMonth() + 1)).slice(-2) + ' '
      + ('0' + this.coaching.date.getHours()).slice(-2) + ':'
      + ('0' + this.coaching.date.getMinutes()).slice(-2);

    this.bookmarkService.addBookmarkEntry({
      id: 'coach' + this.coaching.id,
      label: 'Coach ' + datestring + ' ' + refereeNames.join(','),
      url: `/coaching/coach/${this.coaching.id}` });
    const ctx: Bookmark[] = [];
    this.coaching.referees.forEach((referee) => {
      ctx.push(
        {
          id: 'referee' + referee.refereeId,
          label: 'Referee ' + referee.refereeShortName,
          url: `/referee/view/${referee.refereeId}` }
      );
    });
    this.bookmarkService.setContext(ctx);
  }

  refereeSelected(refereeIndex = Number.parseInt(this.segment.value)) {
    if (this.segment) { // prevent call before the component has been initialised.
      console.log('refereeSelected('+ refereeIndex + ')', 'Segment.value=' + this.segment.value);
      if (refereeIndex === 3){
        this.currentRefereeIdx = 3;
        this.currentReferee = null;
      } else {
        this.currentRefereeIdx = Math.max(0, Math.min(refereeIndex, this.coaching.referees.length-1));
        this.currentReferee = this.id2referee.get(this.coaching.referees[this.currentRefereeIdx].refereeId);
      }
      this.changeDetectorRef.detectChanges();
    }
  }

  lookingForUpgrade(): boolean {
    if (this.currentRefereeIdx === 3) {
      return false;
    }
    const ref: Referee = this.id2referee.get(this.coaching.referees[this.currentRefereeIdx].refereeId);
    if (ref) {
      const res: boolean = ref && ref.referee.nextRefereeLevel && ref.referee.nextRefereeLevel != null;
      return res;
    } else {
      // console.log('lookingForUpgrade: referee not found !', this.coaching.referees[this.currentRefereeIdx].refereeId, this.id2referee);
      return false;
    }
  }

  makeNotEmpty(value: string, defaultValue: string): string {
    return value && value.trim().length > 0 ?  value : defaultValue;
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////// POSITIVE FEEDBACK ///////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////

  public deletePositiveFeedback(idx: number) {
    this.alertCtrl.create({
      message: 'Do you want to delete the positive feedback '
                + this.coaching.referees[this.currentRefereeIdx].positiveFeedbacks[idx].skillName + '?',
      buttons: [
        { text: 'Cancel', role: 'cancel'},
        {
          text: 'Delete',
          handler: () => {
            this.coaching.referees[this.currentRefereeIdx].positiveFeedbacks.splice(idx, 1);
            this.saveCoaching();
          }
        }
      ]
    }).then( (alert) => alert.present());
  }

  public deliverPositiveFeedback(feedback: PositiveFeedback, feedbackIndex: number) {
    if (!this.readonly) {
      feedback.deliver = !feedback.deliver;
      this.saveCoaching();
    }
  }

  public newPositiveFeedback(event) {
    this.navController.navigateRoot(`/coaching/coach/${this.coaching.id}/referee/${this.currentRefereeIdx}/positiveFeedback/-1`);
  }

  public selectPositiveFeedback(positiveFeedback: PositiveFeedback, index: number) {
    this.navController.navigateRoot(`/coaching/coach/${this.coaching.id}/referee/${this.currentRefereeIdx}/positiveFeedback/${index}`);
  }

  switchPeriod(feedback: any) {
    if (this.coaching.closed) {
      return;
    }
    if (feedback.period === 1) {
      feedback.period = 2;
    } else if (feedback.period === 2) {
      feedback.period = 1;
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////// IMPROVMENT FEEDBACK //////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////

  public newFeedback(event) {
    this.navController.navigateRoot([`/coaching/coach/${this.coaching.id}/referee/${this.currentRefereeIdx}/negativeFeedback/-1`]);
  }

  public deleteFeedback(idx: number) {
    this.alertCtrl.create({
      message: 'Do you want to delete the feedback '
                + this.coaching.referees[this.currentRefereeIdx].feedbacks[idx].problemShortDesc + ' ?',
      buttons: [
        { text: 'Cancel', role: 'cancel'},
        {
          text: 'Delete',
          handler: () => {
            console.log('Deleting feedback.');
            this.coaching.referees[this.currentRefereeIdx].feedbacks.splice(idx, 1);
            this.saveCoaching();
          }
        }
      ]
    }).then( (alert) => alert.present());
  }

  public deliverFeedback(feedback: Feedback, feedbackIndex: number) {
    if (!this.readonly) {
      feedback.deliver = !feedback.deliver;
      this.saveCoaching();
    }
  }

  public selectFeedback(feedback: Feedback, idx: number) {
    this.navController.navigateRoot([`/coaching/coach/${this.coaching.id}/referee/${this.currentRefereeIdx}/negativeFeedback/${idx}`]);
  }

  assessReferee() {
    this.navController.navigateRoot(`/assessment/edit/-1?refereeId=${this.coaching.referees[this.currentRefereeIdx].refereeId}`);
  }

  onSwipe(event) {
    // console.log('onSwipe', event);
    if (event.direction === 4) {
      this.saveNback();
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

  switchLockCoaching() {
    this.coaching.closed = !this.coaching.closed;
    this.computeCoachingValues();
    this.coachingService.save(this.coaching).subscribe();
  }
  get closed() {
    return this.coaching.closed;
  }

  
  async onClickCompetition() {
    if (this.readonly || this.closed) {
      return;
    }
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
    this.onCoachingChange();
  }
  searchReferee(idx: number) {
    this.refereeSelectorService.searchReferee(this.appCoach.region, this.coaching.competitionId)
      .subscribe(referee => {
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
        this.computeRefereeNames();
        this.onCoachingChange();
      });
  }
  deleteReferee(idx: number) {
    this.coaching.referees.splice(idx, 1);
    this.coaching.refereeIds = this.coaching.referees.map((ref) => ref.refereeId);
    this.computeRefereeNames();
    this.onCoachingChange();
  }
  computeTimeSlot(ts: Date): string {
    ts.setMinutes(Math.ceil(ts.getMinutes()/5)*5);
    return this.coachingService.computeTimeSlot(ts);
  }
  setTimeSlot(timeSlot: string) {
    console.log(timeSlot);
    this.coaching.timeSlot = timeSlot;
    this.onCoachingChange();
  }
  deleteSharedUser(user: User) {
    this.deleteFromStringArray(user.id, this.coaching.sharedWith.users);
    this.computeSharedWith();
    this.onCoachingChange();
  }
  deleteSharedGroup(group: UserGroup) {
    this.deleteFromStringArray(group.id, this.coaching.sharedWith.groups);
    this.computeSharedWith();
    this.onCoachingChange();
  }
  deleteFromStringArray(item: string, stringArray: string[]) {
    const idx = stringArray.indexOf(item);
    if (idx >= 0) {
      stringArray.splice(idx, 1);
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

  deleteCoaching() {
    if (this.readonly) {
      return;
    }
    this.alertCtrl.create({
      message: 'Do you reaaly want to delete this coaching?',
      buttons: [
        { text: 'Cancel', role: 'cancel'},
        {
          text: 'Delete',
          handler: () => {
            this.coachingService.delete(this.coaching.id).subscribe(() => {
              this.navController.navigateRoot(`/coaching/list`);
            });
          }
        }
      ]
    }).then( (alert) => alert.present() );
  }
}
