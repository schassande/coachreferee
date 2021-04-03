import { RefereeRef } from './competition';
import { PersistentData } from './common';

/** A list of ranking */
export interface CompetitionRankingList extends PersistentData {
    /** Identifier of the competition */
    competitionId: string;
    /** Identifier of the coach */
    coachId: string;
    /** Name of the ranking list */
    listName: string;
    /** the different groups of  */
    groups: RankingGroup[];
    /** Indicate if the list is completely ranked */
    ranked: boolean;
    /** The ranking method to use */
    method: RankingMethod;
    /** The referee category covered by this list */
    category: ListCategory;
    /** the referee gender  covered by this list */
    gender: ListGender;
    /** Ranked List of the referees */
    rankedReferees: RefereeRef[];
}

/** A group of referees to rank/ranked */
export interface RankingGroup {
    /** The name of the group */
    groupName: string;
    rankingTrees: RankingNode[];
    /** Indicate if the group is completely ranked */
    ranked: boolean;
}

export interface RankingNode extends RefereeRef {
    children: RankingNode[];
    ranked: boolean;
}



export type ListGender = 'M' | 'F' | 'B';
export const GenderLabels: string[][] = [
    ['M', 'Male'],
    ['F', 'Female'],
    ['B', 'Male & Female'],
];

export type ListCategory = 'J' | 'O' | 'S' | 'JO' | 'OS' | 'A';
export const CategoryLabels: string[][] = [
    ['J', 'Junior'],
    ['O', 'Open'],
    ['S', 'Senior'],
    ['JO', 'Junior & Open'],
    ['OS', 'Open & Senior'],
    ['A', 'Any age']
];

export type RankingMethod = 'A' | 'S' | 'M';
export const MethodLabels: string[][] = [
    ['A', 'Auto'],
    ['S', 'Semi-auto'],
    ['M', 'Manual']
];
