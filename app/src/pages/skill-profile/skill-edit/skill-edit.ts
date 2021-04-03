import { Component, OnInit } from '@angular/core';
import { map, flatMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NavController } from '@ionic/angular';

import { SkillProfileService } from '../../../app/service/SkillProfileService';
import { PROService } from '../../../app/service/PROService';
import { ResponseWithData } from '../../../app/service/response';

import { PROLink, PersistentPRO } from '../../../app/model/coaching';
import { Skill, SkillProfile } from '../../../app/model/skill';

/**
 * Generated class for the SkillEditPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-skill-edit',
  templateUrl: 'skill-edit.html',
})
export class SkillEditPage implements OnInit {
  skill: Skill;

  skillProfile: SkillProfile;
  skillProfileId: string;
  skillSetIdx: number;
  skillIdx: number;

  searchPros: PersistentPRO[];
  searchInput: string;

  constructor(
    private navController: NavController,
    private route: ActivatedRoute,
    private proService: PROService,
    private skillProfileService: SkillProfileService
    ) {
  }

  ngOnInit() {
    this.route.paramMap.pipe(
      flatMap((paramMap: ParamMap) => {
        this.skillProfileId = paramMap.get('skillProfileid');
        this.skillSetIdx = parseInt(paramMap.get('skillSetIdx'), 10);
        this.skillIdx = parseInt(paramMap.get('skillIdx'), 10);
        console.log('this.skillProfileId=', this.skillProfileId);
        return this.skillProfileService.get(this.skillProfileId);
      }),
      map( (res: ResponseWithData<SkillProfile>) => {
        this.setSkillProfile(res.data);
      })
    ).subscribe();
  }

  get pointValues(): string {
    return this.skill.pointValues ? this.skill.pointValues.join(',') : '';
  }

  set pointValues(pv: string) {
    if (pv) {
      this.skill.pointValues = pv.split(',').filter((item) => item.trim().length).map( (item) => Number.parseInt(item.trim(), 10));
    } else {
      this.skill.pointValues = [];
    }
  }

  setSkillProfile(skillProfile: SkillProfile) {
    this.skillProfile = skillProfile;
    if (!this.skillProfile) {
      // profile id is not known => back to home
      this.navController.navigateRoot(['/home']);

    } else if (0 <= this.skillSetIdx && this.skillSetIdx < this.skillProfile.skillSets.length
      && 0 <= this.skillIdx && this.skillIdx < this.skillProfile.skillSets[this.skillSetIdx].skills.length) {
        console.log('Get skill with ', this.skillSetIdx, this.skillIdx, ' from the profile.');
        // select the skillSet from the profile
        this.skill = this.skillProfile.skillSets[this.skillSetIdx].skills[this.skillIdx];

    } else {
      console.log('Create a new skill into the profile.');
      // Search the skill name from query param
      this.route.queryParams.subscribe((queryParams) => {
        const skillName = queryParams.skillName;
        console.log('skillName=', skillName);
        // Create a new Skill but don't attach it to the skillSet. It will be done at save time.
        this.skill = {
          name: skillName ? skillName : '',
          description: 'Description of ' + (skillName ? skillName : ''),
          required: false,
          proLinks: []
        };
      });
    }
  }

  saveNback() {
    this.saveSkill(null);
  }

  private saveProfileNnavigate(url: string) {
    const save = this.skill.name && this.skill.name.trim().length > 0;
    if (this.skillIdx < 0) {
      console.log('SkillEdit: Add the new skill to the profile', this.skillSetIdx,
        this.skillProfile.skillSets[this.skillSetIdx].skills.length);
      this.skillProfile.skillSets[this.skillSetIdx].skills.push(this.skill);
      this.skillIdx = this.skillProfile.skillSets[this.skillSetIdx].skills.length - 1;

    } else if (!save) {
      // TODO alert user that field is required
    }
    console.log('SkillEdit: Saving profile?', save);
    if (save) {
      this.skillProfileService.save(this.skillProfile).pipe(
        map( () => {
          if (url) {
            this.navController.navigateRoot(url);
          }
        })
      ).subscribe();
    } else {
      this.navController.navigateRoot(url);
    }
  }

  saveSkill(event) {
    this.saveProfileNnavigate(`/skillprofile/${this.skillProfileId}/skillset/${this.skillSetIdx}`);
  }

  proLinkSelected(event, pro: PROLink) {
    this.saveProfileNnavigate(`/pro/edit/${pro.id}`);
  }
  proSelected(event, pro: PersistentPRO) {
    this.saveProfileNnavigate(`/pro/edit/${pro.id}`);
  }

  deletePro(pro: PROLink) {
    if (!this.skill.proLinks) {
      this.skill.proLinks = [];
    }
    const idx: number = this.skill.proLinks.findIndex((elem) => elem.id === pro.id);
    if (idx >= 0) {
      this.skill.proLinks.splice(idx, 1);
    }
  }

  onSearchBarInput(event) {
    if (this.searchInput && this.searchInput.trim().length > 1) {
      this.proService.searchPros(this.searchInput).subscribe((response: ResponseWithData<PersistentPRO[]>) => {
        this.searchPros = response.data;
      });
    } else {
      this.searchPros = [];
    }
  }

  addPRO($event, pro: PersistentPRO) {
    if (!this.skill.proLinks) {
      this.skill.proLinks = [];
    }
    this.skill.proLinks.push({ id: pro.id, problemShortDesc: pro.problemShortDesc });
  }
}
