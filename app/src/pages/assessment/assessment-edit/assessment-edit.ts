import { CompetitionService } from '../../../app/service/CompetitionService';
import { CompetitionSelectorComponent } from '../../widget/competition-selector';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SkillProfile } from '../../../app/model/skill';
import { Observable, of } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { ResponseWithData } from '../../../app/service/response';
import { AppSettingsService } from '../../../app/service/AppSettingsService';
import { AssessmentService } from '../../../app/service/AssessmentService';
import { RefereeService } from '../../../app/service/RefereeService';
import { UserService } from '../../../app/service/UserService';
import { ConnectedUserService } from '../../../app/service/ConnectedUserService';
import { SkillProfileService } from '../../../app/service/SkillProfileService';
import { Referee, User } from '../../../app/model/user';
import { Assessment, SkillSetEvaluation } from '../../../app/model/assessment';

import { mergeMap, map, catchError } from 'rxjs/operators';
import { RefereeSelectorService } from 'src/pages/referee/referee-selector-service';

@Component({
  selector: 'app-page-assessment-edit',
  templateUrl: 'assessment-edit.html',
  styleUrls: ['assessment-edit.scss']
})
export class AssessmentEditPage implements OnInit {

  assessment: Assessment = null;
  assessmentCoach = '';
  assessmentOwner = true;
  readonly = false;
  id2referee: Map<string, Referee> = new Map<string, Referee>();
  refereesLoaded = false;
  profiles: SkillProfile[];
  assessmentValid = false;
  profileId: string;
  appCoach: User;
  sending = false;
  param = {
    refereeId: null as string,
 };

  constructor(
    public modalController: ModalController,
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private navController: NavController,
    public connectedUserService: ConnectedUserService,
    private competitionService: CompetitionService,
    public userService: UserService,
    public refereeService: RefereeService,
    public assessmentService: AssessmentService,
    public skillProfileService: SkillProfileService,
    public appSettingsService: AppSettingsService,
    private refereeSelectorService: RefereeSelectorService,
    public toastController: ToastController) {
  }

  ngOnInit() {
    this.appCoach = this.connectedUserService.getCurrentUser();
    this.loadParams().pipe(
      mergeMap(() => this.loadAssessment()),
      mergeMap((response: ResponseWithData<Assessment>) => {
        this.assessment = response.data;
        if (this.assessment) {
          if (!this.assessment.profileType) {
            this.assessment.profileType = 'REFEREE';
          }
          this.profileId = this.assessment.profileId;
          return of(this.assessment);
        } else {
          return this.initAssessment();
        }
      }),
      map(() => {
        this.computeAssessmentValues();
        this.assessmentService.currentAssessment = this.assessment;
        // console.log('this.assessment.profileType=' + this.assessment.profileType);
        return this.assessment;
      }),
      // load profiles
      mergeMap(() => this.loadProfiles()),
      // load referees
      mergeMap(() => this.assessmentService.loadingReferees(this.assessment, this.id2referee)),
      map(() => {
        console.log('Param=' + JSON.stringify(this.param));
        if (this.assessment.dataStatus ===  'NEW' && this.param.refereeId) {
          this.setRefereeId(this.param.refereeId);
        }
        this.refereesLoaded = true;
        this.updateAssessmentValid();
        this.changeDetectorRef.detectChanges();
      })
    ).subscribe();
  }

  private loadProfiles(): Observable<SkillProfile[]> {
    return this.skillProfileService.allProfiles(this.assessment.profileType).pipe(
      map((res: ResponseWithData<SkillProfile[]>) => {
        this.profiles = this.skillProfileService.sort(res.data);
        if (this.assessment && this.assessment.dataStatus === 'NEW') {
          this.profileId = this.profiles && this.profiles.length ? this.profiles[0].id : null;
        }
        return this.profiles;
      })
    );
  }

  computeAssessmentValues() {
    if (this.assessment) {
      this.assessmentOwner =  this.assessment.coachId === this.appCoach.id;
      this.assessmentCoach = (this.assessmentOwner ? 'me' : 'another coach');
      this.readonly = !this.assessmentOwner || this.assessment.closed;
    }
  }

  switchLockCoaching() {
    if (this.assessmentValid) {
      this.assessment.closed = !this.assessment.closed;
      this.computeAssessmentValues();
      this.adjustFromProfile();
      this.assessmentService.save(this.assessment).subscribe();
    }
  }

  public updateAssessmentValid() {
    this.assessmentValid = this.assessment &&  this.profileId && this.assessment.refereeId && true;
  }

  updateAssessedLevel() {
    this.updateAssessmentValid();
  }

  private loadAssessment(): Observable<ResponseWithData<Assessment>> {
    return this.route.paramMap.pipe(
      mergeMap( (paramMap: ParamMap) => {
        const assessmentId = paramMap.get('id');
        return this.assessmentService.get(assessmentId);
      })
    );
  }

  loadParams(): Observable<any> {
    return this.route.queryParams.pipe(
      map((params) => {
        this.param.refereeId = params.refereeId;
      }));
  }

  initAssessment(): Observable<Assessment> {
    return this.competitionService.get(this.appCoach.defaultCompetitionId).pipe(
      map((rcompetition) => {
        let defaultCompetitionName = this.appCoach.defaultCompetition;
        let defaultCompetitionId = '';
        if (rcompetition.data) {
          defaultCompetitionName = rcompetition.data.name;
          defaultCompetitionId = rcompetition.data.id;
        }
        this.assessment = {
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
            refereeId : this.param.refereeId,
            refereeShortName: '-',
            comment: '-',
            profileId: null,
            profileName: '-',
            profileType: 'REFEREE',
            skillSetEvaluation: [],
            competency: 'NE',
            closed: false,
            sharedWith: {
              users: [],
              groups: []
            }
        };
        console.log('NEW this.assessment.profileType=' + this.assessment.profileType);
        return this.assessment;
      })
    );
  }

  getReferee(): string {
    const refereeId = this.assessment.refereeId;
    if (refereeId === null) {
      return '';
    }
    const referee: Referee = this.id2referee.get(refereeId);
    if (referee) {
      return referee.firstName + ' (' + referee.shortName + ')';
    } else {
      return this.assessment.refereeShortName;
    }
  }

  get competition() {
    return this.assessment.competition;
  }

  set competition(c: string) {
    this.assessment.competition = c;
    this.userService.update(this.assessment.coachId, (user: User) => { user.defaultCompetition = c; return user; }).subscribe();
  }
  async onClickCompetition() {
    const modal = await this.modalController.create({
      component: CompetitionSelectorComponent,
      componentProps: { name: this.assessment.competition}
    });
    modal.onDidDismiss().then( (result) => {
      this.competitionInfoSelected(result.data.name, result.data.id).subscribe();
    });
    modal.present();
  }

  competitionInfoSelected(competitionName: string, competitionId: string): Observable<any> {
    this.assessment.competition = competitionName;
    this.assessment.competitionId = competitionId;
    this.connectedUserService.getCurrentUser().defaultCompetition = competitionName;
    this.connectedUserService.getCurrentUser().defaultCompetitionId = competitionId;
    return this.userService.update(this.assessment.coachId, (user: User) => {
      user.defaultCompetition = competitionName;
      user.defaultCompetitionId = competitionId;
      return user;
    });
  }

  onProfileTypechange() {
    this.loadProfiles().subscribe();
  }
  get date() {
    return this.assessmentService.getAssessmentDateAsString(this.assessment);
  }

  set date(dateStr: string) {
    this.assessmentService.setStringDate(this.assessment, dateStr);
  }

  get closed() {
    return this.assessment.closed;
  }

  async searchReferee(idx: number) {
    this.refereeSelectorService.searchReferee(this.appCoach.region, this.assessment.competitionId)
      .subscribe(referee => this.setReferee(referee));
  }
  private setRefereeId(refereeId: string) {
    console.log('setRefereeId(' + refereeId + ')');
    this.setReferee(this.id2referee.get(refereeId));
  }

  private setReferee(referee: Referee) {
    console.log('setReferee(' + referee + ')');
    if (referee) {
      // a referee has been selected
      this.assessment.refereeId = referee.id;
      this.assessment.refereeShortName = referee.shortName;
      this.id2referee.set(referee.id, referee);
      this.updateAssessmentValid();
      if (referee.referee.nextRefereeLevel) {
        // try to find the right profile from the referee
        const foundProfiles = this.profiles.filter((profile) => {
          // console.log('profile.level=', profile.level, 'referee.referee.nextRefereeLevel', referee.referee.nextRefereeLevel);
          return profile.level === referee.referee.nextRefereeLevel;
        });
        if (foundProfiles.length > 0) {
          // a profile has been found => use it
          this.profileId = foundProfiles[0].id;
          this.adjustFromProfile();
        }
      }
    }
}

  computeTimeSlot(ts: Date): string {
    return this.assessmentService.computeTimeSlot(ts);
  }

  assess(event) {
    this.adjustFromProfile();
    this.assessmentService.save(this.assessment).pipe(
      map((response: ResponseWithData<Assessment>) => {
        this.navController.navigateRoot(`/assessment/assess/${response.data.id}`);
      })).subscribe();
  }

  saveNback() {
    if (this.assessment.closed || !this.assessmentValid) {
      this.navController.navigateRoot(`/assessment/list`);
    } else {
      this.assessmentService.save(this.assessment).subscribe(() => {
        console.log('saved');
        this.navController.navigateRoot(`/assessment/list`);
      });
    }
  }

  sendAssessment() {
    this.sending = true;
    this.assessmentService.sendAssessmentByEmail(this.assessment.id, this.assessment.profileId, this.assessment.refereeId)
      .pipe(
        map((res) => {
          this.sending = false;
          this.toastController.create({
            message : 'An email has been sent with the assessment sheet.',
            position: 'bottom', color: 'light',
            duration: 3000 }).then((toast) => toast.present());
          console.log('sendAssessment =>' + JSON.stringify(res));
        }),
        catchError( (err: any) => {
          this.sending = false;
          console.error(err);
          return of(err);
        })
      )
      .subscribe();
  }

  private getProfile(profileId): SkillProfile {
    return this.profiles.filter( (profile) => profileId === profile.id)[0];
  }
  private adjustFromProfile() {
    if (this.profileId === this.assessment.profileId) {
      return;
    }
    const profile = this.getProfile(this.profileId);
    if (!profile) {
      return;
    }
    this.assessment.profileId = this.profileId;
    this.assessment.profileName = profile.name;
    this.assessment.competency = 'NE';
    this.assessment.competencyPoints = 0;
    this.assessment.comment = '-';
    this.assessment.skillSetEvaluation = [];
    profile.skillSets.forEach((skillSet) => {
      const skillSetEvaluation: SkillSetEvaluation = {
        skillSetName: skillSet.name,
        skillEvaluations: [],
        competency: 'NE',
        competencyPoints: 0,
        comment: '-'
      };
      skillSetEvaluation.skillEvaluations = [];
      skillSet.skills.forEach((skill) => {
        skillSetEvaluation.skillEvaluations.push({
          skillName: skill.name,
          competency: 'NE',
          competencyPoints: 0,
          comment: '-',
        });
      });
      this.assessment.skillSetEvaluation.push(skillSetEvaluation);
    });
  }
}
