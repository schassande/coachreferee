import { CategoryLabels, ListGender, GenderLabels, MethodLabels } from './../../../app/model/ranking';
import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DateService } from '../../../app/service/DateService';

import { ConnectedUserService } from '../../../app/service/ConnectedUserService';
import { CompetitionRefereeRankingService } from '../../../app/service/CompetitionRefereeRankingService';
import { CompetitionRankingList, ListCategory, RankingMethod } from '../../../app/model/ranking';
import { Competition } from '../../../app/model/competition';
import { mergeMap, map } from 'rxjs/operators';


@Component({
  selector: 'app-competition-ranking-new',
  templateUrl: './competition-ranking-new.component.html',
})
export class CompetitionRankingNewComponent {

  @Input() competition: Competition;

  category: ListCategory = 'A';
  categories = CategoryLabels;

  typeName: ListGender = 'B';
  typeNames = GenderLabels;

  method: RankingMethod = 'A';
  methods = MethodLabels;

  saving = false;

  constructor(
    private competitionRefereeRankingService: CompetitionRefereeRankingService,
    private connectedUserService: ConnectedUserService,
    public dateService: DateService,
    private modalCtrl: ModalController
  ) { }

  newList() {
    const list: CompetitionRankingList = {
      id: '',
      version: 0,
      creationDate: new Date(),
      lastUpdate: new Date(),
      dataStatus: 'NEW',
      competitionId: this.competition.id,
      coachId: this.connectedUserService.getCurrentUser().id,
      listName: GenderLabels.find(line => line[0] === this.typeName)[1]
                + ' / ' + CategoryLabels.find(line => line[0] === this.category)[1],
      ranked: false,
      groups: [],
      method: this.method,
      category: this.category,
      gender: this.typeName,
      rankedReferees: []
    };
    this.saving = true;
    this.competitionRefereeRankingService.initList(list, this.competition).pipe(
      mergeMap((l) => this.competitionRefereeRankingService.save(l)),
      map((rlist) => this.modalCtrl.dismiss(rlist.data))
    ).subscribe();
  }

  back() {
    this.modalCtrl.dismiss();
  }
}
