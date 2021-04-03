import { HelpService } from './../../../app/service/HelpService';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { ConnectedUserService } from '../../../app/service/ConnectedUserService';
import { ResponseWithData } from '../../../app/service/response';
import { PersistentPRO } from '../../../app/model/coaching';
import { PROService } from '../../../app/service/PROService';
import { flatMap, map } from 'rxjs/operators';

/**
 * Generated class for the ProEditPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-pro-edit',
  templateUrl: 'pro-edit.html',
})
export class ProEditPage implements OnInit {

  pro: PersistentPRO = null;
  owner = false;

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private helpService: HelpService,
    public proService: PROService,
    public connectedUserService: ConnectedUserService,
    public alertCtrl: AlertController) {
  }

  ngOnInit() {
    this.helpService.setHelp('pro-edit');
    this.loadPRO().subscribe();
  }

  private loadPRO(): Observable<PersistentPRO> {
    return this.route.paramMap.pipe(
      flatMap( (paramMap) => {
        const proId: string  = paramMap.get('id');
        if (proId !== null && proId !== '-1') {
          return this.proService.get(proId);
        } else {
          const pro: PersistentPRO = {
            id: '0',
            version: 0,
            creationDate : new Date(),
            lastUpdate : new Date(),
            dataStatus: 'NEW',
            coachId: this.connectedUserService.getCurrentUser().id,
            skillName: '',
            problem: '',
            problemShortDesc: '',
            remedy: '',
            outcome: '',
            complete: false,
            sharedWith: { users: [], groups: [] },
            sharedPublic: false
          };
          return of({ data : pro, error: null });
        }
      }),
      map( (response: ResponseWithData<PersistentPRO>) => {
        this.pro = response.data;
        this.owner = this.pro && this.pro.coachId === this.connectedUserService.getCurrentUser().id;
        return this.pro;
      })
    );
  }
  public onToggleComplete() {
    this.pro.complete = !this.pro.complete;
  }

  public onTogglePublic() {
    this.pro.sharedPublic = !this.pro.sharedPublic;
  }

  savePRO() {
    if (this.pro.problemShortDesc != null && this.pro.problemShortDesc && this.pro.problemShortDesc.trim().length > 0) {
      this.proService.save(this.pro).pipe(map(() => this.leave())).subscribe();
    } else {
      this.leave();
    }
  }

  deletePRO() {
    this.alertCtrl.create({
      header: 'Confirm Deletion',
      message: 'Do you really want to delete this PRO ' + this.pro.problemShortDesc +  '?',
      buttons: [
        { text: 'Cancel', role: 'cancel'},
        { text: 'Delete', handler: () => {
            this.proService.delete(this.pro.id).pipe(
              map(() => this.leave())
            ).subscribe();
          }
        }
      ]
    }).then( (alert) => alert.present());
  }

  leave() {
    this.navController.navigateRoot('/pro/list');
  }
}
