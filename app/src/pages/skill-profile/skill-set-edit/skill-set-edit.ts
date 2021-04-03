import { map, mergeMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { SkillProfile, SkillSet, Skill } from '../../../app/model/skill';
import { SkillProfileService } from '../../../app/service/SkillProfileService';
import { ResponseWithData } from '../../../app/service/response';

/**
 * Generated class for the SkillSetEditPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-skill-set-edit',
  templateUrl: 'skill-set-edit.html',
})
export class SkillSetEditPage implements OnInit {
  skillProfileId: string;
  skillProfile: SkillProfile;
  skillSetIdx: number;
  skillSet: SkillSet;
  skillName: string;
  readonly = false;

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private router: Router,
    private alertCtrl: AlertController,
    private skillProfileService: SkillProfileService) {
  }

  ngOnInit() {

    this.route.paramMap.pipe(
      mergeMap( (paramMap: ParamMap) => {
        this.skillProfileId = paramMap.get('skillProfileid');
        this.skillSetIdx = parseInt(paramMap.get('skillSetIdx'), 10);
        console.log('Load skill profile ', this.skillProfileId);
        return this.skillProfileService.get(this.skillProfileId);
      }),
      map((res: ResponseWithData<SkillProfile>) =>  this.setSkillProfile(res.data))
    ).subscribe();
  }

  private setSkillProfile(skillProfile: SkillProfile) {
    this.skillProfile = skillProfile;
    // TODO readonly mode
    if (!this.skillProfile) {
      // profile id is not known => back to home
      this.router.navigate(['/home']);

    } else if (0 <= this.skillSetIdx && this.skillSetIdx < this.skillProfile.skillSets.length) {
      console.log('Get skill set with ', this.skillSetIdx, ' from the profile.');
      // select the skillSet from the profile
      this.skillSet = this.skillProfile.skillSets[this.skillSetIdx];

    } else {
      console.log('Create a new skill set into the profile.');
      // Search the skill set name from query param
      this.route.queryParams.subscribe((queryParams) => {
        const skillSetName = queryParams.skillSetName;
        console.log('skillSetName=', skillSetName);
        // Create a new SkillSet but don't attach it to the skillProfile. It will be done at save time.
        this.skillSet = {
          name: skillSetName ? skillSetName : '',
          description: 'Description of ' + (skillSetName ? skillSetName : ''),
          requirement: this.skillProfile.requirement,
          required: false,
          skills: []
        };
      });
    }
  }

  saveNback() {
    this.saveSkillSet(null);
  }

  private saveProfileNnavigate(url: string) {
    const save = this.skillSet.name && this.skillSet.name.trim().length > 0;
    if (this.skillSetIdx < 0) {
      console.log('Add new skillSet to the profile');
      this.skillProfile.skillSets.push(this.skillSet);
      this.skillSetIdx = this.skillProfile.skillSets.length - 1;

    } else if (!save) {
      // TODO alert user that field is required
    }
    if (save) {
      this.skillProfileService.save(this.skillProfile).pipe(
        map( () => {
          if (url) {
            this.navController.navigateRoot(url);
          }
        })
      ).subscribe();

    } else if (url) {
      this.navController.navigateRoot(url);
    }
  }

  saveSkillSet(event) {
    this.saveProfileNnavigate(`/skillprofile/${this.skillProfileId}`);
  }
  deleteSkillSet() {
    // TODO
    console.log('Not yet implemented');    
  }
  skillSelected(event, skill: Skill, skildIdx: number) {
    this.saveProfileNnavigate(`/skillprofile/${this.skillProfileId}/skillset/${this.skillSetIdx}/skill/${skildIdx}`);
  }

  deleteSkill(skill: Skill) {
    const idx: number = this.skillSet.skills.findIndex((elem) => elem.name === skill.name);
    if (idx >= 0) {
      this.skillSet.skills.splice(idx, 1);
    }
  }

  newSkill(event) {
    if (this.skillName) {
      this.saveProfileNnavigate(`/skillprofile/${this.skillProfileId}/skillset/${this.skillSetIdx}/skill/-1?skillName=${this.skillName}`);
    }
  }
}
