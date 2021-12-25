import { AppSettingsService } from './AppSettingsService';
import { DateService } from './DateService';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { RemotePersistentDataService } from './RemotePersistentDataService';
import { ToastController } from '@ionic/angular';
import { Notification, NotificationType } from '../model/notification';
import { ConnectedUserService } from './ConnectedUserService';
import { Observable } from 'rxjs';
import { ApplicationName, CurrentApplicationName, Referee, User } from '../model/user';
import { Competition } from '../model/competition';
import { Coaching } from '../model/coaching';
import { Assessment } from '../model/assessment';
import { ResponseWithData } from './response';

@Injectable()
export class NotificationService extends RemotePersistentDataService<Notification> {

    constructor(
      appSettingsService: AppSettingsService,
      private connectedUserService: ConnectedUserService,
      db: AngularFirestore,
      private dateService: DateService,
      toastController: ToastController
    ) {
        super(appSettingsService, db, toastController);
    }

    getLocalStoragePrefix() {
        return 'notification';
    }

    getPriority(): number {
        return 5;
    }

    protected adjustFieldOnLoad(item: Notification) {
      item.eventDate = this.adjustDate(item.eventDate, this.dateService);
    }

    findMyNotitifications(): Observable<ResponseWithData<Notification[]>> {
      return this.query(this.getCollectionRef()
        .where('applicationNames', 'array-contains', CurrentApplicationName)
        .where('targetedUserId', '==', this.connectedUserService.getCurrentUser().id)
        .orderBy('eventDate', 'asc'),
        'default');
    }

    closeNotification(notification: Notification): Observable<any> {
      return this.delete(notification.id);
    }
    refereeAddedToCompetition(referee: Referee, competition: Competition): Observable<any> {
      return this.newNotif(['RefereeCoach', 'Upgrade'], 'COMP_REFEREE_ADDED',
        `The referee ${referee.firstName} ${referee.lastName} has been added to the competition '${competition.name}'`,
        'COMPETITION',
        referee.id
      );
    }

    refereeRemovedFromCompetition(referee: Referee, competition: Competition): Observable<any> {
      return this.newNotif(['RefereeCoach', 'Upgrade'], 'COMP_REFEREE_REMOVED',
        `The referee ${referee.firstName} ${referee.lastName} has been removed from the competition '${competition.name}'`,
        'COMPETITION',
        referee.id
      );
    }

    coachAddedToCompetition(coach: User, competition: Competition): Observable<any> {
      return this.newNotif(['RefereeCoach', 'Upgrade'], 'COMP_COACH_ADDED',
        `The referee coach ${coach.firstName} ${coach.lastName} has been added to the competition '${competition.name}'`,
        'COMPETITION',
        coach.id
      );
    }

    coachRemovedFromCompetition(coach: User, competition: Competition): Observable<any> {
      return this.newNotif(['RefereeCoach', 'Upgrade'], 'COMP_COACH_REMOVED',
        `The referee coach ${coach.firstName} ${coach.lastName} has been removed from the competition '${competition.name}'`,
        'COMPETITION',
        coach.id
      );
    }

    coachingShared(coachDest: User, coaching: Coaching): Observable<any> {
      const source = this.connectedUserService.getCurrentUser();
      return this.newNotif(['RefereeCoach'],
        'COACHING_SHARED',
        `${source.firstName} ${source.lastName} shared with you a game coaching:<ul>
        <li>Competition: ${coaching.competition}</li>
        <li>Date: ${this.dateService.date2string(coaching.date)}</li>
        <li>Field: ${coaching.field}</li>
        <li>TimeSlot: ${coaching.timeSlot}</li>
        <li>Referees: ${coaching.referees.map(r => r.refereeShortName).join(', ')}</li>
        </ul>`,
        'SHARE',
        coachDest.id,
        coaching.id
      );
    }

    refereeAssessmentShared(coachDest: User, assessment: Assessment): Observable<any> {
      const source = this.connectedUserService.getCurrentUser();
      return this.newNotif(['RefereeCoach'],
        'REFEREE_ASSESSMENT_SHARED',
        `${source.firstName} ${source.lastName} shared with you a referee assessment:<ul>
        <li>Competition: ${assessment.competition}</li>
        <li>Date: ${this.dateService.date2string(assessment.date)}</li>
        <li>Level: ${assessment.profileName}</li>
        <li>Referee: ${assessment.refereeShortName}</li>
        </ul>`,
        'SHARE',
        coachDest.id,
        assessment.id
      );
    }

    refereeCoachAssessmentShared(coachDest: User, assessment: Assessment): Observable<any> {
      const source = this.connectedUserService.getCurrentUser();
      return this.newNotif(['RefereeCoach'],
        'REFEREECOACH_ASSESSMENT_SHARED',
        `${source.firstName} ${source.lastName} shared with you a referee coach assessment:<ul>
        <li>Competition: ${assessment.competition}</li>
        <li>Date: ${this.dateService.date2string(assessment.date)}</li>
        <li>Level: ${assessment.profileName}</li>
        <li>Referee Coach: ${assessment.refereeShortName}</li>
        </ul>`,
        'SHARE',
        coachDest.id,
        assessment.id
      );
    }

    private newNotif(applicationNames: ApplicationName[],
                     eventCode: string,
                     eventMessage: string,
                     eventType: NotificationType,
                     targetedUserId: string,
                     dataId: string = null) {
      const notif: Notification = {
        applicationNames,
        id: null,
        creationDate: new Date(),
        dataId,
        dataStatus: 'NEW',
        eventCode,
        eventDate: new Date(),
        eventMessage,
        eventType,
        lastUpdate: new Date(),
        sourceShortName: this.connectedUserService.getCurrentUser().shortName,
        sourceUserId: this.connectedUserService.getCurrentUser().id,
        targetedUserId,
        version: 0
      };
      return this.save(notif);
    }
}
