import { ConnectedUserService } from './../../../app/service/ConnectedUserService';
import { RefereeData } from './../competition-ranking-best-of2/competition-ranking-best-of2.page';
import { Coaching } from './../../../app/model/coaching';
import { StepResult, RefereeComparator } from './../../../app/service/CompetitionRefereeRankingService';
import { Referee } from './../../../app/model/user';
import { CompetitionRankingList, RankingNode, RankingGroup, RankingMethod } from './../../../app/model/ranking';
import { ActivatedRoute } from '@angular/router';
import { HelpService } from './../../../app/service/HelpService';
import { CompetitionService } from './../../../app/service/CompetitionService';
import { NavController, AlertController } from '@ionic/angular';
import { Competition, RefereeRef } from './../../../app/model/competition';
import { Component, OnInit } from '@angular/core';
import { map, catchError, flatMap } from 'rxjs/operators';
import { of, Observable, Subject } from 'rxjs';
import { CompetitionRefereeRankingService } from 'src/app/service/CompetitionRefereeRankingService';

@Component({
  selector: 'app-competition-ranking',
  templateUrl: './competition-ranking.page.html',
  styleUrls: ['./competition-ranking.page.scss'],
})
export class CompetitionRankingPage implements OnInit, RefereeComparator {

  competition: Competition;
  list: CompetitionRankingList = null;
  loading = false;
  errors: string[] = [];
  id2referee: Map<string, Referee>;
  refereeId2coachings: Map<string, Coaching[]>;

  refereeData1: RefereeData;
  refereeData2: RefereeData;
  showBestOf2 = false;
  bestOf2Subject: Subject<StepResult<string>>;

  constructor(
    private competitionService: CompetitionService,
    public competitionRefereeRankingService: CompetitionRefereeRankingService,
    private connectedUserService: ConnectedUserService,
    private helpService: HelpService,
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
      flatMap( (paramMap) => this.competitionService.get(paramMap.get('id')).pipe(
        map( (rcompetition) => {
          this.competition = rcompetition.data;
          if (!this.competition) {
            // the competition has not been found => back to list of competition
            this.navController.navigateRoot('/competition/list');
          } else if (!this.competitionService.authorized(this.competition, this.connectedUserService.getCurrentUser().id)) {
            // the coach is not allowed to access to this competition
            this.navController.navigateRoot('/competition/list');
          }
          return paramMap;
        }),
        catchError((err) => {
          console.log('loadCompetition error: ', err);
          this.loading = false;
          return of(paramMap);
        })
      )),
      flatMap( (paramMap) => this.competitionRefereeRankingService.get(paramMap.get('listId')).pipe(
        map( (rlist) => {
          this.list = rlist.data;
          return paramMap;
        })
      )),
      flatMap((paramMap) => this.competitionRefereeRankingService.loadReferees(
        this.list.ranked ? this.list.rankedReferees : this.competition.referees).pipe(
        map( (id2referee) => {
          this.id2referee = id2referee;
          console.log('id2referee', this.id2referee);
          return paramMap;
        })
      )),
      flatMap((paramMap) => {
        if (!this.list.ranked) {
          return this.competitionRefereeRankingService.loadCoachings(this.competition.id, this.list.rankedReferees).pipe(
            map((refereeId2coachings) => {
              this.refereeId2coachings = refereeId2coachings;
              console.log('refereeId2coachings', this.refereeId2coachings);
              this.autoRanking();
            }
          ));
        } else {
          this.loading = false;
          return of (paramMap);
        }
      })
    );
  }

  autoRanking() {
    this.competitionRefereeRankingService.launchNextRanking(this.list, this)
      .subscribe((stepResult: StepResult<CompetitionRankingList>) => {
        this.list = stepResult.result;
        if (this.list && !this.list.ranked && stepResult.continueProcess) {
          setTimeout(() => this.autoRanking(), 10);
        } else {
          this.competitionRefereeRankingService.save(this.list).subscribe();
        }
      });
  }

  manualRanking() {
    this.competitionRefereeRankingService.manualRanking(this.list);
    this.competitionRefereeRankingService.save(this.list).subscribe();
  }

  deleteList() {
    this.competitionRefereeRankingService.delete(this.list.id).subscribe();
  }

  /**
   * As to the user to compare two referees in a competition for a ranking list
   * @param ref1 the referee 1
   * @param ref2 the referee 2
   * @param list the current ranking list
   * @return empty string means no choice, otherwise the identifier of the referee
   */
  public askUserChoiseBetween2Referees(ref1: RefereeRef,
                                       ref2: RefereeRef,
                                       list: CompetitionRankingList): Observable<StepResult<string>> {
    console.log('askUserChoiseBetween2Referees', this.id2referee, this.refereeId2coachings);
    this.refereeData1 = {
      refereeId: ref1.refereeId,
      referee: this.id2referee.get(ref1.refereeId),
      coachings: this.refereeId2coachings.get(ref1.refereeId)
    };
    this.refereeData2 = {
      refereeId: ref2.refereeId,
      referee: this.id2referee.get(ref2.refereeId),
      coachings: this.refereeId2coachings.get(ref2.refereeId)
    };
    this.bestOf2Subject = new Subject<StepResult<string>>();
    this.showBestOf2 = true;
    return this.bestOf2Subject.asObservable();
  }

  dropList() {

  }

  onChoice(choice: StepResult<string>) {
    this.showBestOf2 = false;
    this.bestOf2Subject.next(choice);
    this.bestOf2Subject.complete();
  }

  onReorderReferee(event) {
    event.detail.complete(true);
    this.switch2Referees(event.detail.from, event.detail.to);
  }

  onReorder(event) {
    event.detail.complete(true);
    this.switch2Groups(event.detail.from, event.detail.to);
  }

  switch2Groups(groupIdx1: number, groupIdx2: number) {
    this.switch2item<RankingGroup>(groupIdx1, groupIdx2, this.list.groups);
  }

  switch2Referees(refereeIdx1: number, refereeIdx2: number) {
    this.switch2item<RefereeRef>(refereeIdx1, refereeIdx2, this.list.rankedReferees);
  }

  switch2item<T>(itemIdx1: number, itemIdx2: number, list: T[]) {
    if (itemIdx1 === itemIdx2) {
      return;
    }
    const dndItem: T = list[itemIdx1];
    list.splice(itemIdx1, 1);
    list.splice(itemIdx2, 0, dndItem);
    this.competitionRefereeRankingService.save(this.list).subscribe();
  }

  back() {
    if (this.competition.id) {
      this.navController.navigateRoot(`/competition/${this.competition.id}/ranking`);
    } else {
      this.navController.navigateRoot(`/competition/list`);
    }
  }
}
