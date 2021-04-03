import { Component, OnInit, Input } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { flatMap, map } from 'rxjs/operators';
import { Observable, forkJoin, of } from 'rxjs';

import { CompetitionService } from './../../../app/service/CompetitionService';
import { DataRegion } from './../../../app/model/common';
import { RefereeEditPage } from '../referee-edit/referee-edit';
import { ResponseWithData } from './../../../app/service/response';
import { RefereeService } from './../../../app/service/RefereeService';
import { Referee } from '../../../app/model/user';
import { PersistentDataFilter } from './../../../app/service/PersistentDataFonctions';

/**
 * Generated class for the RefereeSelectPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-referee-select',
  templateUrl: 'referee-select.html',
})
export class RefereeSelectPage implements OnInit {

  @Input() competitionId: string;
  @Input() region: DataRegion;
  referees: Referee[];
  error: any;
  searchInput: string;
  refereesDatabase: Referee[] = null;

  constructor(
    public refereeService: RefereeService,
    public competitionService: CompetitionService,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController) {
  }

  ngOnInit() {
    this.refereeService.lastSelectedReferee.referee = null;
    setTimeout(() => this.searchReferee(), 500);
  }

  private getRefereesDatabase(): Observable<Referee[]> {
    // console.log('RefereeSelectPage.getRefereesDatabase(): competitionId=', this.competitionId);
    if (this.competitionId && this.competitionId.length > 0 && this.refereesDatabase == null) {
      // console.log('RefereeSelectPage.getRefereesDatabase(): load competition');
      // load the competition
      return this.competitionService.get(this.competitionId).pipe(
        flatMap((rcomp) => {
          // console.log('RefereeSelectPage.getRefereesDatabase(): competition=', rcomp.data);
          this.refereesDatabase = [];
          if (rcomp.data) {
            const obss: Observable<ResponseWithData<Referee>>[] = [];
            rcomp.data.referees.forEach((ref) => {
              obss.push(this.refereeService.get(ref.refereeId).pipe(
                map( (rref) => {
                  if (rref.data) {
                    this.refereesDatabase.push(rref.data);
                  }
                  return rref;
                })
              ));
            });
            return forkJoin(obss);
          } else {
            return of('');
          }
        }),
        map(() => this.refereesDatabase)
      );
    } else {
      return of(this.refereesDatabase);
    }
  }

  private searchReferee() {
    this.getRefereesDatabase().pipe(
      flatMap( (refDb: Referee[]) => {
        if (!refDb || refDb.length === 0) {
          // search in the global database of referees through the service
          return this.refereeService.searchReferees(this.searchInput);
        } else {
          // search in the sub set of referes
          // get the filter from search word
          const filter: PersistentDataFilter<Referee> = this.refereeService.getFilterByText(this.searchInput);
          if (filter === null) { // no filter then return the ref db
            return of({data: refDb, error: null});
          } else { // use the filter to filter the ref db
            return of({data: refDb.filter(filter), error: null});
          }
        }
      })
    ).subscribe((response: ResponseWithData<Referee[]>) => {
      this.referees = response.data;
      this.error = response.error;
    });
  }

  public refereeSelected(referee: Referee): void {
    // console.log('refereeSelected', referee);
    this.refereeService.lastSelectedReferee.referee = referee;
    this.modalCtrl.dismiss( { referee});
  }

  public cancel() {
    this.refereeService.lastSelectedReferee.referee = null;
    this.modalCtrl.dismiss( { referee: null});
  }

  public newReferee(): void {
    this.modalCtrl.create({ component: RefereeEditPage })
      .then( (modal) => modal.present() );
  }

  public onSearchBarInput() {
    this.searchReferee();
  }

  public deleteReferee(referee: Referee) {
    this.alertCtrl.create({
      // title: 'Confirm Deletion',
      message: 'Do you reaaly want to delete the referee ' + referee.firstName + ' ' + referee.lastName +  '?',
      buttons: [
        { text: 'Cancel', role: 'cancel'},
        {
          text: 'Delete',
          handler: () => {
            this.refereeService.delete(referee.id).subscribe(() => this.searchReferee());
          }
        }
      ]
    }).then((alert) => alert.present());
  }
  onSwipe(event) {
    if (event.direction === 4) {
      this.cancel();
    }
  }
}
