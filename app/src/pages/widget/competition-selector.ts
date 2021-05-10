import { map } from 'rxjs/operators';
import { Component, Output, EventEmitter, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { CompetitionService } from './../../app/service/CompetitionService';
import { Competition } from './../../app/model/competition';

export interface CompetitionInfo {
    name: string;
    id: string;
}

@Component({
    selector: 'app-competition-selector',
    template: `
<ion-header>
    <ion-toolbar>
        <ion-buttons slot="start">
            <ion-button (click)="onOk()">
                <ion-icon name="arrow-back"></ion-icon>
            </ion-button>
        </ion-buttons>
        <ion-title style="text-align: center;">Select a competition</ion-title>
        <ion-buttons slot="end">
            <ion-menu-button autoHide="false" menu="main"></ion-menu-button>
        </ion-buttons>
    </ion-toolbar>
</ion-header>
<ion-content (swipe)="onSwipe($event)">
    <ion-searchbar [(ngModel)]="name" showCancelButton="false" (ionChange)="onSearchBarInput()" autofocus></ion-searchbar>
    <div *ngIf="competitions && competitions.length === 0" style="text-align: center; font-style: italic">No competitions found.</div>
    <div *ngIf="error" style="text-align: center; font-style: italic">{{error}}</div>
    <ion-list *ngIf="competitions">
        <ion-item *ngFor="let competition of competitions">
            <ion-label (click)="onSelection(competition)" style="border: none;">{{competition.name}}</ion-label>
        </ion-item>
    </ion-list>
    <div style="text-align: center;"><ion-button (click)="onOk()">Ok</ion-button></div>
</ion-content>`
})
export class CompetitionSelectorComponent {

    @Input() public name = '';
    competitions: Competition[] = [];
    error = null;

    constructor(
      private competitionService: CompetitionService,
      private modalCtrl: ModalController) {
    }

    onSearchBarInput() {
        this.competitionService.searchCompetitions(this.name).pipe(
            map((rcomp) => {
                this.competitions = rcomp.data;
                this.error = rcomp.error;
            })
        ).subscribe();
    }

    onSelection(competition: Competition) {
        this.sendCompetitionInfo({ name: competition.name, id: competition.id});
    }

    onOk() {
        this.sendCompetitionInfo({ name: this.name, id: ''});
    }

    sendCompetitionInfo(competitionInfo: CompetitionInfo) {
        this.modalCtrl.dismiss(competitionInfo);
    }
    onSwipe(event) {
        if (event.direction === 4) {
          this.onOk();
        }
    }
}
