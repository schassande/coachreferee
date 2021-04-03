import { Upgradable } from './../model/coaching';
import { mergeMap, map } from 'rxjs/operators';
import { ResponseWithData } from './response';
import { Observable, of, from } from 'rxjs';
import { CompetitionRefereeUpgrade, UpgradeVote } from './../model/upgrade';
import { AppSettingsService } from './AppSettingsService';
import { AngularFirestore, Query } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { RemotePersistentDataService } from './RemotePersistentDataService';
import { ToastController } from '@ionic/angular';


@Injectable()
export class CompetitionRefereeUpgradeService extends RemotePersistentDataService<CompetitionRefereeUpgrade> {

    constructor(
      appSettingsService: AppSettingsService,
      db: AngularFirestore,
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
      return this.queryOne(this.getCollectionRef()
        .where('competitionId', '==', competitionId)
        .where('refereeId', '==', refereeId), 'default').pipe(
          mergeMap((rcru: ResponseWithData<CompetitionRefereeUpgrade>) => {
            return rcru.data ? this.getDocumentObservable(rcru.data.id).get() : of(null);
          }),
          map((doc) => this.docSnapNTToResponse(doc))
        );
    }

    findCompetitionRefereeUpgradeByReferee(refereeId: string, season: string): Observable<ResponseWithData<CompetitionRefereeUpgrade[]>> {
      return this.query(this.getCollectionRef().where('refereeId', '==', refereeId).where('season', '==', season), 'default');
    }

    setCoachVote(id: string, vote: UpgradeVote): Observable<any> {
      const newPartialCru: Partial<CompetitionRefereeUpgrade> = {};
      newPartialCru['votes.' + vote.coachId] = vote;
      return from(this.getDocumentObservable(id).update(newPartialCru));
    }

    setDecision(id: string, vote: Upgradable): Observable<any> {
      return from(this.getDocumentObservable(id).update({ finalDecision: vote }));
    }
}
