import { HelpService } from './../../../app/service/HelpService';
import { CoachingService } from '../../../app/service/CoachingService';
import { User } from '../../../app/model/user';
import { Coaching, CoachingTemplate } from '../../../app/model/coaching';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ResponseWithData } from '../../../app/service/response';
import { PROService } from '../../../app/service/PROService';
import { ConnectedUserService } from '../../../app/service/ConnectedUserService';
import { PRO, Feedback, PersistentPRO } from '../../../app/model/coaching';
import { AlertOptions, AlertInput } from '@ionic/core';
import { map } from 'rxjs/operators';
import { mergeMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { CoachingTemplateService } from 'src/app/service/CoachingTemplateService';

/**
 * Generated class for the CoachingImprovmentFeedbackEditPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'app-page-coaching-improvment-feedback-edit',
  templateUrl: 'coaching-improvment-feedback-edit.html',
})
export class CoachingImprovmentFeedbackEditPage implements OnInit {

  coachingId: string;
  coaching: Coaching;
  feedback: Feedback;
  feedbackIndex: number;
  referees: string[];
  refereeIndex: number;
  readonly = false;
  coachingCoach = '';
  coachingOwner = true;
  appCoach: User;

  searchInput: string;
  showProList = false;
  pros: PRO[];
  applyToReferee: boolean[] = [];
  applyToAll = false;
  coachingTemplate: CoachingTemplate;

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private helpService: HelpService,
    public connectedUserService: ConnectedUserService,
    private coachingService: CoachingService,
    private coachingTemplateService: CoachingTemplateService,
    public proService: PROService,
    public alertCtrl: AlertController) {
  }

  ngOnInit() {
    this.helpService.setHelp('coaching-game-axis-improvment');
    // console.log('ionViewDidLoad CoachingImprovmentFeedbackEditPage');
    this.appCoach = this.connectedUserService.getCurrentUser();
    this.route.paramMap.pipe(
      mergeMap( (paramMap: ParamMap) => {
        this.coachingId = paramMap.get('id');
        this.refereeIndex = parseInt(paramMap.get('refereeIdx'), 10);
        this.feedbackIndex = parseInt(paramMap.get('feedbackIdx'), 10);
        return this.coachingService.get(this.coachingId);
      }),
      map( (resCoach) => {
        this.coaching = resCoach.data;
        this.applyToReferee = this.coaching.referees.map((r,idx) => idx===this.refereeIndex);
        this.applyToAll = false;
        if (this.feedbackIndex >= 0) {
          this.feedback = this.coaching.referees[this.refereeIndex].feedbacks[this.feedbackIndex];
        } else {
          this.feedback = {
            priority: 0,
            period: this.coaching.currentPeriod,
            appliedLater: false,
            problemShortDesc: '',
            coachId: this.appCoach.id,
            skillName: '',
            problem: '',
            remedy: '',
            outcome: '',
            deliver: false,
            topicName: ''
          };
        }
        this.referees = this.coaching.referees.map((ref) => ref.refereeShortName);
        this.coachingOwner =  this.coaching.coachId === this.appCoach.id;
        this.coachingCoach = (this.coachingOwner ? 'me' : 'another coach');
        this.readonly = !this.coachingOwner || this.coaching.closed;
      }),
      map(() => {
        if (this.coaching.coachingTemplateId) {
          this.coachingTemplateService.get(this.coaching.coachingTemplateId)
            .subscribe((rt) => this.coachingTemplate = rt.data)
        }
      })
    ).subscribe();
  }
  back() {
    this.navController.navigateRoot(`/coaching/coach/${this.coaching.id}?refereeIdx=${this.refereeIndex}`);
  }
  saveNback() {
    this.save().subscribe((success) => {
      if (success) {
        this.back();
      }
    });
  }

  private save(): Observable<boolean> {
    if (this.readonly) { return of(true); }
    if (this.isFeedbackValid()) {
      // make sure fields are not enmpty
      this.feedback.skillName = this.makeNotEmpty(this.feedback.skillName, '-');
      this.feedback.problem = this.makeNotEmpty(this.feedback.problem, this.feedback.problemShortDesc);
      this.feedback.remedy = this.makeNotEmpty(this.feedback.remedy, '-');
      this.feedback.outcome = this.makeNotEmpty(this.feedback.outcome, '-');
      if (this.feedbackIndex < 0) {
        this.coaching.referees[this.refereeIndex].feedbacks.push(this.feedback);
        console.log('Add improvment feedback \'', this.feedback.problemShortDesc, '\/', this.feedbackIndex,
          ' of the referee ', this.coaching.referees[this.refereeIndex].refereeShortName);
      } else {
        console.log('Update improvment feedback \'', this.feedback.problemShortDesc, '\/', this.feedbackIndex,
          ' of the referee ', this.coaching.referees[this.refereeIndex].refereeShortName);
      }
      this.coaching.referees.forEach((r,idx) => {
        if (this.refereeIndex !== idx && (this.applyToAll || this.applyToReferee[idx])) {
          r.feedbacks.push(this.clone(this.feedback));
        }
      });
      return this.coachingService.saveWithRetry(this.coaching, this.alertCtrl, 'Error during saving of the improvement feedback')
        .pipe(map(res => res.data !== null));

    }  else if (this.feedbackIndex >= 0) {
      console.log('Remove feedback \'', this.feedback.problemShortDesc, '\'/', this.feedbackIndex,
        ' of the referee ', this.coaching.referees[this.refereeIndex].refereeShortName);
      // remove it
      this.coaching.referees[this.refereeIndex].feedbacks.splice(this.feedbackIndex, 1);

      // save the coaching
      return this.coachingService.saveWithRetry(this.coaching, this.alertCtrl, 'Error during removing of the improvement feedback')
        .pipe(map(res => res.data !== null));
    } else {
      // the feedback was new => nothing to do, just forget it
      return of(true);
    }
  }

  isFeedbackValid(): boolean {
    return this.feedback.problemShortDesc && this.feedback.problemShortDesc !== null && this.feedback.problemShortDesc.trim().length > 0;
  }

  onSearchBarInput() {
    const req = this.searchInput;
    if (req && req.trim().length > 0) {
      this.feedback.problemShortDesc = this.searchInput.trim();
      this.proService.searchPros(req.trim()).subscribe((response: ResponseWithData<PersistentPRO[]>) => {
        this.pros = response.data;
        this.showProList = this.pros && this.pros.length > 0;
      });
    } else {
      this.pros = null;
      this.showProList = false;
    }
  }

  proSelected($event, pro) {
    this.feedback.skillName = pro.skillName;
    this.feedback.problem = pro.problem;
    this.feedback.problemShortDesc = pro.problemShortDesc;
    this.feedback.remedy = pro.remedy;
    this.feedback.outcome = pro.outcome;
    this.showProList = false;
  }

  newPro(event= null) {
    const pro: PersistentPRO = {
      id: null,
      version: 0,
      creationDate : new Date(),
      lastUpdate : new Date(),
      dataStatus: 'NEW',
      complete: false,
      sharedWith: { users: [], groups: [] },
      coachId: this.connectedUserService.getCurrentUser().id,
      skillName: this.feedback.skillName,
      problem: this.feedback.problem,
      problemShortDesc: this.feedback.problemShortDesc,
      remedy: this.feedback.remedy,
      outcome: this.feedback.outcome
    };
    this.proService.save(pro).subscribe();
  }
  periodSelect(period: number) {
    if (!this.readonly) {
      this.feedback.period = period;
    }
  }
  getOtherReferees(): string[] {
    return this.referees.filter((ref, idx) => {
      // console.log('idx= ', idx, ' refereeIndex=', this.refereeIndex);
      return ref && ref.length > 0 && idx !== this.refereeIndex;
    });
  }
  toggleApplyToReferee(idx: number) {
    if (!this.applyToAll) {
      this.applyToReferee[idx] = !this.applyToReferee[idx];
    }
  }

  copyFeedbackToAnotherReferee() {
    const otherReferees: string[] = this.getOtherReferees();
    const inputs: AlertInput[] =  [];
    otherReferees.forEach(refShortName => {
      inputs.push({ type: 'checkbox', label: refShortName, value: refShortName, checked: true });
    });

    const opts: AlertOptions = {
      message: 'Choose the other referees',
      inputs,
      buttons: [
        'Cancel',
        {
          text: 'Add',
          handler: (data: string[]) => {
            console.log('Radio data:', data);
            let needToSave = false;
            data.forEach(refShortName => {
              const otherRefereeIndex: number = this.referees.indexOf(refShortName);
              if (otherRefereeIndex >= 0) {
                this.coaching.referees[otherRefereeIndex].feedbacks.push(this.clone(this.feedback));
                needToSave = true;
              }
            });
            if (needToSave) {
              this.coachingService.save(this.coaching).subscribe();
            }
          }
        }]
    };
    this.alertCtrl.create(opts).then( (alert) => alert.present());
  }
  private clone(feedback: Feedback): Feedback {
    return JSON.parse(JSON.stringify(feedback));
  }
  private makeNotEmpty(value: string, defaultValue: string): string {
    return value && value.trim().length > 0 ?  value : defaultValue;
  }
  onSwipe(event) {
    // console.log('onSwipe', event);
    if (event.direction === 4) {
      this.saveNback();
    }
  }
}
