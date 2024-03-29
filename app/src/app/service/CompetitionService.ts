import { AppSettingsService } from './AppSettingsService';
import { DateService } from './DateService';
import { Competition, CompetitionCategory } from './../model/competition';
import { ConnectedUserService } from './ConnectedUserService';
import { Firestore, query, Query, where } from '@angular/fire/firestore';
import { Observable, forkJoin, of } from 'rxjs';
import { ResponseWithData } from './response';
import { Injectable } from '@angular/core';
import { RemotePersistentDataService } from './RemotePersistentDataService';
import { ToastController } from '@ionic/angular';
import { ToolService } from './ToolService';
import { Referee } from '../model/user';
import { DataRegion } from '../model/common';

@Injectable()
export class CompetitionService extends RemotePersistentDataService<Competition> {

    constructor(
        appSettingsService: AppSettingsService,
        db: Firestore,
        private connectedUserService: ConnectedUserService,
        private dateService: DateService,
        toastController: ToastController,
        private toolService: ToolService
    ) {
        super(appSettingsService, db, toastController);
    }

    getLocalStoragePrefix() {
        return 'competition';
    }

    getPriority(): number {
        return 4;
    }
    protected adjustFieldOnLoad(item: Competition) {
        item.date = this.adjustDate(item.date, this.dateService);
        if (item.allocations === undefined) {
            item.allocations = [];
        }
        item.allocations.forEach( (alloc) => {
            alloc.date = this.adjustDate(alloc.date, this.dateService);
        });
        if (!item.days) {
            item.days = [];
        }
        item.days = item.days
            // .filter(d => d !== null && d !== undefined)
            .map((day) => this.adjustDate(day, this.dateService));
        if (item.days.length === 0 && item.date) {
            item.days.push(item.date);
        }
        if (!item.categorySenior) {
            item.categorySenior = item.category;
        }
    }
    public searchCompetitions(text: string,
                              year: number|undefined,
                              options: 'default' | 'server' | 'cache' = 'default',
                              regionP: DataRegion = null): Observable<ResponseWithData<Competition[]>> {
        let q: Query<Competition> = this.getCollectionRef();
        const region = regionP ? regionP : this.connectedUserService.getCurrentUser().region;
        console.log('searchCompetitions(' + text + ',' + options + ') filter by the region of the user: \'' + region + '\'');
        q = query(q, where('region', '==', region));
        if (year) {
            q = query(q, where('year', '==', year));
        }
        let res = this.query(q, options);
        const str = this.toolService.isValidString(text) ? text.trim() : null;
        if (str) {
            console.log('searchCompetitions(' + text + ',' + options + ') filter by the competition name.');
            res = super.filter(res, (item: Competition) => this.stringContains(str, item.name));
        }
        return res;
    }

    public filterCompetitionsByCoach(competitions: Competition[], coachId: string): Competition[] {
        return competitions.filter((competition) => this.authorized(competition, coachId));
    }

    public authorized(competition: Competition, coachId: string): boolean {
        return competition.refereePanelDirectorId === coachId
                || competition.ownerId === coachId
                || competition.refereeCoaches.filter((coach) => coach.coachId === coachId).length > 0;
    }

    public sortCompetitions(competitions: Competition[], reverse: boolean = false): Competition[] {
        if (!competitions) {
            return competitions;
        }
        competitions.sort(this.compareCompetition.bind(this));
        if (reverse) {
            competitions = competitions.reverse();
        }
        return competitions;
    }

    public compareCompetition(competition1: Competition, competition2: Competition): number {
        let res = 0;
        if (res === 0) {
          // Compare date
          res = this.dateService.compareDate(competition1.date, competition2.date);
        }
        if (res === 0) {
          // compare competition name
          res = competition1.name.localeCompare(competition2.name);
        }
        return res;
    }
    public getCompetitionByName(name: string): Observable<ResponseWithData<Competition>> {
        if (!name) {
            return of({data: null, error: null});
        }
        return this.queryOne(query(this.getCollectionRef(), where('name', '==', name)));
    }
    public getCompetitionCategory(competition: Competition, referee: Referee): CompetitionCategory {
        if (referee.referee.refereeCategory === 'SENIOR' && competition.categorySenior) {
          return competition.categorySenior;
        } else {
          return competition.category;
        }
    }
}
