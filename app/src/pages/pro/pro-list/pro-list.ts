import { HelpService } from './../../../app/service/HelpService';
import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ResponseWithData } from '../../../app/service/response';
import { PROService } from '../../../app/service/PROService';
import { PersistentPRO } from '../../../app/model/coaching';

/**
 * Generated class for the ProListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-pro-list',
  templateUrl: 'pro-list.html',
})
export class ProListPage implements OnInit {

  pros: PersistentPRO[];
  searchInput: string;
  notCompleted = false;

  constructor(
    private navController: NavController,
    private helpService: HelpService,
    public proService: PROService,
    public alertCtrl: AlertController) {
  }

  ngOnInit() {
    this.helpService.setHelp('pro-edit');
    this.searchPro();
  }

  public home(): void {
    this.navController.navigateRoot(`/home`);
  }

  public newPRO(): void {
    this.navController.navigateRoot(`/pro/edit/-1`);
  }
  public proSelected(pro: PersistentPRO): void {
    this.navController.navigateRoot(`/pro/edit/${pro.id}`);
  }
  public onSearchBarInput() {
    this.searchPro();
  }
  private searchPro() {
    console.log('SearchPro', this.notCompleted);
    this.proService.searchPros(this.searchInput).subscribe((response: ResponseWithData<PersistentPRO[]>) => {
      if (response.data && this.notCompleted) {
        this.pros = response.data.filter((pro) => !pro.complete);
      } else {
        this.pros = response.data;
      }
    });
  }
  public deletePRO(pro: PersistentPRO) {
    this.alertCtrl.create({
      header: 'Confirm Deletion',
      message: 'Do you really want to delete the PRO ' + pro.problemShortDesc +  '?',
      buttons: [
        { text: 'Cancel', role: 'cancel'},
        {
          text: 'Delete',
          handler: () => {
            this.proService.delete(pro.id).subscribe(() => this.searchPro());
          }
        }
      ]
    }).then( (alert) => alert.present());
  }
  onSwipe(event) {
    // console.log('onSwipe', event);
    if (event.direction === 4) {
      this.navController.navigateRoot(`/home`);
    }
  }
}
