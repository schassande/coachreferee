import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { UserService } from 'src/app/service/UserService';
import { DataRegion, SharedWith } from 'src/app/model/common';
import { UserSelectorComponent } from 'src/pages/widget/user-selector-component';
import { ModalController } from '@ionic/angular';
import { RefereeEditPage } from 'src/pages/referee/referee-edit/referee-edit';
import { User } from 'src/app/model/user';

@Injectable()
export class RefereeSelectorService {

    constructor(
        private modalController: ModalController) {
    }

    public searchReferee(region: DataRegion, competitionId: string): Observable<User> {
        const subject: Subject<User> = new Subject();
        this.modalController.create({
            component: UserSelectorComponent,
            componentProps: {
            competitionId,
            role: 'REFEREE',
            region: competitionId ? null : region,
            allowToCreateReferee : true
            }
        }).then(modal => {
            modal.onDidDismiss().then( (data: any) => {
                if (data.data &&data.data.create) {
                    this.modalController.create({component: RefereeEditPage}).then(m => m.present().then(() => {
                        m.onDidDismiss().then((d: any) => {
                            if (d && d.data && d.data.referee) {
                            subject.next(d.data.referee);
                            subject.complete();
                            }
                        });
                        }));
                } else {
                    const sh: SharedWith = data.data;
                    if (sh && sh.users.length > 0) {
                    subject.next(sh.users[0]);
                    subject.complete();
                }
                }
                });
            modal.present();
        });
        return subject;
    }
}
