import { flatMap, map } from 'rxjs/operators';
import { AlertController, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ResponseWithData } from '../../../app/service/response';
import { SkillProfileService } from '../../../app/service/SkillProfileService';
import { SkillProfile, ProfileType } from '../../../app/model/skill';
import { ActivatedRoute, Params } from '@angular/router';

/**
 * Generated class for the SkillProfileListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-skill-profile-list',
  templateUrl: 'skill-profile-list.html',
})
export class SkillProfileListPage implements OnInit {

  skillProfiles: SkillProfile[];
  profileType: ProfileType;

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    public skillProfileService: SkillProfileService,
    public alertCtrl: AlertController) {
  }

  ngOnInit() {
    this.route.queryParams.pipe(
      map( (param: Params) => {
        this.profileType = param.profileType as ProfileType;
        if (!this.profileType) {
          this.profileType = 'REFEREE';
        }
        console.log('SkillProfileListPage.profileType=' + this.profileType);
        this.searchSkillProfile();
        return '';
      })
    ).subscribe();
  }
  public newSkillProfile(): void {
    this.navController.navigateRoot(`/skillprofile/create?profileType=${this.profileType}`);
  }
  public skillProfileSelected(skillProfile: SkillProfile): void {
    this.navController.navigateRoot(`/skillprofile/${skillProfile.id}`);
  }

  private searchSkillProfile() {
    this.skillProfileService.allProfiles(this.profileType).subscribe((response: ResponseWithData<SkillProfile[]>) => {
      if (response.error && response.error.errorCode)  {
        console.error(response.error);
      }
      this.skillProfiles = this.skillProfileService.sort(response.data);
      // console.log(JSON.stringify(this.skillProfiles, null, 2));
    });
  }

  public deleteSkillProfile(skillProfile: SkillProfile) {
    this.alertCtrl.create({
      message: 'Do you really want to delete the skill profile ' + skillProfile.name +  '?',
      buttons: [
        { text: 'Cancel', role: 'cancel'},
        {
          text: 'Delete',
          handler: () => {
            this.skillProfileService.delete(skillProfile.id).subscribe(() => this.searchSkillProfile());
          }
        }
      ]
    }).then( (alert) => alert.present());
  }
  onSwipe(event) {
    // console.log('onSwipe', event);
    if (event.direction === 4) {
      this.navController.navigateRoot(`/home`);
    }
  }
}
