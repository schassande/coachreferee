import { GameCategory, GameLevel } from './game';
import { PersistentData, SharedElement } from './common';

export type Upgradable = 'DNS' | 'DNSE'  | 'No' | 'Possible' | 'Yes' | 'Abstein' ;

export interface PRO {
    problemShortDesc: string;
    coachId: string;
    skillName: string;
    problem: string;
    remedy: string;
    outcome: string;
}
export interface PersistentPRO extends PRO, PersistentData, SharedElement {
    complete: boolean;
    sharedPublic?: boolean;
}
export interface PROLink {
    id: string;
    problemShortDesc: string;
}
export interface Feedback extends PRO {
    priority: number;
    period: number;
    appliedLater: boolean;
    deliver: boolean;
    topicName?: string;
}

export interface PositiveFeedback {
    skillName: string;
    description: string;
    period: number;
    deliver: boolean;
    topicName?: string;
}

export interface Coaching extends PersistentData, SharedElement {
    importGameId?: string;
    competition: string;
    competitionId?: string;
    date: Date;
    field: string;
    timeSlot: string;
    coachId: string;
    gameCategory: GameCategory;
    gameSpeed: GameLevel;
    gameSkill: GameLevel;
    closed?: boolean;
    currentPeriod?: number;
    refereeIds: string[];
    referees: RefereeCoaching[];
    coachingStructure?: CoachingStructure;
    coachingTemplateId?: string;
}
export interface RefereeCoaching {
    refereeId: string;
    refereeShortName: string;
    feedbacks: Feedback[];
    positiveFeedbacks: PositiveFeedback[];
    comments: string;
    upgrade: Upgradable;
    rank: number;
}
export interface CoachingTemplate extends PersistentData {
    name: string;
    topics: {
        name: string;
        description: string;
    }[];
}

export type CoachingStructure = 'TEXT' /* free text */
    | '+-'  /* Stength and weakness */ 
    | 'BPS' /* Breakpoint sheet */;

