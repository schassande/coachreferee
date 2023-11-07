import { AssessmentService } from './../../../app/service/AssessmentService';
import { Assessment } from './../../../app/model/assessment';
import { HelpService } from './../../../app/service/HelpService';
import { LocalAppSettings } from '../../../app/model/settings';
import { AppSettingsService } from '../../../app/service/AppSettingsService';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { AlertController, NavController, IonSegment, ModalController, ToastController, getTimeGivenProgression, PopoverController } from '@ionic/angular';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';

import { ConnectedUserService } from '../../../app/service/ConnectedUserService';
import { RefereeService } from '../../../app/service/RefereeService';
import { UserService } from '../../../app/service/UserService';
import { ResponseWithData } from '../../../app/service/response';
import { CoachingService } from '../../../app/service/CoachingService';
import { BookmarkService, Bookmark } from '../../../app/service/BookmarkService';
import { Referee, User, UserGroup, UserPreference } from '../../../app/model/user';
import { Coaching, PositiveFeedback, Feedback, RefereeCoaching, CoachingTemplate, CoachingStructure } from '../../../app/model/coaching';
import { DateService } from 'src/app/service/DateService';
import { RefereeSelectorService } from 'src/pages/referee/referee-selector-service';
import { CompetitionSelectorComponent } from 'src/pages/widget/competition-selector';
import { Competition, GameAllocation } from 'src/app/model/competition';
import { SharedWith } from 'src/app/model/common';
import { UserGroupService } from 'src/app/service/UserGroupService';
import { UserSelectorComponent } from 'src/pages/widget/user-selector-component';
import { CompetitionService } from 'src/app/service/CompetitionService';
import { UserPreferenceService } from 'src/app/service/UserPreferenceService';
import { CoachingTemplateService } from 'src/app/service/CoachingTemplateService';

/**
 * Generated class for the CoachingGamePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
export interface CoachingCreationParams extends GameAllocation {
  competitionId: string;
  competitionName: string;
  dateStr: string;
}
const USER_PREF_CAT = 'COACHING_GAME';
const UP_EDIT_STYLE = 'EDIT_STYLE';
const UP_COACHING_TEMPLATE = 'COACHING_TEMPLATE';
type UpEditStyle = 'FREE' | 'CAT' | 'TEM';

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
  id2coachings: Map<string, OtherCoaching[]> = new Map<string, OtherCoaching[]>();
  refereesLoaded = false;
  periods: number[] = [1, 2];
  currentPeriod = 1;
  coachingCoach = '';
  coachingOwner = true;
  readonly = false;
  appCoach: User;
  sending = false;
  sharedWith: SharedWith = { users: [], groups: [] };
  param: CoachingCreationParams = {
    id: undefined,
    date: undefined,
    dateStr: undefined,
    field: undefined,
    timeSlot: undefined,
    gameCategory: 'OPEN',
    gameSpeed:  'Medium',
    gameSkill:  'Medium',
    referees: [],
    refereeCoaches: [],
    competitionId: undefined,
    competitionName: undefined
  };
  refereeName0: string;
  refereeName1: string;
  refereeName2: string;
  agenda: AgendaItem[];
  openPreviousCoaching = false;
  otherCoachingsloaded = false;
  coachingTemplates: CoachingTemplate[] = [];
  preferedCoachingTemplateId: string;
  preferedCoachingStructure: CoachingStructure;
  coachingTemplate: CoachingTemplate;
  topicFeedbacks: TopicFeedbacks[][] = [];

  @ViewChild(IonSegment) segment: IonSegment;

  constructor(
    public alertCtrl: AlertController,
    private appSettingsService: AppSettingsService,
    private assessmentService: AssessmentService,
    private bookmarkService: BookmarkService,
    private changeDetectorRef: ChangeDetectorRef,
    public coachingService: CoachingService,
    private coachingTemplateService: CoachingTemplateService,
    private competitionService: CompetitionService,
    public connectedUserService: ConnectedUserService,
    public dateService: DateService,
    private modalController: ModalController,
    private navController: NavController,
    private helpService: HelpService,
    private popoverController: PopoverController,
    private refereeSelectorService: RefereeSelectorService,
    public refereeService: RefereeService,
    private route: ActivatedRoute,
    public toastController: ToastController,
    public userGroupService: UserGroupService,
    private userPreferenceService: UserPreferenceService,
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
      mergeMap(() => this.loadCoachingTemplates()),
      mergeMap(() => this.loadUserPreference()),
      mergeMap(() => this.loadCoaching()),
      mergeMap((response) => {
        this.coaching = response.data;
        if (this.coaching) {
          if (this.coaching.coachingTemplateId) {
            this.coachingTemplate = this.coachingTemplates.find((ct) => ct.id === this.coaching.coachingTemplateId);
          }
          return of(this.coaching);
        } else {
          return this.initCoaching();
        }
      }),
      map(() => {
        this.clean(this.coaching);
        this.computeCoachingValues();
        this.computeTopicFeedbacks();
        this.loadingReferees();
        this.computeSharedWith();
        this.bookmarkPage();
        this.loadAssessments();
        this.loadOtherCoachings();
        this.loadDayCoachings();
      })
    ).subscribe();
  }

  loadCoachingTemplates():Observable<any> {
    return this.coachingTemplateService.all().pipe(
      map((rtemplates) => this.coachingTemplates = rtemplates.data)
    )
  }
  loadUserPreference():Observable<any> {
    return this.userPreferenceService.getMyPreferences(USER_PREF_CAT).pipe(
      map((rup) => this.userPreferenceService.toMap(rup.data)),
      map((userPreferences: Map<string,UserPreference>) => {
        // compute the prefered coaching structure of the user
        this.preferedCoachingStructure = '+-';
        const userPrefValue = this.userPreferenceService.getValue<string>(userPreferences, UP_EDIT_STYLE, this.preferedCoachingStructure);
        switch(userPrefValue){
          case 'FREE': //map old value to new ones
            this.preferedCoachingStructure = 'TEXT';
            break;
          case 'CAT': //map old value to new ones
            this.preferedCoachingStructure = '+-';
            break;
          case 'TEM': //map old value to new ones
            this.preferedCoachingStructure = 'BPS';
            break;
          default:
            this.preferedCoachingStructure = userPrefValue as CoachingStructure;
            break;
        }
        // compute the prefered coaching template of the user
        this.preferedCoachingTemplateId = this.userPreferenceService.getValue<string>(userPreferences, UP_COACHING_TEMPLATE, undefined);
        if (this.preferedCoachingTemplateId) {
          this.coachingTemplate = this.coachingTemplates.find((ct) => ct.id === this.preferedCoachingTemplateId);
        } else if (this.coachingTemplates.length > 0) {
          this.coachingTemplate = this.coachingTemplates[0];
          this.preferedCoachingTemplateId = this.coachingTemplate.id;
        }
      })
    );
  }
  onCoachingStructureChange() {
    this.userPreferenceService.setMyPreference(USER_PREF_CAT, UP_EDIT_STYLE, this.coaching.coachingStructure).subscribe();
    this.onCoachingChange();
  }
  onCoachingTemplateChange() {
    this.coachingTemplate = this.coachingTemplates.find((ct) => ct.id === this.preferedCoachingTemplateId);
    this.userPreferenceService.setMyPreference(USER_PREF_CAT, UP_COACHING_TEMPLATE, this.coaching.coachingTemplateId).subscribe();
    this.onCoachingChange();
  }
  computeRefereeNames() {
    this.refereeName0 = this.getReferee(0);
    this.refereeName1 = this.getReferee(1);
    this.refereeName2 = this.getReferee(2);
  }

  loadParams(): Observable<any> {
    return this.route.queryParams.pipe(
      map((params) => {
        console.log('Params ', params);
        this.param.competitionName = params.competitionName;
        this.param.competitionId = params.competitionId;
        this.param.field = params.field;
        this.param.dateStr = params.dateStr;
        this.param.gameCategory = params.gameCategory;
        this.param.gameSpeed = params.gameSpeed;
        this.param.gameSkill = params.gameSkill;
      }));
  }

  initCoaching(): Observable<any> {
    return this.competitionService.get(this.appCoach.defaultCompetitionId).pipe(
      map((rcompetition) => {
        let defaultCompetitionName = this.appCoach.defaultCompetition;
        let defaultCompetitionId = '';
        if (this.param.competitionName && this.param.competitionId) {
          defaultCompetitionName = this.param.competitionName;
          defaultCompetitionId = this.param.competitionId;
        } else if (rcompetition.data) {
          defaultCompetitionName = rcompetition.data.name;
          defaultCompetitionId = rcompetition.data.id;
        }
        this.coaching = {
          id: null,
          version: 0,
          creationDate : new Date(),
          lastUpdate : new Date(),
          dataStatus: 'NEW',
          coachingStructure: this.preferedCoachingStructure,
          coachingTemplateId: this.preferedCoachingTemplateId,
          competition: defaultCompetitionName,
          competitionId: defaultCompetitionId,
          field: this.param.field ? this.param.field : '1',
          date : this.param.dateStr ? this.dateService.string2date(this.param.dateStr, new Date()) : new Date(),
          timeSlot: this.param.timeSlot ? this.param.timeSlot : this.computeTimeSlot(new Date()),
          coachId: this.appCoach.id,
          gameCategory: this.param.gameCategory ? this.param.gameCategory : 'OPEN',
          gameSpeed: this.param.gameSpeed ? this.param.gameSpeed : 'Medium',
          gameSkill: this.param.gameSkill ? this.param.gameSkill : 'Medium',
          referees : this.param.referees ? this.param.referees.map((ref) => {
            return {
              refereeId: ref.refereeId,
              refereeShortName: ref.refereeShortName,
              feedbacks: [],
              positiveFeedbacks: [],
              comments: '',
              upgrade: null,
              rank: 0
            };
          }) : [],
          refereeIds: this.param.referees ? this.param.referees.map((ref) => ref.refereeId) : [],
          currentPeriod : 1,
          closed: false,
          sharedWith: {
            users: [],
            groups: []
          }
        };
        console.log('Coaching date:', this.coaching.date);
        return this.coaching;
      }));
  }

  computeCoachingValues() {
    if (!this.coaching.currentPeriod) {
      this.coaching.currentPeriod = 1;
    }
    this.coachingOwner =  this.coaching.coachId === this.appCoach.id;
    this.coachingCoach = (this.coachingOwner ? 'me' : 'another coach');
    this.readonly = !this.coachingOwner || this.coaching.closed;
  }

  private computeTopicFeedbacks() {
    // for each referee
    this.topicFeedbacks = this.coaching.referees.map((rc, idx) => {
      // group feedback item by topic
      let refereeTopicFeedbacks: TopicFeedbacks[] = [];
      this.coaching.referees[idx].feedbacks.forEach((f,idx) => {
        this.getOrCreateHolder(refereeTopicFeedbacks, f.topicName).feedbacks.push({idx, ...f});
      });
      this.coaching.referees[idx].positiveFeedbacks.forEach((f,idx) => {
        this.getOrCreateHolder(refereeTopicFeedbacks, f.topicName).positiveFeedbacks.push({idx, ...f});
      });
      if (this.coachingTemplate) {
        refereeTopicFeedbacks = this.coachingTemplate.topics.map(t => {
          const rtfIdx = refereeTopicFeedbacks.findIndex(rtf => rtf.topicName === t.name);
          if (rtfIdx >= 0) {
            const rtf = refereeTopicFeedbacks.splice(rtfIdx, 1)[0];
            rtf.description = t.description;
            return rtf;
          } else {
            return {topicName: t.name, description: t.description, feedbacks:[], positiveFeedbacks: []};
          }
        }).concat(refereeTopicFeedbacks);
      }
      return refereeTopicFeedbacks;
    });
  }
  showHelpFeedback(tf: TopicFeedbacks) {
    this.alertCtrl.create({header: tf.topicName, message: tf.description})
      .then( (alert) => alert.present());
  }
  private getOrCreateHolder(holders: TopicFeedbacks[], topicName: string) {
    const _topicName = topicName ? topicName : 'Other';
    let holder = holders.find(tf => tf.topicName === _topicName);
    if (!holder) {
      holder = { topicName: _topicName, description: undefined, feedbacks: [], positiveFeedbacks: []};
      holders.push(holder);
    }
    return holder;
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
    this.computeTopicFeedbacks();
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
      return referee.firstName + ' ' + referee.lastName + ' (' + referee.shortName + ')';
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
        this.computeRefereeNames();
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
        })
      ).subscribe();
    });
  }
  private loadOtherCoachings() {
    this.otherCoachingsloaded = false;
    forkJoin(this.coaching.refereeIds.map((refId) => {
      return this.coachingService.getCoachingByReferee(refId).pipe(
        map((rcoachings) => {
          if (rcoachings.data) {
            const cs: Coaching[] = rcoachings.data
              .filter(c => c.id !== this.coaching.id 
                && (
                  (this.coaching.competitionId && c.competitionId === this.coaching.competitionId)
                  || (!this.coaching.competitionId && c.competition === this.coaching.competition)));
            this.coachingService.sortCoachings(cs, true);
            const ocs: OtherCoaching[] = cs.map(c => { 
              return { ...c, refereeCoaching: c.referees.filter(r => r.refereeId === refId)[0] }; 
            })
            this.id2coachings.set(refId, ocs);
          }
        })
      );
    })).subscribe(() => this.otherCoachingsloaded = true);
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
    this.bookmarkService.setContext([]);
  }

  refereeSelected(refereeIndex = Number.parseInt(this.segment.value)) {
    if (this.segment) { // prevent call before the component has been initialised.
      if (refereeIndex === 3 || refereeIndex === 4){
        this.currentRefereeIdx = refereeIndex;
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
    this.saveCoaching();
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
  toggleAppliedLater(feedback: Feedback) {
    if (!this.readonly) {
      feedback.appliedLater = !feedback.appliedLater;
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
      if (result.data) {
        this.competitionInfoSelected(result.data.name, result.data.id).subscribe();
      }
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

  set date(dateStr: any) {
    this.coachingService.setStringDate(this.coaching, dateStr);
    this.popoverController.dismiss();
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
        this.addRefereeToCompetition(referee);
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


  /////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////// AGENDA /////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////
  loadDayCoachings() {
    if (!this.coaching) {
      return;
    }
    const begin = this.dateService.to00h00(new Date(this.coaching.date));
    const end = this.dateService.to00h00(new Date(this.coaching.date));
    this.coachingService.getCoachingByRefereeCoachCompetition(this.coaching.coachId, begin, end).subscribe((rcs) => {
      if (rcs.data) {
        this.agenda = rcs.data.map((c: Coaching) => {
          return { coaching: c, 
            color: this.getAgendaItemColor(c),
            date: this.coachingService.getCoachingDateAsString(c),
            refereeShortNames: c.referees.map((ref) => ref.refereeShortName).join(', ')
          };
        }).sort((a1,a2) => a1.coaching.timeSlot.localeCompare(a2.coaching.timeSlot));
      } else {
        this.agenda = [];
      }
    });
  }
  getAgendaItemColor(coaching: Coaching): string {
    const delta = this.getDateTime(this.coaching).getTime() - this.getDateTime(coaching).getTime(); 
    return coaching.id === this.coaching.id 
      ? 'success' 
      : (delta > 0 ? 'warning' : 'normal');
  }
  getDateTime(coaching: Coaching): Date {
    if (!coaching) return new Date();
    const [hours, minutes] = coaching.timeSlot.split(":");
    const date = new Date(coaching.date);
    date.setHours(Number.parseInt(hours, 10));
    date.setMinutes(Number.parseInt(minutes, 10));
    return date;
  }
  coachingSelected(coaching) {
    this.navController.navigateRoot(`/coaching/coach/${coaching.id}`);
  }
  newCoaching() {
    const params = {
      queryParams: {
        competitionName: this.coaching.competition,
        competitionId: this.coaching.competitionId,
        field: this.coaching.field,
        dateStr: this.dateService.date2string(this.coaching.date),
        gameCategory: this.coaching.gameCategory,
        gameSpeed: this.coaching.gameSpeed,
        gameSkill: this.coaching.gameSkill,
      }
    };
    this.navController.navigateRoot('/coaching/create', params);
  }
  addRefereeToCompetition(referee: Referee) {
    if (this.coaching.competitionId && referee) {
      this.competitionService.get(this.coaching.competitionId).pipe(
        mergeMap((rcomp) => {
          if (!rcomp.data) {
            // Competition does not exist any more
            return of('');
          }
          const competition: Competition = rcomp.data;
          const ref = competition.referees.find(ref => ref.refereeId === referee.id);
          if (ref) {
            // referee already belongs the competition => nothing to do
            return of('');
          } else {
            // add the referee to the competition
            competition.referees.push({ refereeId: referee.id, refereeShortName: referee.shortName});
            return this.competitionService.save(competition);
          }
        })
      ).subscribe();
    } // else the coaching is not linked to a competition 
  }
}
interface AgendaItem {
  coaching: Coaching;
  color: string;
  date: string;
  refereeShortNames: string;
}
interface OtherCoaching extends Coaching {
  refereeCoaching: RefereeCoaching;
}

interface TopicFeedbacks {
  topicName: string;
  description: string;
  positiveFeedbacks: PositiveFeedbackWithIndex[];
  feedbacks: FeedbackWithIndex[];
}

interface PositiveFeedbackWithIndex extends PositiveFeedback {
  idx: number;
}
interface FeedbackWithIndex extends Feedback {
  idx: number;
}
