import { ConnectedUserService } from './../../../app/service/ConnectedUserService';
import { SharedWith } from './../../../app/model/common';
import { UserSelectorComponent } from './../../widget/user-selector-component';
import { ToolService } from './../../../app/service/ToolService';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/service/UserService';
import { NavController, AlertController, ModalController } from '@ionic/angular';
import { HelpService } from './../../../app/service/HelpService';
import { DateService } from 'src/app/service/DateService';
import { CompetitionService } from './../../../app/service/CompetitionService';
import { User } from './../../../app/model/user';
import { Competition } from './../../../app/model/competition';
import { Component, OnInit } from '@angular/core';
import { map, flatMap, catchError } from 'rxjs/operators';
import { of, Observable, forkJoin } from 'rxjs';
import { ResponseWithData } from 'src/app/service/response';

@Component({
  selector: 'app-competition-coaches',
  templateUrl: './competition-coaches.page.html',
  styleUrls: ['./competition-coaches.page.scss'],
})
export class CompetitionCoachesPage implements OnInit {

  competition: Competition;
  coaches: User[] = [];
  nonUserCoaches: string[] = [];
  loading = false;
  errors: string[] = [];


  constructor(
    private alertCtrl: AlertController,
    private connectedUserService: ConnectedUserService,
    private modalController: ModalController,
    private competitionService: CompetitionService,
    public dateService: DateService,
    private helpService: HelpService,
    private navController: NavController,
    private route: ActivatedRoute,
    private toolService: ToolService,
    private userService: UserService
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
      flatMap( (paramMap) => this.competitionService.get(paramMap.get('id'))),
      map( (rcompetition) => {
        this.competition = rcompetition.data;
        if (!this.competition) {
          // the competition has not been found => create it
          this.navController.navigateRoot('/competition/list');
        }
        if (!this.competitionService.authorized(this.competition, this.connectedUserService.getCurrentUser().id)) {
          // the coach is not allowed to access to this competition
          this.navController.navigateRoot('/competition/list');
        }
        return this.competition;
      }),
      // load coaches
      flatMap(() => this.loadCoaches()),
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

  private loadCoaches(): Observable<User[]> {
    console.log('loadCoaches');
    const obs: Observable<User>[] = [];
    const newCoaches: User[] = [];
    if (!this.competition.refereeCoaches || this.competition.refereeCoaches.length === 0) {
      this.coaches = newCoaches;
      return of(this.coaches);
    }
    this.nonUserCoaches = [];
    this.competition.refereeCoaches.forEach((coach) => {
      if (coach.coachId === null) {
        this.nonUserCoaches.push(coach.coachShortName);
      } else {
        obs.push(this.userService.get(coach.coachId).pipe(
              map((res: ResponseWithData<User>) => {
                  if (res.data) {
                    newCoaches.push(res.data);
                  } else {
                      console.error('Coach ' + coach.coachId + ' does not exist !');
                  }
                  return res.data;
              }))
           );
      }
    });
    if (obs.length === 0) {
      this.coaches = newCoaches;
      return of(this.coaches);
    }
    return forkJoin(obs).pipe(
      map(() => {
        this.coaches = newCoaches;
        return this.coaches;
      })
    );
  }

  async addRefereeCoach() {
    const modal = await this.modalController.create({ component: UserSelectorComponent});
    modal.onDidDismiss().then( (data) => {
      const selection: SharedWith = data.data as SharedWith;
      if (selection) {
        selection.users.forEach((user) => {
          console.log({ coachShortName: user.shortName, coachId: user.id});
          this.toolService.addToSetById(this.competition.refereeCoaches,
            { coachShortName: user.shortName, coachId: user.id}, 'coachId');
          this.toolService.addToSetById(this.coaches, user);
        });
        this.save().subscribe();
      }
    });
    return await modal.present();
  }

  deleteRefereeCoach(coach: User) {
    this.alertCtrl.create({
      message: 'Do you reaaly want to delete the the refere coach ' + coach.shortName + ' from this competition?',
      buttons: [
        { text: 'Cancel', role: 'cancel'},
        {
          text: 'Delete',
          handler: () => {
            // remove the referee coach from the competition object
            this.toolService.deleteFromArrayById(this.competition.refereeCoaches, coach.id, 'coachId');
            // remove the referee coach  from the local list
            this.toolService.deleteFromArrayById(this.coaches, coach.id);
            this.save().subscribe();
          }
        }
      ]
    }).then( (alert) => alert.present() );
  }

  deleteNonUserCoach(nonUserCoach: string) {
    this.alertCtrl.create({
      message: 'Do you reaaly want to delete the the refere coach ' + nonUserCoach + ' (not an app user) from this competition?',
      buttons: [
        { text: 'Cancel', role: 'cancel'},
        {
          text: 'Delete',
          handler: () => {
            // remove the referee coach from the competition object
            this.toolService.deleteFromArrayById(this.competition.refereeCoaches, nonUserCoach, 'coachShortName');
            // remove the referee coach  from the local list
            this.nonUserCoaches.splice(this.nonUserCoaches.indexOf(nonUserCoach, 0), 1);
            this.save().subscribe();
          }
        }
      ]
    }).then( (alert) => alert.present() );
  }

  save(): Observable<any> {
    return this.competitionService.save(this.competition).pipe(
      map((rcompetition) => {
        if (rcompetition.data) {
          this.competition = rcompetition.data;
        } else {
          this.alertCtrl.create({ message: 'Error when saving the competition: ' + rcompetition.error.error })
            .then( (alert) => alert.present() );
        }
      })
    );
  }

  back() {
    if (this.competition.id) {
      this.navController.navigateRoot(`/competition/${this.competition.id}/home`);
    } else {
      this.navController.navigateRoot(`/competition/list`);
    }
  }

  setDirector() {
    this.save().subscribe();
  }
}
