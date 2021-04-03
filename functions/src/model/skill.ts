import { PROLink } from './coaching';
import { PersistentData } from './common';
import { RefereeLevel } from './user';


export type EvaluationRequirement = 'ALL_REQUIRED' | 'MAJORITY_REQUIRED' | 'POINTS';
export interface Defintion {
    name: string;
    description: string;
}
export interface Skill extends Defintion {
    proLinks: PROLink[];
    required: boolean;
    pointValues?: number[];
}

export interface HasRequiredPoint {
    requiredPoints?: number;
}
export interface SkillSet extends Defintion, HasRequiredPoint {
    skills: Skill[];
    requirement: EvaluationRequirement;
    required: boolean;
}

export type ProfileType = 'REFEREE' | 'REFEREE_COACH';

export interface SkillProfile extends Defintion, PersistentData, HasRequiredPoint {
    skillSets: SkillSet[];
    requirement: EvaluationRequirement;
    backgroundColor?: string;
    color?: string;
    level?: RefereeLevel;
    profileType?: ProfileType;
}
