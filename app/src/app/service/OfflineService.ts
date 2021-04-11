import { Injectable } from '@angular/core';
import { AngularFirestore, Query } from '@angular/fire/firestore';
import { Observable, from, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { AppSettingsService } from './AppSettingsService';
import { AssessmentService } from './AssessmentService';
import { CoachingService } from './CoachingService';
import { ConnectedUserService } from './ConnectedUserService';
import { CompetitionService } from './CompetitionService';
import { LocalAppSettings } from './../model/settings';
import { PROService } from './PROService';
import { RefereeService } from './RefereeService';
import { SkillProfileService } from './SkillProfileService';
import { UserService } from './UserService';

@Injectable()
export class OfflinesService  {

    constructor(
        private appSettingsService: AppSettingsService,
        private assessmentService: AssessmentService,
        private coachingService: CoachingService,
        private connectedUserService: ConnectedUserService,
        private competitionService: CompetitionService,
        private firestore: AngularFirestore,
        private proService: PROService,
        private refereeService: RefereeService,
        private skillProfileService: SkillProfileService,
        private userService: UserService
    ) {}

    public switchOfflineMode(): Observable<LocalAppSettings> {
        let settings = null;
        return this.appSettingsService.get().pipe(
            mergeMap((s: LocalAppSettings) => {
                settings = s;
                let obs: Observable<any> = null;
                if (settings.forceOffline) {
                    // Enable the network
                    obs = from(this.firestore.firestore.enableNetwork().then(() => console.log('Online')));
                } else {
                    // preload data
                    obs = this.skillProfileService.preload().pipe(
                        mergeMap(() => this.refereeService.preload()),
                        mergeMap(() => this.proService.preload()),
                        mergeMap(() => this.coachingService.preload()),
                        mergeMap(() => this.assessmentService.preload()),
                        mergeMap(() => this.competitionService.preload()),
                        mergeMap(() => {
                            // for admin preload user list
                            if (this.connectedUserService.isConnected() && this.connectedUserService.isAdmin()) {
                                return this.userService.preload();
                            } else {
                                return of('');
                            }
                        }),
                        // then disable the network
                        mergeMap(() => from(this.firestore.firestore.disableNetwork().then(() => console.log('Offline')))),
                    );
                }
                // store the offline mode
                return obs.pipe(
                    mergeMap( () => {
                        settings.forceOffline = !settings.forceOffline;
                        return this.appSettingsService.save(settings);
                    })
                );
            })
        );
    }
}
