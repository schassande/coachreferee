import { ModalController, LoadingController, NavController } from '@ionic/angular';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';

import { Assessment } from '../../../app/model/assessment';
import { AssessmentService } from './../../../app/service/AssessmentService';
import { BookmarkService } from '../../../app/service/BookmarkService';
import { ConnectedUserService } from '../../../app/service/ConnectedUserService';
import { Coaching } from '../../../app/model/coaching';
import { CoachingService } from '../../../app/service/CoachingService';
import { CONSTANTES } from '../../../app/model/user';
import { DateService } from './../../../app/service/DateService';
import { EmailService } from '../../../app/service/EmailService';
import { HelpService } from './../../../app/service/HelpService';
import { Referee } from '../../../app/model/user';
import { RefereeEditPage } from '../referee-edit/referee-edit';
import { RefereeService } from '../../../app/service/RefereeService';
import { ResponseWithData } from '../../../app/service/response';
import { ToolService } from '../../../app/service/ToolService';

/**
 * Generated class for the RefereeViewPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-referee-view',
  templateUrl: 'referee-view.html',
  styleUrls: ['referee-view.scss']
})
export class RefereeViewPage implements OnInit {
  referee: Referee;
  coachings: Coaching[];
  errorfindCoachings: any;
  assessments: Assessment[];
  errorfindAssessments: any;
  refereeLanguage: string[];
  refereeCountry: string;


  constructor(
    public modalCtrl: ModalController,
    private route: ActivatedRoute,
    private navController: NavController,
    private helpService: HelpService,
    public refereeService: RefereeService,
    public dateService: DateService,
    private assessmentService: AssessmentService,
    public coachingService: CoachingService,
    public connectedUserService: ConnectedUserService,
    public loadingCtrl: LoadingController,
    public bookmarkService: BookmarkService,
    public emailService: EmailService,
    public toolService: ToolService) {
  }

  ngOnInit() {
    this.helpService.setHelp('referee-view');
    this.route.paramMap.pipe(
      map((params: ParamMap) => {
        const id = params.get('id');
        if (id) {
          this.setRefereeId(id);
        } else {
          this.navBack();
        }
      })
    ).subscribe();
  }

  navBack() {
    this.navController.navigateRoot( ['/referee/list']);
  }

  private setRefereeId(id: string) {
    // console.log('RefereeView.setRefereeId(' + id + ')');
    this.refereeService.get(id).subscribe((response: ResponseWithData<Referee>) => {
      if (response.error) {
        this.loadingCtrl.create({
          // content: 'Problem to load referee informaion ...',
          duration: 3000
        }).then( (loader) => loader.present()
        ).then(() => {
          this.navBack();
        });
      } else {
        this.setReferee(response.data);
      }
    });
  }

  private setReferee(referee: Referee) {
    // console.log('RefereeView.setReferee(' + referee + ')');
    this.referee = referee;
    this.refereeCountry = this.toolService.getValue(CONSTANTES.countries, this.referee.country);
    this.refereeLanguage = this.toolService.getValues(CONSTANTES.languages, this.referee.speakingLanguages);
    this.bookmarkPage();
    this.coachingService.getCoachingByReferee(this.referee.id).subscribe((response: ResponseWithData<Coaching[]>) => {
      this.errorfindCoachings = response.error;
      this.coachings = response.data;
    });
    this.assessmentService.getAssessmentByReferee(this.referee.id).subscribe((response: ResponseWithData<Assessment[]>) => {
      this.errorfindAssessments = response.error;
      this.assessments = response.data;
      console.log('Assessments=', this.assessments);
    });
  }

  getRefIdx(coaching: Coaching) {
    return coaching.refereeIds.indexOf(this.referee.id);
  }
  private bookmarkPage() {
    this.bookmarkService.addBookmarkEntry({
      id: 'referee' + this.referee.id,
      label: 'Referee ' + this.referee.shortName,
      url: `/referee/view/${this.referee.id}` });
  }

  public async editReferee() {
    const modal = await this.modalCtrl.create(
      { component: RefereeEditPage, componentProps : {referee: this.referee }});
    modal.onDidDismiss().then( (data) => this.setRefereeId(this.referee.id));
    return await modal.present();
  }
  coachingSelected(event, coaching: Coaching) {
    this.navController.navigateRoot(`/coaching/edit/${coaching.id}`);
  }

  sendCoachings() {
    this.coachings.forEach((coaching: Coaching) => {
      this.coachingService.sendCoachingByEmail(coaching.id).subscribe();
    });
  }
  assessmentSelected(event, assessment: Assessment) {
    this.navController.navigateRoot(`/assessment/edit/${assessment.id}`);
  }

  assessReferee() {
    this.navController.navigateRoot(`/assessment/edit/-1?refereeId=${this.referee.id}`);
  }

  sendAssessments() {
    this.assessments.forEach((assessment: Assessment) => {
      this.assessmentService.sendAssessmentByEmail(assessment.id, assessment.profileId, assessment.refereeId).subscribe();
    });
  }
  onSwipe(event) {
    // console.log('onSwipe', event);
    if (event.direction === 4) {
      this.navBack();
    }
  }
}
