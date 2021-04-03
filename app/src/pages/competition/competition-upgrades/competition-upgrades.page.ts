import { Upgradable } from './../../../app/model/coaching';
import { ConnectedUserService } from './../../../app/service/ConnectedUserService';
import { CompetitionRefereeUpgradeService } from './../../../app/service/CompetitionRefereeUpgradeService';
import { CompetitionRefereeUpgrade, UpgradeVote } from './../../../app/model/upgrade';
import { CoachingService } from './../../../app/service/CoachingService';
import { Coaching } from 'src/app/model/coaching';
import { ToolService } from 'src/app/service/ToolService';
import { Observable, of, forkJoin } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { mergeMap, map, catchError } from 'rxjs/operators';

import { CompetitionService } from './../../../app/service/CompetitionService';
import { Competition, CoachRef } from './../../../app/model/competition';
import { DateService } from './../../../app/service/DateService';
import { HelpService } from './../../../app/service/HelpService';
import { Referee, RefereeLevel } from './../../../app/model/user';
import { ResponseWithData } from 'src/app/service/response';
import { RefereeService } from './../../../app/service/RefereeService';

class UpgradableReferee {
  referee: Referee;
  coachings: Coaching[];
  constructor(referee: Referee, coachings: Coaching[]) {
    this.referee = referee;
    this.coachings = coachings;
  }
}
@Component({
  selector: 'app-competition-upgrades',
  templateUrl: './competition-upgrades.page.html',
  styleUrls: ['./competition-upgrades.page.scss'],
})
export class CompetitionUpgradesPage implements OnInit {

  competition: Competition;
  loading = false;
  errors: string[] = [];
  upgradeLevels: RefereeLevel[] = [];
  referees: Referee[] = [];
  currentUgradeLevel: RefereeLevel = null;
  refereesToUpgrade: UpgradableReferee[] = [];
  refereeToUpgrade: UpgradableReferee = null;
  refereeToUpgrade2: UpgradableReferee = null;
  competitionRefereeUpgrade: CompetitionRefereeUpgrade;
  votes: UpgradeVote[];
  voteStats: number[] = [];
  isPanelDirector = false;
  userId: string;

  constructor(
    public coachingService: CoachingService,
    private connectedUserService: ConnectedUserService,
    private competitionService: CompetitionService,
    public dateService: DateService,
    private helpService: HelpService,
    private navController: NavController,
    private refereeService: RefereeService,
    private route: ActivatedRoute,
    private toolService: ToolService,
    private competitionRefereeUpgradeService: CompetitionRefereeUpgradeService
  ) { }

  ngOnInit() {
    this.userId = this.connectedUserService.getCurrentUser().id;
    this.helpService.setHelp('competition-list');
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
      mergeMap( () => this.loadReferees()),
      map( () => this.computeUpgradeLevels()),
      mergeMap( () => this.computeUpgradableReferees()),
      map (() => {
        this.loading = false;
        return this.competition;
      })
    );
  }

  loadReferees(): Observable<any> {
    const obs: Observable<ResponseWithData<Referee>>[] = [];
    this.upgradeLevels = [];
    this.competition.referees.forEach( (ref) => {
      obs.push(this.refereeService.get(ref.refereeId).pipe(
        map( (rref) => {
          if (rref.data) {
            this.referees.push(rref.data);
          }
          return rref;
        })
      ));
    });
    return forkJoin(obs).pipe(
      map (() => this.referees)
    );
  }

  computeUpgradeLevels(): RefereeLevel[] {
    this.upgradeLevels = [];
    this.referees.forEach((ref) => {
      if (ref.referee.nextRefereeLevel && this.upgradeLevels.indexOf(ref.referee.nextRefereeLevel) < 0) {
        console.log('add upgrade level: ' + ref.referee.nextRefereeLevel);
        this.upgradeLevels.push(ref.referee.nextRefereeLevel);
      }
    });
    this.upgradeLevels = this.upgradeLevels.sort().reverse();
    if (this.upgradeLevels.length) {
      this.currentUgradeLevel = this.upgradeLevels[0];
      this.onUpgradeLevelChanged();
    }
    return this.upgradeLevels;
  }

  onUpgradeLevelChanged() {
    this.computeUpgradableReferees().subscribe();
  }

  computeUpgradableReferees(): Observable<any> {
    const refsToUpgrade: UpgradableReferee[] = [];
    const obs: Observable<any>[] = [];
    this.referees.forEach((ref) => {
      if (ref.referee.nextRefereeLevel && ref.referee.nextRefereeLevel === this.currentUgradeLevel) {
        // console.log('Select the referee: ' + ref.shortName);
        // load the coaching of the referee during the competition
        obs.push(this.coachingService.getCoachingByRefereeCompetition(ref.id, this.competition.id).pipe(
          map((rcoachings) => {
          refsToUpgrade.push(new UpgradableReferee(ref, rcoachings.data));
        })));
      }
    });
    return forkJoin(obs).pipe(
      map (() => {
        // sort by referee first name + last name
        refsToUpgrade.sort( (ur1, ur2) => {
          const n1 = ur1.referee.firstName + ' ' + ur1.referee.lastName;
          const n2 = ur2.referee.firstName + ' ' + ur2.referee.lastName;
          return n1.localeCompare(n2);
        });
        refsToUpgrade.forEach(ref => {
          this.coachingService.sortCoachings(ref.coachings, true);
        });
        this.refereesToUpgrade = refsToUpgrade;
        this.refereeToUpgrade = refsToUpgrade ? refsToUpgrade[0] : null;
        return this.refereesToUpgrade;
      })
    );
  }

  getRefIdx(coaching: Coaching, refereeId: string): number {
    return coaching.refereeIds.indexOf(refereeId);
  }

  back() {
    if (this.competition.id) {
      this.navController.navigateRoot(`/competition/${this.competition.id}/home`);
    } else {
      this.navController.navigateRoot(`/competition/list`);
    }
  }

  onRefereeChanged() {
    if (this.refereeToUpgrade
      && (this.refereeToUpgrade2 === null || this.refereeToUpgrade.referee.id !== this.refereeToUpgrade2.referee.id)) {

      this.refereeToUpgrade2 = this.refereeToUpgrade;
      this.getCompetitionRefereeUpgrade().subscribe();
    }
  }

  private getCompetitionRefereeUpgrade(): Observable<CompetitionRefereeUpgrade> {
    return this.competitionRefereeUpgradeService.getCompetitionRefereeUpgrade(this.competition.id, this.refereeToUpgrade.referee.id).pipe(
      mergeMap((rcru) => {
        if (!rcru.error && !rcru.data) {
          console.log('getCompetitionRefereeUpgrade: create a new');
          // create a new CompetitionRefereeUpgrade
          rcru.data = {
            id: '',
            creationDate: new Date(),
            dataStatus: 'NEW',
            lastUpdate: new Date(),
            version: 0,
            refereeId: this.refereeToUpgrade.referee.id,
            refereeShortName: this.refereeToUpgrade.referee.shortName,
            competitionId: this.competition.id,
            votes: {},
            finalDecision: 'DNS',
            season: this.competition.date.getFullYear().toString()
          };
          // initialize coach votes
          this.competition.refereeCoaches.forEach(coach => {
            const coachId: string = this.toCoachId(coach);
            if (coachId) {
              rcru.data.votes[coachId] = {
                coachId,
                vote: 'DNS',
                isUser: coach.coachId !== null,
                force: false
              } as UpgradeVote;
            }
          });
          // save the new object
          return this.competitionRefereeUpgradeService.save(rcru.data);
        } else {
          console.log('getCompetitionRefereeUpgrade: rcru', rcru);
          return of(rcru);
        }
      }),
      map((rcru) => {
        this.competitionRefereeUpgrade = rcru.data;
        if (this.competitionRefereeUpgrade) {
          this.votes = this.competition.refereeCoaches.map(coach => this.competitionRefereeUpgrade.votes[this.toCoachId(coach)]);
          this.isPanelDirector = this.userId === this.competition.refereePanelDirectorId;
        } else {
          this.votes = [];
          this.isPanelDirector = false;
        }
        this.computeVoteStats();
        return this.competitionRefereeUpgrade;
      })
    );
  }

  toCoachId(coach: CoachRef): string {
    return coach.coachId ? coach.coachId : coach.coachShortName;
  }

  getCoachShortName(coachId: string): string {
    const coachInfo = this.competition.refereeCoaches.find(coach => this.toCoachId(coach) === coachId);
    return coachInfo ? coachInfo.coachShortName : null;
  }

  setDecision() {
    this.competitionRefereeUpgradeService.setDecision(
      this.competitionRefereeUpgrade.id, 
      this.competitionRefereeUpgrade.finalDecision).subscribe();
  }

  setVote(vote: UpgradeVote) {
    this.computeVoteStats();
    this.competitionRefereeUpgradeService.setCoachVote(this.competitionRefereeUpgrade.id, vote).subscribe();
  }

  computeVoteStats() {
    this.voteStats['Yes'] = 0;
    this.voteStats['Possible'] = 0;
    this.voteStats['No'] = 0;
    this.voteStats['DNS'] = 0;
    this.competition.refereeCoaches.forEach(coach => {
      const vote: Upgradable = this.competitionRefereeUpgrade.votes[this.toCoachId(coach)].vote;
      this.voteStats[vote]++;
    });
  }
}
