import { ConnectedUserService } from './../../app/service/ConnectedUserService';
import { COACH_LEVELS_EURO } from './coachLevelEuropean';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { map, mergeMap } from 'rxjs/operators';
import { AlertController, ToastController, NavController } from '@ionic/angular';
import { Observable, of, concat, forkJoin } from 'rxjs';
import { UserService } from '../../app/service/UserService';
import { SkillProfileService } from '../../app/service/SkillProfileService';
import { PROService } from '../../app/service/PROService';
import { CoachingService } from '../../app/service/CoachingService';
import { RefereeService } from '../../app/service/RefereeService';
import { AppSettingsService } from '../../app/service/AppSettingsService';
import { LocalAppSettings } from '../../app/model/settings';
import { AssessmentService } from '../../app/service/AssessmentService';
import { Referee, Gender, RefereeLevel, RefereeCategory, User, ApplicationName, CurrentApplicationName } from './../../app/model/user';
import { ExportedData } from './../../app/model/settings';

import { LEVELS_AUS } from './levelAus';
import { LEVELS_NZ } from './levelNZ';
import { LEVELS_EURO } from './levelEuropean';
import { environment } from '../../environments/environment';
import * as csv from 'csvtojson';


/**
 * Generated class for the SettingsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'app-page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage implements OnInit {

  settings: LocalAppSettings;
  msg: string[] = [];
  env = environment;
  @ViewChild('inputReferees') inputReferees: ElementRef;
  launchMode = '';
  showDebugInfo = false;
  deferredPrompt;
  showInstallBtn = false;
  currentUser: User;

  constructor(
    private alertController: AlertController,
    private appSettingsService: AppSettingsService,
    private assessmentService: AssessmentService,
    private coachingService: CoachingService,
    private connectedUserService: ConnectedUserService,
    private navController: NavController,
    private proService: PROService,
    private refereeService: RefereeService,
    private skillProfileService: SkillProfileService,
    private toastController: ToastController,
    private userService: UserService
  ) {
  }

  ngOnInit() {
    this.installAsApp();
    this.computeLaunchMode();
    this.currentUser = this.connectedUserService.getCurrentUser();
    this.appSettingsService.get().subscribe((appSettings: LocalAppSettings) => {
      if (appSettings.forceOffline === undefined) {
        appSettings.forceOffline = false;
      }
      this.settings = appSettings;
    });
  }

  private installAsApp() {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      // e.preventDefault();
      // Stash the event so it can be triggered later on the button event.
      this.deferredPrompt = e;
    // Update UI by showing a button to notify the user they can add to home screen
      this.showInstallBtn = true;
      this.launchMode += '<br>App can be installed.';
    });
    window.addEventListener('appinstalled', (event) => { this.launchMode += '<br>App installed'; });
  }

  private computeLaunchMode() {
    this.launchMode = '';
    if (window.hasOwnProperty('navigator') && window.navigator.hasOwnProperty('standalone')) {
      try {
        const nav: any = window.navigator;
        if (nav && nav.standalone === true) {
          this.launchMode += '<br>display-mode is standalone on iphone';
        } else {
          this.launchMode += '<br>display-mode is launch from Safari';
        }
      } catch (err) {
      }

    } else if (window.matchMedia('(display-mode: standalone)').matches) {
      this.launchMode += '<br>display-mode is standalone';

    } else {
      this.launchMode += '<br>display-mode is launch from web browser';
    }
  }

  public saveSettings(navigate = true) {
    this.appSettingsService.save(this.settings).pipe(
      map((settings: LocalAppSettings) => {
        this.settings = settings;
        if (navigate) {
          this.navController.navigateRoot(['/home']);
        }
      })
    ).subscribe();
  }

  importReferees() {
    this.inputReferees.nativeElement.click();
  }
  public importRefereeFromCsv(event) {
    const reader: FileReader = new FileReader();
    reader.readAsText(event.target.files[0]);
    reader.onloadend = () => {
      csv({ output: 'json', trim: true, noheader: false, delimiter: ';', ignoreEmpty: true, checkType: true})
        .fromString(reader.result as string).then((jsons) => {
          jsons.forEach(json => {
            // this.importReferee(json);
          });
        });
   };
  }

  private importReferee(json) {
    const referee: Referee = {
      id: null,
      version: 0,
      creationDate : new Date(),
      lastUpdate : new Date(),
      dataStatus: 'NEW',
      firstName: this.getValue(json, 'firstName', ''),
      lastName: this.getValue(json, 'lastName', ''),
      shortName: this.getValue(json, 'shortName', ''),
      country: this.getValue(json, 'country', ''),
      email: this.getValue(json, 'email', ''),
      gender: this.getGender(json, 'gender', 'M'),
      mobilePhones: this.getStringList(json, 'mobilePhones', []),
      photo: {path: null, url: null},
      speakingLanguages: this.getStringList(json, 'speakingLanguages', ['EN']),
      referee : {
          refereeLevel: this.getRefereeLevel(json, 'refereeLevel', 'EURO_1'),
          refereeCategory : this.getRefereeCategory(json, 'OPEN'),
          nextRefereeLevel: this.getRefereeLevel(json, 'nextRefereeLevel', null),
      },
      refereeCoach: {
          refereeCoachLevel: 'NONE'
      },
      dataSharingAgreement: {
        personnalInfoSharing: 'NO',
        photoSharing: 'NO',
        refereeAssessmentSharing: 'NO',
        refereeCoachingInfoSharing: 'NO'
      }
    };
    this.refereeService.save(referee).subscribe();
  }

  private getValue(json: any, fieldName: string, defaultValue: string): string {
    return json[fieldName] ? json[fieldName] : defaultValue;
  }

  private getGender(json: any, fieldName: string, defaultValue: Gender): Gender {
    return json[fieldName] ? json[fieldName] : defaultValue;
  }

  private getStringList(json: any, fieldName: string, defaultValue: string[]): string[] {
    if (json[fieldName] ) {
      return json[fieldName].split(',');
    } else {
      return defaultValue;
    }
  }

  private getRefereeLevel(json: any, fieldName: string, defaultValue: RefereeLevel): RefereeLevel {
    if (json.referee && json.referee[fieldName]) {
      return json.referee[fieldName] as RefereeLevel;
    } else if (json[fieldName]) {
      return json[fieldName] as RefereeLevel;
    } else {
      return defaultValue;
    }
  }

  public getRefereeCategory(json: any, defaultValue: RefereeCategory): RefereeCategory {
    if (json.referee && json.referee.refereeCategory) {
      return json.referee.refereeCategory as RefereeCategory;
    } else if (json.refereeCategory) {
      return json.refereeCategory as RefereeCategory;
    } else {
      return defaultValue;
    }
  }

  public reloadPage() {
    window.location.reload(true);
  }

  private toast(msg: string) {
    this.toastController.create({
      message: msg,
      position: 'bottom',
      duration: 2000,
      translucent: true
    }).then((alert) => alert.present());
  }

  importLevelsAus() {
    let obs: Observable<any> = of('');
    LEVELS_AUS.forEach((elem) => {
      const e = elem;
      obs = concat(obs, this.skillProfileService.save(e).pipe(map(() => { console.log(e.id + ' imported.'); })));
    });
    obs.subscribe(() => {
      this.toast('Aus levels imported.');
    });
  }

  importLevelsEuro() {
    let obs: Observable<any> = of('');
    LEVELS_EURO.forEach((elem) => {
      const e = elem;
      obs = concat(obs, this.skillProfileService.save(e).pipe(map(() => { console.log(e.id + ' imported.'); })));
    });
    obs.subscribe(() => {
      this.toast('Euro levels imported.');
    });
  }

  importCoachLevelsEuro() {
    let obs: Observable<any> = of('');
    COACH_LEVELS_EURO.forEach((elem) => {
      const e = elem;
      obs = concat(obs, this.skillProfileService.save(e).pipe(map(() => { console.log(e.id + ' imported.'); })));
    });
    obs.subscribe(() => {
      this.toast('Coach Euro levels imported.');
    });
  }

  importLevelsNZ() {
    let obs: Observable<any> = of('');
    LEVELS_NZ.forEach((elem) => {
      const e = elem;
      obs = concat(obs, this.skillProfileService.save(e).pipe(map(() => { console.log(e.id + ' imported.'); })));
    });
    obs.subscribe(() => {
      this.toast('NZ levels imported.');
    });
  }

  public exportData() {
      this.alertController.create({
        header: 'Which data do you want to export?',
        inputs: [
          {type: 'checkbox', label: 'Users',           value: 'users',           checked: true},
          {type: 'checkbox', label: 'Referees',        value: 'referees',        checked: true},
          {type: 'checkbox', label: 'Levels',          value: 'skillProfiles',   checked: true},
          {type: 'checkbox', label: 'PROs'     ,       value: 'pros',            checked: true},
          {type: 'checkbox', label: 'Coachings',       value: 'coachings',       checked: true},
          {type: 'checkbox', label: 'Assessments',     value: 'assessments',     checked: true}],
        buttons: ['Cancel',
          {
            text: 'Export',
            handler: (data: string[]) => {
                const exportObj: ExportedData = {};
                const observables = [];
                if (data.indexOf('users') >= 0) {
                  observables.push(this.userService.all().pipe(map(          (response) => exportObj.users         =  response.data)));
                }
                if (data.indexOf('referees') >= 0) {
                  observables.push(this.refereeService.all().pipe(map(       (response) => exportObj.referees      =  response.data)));
                }
                if (data.indexOf('skillProfiles') >= 0) {
                  observables.push(this.skillProfileService.all().pipe(map(  (response) => exportObj.skillProfiles =  response.data)));
                }
                if (data.indexOf('pros') >= 0) {
                  observables.push(this.proService.all().pipe(map(           (response) => exportObj.pros          =  response.data)));
                }
                if (data.indexOf('coachings') >= 0) {
                  observables.push(this.coachingService.all().pipe(map(      (response) => exportObj.coachings     =  response.data)));
                }
                if (data.indexOf('assessments') >= 0) {
                  observables.push(this.assessmentService.all().pipe(map(    (response) => exportObj.assessments   =  response.data)));
                }
                /*forkJoin(observables).subscribe( () => {
                  const str = JSON.stringify(exportObj, null, 2);
                  // console.log('Exported data: ', str);
                  const fileName = `referee_coach_${new Date().getTime()}.json`;
                  const path = this.file.dataDirectory;
                  // console.log('Writing file: ' + path + fileName);
                  this.file.writeFile(path, fileName, str, {replace: true})
                    .then((fe: FileEntry) => {
                      // console.log('Write OK', fe);
                      this.socialSharing.share(null, null, fe.nativeURL, null).then(() => this.msg.push('Data exported'));
                    }).catch((error) => {
                      console.error('Writing error: ', error);
                      this.toast('Fail to write file: ' + error);
                    });
                  });
                  */
                }
            }
        ]
      }).then( (alert) => alert.present());
  }

  toggleDebugInfo() {
    this.showDebugInfo = ! this.showDebugInfo;
    console.log('this.showDebugInfo =', this.showDebugInfo);
  }

  onNbPeriodChange() {
    this.settings.nbPeriod = Math.min(4, Math.max(this.settings.nbPeriod, 1));
    this.saveSettings(false);
  }
  runScript() {
    this.coachingService.getCoachingByCompetition('XAOsU2ZC5bgRKG2aFLmV').pipe(
      mergeMap((rcs) => forkJoin(rcs.data.map(c => this.coachingService.delete(c.id))))
    ).subscribe();
  }
  addToHome() {
    // hide our user interface that shows our button
    // Show the prompt
    this.deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the prompt');
        } else {
          console.log('User dismissed the prompt');
        }
        this.deferredPrompt = null;
      });
  }
  onSwipe(event) {
    // console.log('onSwipe', event);
    if (event.direction === 4) {
      this.navController.navigateRoot(`/home`);
    }
  }
}
