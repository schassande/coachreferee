import { Upgradable } from './../model/coaching';
import { mergeMap, map } from 'rxjs/operators';
import { ResponseWithData } from './response';
import { Observable, of, from } from 'rxjs';
import { CompetitionRefereeUpgrade, UpgradeVote } from './../model/upgrade';
import { AppSettingsService } from './AppSettingsService';
import { Firestore, Query, query, where } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { RemotePersistentDataService } from './RemotePersistentDataService';
import { ToastController } from '@ionic/angular';


@Injectable()
export class CompetitionRefereeUpgradeService extends RemotePersistentDataService<CompetitionRefereeUpgrade> {

    constructor(
      appSettingsService: AppSettingsService,
      db: Firestore,
      toastController: ToastController
    ) {
        super(appSettingsService, db, toastController);
    }

    getLocalStoragePrefix() {
        return 'competitionrefereeupgrade';
    }

    getPriority(): number {
        return 5;
    }

    getCompetitionRefereeUpgrade(competitionId: string, refereeId: string): Observable<ResponseWithData<CompetitionRefereeUpgrade>> {
      return this.queryOne(query(this.getCollectionRef(),
          where('competitionId', '==', competitionId),
          where('refereeId', '==', refereeId)));
    }

    findCompetitionRefereeUpgradeByReferee(refereeId: string, season: string): Observable<ResponseWithData<CompetitionRefereeUpgrade[]>> {
      return this.query(query(this.getCollectionRef(), 
        where('refereeId', '==', refereeId),
        where('season', '==', season)));
    }

    setCoachVote(id: string, vote: UpgradeVote): Observable<any> {
      const newPartialCru: Partial<CompetitionRefereeUpgrade> = {};
      newPartialCru['votes.' + vote.coachId] = vote;
      return this.partialUpdate(id, newPartialCru);
    }

    setDecision(id: string, vote: Upgradable): Observable<any> {
      return this.partialUpdate(id, { finalDecision: vote });
    }
}
