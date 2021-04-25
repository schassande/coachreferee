import { Upgradable } from './coaching';
import { PersistentData } from './common';
import { CoachRef, CompetitionCategory, CompetitionRef, RefereeRef } from './competition';
import { RefereeLevel } from './user';

/**
 * The upgrade decision about a referee during a competition by the panel of the referee coaches.
 */
export interface CompetitionRefereeUpgrade extends  PersistentData {
    /** Identifier of the evaluated referee */
    refereeId: string;
    /** Short name of the evaluated referee */
    refereeShortName: string;
    /** Identifier of the competition where the referee has been observed */
    competitionId: string;
    /** Final vote of the referee coach about the referee during the competition */
    votes: any;
    /** The final decision of the panel */
    finalDecision: Upgradable;
    /** the season/year of the competition when the referee has been evaluated */
    season: string;
}

/**
 * A vote from a coach
 */
export interface UpgradeVote {
    /** Identifier of the voting coach if it is an app user. Otherwise it is the short name */
    coachId: string;
    /** The vote value */
    vote: Upgradable;
    /**
     * Does the vote is done by the user itself
     * Yes : the vote has been made by the panel director.
     * No : the user voted himself
     */
    force: boolean;
    /** does the referee coach is a user of the application. */
    isUser: boolean;
}
/** A vote during a day of a competition */
export interface CompetitionDayVote {
    /** the competition where the referee has been observed */
    competitionRef: CompetitionRef;
    /** Day of the competition */
    day: Date;
    /** is the competition is a multi day event */
    isMultiDayCompetition: boolean;
    /** The evaluated referee */
    referee: RefereeRef;
    /** The level to upgrade */
    upgradeLevel: RefereeLevel;
    /** The vote value */
    vote: Upgradable;
    /** Does the vote is closed */
    closed: boolean;
    /** Comment about the vote */
    commentForReferee: string;
    /** Comment about the vote */
    commentForCoach: string;
}
/** A vote about a referee during a day of a competition by a referee coach */
export interface CompetitionDayRefereeCoachVote extends  CompetitionDayVote, PersistentData {
    /** The voting coach */
    coach: CoachRef;
 }
/** The panel upgrade decision about a referee during a day of a competition by the panel */
export interface CompetitionDayPanelVote extends  CompetitionDayVote, PersistentData {
    /** The  coach */
    coaches: CoachRef[];
    /** The Yes voting coach */
    yesCoaches: CoachRef[];
    competitionCategory: CompetitionCategory;
}
export type RefereeUpgradeStatus = 'DECIDED' | 'PUBLISHED';
export interface RefereeUpgrade extends PersistentData {
    /** The evaluated referee */
    referee: RefereeRef;
    /** The level to upgrade */
    upgradeLevel: RefereeLevel;
    /** The decision of the upgrade. Only 2 possible values: 'Yes' or 'No' */
    decision: Upgradable;
    /** the date of the upgrade status */
    decisionDate: Date;
    /** Indicate the status of the upgrade */
    upgradeStatus: RefereeUpgradeStatus;
    /** The competition where occurs the decision */
    competitionId: string;
    /** the ompetition which are multi-day */
    multiDayCompetitionRefs: CompetitionRef[];
    /** the reference to the referee coach already voting Yes */
    yesRefereeCoaches: CoachRef[];
    /** the list of the CompetitionPanelVote retained for the upragde decision in the category C3+ */
    c3PanelVotes: CompetitionDayPanelVote[];
    /** the list of the CompetitionPanelVote retained for the upragde decision in the category C4+ */
    c4PanelVotes: CompetitionDayPanelVote[];
    /** the list of the CompetitionPanelVote retained for the upragde decision in the category C5 */
    c5PanelVotes: CompetitionDayPanelVote[];
    /** the identifier of the UpgradeCriteria used for the evaluation */
    upgradeCriteriaId: string;
}

/**
 * Definition the upgrade criteria for a referee upgrade.
 */
export interface UpgradeCriteria extends PersistentData {
    /** Date (included) since the criteria is applied */
    beginDate: Date;
    /** Date (included) until the criteria is applied */
    endDate: Date;

    /** The level to upgrade */
    upgradeLevel: RefereeLevel;

    /** Number of required competition which must be multi-day */
    multiDayCompetitionRequired: number;

    /** Number of required referee coach with the expected level (or higher) said yes */
    yesRefereeCoachRequired: number;

    /** Number of Category 3+ competition days required in the window */
    c3DaysRequired: number;
    /** Number of Category 4+ competition days required in the window */
    c4DaysRequired: number;
    /** Number of Category 5 competition days required in the window */
    c5DaysRequired: number;
    /** Number of competition days required in the window */
    daysRequired: number;

    /** Number of yes days required in the window */
    totalYesRequired: number;
    /** Number of yes C3 days required in the window */
    c3YesRequired: number;
    /** Number of yes C4 days required in the window */
    c4YesRequired: number;
    /** Number of yes C5 days required in the window */
    c5YesRequired: number;
    /** the duration (number of months) of the validation of a day vote. After this delay the vote is ignored. */
    dayVoteDuration: number;
}
