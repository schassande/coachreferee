import { GameLevel, GameCategory } from './game';
import { PersistentData, DataRegion, HasId } from './common';
import { User, Referee } from './user';

export type CompetitionCategory = 'C1' | 'C2'| 'C3'| 'C4'| 'C5';
export const CompetitionCategories: CompetitionCategory[] = ['C1', 'C2', 'C3', 'C4', 'C5'];

export interface Competition extends PersistentData {
    name: string;
    date: Date;
    year: number;
    days: Date[];
    region: DataRegion;
    country: string;
    category: CompetitionCategory;
    ownerId: string;
    referees: RefereeRef[];
    refereeCoaches: CoachRef[];
    allocations: GameAllocation[];
    refereePanelDirectorId?: string;
}
export interface CompetitionRef {
    competitionId: string;
    competitionName: string;
}

export interface RefereeRef {
    refereeId: string;
    refereeShortName: string;
}

export interface CoachRef {
    coachId: string;
    coachShortName: string;
}
export interface GameAllocation extends HasId {
    date: Date;
    field: string;
    timeSlot: string;
    gameCategory: GameCategory;
    gameSpeed: GameLevel;
    gameSkill: GameLevel;
    referees: {
        /** Persistent identifier of the referee allocated on the game */
        refereeId: string;
        /** Short name of the referee allocated on the game */
        refereeShortName: string;
    }[];
    refereeCoaches: {
        /** Persistent identifier of the referee coach allocated on the game */
        coachId: string;
        /** Short name of the referee coach */
        coachShortName: string;
        /** Persistent identifier of the coaching peristent item */
        coachingId: string;
    }[];
}

export interface AnalysedImport<P extends HasId> extends HasId {
    /** Data to import */
    dataToImport: P;
    /** Persistent data found from database correspondaing to the data to import */
    dataFromDB: P;
    /** The line number of the data to import */
    lineNumber: number;
    /** the list of error detected during the analysis or the import of the data */
    errors: string[];
    /** flag indicating if the data can be imported */
    toImport: boolean;
}

/**
 * Define the internal structure representing a competition to import
 */
export interface AnalysedImportCompetition extends AnalysedImport<Competition> {
    gameAnalysis: AnalysedImport<GameAllocation>[];
    gameToImport: number;

    refereeAnalysis: AnalysedImport<Referee>[];
    refereeToImport: number;

    refereeCoachAnalysis: AnalysedImport<User>[];
    refereeCoachToImport: number;
}
