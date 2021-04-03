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
 * Generated class for the user-waiting-validation page.
 *
 */

@Component({
  selector: 'user-waiting-validation',
  templateUrl: 'user-waiting-validation.html',
})
export class UserWaitingValidationPage implements OnInit {

  constructor(
    private navController: NavController,
    private route: ActivatedRoute,
    ) {
  }

  ngOnInit() {
  }
}
