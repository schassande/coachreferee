import { ConnectedUserService } from './../../../app/service/ConnectedUserService';
import { Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { HelpService } from './../../../app/service/HelpService';
import { DateService } from './../../../app/service/DateService';
import { CompetitionService } from './../../../app/service/CompetitionService';
import { Competition, GameAllocation } from './../../../app/model/competition';
import { Component, OnInit } from '@angular/core';
import { ToolService } from 'src/app/service/ToolService';
import { mergeMap, map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-competition-games',
  templateUrl: './competition-games.page.html',
  styleUrls: ['./competition-games.page.scss'],
})
export class CompetitionGamesPage implements OnInit {

  competition: Competition;
  loading = false;
  errors: string[] = [];
  constructor(
    private competitionService: CompetitionService,
    private connectedUserService: ConnectedUserService,
    public dateService: DateService,
    private helpService: HelpService,
    private navController: NavController,
    private route: ActivatedRoute,
    private toolService: ToolService
  ) { }

  ngOnInit() {
    this.helpService.setHelp('competition-edit');
    this.loadCompetition().subscribe();
  }

  private loadCompetition(): Observable<Competition> {
    this.loading = true;
    // load id from url path
    return this.route.paramMap.pipe(
      // load competition from the id
      mergeMap( (paramMap) => this.competitionService.get(paramMap.get('id'))),
      map( (rcompetition) => {
        this.competition = rcompetition.data;
        if (!this.competition) {
          // the competition has not been found => create it
          this.navController.navigateRoot('/competition/list');
        } else if (!this.connectedUserService.isAdmin()
            && !this.competitionService.authorized(this.competition, this.connectedUserService.getCurrentUser().id)) {
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
      map (() => {
        this.loading = false;
        return this.competition;
      })
    );
  }
  downloadGames() {
    const SEP = ',';
    const headers = '"gameId", "competition", "date", "timeSlot", "field", "category", "referee1", "referee2", "referee3", "refereeCoach1", "refereeCoach2", "refereeCoach3"\r\n';
    const content = headers + this.competition.allocations.map(ga => {
      return '"' + ga.id + '"'
        + SEP + '"' + this.competition.name + '"'
        + SEP + '"' + this.dateService.date2string(ga.date) + '"'
        + SEP + '"' + ga.timeSlot + '"'
        + SEP + '"' + ga.field + '"'
        + SEP + '"' + ga.gameCategory + '"'
        + SEP + '"' + (ga.referees.length > 0 ? ga.referees[0].refereeShortName : '') + '"'
        + SEP + '"' + (ga.referees.length > 1 ? ga.referees[1].refereeShortName : '') + '"'
        + SEP + '"' + (ga.referees.length > 2 ? ga.referees[2].refereeShortName : '') + '"'
        + SEP + '"' + (ga.refereeCoaches.length > 0 ? ga.refereeCoaches[0].coachShortName : '') + '"'
        + SEP + '"' + (ga.refereeCoaches.length > 1 ? ga.refereeCoaches[1].coachShortName : '') + '"'
        + SEP + '"' + (ga.refereeCoaches.length > 2 ? ga.refereeCoaches[2].coachShortName : '') + '"'
        ;
    }).join('\r\n');
    const oMyBlob = new Blob([content], {type : 'text/csv'});
    const url = URL.createObjectURL(oMyBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CoachReferee_export_games_${this.competition.name}_${this.dateService.date2string(new Date())}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
  back() {
    if (this.competition.id) {
      this.navController.navigateRoot(`/competition/${this.competition.id}/home`);
    } else {
      this.navController.navigateRoot(`/competition/list`);
    }
  }
  allocSelected(alloc: GameAllocation) {
  }
}
