import { DateService } from 'src/app/service/DateService';
import { HelpService } from './../../../app/service/HelpService';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { RefereeEditPage } from '../referee-edit/referee-edit';
import { RefereeService } from '../../../app/service/RefereeService';
import { ResponseWithData } from '../../../app/service/response';
import { CONSTANTES, Referee, RefereeLevel, User } from '../../../app/model/user';
import { DataRegion } from 'src/app/model/common';
import { UserSearchCriteria, UserService } from 'src/app/service/UserService';
import { ConnectedUserService } from 'src/app/service/ConnectedUserService';
import { AppSettingsService } from 'src/app/service/AppSettingsService';

/**
 * Generated class for the RefereeListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'app-page-referee-list',
  templateUrl: 'referee-list.html',
})
export class RefereeListPage implements OnInit {

  referees: Referee[];
  error: any;
  searchInput: string;
  sortBy: string;
  region: DataRegion = null;
  country: string = null;
  refereeLevel: RefereeLevel = null;
  constantes = CONSTANTES;
  loading = false;

  constructor(
    private alertCtrl: AlertController,
    private connectedUserService: ConnectedUserService,
    private dateService: DateService,
    private helpService: HelpService,
    public modalController: ModalController,
    private navController: NavController,
    public refereeService: RefereeService,
    private settingsService: AppSettingsService,
    private userService: UserService
    ) {
  }

  ngOnInit() {
    this.helpService.setHelp('referee-list');
    this.settingsService.getRefereeSearch().subscribe(settings => {      
      this.searchInput = settings.q;
      this.country = settings.country;
      this.region = settings.region || this.connectedUserService.getCurrentUser().region;
      this.refereeLevel = settings.refereeLevel || null;
      this.sortBy = settings.sortBy;
      this.searchReferee();
    });
  }

  public searchReferee() {
    this.settingsService.setRefereeSearch({ 
      q: this.searchInput, 
      region: this.region, 
      country: this.country, 
      refereeLevel: this.refereeLevel,
      sortBy: this.sortBy
     });
    if (!this.searchInput || this.searchInput.trim().length === 0) {
      return;
    } 
    const criteria: UserSearchCriteria = {
      role : 'REFEREE',
      region : this.region,
      country : this.country,
      text : this.searchInput,
      refereeLevel : this.refereeLevel
    };
    this.loading = true;
    this.userService.searchUsers(criteria).subscribe((response: ResponseWithData<User[]>) => {
      this.referees = this.sortReferees(response.data);
      this.error = response.error;
      this.loading = false;
    });
  }
  private sortReferees(referees: Referee[]): Referee[] {
    if (!referees) {
      return referees;
    }
    if (this.sortBy === 'level') {
      return referees.sort((ref1: Referee, ref2: Referee) => {
        let res = 0;
        if (res === 0) {
          res = ref1.referee.refereeLevel.localeCompare(ref2.referee.refereeLevel);
        }
        if (res === 0) {
            res = ref1.shortName.localeCompare(ref2.shortName);
        }
        return res;
      });
    } else {
      return referees.sort((ref1: Referee, ref2: Referee) => ref1.shortName.localeCompare(ref2.shortName));
    }
  }

  public refereeSelected(event: any, referee: Referee): void {
    this.navController.navigateRoot(`/referee/view/${referee.id}`);
  }

  public async newReferee() {
    const modal = await this.modalController.create({ component: RefereeEditPage});
    modal.onDidDismiss().then( (data) => this.searchReferee());
    return await modal.present();
  }

  public deleteReferee(referee: Referee) {
    this.alertCtrl.create({
      message: 'Do you reaaly want to delete the referee ' + referee.firstName + ' ' + referee.lastName +  '?',
      buttons: [
        { text: 'Cancel', role: 'cancel'},
        {
          text: 'Delete',
          handler: () => {
            this.refereeService.delete(referee.id).subscribe(() => this.searchReferee());
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
  exportReferees() {
    this.refereeService.all().subscribe((rref) => {
      const content = this.refereeService.listToCSV(rref.data);
      const oMyBlob = new Blob([content], {type : 'text/csv'});
      const url = URL.createObjectURL(oMyBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CoachReferee_export_referees_${this.dateService.date2string(new Date())}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    });
  }
}
