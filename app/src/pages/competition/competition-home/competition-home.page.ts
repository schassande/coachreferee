import { UserService } from './../../../app/service/UserService';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ConnectedUserService } from './../../../app/service/ConnectedUserService';
import { CompetitionService } from './../../../app/service/CompetitionService';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { HelpService } from './../../../app/service/HelpService';
import { DateService } from './../../../app/service/DateService';
import { Competition } from './../../../app/model/competition';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CoachingService } from 'src/app/service/CoachingService';
import { Coaching } from 'src/app/model/coaching';

@Component({
  selector: 'app-competition-home',
  templateUrl: './competition-home.page.html',
  styleUrls: ['./competition-home.page.scss'],
})
export class CompetitionHomePage implements OnInit {

  competition: Competition;
  coachings: Coaching[] = [];
  loading = false;
  owner: string;
  refereePanelDirector: string;
  days: string;

  constructor(
    private alertCtrl: AlertController,
    private changeDetectorRef: ChangeDetectorRef,
    private connectedUserService: ConnectedUserService,
    private coachingService: CoachingService,
    private competitionService: CompetitionService,
    public dateService: DateService,
    private helpService: HelpService,
    private navController: NavController,
    private route: ActivatedRoute,
    public userService: UserService
  ) { }

  ngOnInit() {
    this.helpService.setHelp('competition-list');
    this.loadCompetition().subscribe(() => {
      this.loadCoachings();
      this.changeDetectorRef.detectChanges();
    });
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
        } else  if (!this.connectedUserService.isAdmin()
            && !this.competitionService.authorized(this.competition, this.connectedUserService.getCurrentUser().id)) {
          // the coach is not allowed to access to this competition
          this.navController.navigateRoot('/competition/list');
        }
        this.days = this.competition.days.map(d => this.dateService.date2string(d)).join(', ');
        return this.competition;
      }),
      // load competition owner info
      mergeMap( () => {
        this.owner = '';
        if (this.competition && this.competition.ownerId) {
          return this.getUserById(this.competition.ownerId).pipe(
            map( (name) => this.owner = name)
          );
        }
        return of(this.owner);
      }),
      mergeMap( () => {
        this.refereePanelDirector = '';
        
        if (this.competition && this.competition.refereePanelDirectorId) {
          return this.getUserById(this.competition.refereePanelDirectorId).pipe(
            map( (name) => this.refereePanelDirector = name)
          );
        }
        return of(this.refereePanelDirector);
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

  private getUserById(userId:string): Observable<string> {
    return this.userService.get(userId).pipe(
      map( (ruser) => {
        if (ruser.data) {
          return ruser.data.firstName + ' ' + ruser.data.lastName + '(' + ruser.data.shortName + ')';
        }
        return "";
      })
    );
}
  private loadCoachings() {
    this.coachingService.getCoachingByCoachNCompetition(
      this.connectedUserService.getCurrentUser().id, this.competition.id).subscribe((rcoaching) => {
        if (rcoaching.data) {
          this.coachings = this.coachingService.sortCoachings(rcoaching.data, true);
        }
    })
  }
  getCoachingDate(coaching: Coaching) {
    return this.coachingService.getCoachingDateAsString(coaching);
  }
  getRefereeShortNames(coaching: Coaching) {
    return coaching.referees.map((ref) => ref.refereeShortName).join(', ');
  }
  coachingSelected(coaching: Coaching) {
    this.navController.navigateRoot('/coaching/coach/' + coaching.id);
  }
  onDelete() {
    this.deleteCompetition(this.competition);
  }
  deleteCompetition(competition: Competition) {
    this.alertCtrl.create({
      message: 'Do you really want to delete the competition ' + competition.name + '-' + competition.year + '?',
      buttons: [
        { text: 'Cancel', role: 'cancel'},
        {
          text: 'Delete',
          handler: () => {
            this.navController.navigateRoot('/competition/list');
          }
        }
      ]
    }).then( (alert) => alert.present() );
  }

  navToCoaching($event) {
    $event.stopPropagation();
    if (this.coachings.length > 0) {
      this.navController.navigateRoot('/coaching/coach/' + this.coachings[0].id);
    } else {
      this.newCoaching($event);
    }
  }
  newCoaching($event) {
    $event.stopPropagation();
    this.navController.navigateRoot('/coaching/create',
      { queryParams : { 
        competitionId: this.competition.id,
        competitionName: this.competition.name,
      }});
  }
}
