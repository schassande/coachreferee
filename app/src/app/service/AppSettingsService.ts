import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalAppSettings } from './../model/settings';
import { Storage } from '@ionic/Storage';
import { Injectable } from '@angular/core';
import { LocalSingletonDataService } from './LocalSingletonDataService';
import { environment } from '../../environments/environment';

@Injectable()
export class AppSettingsService extends LocalSingletonDataService<LocalAppSettings> {

    public settings: LocalAppSettings = null;

    constructor(storage: Storage) {
        super(storage, 'LocalAppSettings');
        this.get().subscribe((las: LocalAppSettings) => {
            this.settings = las;
        });
    }

    public get(): Observable<LocalAppSettings> {
        return super.get().pipe(
            map((las: LocalAppSettings) => {
                let result: LocalAppSettings = las;
                if (!result) {
                    result = {
                        apiKey: environment.firebase.apiKey,
                        serverUrl: environment.firebase.databaseURL,
                        lastUserEmail: null,
                        lastUserPassword: null,
                        forceOffline: false,
                        nbPeriod: 2
                    };
                    super.save(result);
                }
                if (!result.nbPeriod) {
                    result.nbPeriod = 2;
                }
                this.settings = result;
                return result;
            })
        );
    }

    public setLastUser(email: string, password: string) {
        this.get().subscribe((setting: LocalAppSettings) => {
            setting.lastUserEmail = email;
            setting.lastUserPassword = password;
            this.settings = setting;
            this.save(setting).subscribe();
        });
    }
    public setServerUrl(serverUrl: string) {
        this.get().subscribe((setting: LocalAppSettings) => {
            setting.serverUrl = serverUrl;
            this.settings = setting;
            this.save(setting).subscribe();
        });
    }
    public setApplicationVersion(applicationVersion: string) {
        this.get().subscribe((setting: LocalAppSettings) => {
            setting.applicationVersion = applicationVersion;
            this.settings = setting;
            this.save(setting).subscribe();
        });
    }
}
