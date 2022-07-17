import { HelpService } from './../../../app/service/HelpService';
import { DateService } from 'src/app/service/DateService';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';

import { ResponseWithData } from '../../../app/service/response';
import { Coaching } from '../../../app/model/coaching';
import { CoachingList, CoachingService } from '../../../app/service/CoachingService';

/**
 * Generated class for the CoachingListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-coaching-list',
  templateUrl: 'coaching-list.html',
  styleUrls: ['coaching-list.scss']
})
export class CoachingListPage implements OnInit {

  coachings: Coaching[];
  coachingLists: CoachingList[];
  error: any;
  searchInput: string;
  loading = false;
  today = false;
  currentYearOnly = true;

  constructor(
    public alertCtrl: AlertController,
    private changeDetectorRef: ChangeDetectorRef,
    public coachingService: CoachingService,
    private dateService: DateService,
    private helpService: HelpService,
    private navController: NavController
    ) {
  }

  ngOnInit() {
    this.helpService.setHelp('coaching-list');
    this.searchCoaching();
  }
  onToday() {
    this.changeDetectorRef.detectChanges();
  }
  doRefresh(event = null) {
    this.searchCoaching(false, event);
  }
  private searchCoaching(forceServer: boolean = false, event: any = null) {
    this.loading = true;
    this.coachingService.searchCoachings(this.searchInput, this.currentYearOnly,
        forceServer ? 'server' : 'default')
      .subscribe((response: ResponseWithData<Coaching[]>) => {
        this.coachings = this.coachingService.sortCoachings(response.data, true);
        this.coachingLists = this.coachingService.computeCoachingLists(this.coachings);
        this.loading = false;
        if (event) {
          event.target.complete();
        }
        this.error = response.error;
        if (this.error) {
          console.log('searchCoaching(' + this.searchInput + ') error=' + this.error);
        }
      });
  }

  public coachingSelected(event, coaching: Coaching): void {
    this.navController.navigateRoot(`/coaching/edit/${coaching.id}`);
  }

  getCoachingDate(coaching: Coaching) {
    return this.coachingService.getCoachingDateAsString(coaching);
  }

  getRefereeShortNames(coaching: Coaching) {
    return coaching.referees.map((ref) => ref.refereeShortName).join(', ');
  }
  public newCoaching(): void {
    this.navController.navigateRoot(`/coaching/create`);
  }

  public onSearchBarInput() {
    this.searchCoaching();
  }
  public isPast(coaching: Coaching): boolean {
    return this.dateService.compareDate(coaching.date, new Date()) < 0;
  }
  public deleteCoaching(coaching: Coaching) {
    this.alertCtrl.create({
      message: 'Do you reaaly want to delete the coaching <br><b>' + this.getCoachingDate(coaching) + ':' + coaching.timeSlot
        + ', Field ' + coaching.field + ' with ' + this.getRefereeShortNames(coaching) + '</b> ?',
      buttons: [
        { text: 'Cancel', role: 'cancel'},
        {
          text: 'Delete',
          handler: () => {
            this.coachingService.delete(coaching.id).subscribe(() => this.searchCoaching());
          }
        }
      ]
    }).then( (alert) => alert.present() );
  }

  onSwipe(event) {
    if (event.direction === 4) {
      this.navController.navigateRoot(`/home`);
    }
  }

  toggleCoachingListVisibility(coachingList: CoachingList) {
    coachingList.visible = !coachingList.visible;
    this.changeDetectorRef.detectChanges();
  }

  lockCoachings(coachingList: CoachingList) {
    coachingList.coachings.forEach((coaching) => {
      if (!coaching.closed) {
        coaching.closed = true;
        console.log('Lock coaching', coaching.coachId);
        this.coachingService.save(coaching).subscribe();
      }
    });
  }

  getCoachingColor(coaching: Coaching): string {
    const comp = this.dateService.compareDate(coaching.date, new Date());
    if (comp < 0) { // past
      return '';
    } else if (comp === 0) { // today
      const nowTime: string = this.dateService.time2string(new Date());
      return nowTime < coaching.timeSlot ? 'danger' : 'success';
    } else { // futur
      return 'primary';
    }
  }
}
