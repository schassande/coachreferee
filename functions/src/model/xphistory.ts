import { PersistentData } from './common';

/** Class of the competition event */
export type EventClass = 'A' | 'B' | 'C' | 'D';

/** Description of the referee allocation job */
export type RefereeAllocation =
    /** The coach does not allocate the referees on games */
    'No'
    /** The coach contribute to the referee allocation */
    | 'Contribute'
    /** The coach fully participate to the refeee allocation */
    | 'Yes';

export interface Xp extends PersistentData {
    /** Identifier of the coach */
    coachId: string;
    /** Name of the event */
    eventName: string;
    /** Class of the event */
    eventClass: EventClass;
    /** Year of the event */
    year: number;
    /** the days of coaching during the event */
    days: CoachingDay[];
}
export interface CoachingDay {
    /** Date of the coaching */
    coachingDate: Date;
    /** Duration of the game in minutes */
    gameDuration: number;
    /** Number of games */
    nbGames?: number;
    /** Number of minute of coached game during the day */
    coachingDuration: number;
    /** Indicate the contribution level of the referee coach to the referee allocation */
    refereeAllocation: RefereeAllocation;
}
