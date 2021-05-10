import { Component, OnInit, Input } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { mergeMap, map } from 'rxjs/operators';
import { Observable, forkJoin, of } from 'rxjs';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/service/UserService';
import { CompetitionService } from 'src/app/service/CompetitionService';
import { ResponseWithData } from 'src/app/service/response';
import { PersistentDataFilter } from 'src/app/service/PersistentDataFonctions';
import { RefereeEditPage } from '../referee/referee-edit/referee-edit';

@Component({
  selector: 'app-page-referee-select',
  template: `
<ion-header>
    <ion-toolbar>
        <ion-buttons slot="start">
            <ion-button (click)="cancel()" detail>
                <ion-icon name="arrow-back"></ion-icon>
            </ion-button>
        </ion-buttons>
        <ion-title>Select a referee</ion-title>
    </ion-toolbar>
</ion-header>
<ion-content padding>
    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button (click)="newReferee()">
            <ion-icon name="add"></ion-icon>
        </ion-fab-button>
    </ion-fab>
    <ion-searchbar [(ngModel)]="searchInput" [showCancelButton]="false" (ionChange)="onSearchBarInput()"></ion-searchbar>
    <ion-list>
        <ion-item *ngFor="let referee of referees">
            <ion-icon slot="start" *ngIf="!referee.photo" name="person" (click)="refereeSelected(referee)"></ion-icon>
            <ion-avatar slot="start" *ngIf="referee.photo"><img src="img/my-avatar.png" (click)="refereeSelected(referee)"></ion-avatar>
            <ion-label (click)="refereeSelected(referee)" class="listItemButton">
                {{referee.shortName}}<br> {{referee.firstName}} {{referee.lastName}}<br> {{referee.referee.refereeLevel}} ({{referee.referee.refereeCategory}})
            </ion-label>
        </ion-item>
    </ion-list>
</ion-content>`
})
export class CompetitionRefereeSelectorComponent implements OnInit {

  @Input() competitionId: string;

  referees: User[];
  error: any;
  searchInput: string;
  refereesDatabase: User[] = null;

  constructor(
    public userService: UserService,
    public competitionService: CompetitionService,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController) {
  }

  ngOnInit() {
    setTimeout(() => this.searchReferee(), 500);
  }

  private getRefereesDatabase(): Observable<User[]> {
    // console.log('RefereeSelectPage.getRefereesDatabase(): competitionId=', this.competitionId);
    if (this.competitionId && this.competitionId.length > 0 && this.refereesDatabase == null) {
      // console.log('RefereeSelectPage.getRefereesDatabase(): load competition');
      // load the competition
      return this.competitionService.get(this.competitionId).pipe(
        mergeMap((rcomp) => {
          // console.log('RefereeSelectPage.getRefereesDatabase(): competition=', rcomp.data);
          this.refereesDatabase = [];
          if (rcomp.data) {
            const obss: Observable<ResponseWithData<User>>[] = [];
            rcomp.data.referees.forEach((ref) => {
              obss.push(this.userService.get(ref.refereeId).pipe(
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
      mergeMap( (refDb: User[]) => {
        if (!refDb || refDb.length === 0) {
          // search in the global database of referees through the service
          return this.userService.searchReferees(this.searchInput);
        } else {
          // search in the sub set of referes
          // get the filter from search word
          const filter: PersistentDataFilter<User> = this.userService.getFilterByText(this.searchInput);
          if (filter === null) { // no filter then return the ref db
            return of({data: refDb, error: null});
          } else { // use the filter to filter the ref db
            return of({data: refDb.filter(filter), error: null});
          }
        }
      })
    ).subscribe((response: ResponseWithData<User[]>) => {
      this.referees = response.data;
      this.error = response.error;
    });
  }

  public refereeSelected(referee: User): void {
    // console.log('refereeSelected', referee);
    this.modalCtrl.dismiss( { referee});
  }

  public cancel() {
    this.modalCtrl.dismiss( { referee: null});
  }

  public newReferee(): void {
    this.modalCtrl.create({ component: RefereeEditPage })
      .then( (modal) => modal.present().then((data: any) => {
        if (data.referee) {
          this.refereeSelected(data.referee);
        }
      }) );
  }

  public onSearchBarInput() {
    this.searchReferee();
  }

  onSwipe(event) {
    if (event.direction === 4) {
      this.cancel();
    }
  }
}
