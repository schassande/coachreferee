import { ResponseWithData } from '../../../app/service/response';
import { AssessmentService } from '../../../app/service/AssessmentService';
import { Assessment } from '../../../app/model/assessment';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';

/**
 * Generated class for the AssessmentListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

export interface AssessmentList {
  day: string;
  competitionName: string;
  assessments: Assessment[];
}

@Component({
  selector: 'page-assessment-list',
  templateUrl: 'assessment-list.html',
})
export class AssessmentListPage implements OnInit {

  assessments: Assessment[];
  assessmentLists: AssessmentList[];
  error: any;
  searchInput: string;

  constructor(
    private alertCtrl: AlertController,
    private assessmentService: AssessmentService,
    private changeDetectorRef: ChangeDetectorRef,
    private navController: NavController
    ) {
  }

  ngOnInit() {
    this.searchAssessment();
  }

  private searchAssessment() {
    this.assessmentService.searchAssessments(this.searchInput).subscribe((response: ResponseWithData<Assessment[]>) => {
      this.assessments = this.assessmentService.sortAssessments(response.data, true);
      this.assessmentLists = this.computeAssessmentLists(this.assessments);
      this.error = response.error;
      this.changeDetectorRef.detectChanges();
    });
  }

  public assessmentSelected(event: any, assessment: Assessment): void {
    this.navController.navigateRoot(`/assessment/edit/${assessment.id}`);
  }

  getAssessmentDate(assessment: Assessment) {
    return this.assessmentService.getAssessmentDateAsString(assessment);
  }

  public newAssessment(): void {
    this.navController.navigateRoot(`/assessment/create`);
  }

  public onSearchBarInput() {
    this.searchAssessment();
  }
  public isPast(assessment: Assessment): boolean {
    return this.assessmentService.compareDate(assessment.date, new Date()) < 0;
  }
  public deleteAssessment(assessment: Assessment) {
    this.alertCtrl.create({
      // title: 'Confirm Deletion',
      message: 'Do you really want to delete the assessment of ' + assessment.refereeShortName +  '?',
      buttons: [
        { text: 'Cancel', role: 'cancel'},
        {
          text: 'Delete',
          handler: () => {
            this.assessmentService.delete(assessment.id).subscribe(() => this.searchAssessment());
          }
        }
      ]
    }).then( (alert) => alert.present() );
  }

  computeAssessmentLists(assessments: Assessment[]): AssessmentList[] {
    const lists: AssessmentList[] = [];
    let currentIndex = -1;
    assessments.forEach((c: Assessment) => {
      const cd: string = this.assessmentService.getAssessmentDateAsString(c);
      if (currentIndex >= 0
        && lists[currentIndex].day === cd
        && lists[currentIndex].competitionName === c.competition ) {
        lists[currentIndex].assessments.push(c);
      } else {
        currentIndex ++;
        lists.push({ day: cd, competitionName: c.competition, assessments : [c]});
      }
    });
    return lists;
  }
  onSwipe(event) {
    // console.log('onSwipe', event);
    if (event.direction === 4) {
      this.navController.navigateRoot(`/home`);
    }
  }
}
