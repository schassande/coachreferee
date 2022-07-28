import { AppSettingsService } from './AppSettingsService';
import { ConnectedUserService } from './ConnectedUserService';
import { Firestore, query, where } from '@angular/fire/firestore';
import { UserPreference } from './../model/user';
import { ResponseWithData } from './response';
import { Injectable } from '@angular/core';
import { RemotePersistentDataService } from './RemotePersistentDataService';
import { Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class UserPreferenceService extends RemotePersistentDataService<UserPreference> {

    constructor(
        appSettingsService: AppSettingsService,
        db: Firestore,
        private connectedUserService: ConnectedUserService,
        toastController: ToastController
    ) {
        super(appSettingsService, db, toastController);
    }
    getLocalStoragePrefix() {
        return 'user-preference';
    }
    getPriority(): number {
        return 5;
    }
    public setMyPreference(category: string, name: string, value: string): Observable<ResponseWithData<UserPreference>> {
        return this.getMyPreference(name).pipe(
            mergeMap( rup => {
                let up:UserPreference;
                if (rup.data) {
                    up = rup.data;
                    up.value = value;
                } else {
                    up = {
                        userId: this.connectedUserService.getCurrentUser().id,
                        name, category, value,
                        id: '',
                        dataStatus: 'NEW',
                        creationDate: new Date(),
                        lastUpdate: new Date(),
                        version: 0
                    }
                }
                return this.save(up);
            })
        );
    }
    public getMyPreferences(category: string): Observable<ResponseWithData<UserPreference[]>> {
        return this.query(query(this.getCollectionRef(), 
            where('userId', '==', this.connectedUserService.getCurrentUser().id),
            where('category', '==', category)
        ));
    }
    public toMap(ups: UserPreference[]): Map<string,UserPreference> {
        const res: Map<string,UserPreference> = new Map();
        if (ups) {
            ups.forEach(up => res.set(up.name, up));
        }
        return res;
    }
    public getValue<T>(userPreferences: Map<string,UserPreference>, name: string, defaultValue: T): T {
        const up = userPreferences.get(name);
        return up ? (up.value as any) as T: defaultValue;
    }
    public getMyPreference(name: string): Observable<ResponseWithData<UserPreference>> {
        return this.queryOne(query(this.getCollectionRef(), 
            where('userId', '==', this.connectedUserService.getCurrentUser().id),
            where('name', '==', name)
        ));
    }
}
