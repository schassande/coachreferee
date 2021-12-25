import { PersistentData } from './common';
import { ApplicationName } from './user';


export type NotificationType = 'UPGRADE' | 'COMPETITION' | 'GAME' | 'VOTE' | 'SHARE';

export interface Notification extends PersistentData {
    applicationNames: ApplicationName[];
    /** Date of the event */
    eventDate: Date;
    eventType: NotificationType;
    eventCode: string;
    dataId: string;
    eventMessage: string;
    sourceUserId: string;
    sourceShortName: string;
    /** id of the targeted user */
    targetedUserId: string;
}
