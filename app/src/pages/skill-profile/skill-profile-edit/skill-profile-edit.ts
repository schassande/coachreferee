import { REFEREE_COACH_LEVELS, REFEREE_LEVELS } from '../../../app/model/user';
import { AlertController, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Params } from '@angular/router';
import { map, flatMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ResponseWithData } from '../../../app/service/response';
import { SkillProfile, SkillSet, ProfileType } from '../../../app/model/skill';
import { SkillProfileService } from '../../../app/service/SkillProfileService';
import { ConnectedUserService } from '../../../app/service/ConnectedUserService';

/**
 * Generated class for the SkillProfileEditPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-skill-profile-edit',
  templateUrl: 'skill-profile-edit.html',
})
export class SkillProfileEditPage implements OnInit {
  skillProfileId: string;
  skillProfile: SkillProfile;
  skillSetName: string;
  readonly = false;
  profileType: ProfileType = 'REFEREE';
  levels: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    public skillProfileService: SkillProfileService,
    public connectedUserService: ConnectedUserService,
    public alertCtrl: AlertController) {
  }

  ngOnInit() {
    this.loadSkillProfile().subscribe((response: ResponseWithData<SkillProfile>) => {
      this.skillProfile = response.data;
      if (this.skillProfile) {
        this.profileType = this.skillProfile.profileType;
        // TODO init readonly mode
      } else {
        this.initSkillProfile();
      }
      this.levels = this.profileType === 'REFEREE' ? REFEREE_LEVELS : REFEREE_COACH_LEVELS;
      // console.log('SkillProfileEditPage: profileType=', this.profileType, 'levels=', this.levels);
    });
  }
  private loadSkillProfile(): Observable<ResponseWithData<SkillProfile>> {
    return this.route.queryParams.pipe(
      map( (param: Params) => {
        this.profileType = param.profileType as ProfileType;
        if (!this.profileType) {
          this.profileType = 'REFEREE';
        }
        return this.profileType;
      }),
      flatMap(() => this.route.paramMap),
      flatMap( (paramMap: ParamMap) => {
        this.skillProfileId = paramMap.get('skillProfileid');
        if (this.skillProfileId) {
          return this.skillProfileService.get(this.skillProfileId);
        } else {
          return of({data: null, error: null});
        }
      })
    );
  }

  private initSkillProfile() {
    this.skillProfile = {
      id: null,
      version: 0,
      creationDate : new Date(),
      lastUpdate : new Date(),
      dataStatus: 'NEW',
      name: '',
      description: '',
      skillSets: [],
      requirement: 'ALL_REQUIRED',
      backgroundColor: 'white',
      color: 'black',
      level: 'EURO_0',
      requiredPoints: 0,
      profileType: this.profileType
    };
  }


  saveSkillProfile(event) {
    this.saveNback();
  }

  saveNback() {
    this.skillProfileService.save(this.skillProfile).pipe(
      map((response: ResponseWithData<SkillProfile>) => {
        this.back();
        return response;
      })).subscribe(
        (data) => console.log('Profil ' + this.skillProfile.name + ' saved.'),
        (err) => console.log('Error when saving Profil ' + this.skillProfile.name + ': ' + JSON.stringify(err))
        );
  }

  back() {
    this.navController.navigateRoot(`/skillprofile/list?profileType=${this.profileType}`);
  }

  deleteSkillProfile(event) {
    this.alertCtrl.create({
      header: 'Confirm Deletion',
      message: 'Do you really want to delete this skill profile ' + this.skillProfile.name +  '?',
      buttons: [
        { text: 'Cancel', role: 'cancel'},
        {
          text: 'Delete',
          handler: () => {
            // delete profile
            this.skillProfileService.delete(this.skillProfile.id).pipe(
              map( () => {
                this.back();
              }));
          }
        }
      ]
    }).then( (alert) => alert.present());
  }

  skillSetSelected(event, skillSet: SkillSet, idx: number) {
    this.navController.navigateRoot(`/skillprofile/${this.skillProfileId}/skillset/${idx}`);
  }

  deleteSkillSet(skillSet: SkillSet) {
    const idx: number = this.skillProfile.skillSets.findIndex((elem) => elem.name === skillSet.name);
    if (idx >= 0) {
      this.alertCtrl.create({
        header: 'Confirm Deletion',
        message: 'Do you really want to delete this skillSet ' + this.skillProfile.skillSets[idx].name +  '?',
        buttons: [
          { text: 'Cancel', role: 'cancel'},
          {
            text: 'Delete',
            handler: () => {
              console.log('deleteSkillSet: ', idx);
              this.skillProfile.skillSets.splice(idx, 1);
            }
          }
        ]
      }).then( (alert) => alert.present());
    }
  }

  newSkillSet(event) {
    if (this.skillSetName) {
      this.skillProfileService.save(this.skillProfile).subscribe(
        (data) => {
          this.skillProfile = data.data;
          this.skillProfileId = this.skillProfile.id;
          const newSkillSetName = this.skillSetName;
          this.skillSetName = '';
          this.navController.navigateRoot(
            `/skillprofile/${this.skillProfileId}/skillset/-1?skillSetName=${newSkillSetName}&profileType=${this.profileType}`);
        }
      );
    }
  }
}
