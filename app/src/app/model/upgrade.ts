import { Upgradable } from './coaching';
import { PersistentData } from './common';

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
