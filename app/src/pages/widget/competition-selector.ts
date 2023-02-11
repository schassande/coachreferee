import { map } from 'rxjs/operators';
import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { CompetitionService } from './../../app/service/CompetitionService';
import { Competition } from './../../app/model/competition';
import { ConnectedUserService } from 'src/app/service/ConnectedUserService';
import { DataRegion } from 'src/app/model/common';

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
    <div class="search-bar">
        <div class="search-filter-item">
            <ion-select [(ngModel)]="region" interface="action-sheet" (ionChange)="onSearchBarInput()">
                <ion-select-option value="Europe">Europe</ion-select-option>
                <ion-select-option value="Australia">Australia</ion-select-option>
                <ion-select-option value="New Zealand">New Zealand</ion-select-option>
                <ion-select-option value="Others">Others</ion-select-option>
                <ion-select-option value="">All</ion-select-option>
                <ion-select-option value="Test">Test</ion-select-option>
            </ion-select>
        </div>
        <div class="search-filter-item">
            <ion-select [(ngModel)]="year" (ionChange)="onSearchBarInput()" interface-options="popover">
                <ion-select-option *ngFor="let y of years;" value="{{y}}">{{y}}</ion-select-option>
            </ion-select>
        </div>
        <ion-searchbar [(ngModel)]="name" class="search-box" [showCancelButton]="false" (ionChange)="onSearchBarInput()"></ion-searchbar>
    </div>
    <div *ngIf="competitions && competitions.length === 0" style="text-align: center; font-style: italic">No competitions found.</div>
    <div *ngIf="error" style="text-align: center; font-style: italic">{{error}}</div>
    <ion-list *ngIf="competitions">
        <ion-item *ngFor="let competition of competitions">
            <ion-label (click)="onSelection(competition)" style="border: none;">{{competition.name}}</ion-label>
        </ion-item>
    </ion-list>
    <div style="text-align: center;"><ion-button (click)="onOk()">Ok</ion-button></div>
</ion-content>`,
    styles: [`
        .search-bar {
            width: 100%;
        }
        .search-box {
            display: inline-block;
        }
        .search-filter-item {
            display: inline-block;
        }
        @media (max-width: 400px) {
            .search-box {
                width: 100%;
            }
            .search-filter-item {
                margin-right: 10px;
            }
        }
        @media (min-width: 400px) and (max-width: 470px) {
            .search-box {
                width: 50%;
            }
        }
        @media (min-width: 470px) {
            .search-box {
                width: 60%;
            }
        }
`]
})
export class CompetitionSelectorComponent  implements OnInit {

    @Input() public name = '';
    competitions: Competition[] = [];
    error = null;
    region: DataRegion;
    year: string;
    years: string[] = [];
  
    constructor(
      private competitionService: CompetitionService,
      private connectedUserService: ConnectedUserService,
      private modalCtrl: ModalController) {
    }

    ngOnInit() {
        this.region = this.connectedUserService.getCurrentUser().region;
        const y = new Date().getFullYear();
        this.year = '' + y;
        for(let i = 0; i<5; i++) this.years.push('' + (y-i));
    }

    onSearchBarInput() {
        this.competitionService.searchCompetitions(this.name, Number.parseInt(this.year), 'default', this.region).pipe(
            map((rcomp) => {
                this.competitions = rcomp.data;
                this.error = rcomp.error;
                if (this.competitions) {
                    this.competitions.sort((c1, c2) => c2.date.getTime() - c1.date.getTime());
                }
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
