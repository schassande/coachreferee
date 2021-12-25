import { ConnectedUserService } from './../../../app/service/ConnectedUserService';
import { HelpService } from './../../../app/service/HelpService';
import { ResponseWithData } from './../../../app/service/response';
import { Competition } from './../../../app/model/competition';
import { NavController, AlertController } from '@ionic/angular';
import { CompetitionService } from './../../../app/service/CompetitionService';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DateService } from 'src/app/service/DateService';
import { DataRegion } from 'src/app/model/common';

/**
 * Generated class for the CompetitionListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'app-competition-list',
  templateUrl: 'competition-list.html',
})
export class CompetitionListPage implements OnInit {

  competitions: Competition[];
  error;
  searchInput: string;
  loading = false;
  region: DataRegion;
  withMe = true;
  isAdmin = false;

  constructor(
    private alertCtrl: AlertController,
    private competitionService: CompetitionService,
    private connectedUserService: ConnectedUserService,
    private changeDetectorRef: ChangeDetectorRef,
    public dateService: DateService,
    private helpService: HelpService,
    private navController: NavController
    ) {
  }

  ngOnInit() {
    this.helpService.setHelp('competition-list');
    this.isAdmin = this.connectedUserService.isAdmin();
    this.region = this.connectedUserService.getCurrentUser().region;
    setTimeout(() => {
      this.doRefresh(null);
    }, 200);
  }

  doRefresh(event) {
    this.searchCompetition(false, event);
  }

  onSearchBarInput() {
    this.doRefresh(null);
  }

  private searchCompetition(forceServer: boolean = false, event: any = null) {
    this.loading = true;
    this.competitions = [];
    // console.log('searchCompetition(' + this.searchInput + ')');
    this.competitionService.searchCompetitions(this.searchInput, forceServer ? 'server' : 'default', this.region)
      .subscribe((response: ResponseWithData<Competition[]>) => {
        let cs = response.data;
        if (this.withMe || !this.isAdmin) {
          cs = this.competitionService.filterCompetitionsByCoach(cs, this.connectedUserService.getCurrentUser().id);
        }
        this.competitions = this.competitionService.sortCompetitions(cs, true);
        this.loading = false;
        if (event) {
          event.target.complete();
        }
        this.error = response.error;
        if (this.error) {
          console.log('searchCompetition(' + this.searchInput + ') error=' + this.error);
        }
        this.changeDetectorRef.detectChanges();
      });
  }

  newCompetition() {
    this.navController.navigateRoot(`/competition/-1/edit`);
  }

  competitionSelected(competition: Competition) {
    this.navController.navigateRoot(`/competition/${competition.id}/home`);
  }

  deleteCompetition(competition: Competition) {
    this.alertCtrl.create({
      message: 'Do you really want to delete the competition ' + competition.name + '-' + competition.year + '?',
      buttons: [
        { text: 'Cancel', role: 'cancel'},
        {
          text: 'Delete',
          handler: () => {
            this.competitionService.delete(competition.id).subscribe(() => this.searchCompetition());
          }
        }
      ]
    }).then( (alert) => alert.present() );
  }

  getCompetitionDate(competition: Competition) {
    return this.dateService.date2string(competition.date);
  }

  onSwipe(event) {
    // console.log('onSwipe', event);
    if (event.direction === 4) {
      this.navController.navigateRoot(`/home`);
    }
  }
}
