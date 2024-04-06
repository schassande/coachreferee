import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { AssessmentSearch, CoachingSearch, CompetitionSearch, LocalAppSettings, ProSearch, RefereeSearch, UserSearch, XPSearch } from './../model/settings';
import { Storage } from '@ionic/storage-angular';
import { Injectable } from '@angular/core';
import { LocalSingletonDataService } from './LocalSingletonDataService';
import { environment } from '../../environments/environment';

@Injectable()
export class AppSettingsService extends LocalSingletonDataService<LocalAppSettings> {

    public settings: LocalAppSettings = null;

    constructor(storage: Storage) {
        super(storage, 'LocalAppSettings');
        this.get().subscribe();
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
    public setApplicationVersion(applicationVersion: string) {
        this.get().subscribe((setting: LocalAppSettings) => {
            setting.applicationVersion = applicationVersion;
            this.settings = setting;
            this.save(setting).subscribe();
        });
    }
    public getAssessmentSearch(): Observable<AssessmentSearch> {
        return this.get().pipe(map((settings:LocalAppSettings) => settings.preferences?.assessmentSearch || {}));
    }
    public getCoachingSearch(): Observable<CoachingSearch> {
        return this.get().pipe(map((settings:LocalAppSettings) => settings.preferences?.coachingSearch || {}));
    }
    public getCompetitionSearch(): Observable<CompetitionSearch> {
        return this.get().pipe(map((settings:LocalAppSettings) => settings.preferences?.competitionSearch || {}));
    }
    public getRefereeSearch(): Observable<RefereeSearch> {
        return this.get().pipe(map((settings:LocalAppSettings) => settings.preferences?.refereeSearch || {}));
    }
    public getUserSearch(): Observable<UserSearch> {
        return this.get().pipe(map((settings:LocalAppSettings) => settings.preferences?.userSearch || {}));
    }
    public getProSearch(): Observable<ProSearch> {
        return this.get().pipe(map((settings:LocalAppSettings) => settings.preferences?.proSearch || {}));
    }
    public getXPSearch(): Observable<XPSearch> {
        return this.get().pipe(map((settings:LocalAppSettings) => settings.preferences?.xpSearch || {}));
    }

    public setAssessmentSearch(search: AssessmentSearch) {
        this.setXXXSearch((settings:LocalAppSettings)=>settings.preferences.assessmentSearch = search);
    }
    public setCoachingSearch(search: CoachingSearch) {
        this.setXXXSearch((settings:LocalAppSettings)=>settings.preferences.coachingSearch = search);
    }
    public setCompetitionSearch(search: CompetitionSearch) {
        this.setXXXSearch((settings:LocalAppSettings)=>settings.preferences.competitionSearch = search);
    }
    public setRefereeSearch(search: RefereeSearch) {
        this.setXXXSearch((settings:LocalAppSettings)=>settings.preferences.refereeSearch = search);
    }
    public setUserSearch(search: UserSearch) {
        this.setXXXSearch((settings:LocalAppSettings)=>settings.preferences.userSearch = search);
    }
    public setProSearch(search: ProSearch) {
        this.setXXXSearch((settings:LocalAppSettings)=>settings.preferences.proSearch = search);
    }
    public setXPSearch(search: XPSearch) {
        this.setXXXSearch((settings:LocalAppSettings)=>settings.preferences.xpSearch = search);
    }
    private setXXXSearch(setter: (settings:LocalAppSettings)=>{}) {
        this.get().pipe(
            mergeMap((settings:LocalAppSettings) => {
                if (!settings.preferences) {
                    settings.preferences = {}
                }
                setter(settings);
                return super.save(settings);
            })).subscribe();
    }
}
