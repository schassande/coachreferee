export type Sharing =
    'NO' /** No sharing */
    | 'LIMITED' /* sharing with control */
    | 'YES' /* Sharing allowed */
    ;

export interface PersonDataSharingAgreement  {
    /* Agrement of sharing about personnal information */
    personnalInfoSharing: Sharing;
    /* Agrement of sharing about the photo */
    photoSharing: Sharing;
}
export interface RefereeDataSharingAgreement  extends PersonDataSharingAgreement {
    /* Agrement of sharing about the coaching information about me writen by the coaches */
    refereeAssessmentSharing: Sharing;
    /* Agrement of sharing about the assessment information about me writen by the coaches */
    refereeCoachingInfoSharing: Sharing;
}
export interface CoachDataSharingAgreement extends RefereeDataSharingAgreement {
    /* Agrement of sharing about the coaching done by the coach */
    coachAssessmentSharing: Sharing;
    /* Agrement of sharing about the assessment done by the coach */
    coachCoachingInfoSharing: Sharing;
    /* Agrement of sharing about the PRO library created by the coach */
    coachProSharing: Sharing;
}
