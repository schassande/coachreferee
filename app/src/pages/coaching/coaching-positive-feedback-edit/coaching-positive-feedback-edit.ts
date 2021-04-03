import { HelpService } from './../../../app/service/HelpService';
import { Component, OnInit } from '@angular/core';
import { flatMap, map } from 'rxjs/operators';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, of } from 'rxjs';
import { NavController } from '@ionic/angular';

import { CoachingService } from '../../../app/service/CoachingService';
import { ConnectedUserService } from '../../../app/service/ConnectedUserService';
import { User } from '../../../app/model/user';
import { Coaching, PositiveFeedback } from '../../../app/model/coaching';

/**
 * Generated class for the CoachingPositiveFeedbackEditPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-coaching-positive-feedback-edit',
  templateUrl: 'coaching-positive-feedback-edit.html',
})
export class CoachingPositiveFeedbackEditPage implements OnInit {

  coachingId: string;
  coaching: Coaching;
  feedback: PositiveFeedback;
  feedbackIndex: number;
  referees: string[];
  refereeIndex: number;
  readonly = false;
  coachingCoach = '';
  coachingOwner = true;
  appCoach: User;

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private helpService: HelpService,
    public connectedUserService: ConnectedUserService,
    private coachingService: CoachingService) {
  }

  ngOnInit() {
    this.helpService.setHelp('coaching-game-positive-point');
    this.appCoach = this.connectedUserService.getCurrentUser();
    this.route.paramMap.pipe(
      flatMap( (paramMap: ParamMap) => {
        this.coachingId = paramMap.get('id');
        this.refereeIndex = parseInt(paramMap.get('refereeIdx'), 10);
        this.feedbackIndex = parseInt(paramMap.get('feedbackIdx'), 10);
        return this.coachingService.get(this.coachingId);
      }),
      map( (resCoach) => {
        this.coaching = resCoach.data;
        if (this.feedbackIndex >= 0) {
          this.feedback = this.coaching.referees[this.refereeIndex].positiveFeedbacks[this.feedbackIndex];
        } else {
          this.feedback = {
            skillName: '',
            description: '',
            period: this.coaching.currentPeriod,
            deliver: false
          };
        }
        this.referees = this.coaching.referees.map((ref) => ref.refereeShortName);
        this.coachingOwner =  this.coaching.coachId === this.appCoach.id;
        this.coachingCoach = (this.coachingOwner ? 'me' : 'another coach');
        this.readonly = !this.coachingOwner || this.coaching.closed;
      })
    ).subscribe();
  }
  saveNback() {
    console.log('Save and Back');
    this.save().subscribe(() => {
      console.log('saved');
      this.navController.navigateRoot(`/coaching/coach/${this.coaching.id}?refereeIdx=${this.refereeIndex}`);
    });
  }
  private save(): Observable<any> {
    if (this.readonly) { return of(''); }
    if (this.isFeedbackValid()) {
      // make sure fields are not enmpty
      this.feedback.description = this.makeNotEmpty(this.feedback.description, this.feedback.skillName);
      if (this.feedbackIndex < 0) {
        this.feedbackIndex = this.coaching.referees[this.refereeIndex].positiveFeedbacks.length;
        this.coaching.referees[this.refereeIndex].positiveFeedbacks.push(this.feedback);
        console.log('Add positive feedback \'', this.feedback.skillName, '\/', this.feedbackIndex,
          ' of the referee ', this.coaching.referees[this.refereeIndex].refereeShortName);
      } else {
        console.log('Update positive feedback \'', this.feedback.skillName, '\/', this.feedbackIndex,
          ' of the referee ', this.coaching.referees[this.refereeIndex].refereeShortName);
      }
      return this.coachingService.save(this.coaching);
    } else if (this.feedbackIndex >= 0) {
      console.log('Remove feedback \'', this.feedback.skillName, '\'/', this.feedbackIndex,
        ' of the referee ', this.coaching.referees[this.refereeIndex].refereeShortName);
      // remove it
      this.coaching.referees[this.refereeIndex].positiveFeedbacks.splice(this.feedbackIndex, 1);
      // save the coaching
      return this.coachingService.save(this.coaching);
    } else {
      // the feedback was new => nothing to do, just forget it
      return of('');
    }
  }

  isFeedbackValid(): boolean {
    return this.feedback.skillName && this.feedback.skillName !== null && this.feedback.skillName.trim().length > 0;
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
