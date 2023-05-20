import { DateService } from './../../../app/service/DateService';
import { Competition } from './../../../app/model/competition';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-competition-games',
  template: `
  <ion-list *ngIf="competition">
    <ion-item-group style="border-left: 1px solid lightgrey; border-right: 1px solid lightgrey;">
      <ion-item-divider color="light" style="text-align: left; font-size: 1.2em; padding: 10px;">
        <span (click)="toggleVisibility()" style="width: 100%; vertical-align: middle;">
            <ion-icon *ngIf="competition.allocations.length > 0" style="display: inline-block; vertical-align: middle;" name="{{ visible ? 'remove' : 'add'}}"></ion-icon> &nbsp;
            <div style="display: inline-block; vertical-align: middle;">{{competition.allocations.length}} Game(s)</div>
        </span>
      </ion-item-divider>
      <div *ngIf="visible">
        <ion-item *ngFor="let alloc of competition.allocations">
            <ion-label>
                {{dateService.date2string(alloc.date)}} {{alloc.timeSlot}} Field:{{alloc.field}} Cat:{{alloc.gameCategory}}
                <span *ngIf="alloc.id"><br>GameId: {{alloc.id}}</span>
                <br>Referees:<span *ngFor="let ref of alloc.referees"> {{ref.refereeShortName}}</span>
                <br>Coaches:<span *ngFor="let coach of alloc.refereeCoaches"> {{coach.coachShortName}}</span>
            </ion-label>
        </ion-item>
      </div>
    </ion-item-group>
  </ion-list>`
})
export class CompetitionGamesPage {

  @Input()
  competition: Competition;
  visible = true;

  constructor(
    public dateService: DateService
  ) { }

  toggleVisibility() {
    this.visible = !this.visible;
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
}
