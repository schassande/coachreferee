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

@Component({
  selector: 'app-competition-home',
  templateUrl: './competition-home.page.html',
  styleUrls: ['./competition-home.page.scss'],
})
export class CompetitionHomePage implements OnInit {

  competition: Competition;
  loading = false;
  owner: string;

  constructor(
    private alertCtrl: AlertController,
    private changeDetectorRef: ChangeDetectorRef,
    private connectedUserService: ConnectedUserService,
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
        return this.competition;
      }),
      // load competition owner info
      mergeMap( () => {
        this.owner = '';
        console.log('competition.ownerId=' + this.competition.ownerId);
        if (this.competition && this.competition.ownerId) {
          return this.userService.get(this.competition.ownerId).pipe(
            map( (ruser) => {
              if (ruser.data) {
                this.owner = ruser.data.firstName + ' ' + ruser.data.lastName + '(' + ruser.data.shortName + ')';
              }
              return this.owner;
            })
          );
        }
        return of(this.owner);
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

  newCoaching() {
    this.navController.navigateRoot('/coaching/create',
      { queryParams : { 
        competitionId: this.competition.id,
        competitionName: this.competition.name,
      }});
  }
}
