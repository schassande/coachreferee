import { AppSettingsService } from './AppSettingsService';
import { ToastController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UserGroup } from '../model/user';

import { ResponseWithData } from './response';
import { RemotePersistentDataService } from './RemotePersistentDataService';

@Injectable()
export class UserGroupService extends RemotePersistentDataService<UserGroup> {

    constructor(
        appSettingsService: AppSettingsService,
        db: Firestore,
        toastController: ToastController
    ) {
        super(appSettingsService, db, toastController);
    }

    getLocalStoragePrefix() {
        return 'usergroup';
    }

    getPriority(): number {
        return 4;
    }

    public searchPros(text: string): Observable<ResponseWithData<UserGroup[]>> {
        if (text) {
            const texts = text.trim().split(' ');
            return super.filter(this.all(), (group: UserGroup) => {
                return texts.filter((txt) =>
                    this.stringContains(text, group.name)
                    ).length > 0;
            });
        } else {
            return this.all();
        }
    }
}
