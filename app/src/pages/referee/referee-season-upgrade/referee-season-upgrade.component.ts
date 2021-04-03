import { Competition, CoachRef } from './../../../app/model/competition';
import { CompetitionService } from './../../../app/service/CompetitionService';
import { flatMap, map } from 'rxjs/operators';
import { CompetitionRefereeUpgrade, UpgradeVote } from './../../../app/model/upgrade';
import { CompetitionRefereeUpgradeService } from './../../../app/service/CompetitionRefereeUpgradeService';
import { Referee } from './../../../app/model/user';
import { RefereeService } from 'src/app/service/RefereeService';
import { RefereeSelectPage } from './../referee-select/referee-select';
import { NavController, ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { forkJoin, of, Observable } from 'rxjs';

@Component({
  selector: 'app-referee-season-upgrade',
  templateUrl: './referee-season-upgrade.component.html',
  styleUrls: ['./referee-season-upgrade.component.scss'],
})
export class RefereeSeasonUpgradeComponent implements OnInit {


  referee: Referee = null;
  upgrades: CompetitionRefereeUpgrade[] = [];
  id2competition: Map<string, Competition> = new Map<string, Competition>();
  id2coachShortName: Map<string, string> = new Map<string, string>();

  constructor(
    private competitionRefereeUpgradeService: CompetitionRefereeUpgradeService,
    private competionService: CompetitionService,
    private modalController: ModalController,
    private navController: NavController,
    private refereeService: RefereeService
    ) { }

  ngOnInit() {}

  back() {
    this.navController.navigateRoot(`/home`);
  }

  async searchReferee() {
    console.log('searchReferee()');
    const modal = await this.modalController.create({ component: RefereeSelectPage });
    modal.onDidDismiss().then( (data) => {
      this.onRefereeChanged(this.refereeService.lastSelectedReferee.referee);
    });
    return await modal.present();
  }

  onRefereeChanged(referee: Referee) {
    this.referee = referee;
    const year = new Date().getFullYear().toString();
    this.competitionRefereeUpgradeService.findCompetitionRefereeUpgradeByReferee(this.referee.id, year).pipe(
      flatMap((rupgrades) => {
        this.upgrades = rupgrades.data;
        console.log('findCompetitionRefereeUpgradeByReferee(', this.referee.id, ',', year, ')', rupgrades.data);
        const obs: Observable<any>[] = [of('')];
        this.upgrades.forEach((upgrade) => {
          // load the competition
          obs.push(this.competionService.get(upgrade.competitionId).pipe(
            map((rcomp) => {
              if (rcomp.data) {
                this.id2competition.set(upgrade.competitionId, rcomp.data);
                // compute coach short name of the competition.
                rcomp.data.refereeCoaches.forEach((coach: CoachRef) => {
                  this.id2coachShortName.set(this.toCoachId(coach), coach.coachShortName);
                });
              }
            })
          ));
        });
        return forkJoin(obs);
      })
    ).subscribe();
  }

  toCoachId(coach: CoachRef): string {
    return coach.coachId ? coach.coachId : coach.coachShortName;
  }

  getVotes(cru: CompetitionRefereeUpgrade): UpgradeVote[] {
    const competition: Competition = this.id2competition.get(cru.competitionId);
    const votes: UpgradeVote[] = [];
    competition.refereeCoaches.forEach(coach => {
      votes.push(cru.votes[this.toCoachId(coach)]);
    });
    return votes;
  }
  onSwipe(event) {

  }
}
