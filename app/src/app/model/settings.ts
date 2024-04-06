import { Coaching, PersistentPRO } from './coaching';
import { Assessment } from './assessment';
import { User, Referee, RefereeLevel, AppRole, AccountStatus } from './user';
import { SkillProfile } from './skill';
import { DataRegion } from './common';

export interface LocalAppSettings {
    serverUrl: string;
    forceOffline?: boolean;
    lastUserEmail: string;
    lastUserPassword: string;
    applicationVersion?: string;
    apiKey?: string;
    nbPeriod?: number;
    preferences? : {
        assessmentSearch?: AssessmentSearch;
        coachingSearch?: CoachingSearch;
        competitionSearch?: CompetitionSearch;
        refereeSearch?: RefereeSearch;
        userSearch?: UserSearch;
        proSearch?: ProSearch;
        xpSearch?: XPSearch;
    }
}
export type NetworkConnection = 'UNKNOWN' | 'NONE'| '3G' | '4G' | 'WIFI' | 'WIRED';
export interface ExportedData {
    users?: User[];
    referees?: Referee[];
    skillProfiles?: SkillProfile[];
    pros?: PersistentPRO[];
    coachings?: Coaching[];
    assessments?: Assessment[];
}

export interface Search {
    q?: string;
    region?: DataRegion;
    sortBy?: string;
}
export interface RefereeSearch extends Search {
    country?: string;
    refereeLevel?: RefereeLevel
}
export interface CoachingSearch extends Search {
    year?: number;
    todayOnly?: boolean;
}
export interface AssessmentSearch extends Search {
    year?: number;
}
export interface ProSearch extends Search {
    notCompletedOnly?: boolean;
}
export interface XPSearch extends Search {
    year?: number;
    coachId?: string;
}
export interface CompetitionSearch extends Search {
    year?: number;
    withMe?: boolean;
}
export interface UserSearch extends Search {
    status?: AccountStatus;
    role?: AppRole;
}
