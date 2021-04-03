import { Competition } from './../../../app/model/competition';
import { StepResult } from './../../../app/service/CompetitionRefereeRankingService';
import { ConnectedUserService } from 'src/app/service/ConnectedUserService';
import { DateService } from './../../../app/service/DateService';
import { ModalController } from '@ionic/angular';
import { Coaching } from 'src/app/model/coaching';
import { RefereeService } from 'src/app/service/RefereeService';
import { flatMap, map } from 'rxjs/operators';
import { Observable, forkJoin } from 'rxjs';
import { Referee } from './../../../app/model/user';
import { CoachingService } from './../../../app/service/CoachingService';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-competition-ranking-best-of2',
  templateUrl: './competition-ranking-best-of2.page.html',
  styleUrls: ['./competition-ranking-best-of2.page.scss'],
})
export class CompetitionRankingBestOf2Page implements OnInit {

  @Input() competition: Competition;
  @Input() refereeData1: RefereeData;
  @Input() refereeData2: RefereeData;
  @Output() choice: EventEmitter<StepResult<string>> = new EventEmitter<StepResult<string>>();


  constructor(
    public coachingService: CoachingService,
    public dateService: DateService,
    private modalCtrl: ModalController,
    private refereeService: RefereeService
  ) { }

  ngOnInit() {
  }

  getRefIdx(coaching: Coaching, refereeId: string) {
    return coaching.refereeIds.indexOf(refereeId);
  }

  onRefereeSelected(refereeId: string) {
    this.choice.emit(new StepResult<string>(refereeId, true, true));
  }

  back() {
    this.choice.emit(new StepResult<string>(null, false, false));
  }
}
export interface RefereeData {
  refereeId: string;
  referee: Referee;
  coachings: Coaching[];
}
