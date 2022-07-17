import { UserService } from './../../../app/service/UserService';
import { User } from './../../../app/model/user';
import { HelpService } from './../../../app/service/HelpService';
import { DateService } from '../../../app/service/DateService';
import { ModalController, NavController } from '@ionic/angular';
import { ConnectedUserService } from '../../../app/service/ConnectedUserService';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { XpService } from '../../../app/service/XpService';
import { Xp, CoachingDay } from '../../../app/model/xphistory';
import { Component, OnInit } from '@angular/core';
import { mergeMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { CompetitionSelectorComponent } from 'src/pages/widget/competition-selector';
import { CoachingList, CoachingService } from 'src/app/service/CoachingService';

const DATE_SEP = '-';

@Component({
  selector: 'app-xp-edit',
  templateUrl: './xp-edit.component.html',
  styleUrls: ['./xp-edit.component.scss'],
})
export class XpEditComponent implements OnInit {

  xp: Xp;
  xpId: string;
  error: any;
  coach: User;

  constructor(
    private connectedUserService: ConnectedUserService,
    private coachingService: CoachingService,
    private dateService: DateService,
    private helpService: HelpService,
    public modalController: ModalController,
    private navController: NavController,
    private route: ActivatedRoute,
    private userService: UserService,
    private xpService: XpService
  ) { }

  ngOnInit() {
    this.helpService.setHelp('xp-edit');
    return this.route.paramMap.pipe(
      mergeMap( (paramMap: ParamMap) => {
        this.xpId = paramMap.get('id');
        console.log('xpId=' + this.xpId);
        if (this.xpId) {
          return this.xpService.get(this.xpId);
        } else {
          return of( { data: this.newXp(), error: null});
        }
      }),
      map((rxp) => {
        this.xp = rxp.data;
        this.error = rxp.error;
        return rxp;
      }),
      mergeMap(() => this.userService.get(this.xp.coachId)),
      map((ruser) => this.coach = ruser.data)
    ).subscribe();
  }

  delete(dayIdx: number) {
    this.xp.days.splice(dayIdx, 1);
  }

  newXp(): Xp {
    return  {
      id: null,
      version: 0,
      creationDate: new Date(),
      lastUpdate: new Date(),
      dataStatus: 'NEW',
      coachId: this.connectedUserService.getCurrentUser().id,
      eventName: this.connectedUserService.getCurrentUser().defaultCompetition,
      eventClass: 'B',
      year: new Date().getFullYear(),
      days: []
    };
  }

  public onCDDate(cd: CoachingDay, event) {
    cd.coachingDate = new Date(event.detail.value);
  }
  public getCDDate(cd: CoachingDay): string {
    return this.dateService.date2string(cd.coachingDate);
  }

  public setCDDate(cd: CoachingDay, dateStr: string) {
    cd.coachingDate = this.dateService.string2date(dateStr, cd.coachingDate);
  }

  saveNback() {
    this.xp.year = this.xp && this.xp.days && this.xp.days.length > 0
      ? this.xp.days[0].coachingDate.getFullYear()
      : new Date().getFullYear();
    this.xpService.save(this.xp).subscribe(() => {
      this.navController.navigateRoot(`/xp/list`);
    });
  }

  deleteXp() {
    if (this.xpId) {
      this.xpService.delete(this.xpId).subscribe( () => {
        this.navController.navigateRoot(`/xp/list`);
      });
    }
  }

  newDay() {
    const coachingDay: CoachingDay = this.xp.days.length > 0 
      ? this.xp.days[this.xp.days.length-1]
      : null;
    this.xp.days.push(this.buildNewDay(coachingDay));
  }

  buildNewDay(previousCoachingDay: CoachingDay = null): CoachingDay {
    if (previousCoachingDay) {
      return {
        coachingDate: this.dateService.to00h00(this.dateService.nextDay(previousCoachingDay.coachingDate)),
        gameDuration: previousCoachingDay.gameDuration,
        nbGames: previousCoachingDay.nbGames,
        coachingDuration: previousCoachingDay.coachingDuration,
        refereeAllocation: previousCoachingDay.refereeAllocation
      };
    } else {
      return {
        coachingDate: this.dateService.to00h00(new Date()),
        gameDuration: 40,
        nbGames: 8,
        coachingDuration: 320,
        refereeAllocation: 'No'
      };
    }
  }

  async onClickCompetition() {
    const modal = await this.modalController.create({
      component: CompetitionSelectorComponent,
      componentProps: { name: this.xp.eventName}
    });
    modal.onDidDismiss().then( (result) => {
      this.xp.eventName = result.data.name;
      this.autoCompute(result.data.id);
    });
    modal.present();
  }

  onGameDataChange(cd: CoachingDay) {
    cd.coachingDuration = cd.nbGames * cd.gameDuration;
  }

  autoCompute(competitionId: string) {
    if (!competitionId || this.xp.days.length > 0) {
      return;
    }
    this.coachingService.getCoachingByCompetition(competitionId).subscribe((rcoachings) => {
      if (rcoachings.data) {
        const myCoachings = this.coachingService.sortCoachings(
          rcoachings.data.filter(coaching => coaching.coachId === this.connectedUserService.getCurrentUser().id));
        const coachingLists: CoachingList[] = this.coachingService.computeCoachingLists(myCoachings);
        this.xp.days = coachingLists.map(cl => {
          console.log('Create a xp day for ' + cl.day);
          return {
            coachingDate: this.dateService.to00h00(cl.coachings[0].date),
            gameDuration: 40,
            nbGames: cl.coachings.length,
            coachingDuration: cl.coachings.length * 40,
            refereeAllocation: 'No'
          } as CoachingDay;
        });
      }
    });
  }

  onSwipe(event) {
    if (event.direction === 4) {
      this.saveNback();
    }
  }
}
