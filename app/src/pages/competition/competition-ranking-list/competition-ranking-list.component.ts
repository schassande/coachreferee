import { CompetitionRankingNewComponent } from './competition-ranking-new.component';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController, ModalController } from '@ionic/angular';
import { HelpService } from './../../../app/service/HelpService';
import { DateService } from './../../../app/service/DateService';
import { ConnectedUserService } from 'src/app/service/ConnectedUserService';
import { CompetitionRefereeRankingService } from './../../../app/service/CompetitionRefereeRankingService';
import { CompetitionService } from './../../../app/service/CompetitionService';
import { CompetitionRankingList } from './../../../app/model/ranking';
import { Competition } from './../../../app/model/competition';
import { Component, OnInit } from '@angular/core';
import { of, Observable } from 'rxjs';

@Component({
  selector: 'app-competition-ranking-list',
  templateUrl: './competition-ranking-list.component.html',
  styleUrls: ['./competition-ranking-list.component.scss'],
})
export class CompetitionRankingListComponent implements OnInit {

  competition: Competition;
  competitionRankingLists: CompetitionRankingList[] = null;
  loading = false;
  errors: string[] = [];

  constructor(
    private alertCtrl: AlertController,
    private competitionService: CompetitionService,
    private competitionRefereeRankingService: CompetitionRefereeRankingService,
    private connectedUserService: ConnectedUserService,
    public dateService: DateService,
    private helpService: HelpService,
    private modalController: ModalController,
    private navController: NavController,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.helpService.setHelp('competition-ranking');
    this.loadData().subscribe();
  }

  private loadData(): Observable<any> {
    this.loading = true;
    // load id from url path
    return this.route.paramMap.pipe(
      // load competition from the id
      mergeMap( (paramMap) => this.competitionService.get(paramMap.get('id'))),
      map( (rcompetition) => {
        this.competition = rcompetition.data;
        if (!this.competition) {
          // the competition has not been found => back to list of competition
          this.navController.navigateRoot('/competition/list');
        } else if (!this.competitionService.authorized(this.competition, this.connectedUserService.getCurrentUser().id)) {
          // the coach is not allowed to access to this competition
          this.navController.navigateRoot('/competition/list');
        }
        return this.competition;
      }),
      catchError((err) => {
        console.log('loadCompetition error: ', err);
        this.loading = false;
        return of(this.competition);
      }),
      mergeMap (() => {
        return this.competitionRefereeRankingService.findCompetitionRefereeRanking(
          this.competition.id, this.connectedUserService.getCurrentUser().id).pipe(
            map((rcrr) => {
              console.log('=>', rcrr);
              this.competitionRankingLists = rcrr.data;
            })
          );
      }),
      map(() => {
        this.loading = false;
      })
    );
  }

  listSelected(list: CompetitionRankingList) {
    this.navController.navigateRoot(`/competition/${this.competition.id}/ranking/${list.id}`);
  }

  newList() {
    this.modalController.create({
      component: CompetitionRankingNewComponent,
      componentProps : { competition: this.competition }}
      ).then(modal => {
        modal.onDidDismiss().then( (data) => {
          if (data.data) {
            this.navController.navigateRoot(`/competition/${this.competition.id}/ranking/${data.data.id}`);
          }
        });
        modal.present();
      });
  }

  deleteList(list: CompetitionRankingList) {
    this.alertCtrl.create({
      message: 'Do you really want to delete the ranking list ' + list.listName + ' of the competition ' + this.competition.name + '?',
      buttons: [
        { text: 'Cancel', role: 'cancel'},
        {
          text: 'Delete',
          handler: () => {
            this.competitionRefereeRankingService.delete(list.id).subscribe(() => this.loadData().subscribe());
          }
        }
      ]
    }).then( (alert) => alert.present() );
  }
  back() {
    this.navController.navigateRoot(`/competition/${this.competition.id}/home`);
  }
}
