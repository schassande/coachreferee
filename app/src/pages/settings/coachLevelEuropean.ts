import { SkillProfile } from '../../app/model/skill';

export const COACH_LEVELS_EURO: SkillProfile[] = [
    {
        level: 'EURO_1',
        name: 'Coach Euro 1',
        profileType: 'REFEREE_COACH',
        requiredPoints: 65,
        requirement: 'POINTS',
        backgroundColor: 'blue',
        color: 'white',
        creationDate: new Date(),
        dataStatus: 'NEW',
        description: 'European referee coach L1',
        id: 'coachEuro1',
        lastUpdate: new Date(),
        version: 10,
        skillSets: [{
                name: 'CAS',
                description: 'Competency Assessment Sheet',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                        name: 'Identify strengths and improvements',
                        description: 'The Referee Coach can identify areas of strength and areas of improvement in line with the Level 1 Competency Assessment Sheet.',
                        pointValues: [0, 1, 2, 3, 4, 5],
                        proLinks: [],
                        required: false
                    },
                    {
                        name: 'Complete CAS',
                        description: 'The Referee Coach has completed the Level 1 Referee CAS alone but under supervision by a more experienced Referee Coach and demonstrates reasonable justification for a decision on the upgrade.',
                        pointValues: [0, 5],
                        proLinks: [],
                        required: false
                    }
                ]
            },
            {
                name: 'Game Awareness',
                description: 'Game Awareness',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Identify basic player moves',
                    description: 'The coach can identify basic player moves and attempts to improve referee performance through this.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Coaching Position',
                description: 'Coaching Position',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Suitable position',
                    description: 'The coach adopts a suitable vantage point.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Preparation',
                description: 'Preparation',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Prepare feedbacks',
                    description: 'The coach prepares for half-time and full-time sessions.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Briefing Structure',
                description: 'Briefing Structure',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                        name: 'Deliver session',
                        description: 'The coach can deliver a coaching session.',
                        pointValues: [0, 1, 2, 3, 4, 5],
                        proLinks: [],
                        required: false
                    },
                    {
                        name: 'Following',
                        description: 'The full-time brief follows on from the half-time summary.',
                        pointValues: [0, 1, 2, 3, 4, 5],
                        proLinks: [],
                        required: false
                    },
                    {
                        name: 'Transfert improvement',
                        description: 'The referee can recognise and transfer improvement.',
                        pointValues: [0, 1, 2, 3, 4, 5],
                        proLinks: [],
                        required: false
                    }
                ]
            },
            {
                name: 'Coaching Teamwork',
                description: 'Coaching Teamwork',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Collective feedbacks',
                    description: 'The coach can deliver basic positive and collective teamwork improvement points.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: '5m Management',
                description: '5m Management',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Improvement on 5m control',
                    description: 'The coach can deliver competent points of improvement on 5m control.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Transfer and Impact',
                description: 'Transfer and Impact',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                        name: 'Concise feedback',
                        description: 'The coach provides concise feedback at half-time and full-time. The coach does not impact game start or re-start.',
                        pointValues: [0, 5],
                        proLinks: [],
                        required: false
                    },
                    {
                        name: 'Positive and constructive feedback',
                        description: 'The coach provides positive and constructive feedback, geared solely for the benefit of the individual.',
                        pointValues: [0, 5],
                        proLinks: [],
                        required: false
                    }
                ]
            },
            {
                name: 'Body Language',
                description: 'Body Language',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Engaged with referees',
                    description: 'The coach engages with referees and captures their attention.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Coaching Sheet',
                description: 'Coaching Sheet',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Clear and concise side-line coaching sheet',
                    description: 'The coach can deliver a clear and concise side-line coaching sheet (tear-off).',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Conflict',
                description: 'Conflict',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Identify conflict within a referee team.',
                    description: 'The coach can identify conflict within a referee team.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Emotional',
                description: 'Emotional',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Good social skills and motivation',
                    description: 'The coach demonstrates good social skills and motivation. The coach also demonstrates self-regulation.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Respect',
                description: 'Respect',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Respect towards individuals',
                    description: 'The coach demonstrates adequate levels of respect towards individuals and appreciates individual circumstances including referee skill, rule understanding and application and any specific needs (including and not limited to disability).',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Equal Opportunity',
                description: 'Equal Opportunity',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'The coach supports equal opportunity and positively vocalises areas for improvement.',
                    description: 'The coach supports equal opportunity and positively vocalises areas for improvement.',
                    pointValues: [0, 5],
                    proLinks: [],
                    required: false
                }]
            }
        ],
    },
    {
        level: 'EURO_2',
        name: 'Coach Euro 2',
        profileType: 'REFEREE_COACH',
        description: 'European referee coach L2',
        requiredPoints: 90,
        requirement: 'POINTS',
        backgroundColor: 'green',
        color: 'white',
        creationDate: new Date(),
        dataStatus: 'NEW',
        id: 'coachEuro2',
        lastUpdate: new Date(),
        version: 10,
        skillSets: [{
                name: '',
                description: 'Competency Assessment Sheet',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                        name: 'Identify strengths and improvements',
                        description: 'The Referee Coach can identify areas of strength and areas of improvement in line with the Level 2 Competency Assessment Sheet.',
                        pointValues: [0, 1, 2, 3, 4, 5],
                        proLinks: [],
                        required: false
                    },
                    {
                        name: 'Complete CAS',
                        description: 'The Referee Coach has completed the Level 2 Referee CAS alone but under supervision by a more experienced Referee Coach and demonstrates reasonable justification for a decision on the upgrade.',
                        pointValues: [0, 5],
                        proLinks: [],
                        required: false
                    }
                ]
            },
            {
                name: 'Coaching Style',
                description: 'Coaching Style',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Use PRO',
                    description: 'The coach uses the Problem-Cause-Remedy-Game Outcome-Referee Benefit method',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Game Awareness',
                description: 'Game Awareness',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Game outcomes',
                    description: 'The coach understands game outcomes and can identify key play makers.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Coaching Position',
                description: 'Coaching Position',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Suitable position and move',
                    description: 'The coach adopts suitable vantage points, moves along the side-line and views the game from behind the score-line',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Preparation',
                description: 'Preparation',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Prepare feedbacks',
                    description: 'The coach prepares for half-time and full-time sessions.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Briefing Structure',
                description: 'Briefing Structure',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                        name: 'Positive aspectes and structured',
                        description: 'The coach actively looks for positive aspects of a referee’s performance. The coach can deliver a well-structured session within the available time limits.',
                        pointValues: [0, 1, 2, 3, 4, 5],
                        proLinks: [],
                        required: false
                    },
                    {
                        name: 'Improvement',
                        description: 'The coach can identify areas for referee improvement.',
                        pointValues: [0, 1, 2, 3, 4, 5],
                        proLinks: [],
                        required: false
                    },
                    {
                        name: 'Check for understanding',
                        description: 'The coach can check for understanding.',
                        pointValues: [0, 1, 2, 3, 4, 5],
                        proLinks: [],
                        required: false
                    }
                ]
            },
            {
                name: 'Coaching Teamwork',
                description: 'Coaching Teamwork',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Advanced teamwork improvements',
                    description: 'The coach can deliver advanced teamwork improvements points.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: '5m Management',
                description: '5m Management',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'PCRO-R',
                    description: 'The coach can use PCRO-R',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Transfer and Impact',
                description: 'Transfer and Impact',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                        name: 'Concise feedback',
                        description: 'The coach provides concise feedback at half-time and full-time. The coach does not impact game start or re-start.',
                        pointValues: [0, 5],
                        proLinks: [],
                        required: false
                    },
                    {
                        name: 'Positive and constructive feedback',
                        description: 'The coach provides positive and constructive feedback, geared solely for the benefit of the individual.',
                        pointValues: [0, 5],
                        proLinks: [],
                        required: false
                    }
                ]
            },
            {
                name: 'Body Language',
                description: 'Body Language',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Engaged with referees',
                    description: 'The coach engages with referees and captures their attention.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Coaching Sheet',
                description: 'Coaching Sheet',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Full coaching sheet post tournament',
                    description: 'The coach can transfer coaching and deliver a full coaching sheet post tournament',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Tournament Coaching',
                description: 'Tournament Coaching',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'The coach can deliver consistent coaching throughout the day to an individual and build upon previous sessions.',
                    description: 'The coach can deliver consistent coaching throughout the day to an individual and build upon previous sessions.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Panel and Processes',
                description: 'Panel and Processes',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                        name: 'Panel teamwork and discretion',
                        description: 'The coach demonstrates panel teamwork and discretion. The coach does not undermine the referee group or panel.',
                        pointValues: [0, 5],
                        proLinks: [],
                        required: false
                    },
                    {
                        name: 'Aware of panel processes at multi-day tournaments.',
                        description: 'The coach is aware of panel processes at multi-day tournaments.',
                        pointValues: [0, 5],
                        proLinks: [],
                        required: false
                    }
                ]
            },
            {
                name: 'Appointments',
                description: 'Appointments',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'The coach can deliver referee appointments for a single day tournament within 2 weeks.',
                    description: 'The coach can deliver referee appointments for a single day tournament within 2 weeks.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Mentoring',
                description: 'Mentoring',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'The coach provides follow up coaching to referees.',
                    description: 'The coach provides follow up coaching to referees.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },

            {
                name: 'Conflict',
                description: 'Conflict',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Identify and attempt to resolveconflict within a referee team.',
                    description: 'The coach can identify social issues between referees and attempts to resolve conflict within the referee team.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Emotional',
                description: 'Emotional',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Good social skills and motivation',
                    description: 'The coach demonstrates empathy.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Psychology',
                description: 'Psychology',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'The coach has an appreciation of referee psychology.',
                    description: 'The coach has an appreciation of referee psychology.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Respect',
                description: 'Respect',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Respect towards individuals',
                    description: 'The coach demonstrates adequate levels of respect towards individuals and appreciates individual circumstances including referee skill, rule understanding and application and any specific needs.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Equal Opportunity',
                description: 'Equal Opportunity',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'The coach supports equal opportunity and positively vocalises areas for improvement.',
                    description: 'The coach supports equal opportunity and positively vocalises areas for improvement.',
                    pointValues: [0, 5],
                    proLinks: [],
                    required: false
                }]
            }
        ],
    },
    {
        level: 'EURO_3',
        name: 'Coach Euro 3',
        profileType: 'REFEREE_COACH',
        description: 'European referee coach L3',
        requiredPoints: 100,
        requirement: 'POINTS',
        backgroundColor: 'yellow',
        color: 'black',
        creationDate: new Date(),
        dataStatus: 'NEW',
        id: 'coachEuro3',
        lastUpdate: new Date(),
        version: 10,
        skillSets: [{
                name: '',
                description: 'Competency Assessment Sheet',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                        name: 'Identify strengths and improvements',
                        description: 'The Referee Coach can identify areas of strength and areas of improvement in line with the Level 3 Competency Assessment Sheet.',
                        pointValues: [0, 1, 2, 3, 4, 5],
                        proLinks: [],
                        required: false
                    },
                    {
                        name: 'Complete CAS',
                        description: 'The Referee Coach has completed the Level 3 Referee CAS alone but under supervision by a more experienced Referee Coach and demonstrates reasonable justification for a decision on the upgrade.',
                        pointValues: [0, 5],
                        proLinks: [],
                        required: false
                    }
                ]
            },
            {
                name: 'Coaching Style',
                description: 'Coaching Style',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Strength coaching collectively',
                    description: 'The coach can use strength coaching collectively',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Game Awareness',
                description: 'Game Awareness',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Transfer play maker objectives',
                    description: 'The coach attempts to transfer play maker objectives on set plays to assist the referee with game outcomes.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Coaching Position',
                description: 'Coaching Position',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Mtivate from side-line',
                    description: 'The coach motivates and encourages the referee from the side-line. This must be done without game impact.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Preparation',
                description: 'Preparation',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Prepare feedbacks',
                    description: 'The coach prepares for half-time and full-time sessions.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Briefing Structure',
                description: 'Briefing Structure',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                        name: 'Immediate game impact',
                        description: 'The coach can deliver a session for immediate game impact.',
                        pointValues: [0, 1, 2, 3, 4, 5],
                        proLinks: [],
                        required: false
                    },
                    {
                        name: 'Improvement',
                        description: 'The coach can identify areas for referee improvement.',
                        pointValues: [0, 1, 2, 3, 4, 5],
                        proLinks: [],
                        required: false
                    },
                    {
                        name: 'Check for understanding',
                        description: 'The coach can check for understanding.',
                        pointValues: [0, 1, 2, 3, 4, 5],
                        proLinks: [],
                        required: false
                    }
                ]
            },
            {
                name: 'Coaching Teamwork',
                description: 'Coaching Teamwork',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Advanced teamwork improvements',
                    description: 'The coach can deliver advanced teamwork improvements points.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: '5m Management',
                description: '5m Management',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Variety of techniques.',
                    description: 'The coach can deliver advanced points of improvement on 5 m control, together with solutions using a variety of techniques.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Transfer and Impact',
                description: 'Transfer and Impact',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                        name: 'Understanding overload',
                        description: 'The coach has a basic understanding of the impact of overload.',
                        pointValues: [0, 5],
                        proLinks: [],
                        required: false
                    },
                    {
                        name: 'Adapt content and method to transfert impact',
                        description: 'The coach has a comprehensive knowledge of transfer and its impact and seeks to understand both the content required and the format/methods by which such information should be presented.',
                        pointValues: [0, 5],
                        proLinks: [],
                        required: false
                    }
                ]
            },
            {
                name: 'Body Language',
                description: 'Body Language',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Modify feedback to referee body language',
                    description: 'The coach can identify changes in body language in individuals or the referee team and is able to modify their sessions accordingly.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Preloading',
                description: 'Preloading',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Preload expectations',
                    description: 'The coach can pre-load referees on game expectations',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Coaching Sheet',
                description: 'Coaching Sheet',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Full coaching sheet post tournament',
                    description: 'The coach can transfer coaching and deliver a full coaching sheet post tournament',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Video analysis',
                description: 'Video analysis',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Dissect performance on video',
                    description: 'The Referee Coach has an advanced ability to dissect the referee performance through video analysis.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Tournament Coaching',
                description: 'Tournament Coaching',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'The coach can deliver consistent coaching throughout the day to an individual and build upon previous sessions.',
                    description: 'The coach can deliver consistent coaching throughout the day to an individual and build upon previous sessions.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Panel and Processes',
                description: 'Panel and Processes',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                        name: 'Panel teamwork and discretion',
                        description: 'The coach demonstrates panel teamwork and discretion. The coach does not undermine the referee group or panel.',
                        pointValues: [0, 5],
                        proLinks: [],
                        required: false
                    },
                    {
                        name: 'Understand panel processes at multi-day tournaments.',
                        description: 'The coach understands panel process during multi-day tournaments, including exposure at Euros. The coach can provide valuable input into decisions.',
                        pointValues: [0, 5],
                        proLinks: [],
                        required: false
                    }
                ]
            },
            {
                name: 'Appointments',
                description: 'Appointments',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'The coach can deliver the referee appointments during a multiday event.',
                    description: 'The coach can deliver the referee appointments during a multiday event.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Mentoring',
                description: 'Mentoring',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Provides mentoring to Referee Coaches.',
                    description: 'Provides mentoring to Referee Coaches.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Conflict',
                description: 'Conflict',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Identify and ability to resolve conflict within a referee team.',
                    description: 'The coach can identify social issues between referees and attempts to mitigate them for positive game outcome. The coach has an advanced ability to resolve conflict within the referee team.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Emotional',
                description: 'Emotional',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'The coach demonstrates self-awareness and their own areas for improvement.',
                    description: 'The coach demonstrates self-awareness and their own areas for improvement.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Psychology',
                description: 'Psychology',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'The coach can vary their delivery and message according to the individual referee and the referee team. The coach attempts to recognise game sensitivity.',
                    description: 'The coach can vary their delivery and message according to the individual referee and the referee team. The coach attempts to recognise game sensitivity.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Respect',
                description: 'Respect',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Respect towards individuals',
                    description: 'The coach demonstrates adequate levels of respect towards individuals and appreciates individual circumstances including referee skill, rule understanding and application and any specific needs.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Equal Opportunity',
                description: 'Equal Opportunity',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'The coach supports equal opportunity and positively vocalises areas for improvement.',
                    description: 'The coach supports equal opportunity and positively vocalises areas for improvement.',
                    pointValues: [0, 5],
                    proLinks: [],
                    required: false
                }]
            }
        ],
    },
    {
        level: 'EURO_4',
        name: 'Coach Euro 4',
        profileType: 'REFEREE_COACH',
        description: 'European referee coach L4',
        requiredPoints: 115,
        requirement: 'POINTS',
        backgroundColor: 'red',
        color: 'white',
        creationDate: new Date(),
        dataStatus: 'NEW',
        id: 'coachEuro4',
        lastUpdate: new Date(),
        version: 10,
        skillSets: [{
                name: '',
                description: 'Competency Assessment Sheet',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                        name: 'Identify strengths and improvements',
                        description: 'The Referee Coach can identify areas of strength and areas of improvement in line with the Level 4 Competency Assessment Sheet.',
                        pointValues: [0, 1, 2, 3, 4, 5],
                        proLinks: [],
                        required: false
                    },
                    {
                        name: 'Complete CAS',
                        description: 'The Referee Coach has completed the Level 4 Referee CAS alone but under supervision by a more experienced Referee Coach and demonstrates reasonable justification for a decision on the upgrade.',
                        pointValues: [0, 5],
                        proLinks: [],
                        required: false
                    }
                ]
            },
            {
                name: 'Coaching Style',
                description: 'Coaching Style',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Combination of style',
                    description: 'The coach can use a solution based approach to coaching, as well as a combination of strength based, solution based and PCRO, depending upon the audience.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Game Awareness',
                description: 'Game Awareness',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Transfer defensive and offensive player objectives',
                    description: 'The coach understands defensive and offensive player objectives and set plays and can transfer this to referees to improve game outcome at an advanced level at a Cat B event.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Coaching Position',
                description: 'Coaching Position',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Mtivate from side-line',
                    description: 'The coach motivates and encourages the referee from the side-line. This must be done without game impact.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Preparation',
                description: 'Preparation',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Prepare feedbacks',
                    description: 'The coach prepares for half-time and full-time sessions.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Briefing Structure',
                description: 'Briefing Structure',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                        name: 'Immediate game impact',
                        description: 'The coach can deliver a session for immediate game impact.',
                        pointValues: [0, 1, 2, 3, 4, 5],
                        proLinks: [],
                        required: false
                    },
                    {
                        name: 'Improvement',
                        description: 'The coach can identify areas for referee improvement.',
                        pointValues: [0, 1, 2, 3, 4, 5],
                        proLinks: [],
                        required: false
                    },
                    {
                        name: 'provides positive reinforcement on learning objectives',
                        description: 'The coach provides positive reinforcement on learning objectives',
                        pointValues: [0, 1, 2, 3, 4, 5],
                        proLinks: [],
                        required: false
                    }
                ]
            },
            {
                name: 'Coaching Teamwork',
                description: 'Coaching Teamwork',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'identify the nuances between referees',
                    description: 'The coach should be able to identify the nuances between each referee and be able to coach toward a collective outcome.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: '5m Management',
                description: '5m Management',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'pin point the 3 elements of 5m management',
                    description: 'The coach should be able to pin point the 3 elements of 5m management and be specific in delivery. 1. Score Line, 2 Drives, 3. General play',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Transfer and Impact',
                description: 'Transfer and Impact',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                        name: 'Fully understanding overload',
                        description: 'The coach fully understands the impact of overload and how the time can impact on referee recovery',
                        pointValues: [0, 5],
                        proLinks: [],
                        required: false
                    },
                    {
                        name: 'Adapt content and method to transfert impact',
                        description: 'The coach has a comprehensive knowledge of transfer and its impact and seeks to understand both the content required and the format/methods by which such information should be presented.',
                        pointValues: [0, 5],
                        proLinks: [],
                        required: false
                    }
                ]
            },
            {
                name: 'Body Language',
                description: 'Body Language',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Modify feedback to referee body language',
                    description: 'The coach can identify changes in body language in individuals or the referee team and is able to modify their sessions accordingly.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Preloading',
                description: 'Preloading',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Preload expectations',
                    description: 'The coach can pre-load referees on game expectations',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Coaching Sheet',
                description: 'Coaching Sheet',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Full coaching sheet post tournament',
                    description: 'The coach can transfer coaching and deliver a full coaching sheet post tournament',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Video analysis',
                description: 'Video analysis',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Dissect performance on video',
                    description: 'The Referee Coach has an advanced ability to dissect the referee performance through video analysis.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Tournament Coaching',
                description: 'Tournament Coaching',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'The coach can deliver consistent coaching throughout the day to an individual and build upon previous sessions.',
                    description: 'The coach can deliver consistent coaching throughout the day to an individual and build upon previous sessions.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Panel and Processes',
                description: 'Panel and Processes',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                        name: 'Expert in panel duties',
                        description: 'The coach is an expert in panel duties and demonstrates a dynamic skillset during a multi-day tournament.',
                        pointValues: [0, 5],
                        proLinks: [],
                        required: false
                    },
                    {
                        name: 'knowledge of panel process',
                        description: 'The coach has a thorough knowledge of panel process and can apply them positively.',
                        pointValues: [0, 5],
                        proLinks: [],
                        required: false
                    }
                ]
            },
            {
                name: 'Appointments',
                description: 'Appointments',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Complex appointments overnight',
                    description: 'The coach can deliver competent solutions to complex appointments overnight during a Category A event',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Mentoring',
                description: 'Mentoring',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Provides group mentoring and presentations to referees and coaches.',
                    description: 'Provides group mentoring and presentations to referees and coaches.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Conflict',
                description: 'Conflict',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [
                    {
                        name: 'The coach can identify and mitigate areas of conflict between referees.',
                        description: 'The coach can identify and mitigate areas of conflict between referees.',
                        pointValues: [0, 1, 2, 3, 4, 5],
                        proLinks: [],
                        required: false
                    },
                    {
                        name: 'The coach can engage with team coaches positively.',
                        description: 'The coach can engage with team coaches positively.',
                        pointValues: [0, 1, 2, 3, 4, 5],
                        proLinks: [],
                        required: false
                    }
                ]
            },
            {
                name: 'Emotional',
                description: 'Emotional',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'The coach demonstrates self-awareness and their own areas for improvement.',
                    description: 'The coach demonstrates self-awareness and their own areas for improvement.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Psychology',
                description: 'Psychology',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [
                    {
                        name: 'The coach can assess the state of mind of the referee and adjust their coaching as required',
                        description: 'The coach can assess the state of mind of the referee and adjust their coaching as required',
                        pointValues: [0, 1, 2, 3, 4, 5],
                        proLinks: [],
                        required: false
                    },
                    {
                        name: 'The coach can recognise the tenor of a game, the player and team coach feeling and what impact that may have on the game.',
                        description: 'The coach can recognise the tenor of a game, the player and team coach feeling and what impact that may have on the game.',
                        pointValues: [0, 1, 2, 3, 4, 5],
                        proLinks: [],
                        required: false
                    }
                ]
            },
            {
                name: 'Respect',
                description: 'Respect',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Respect towards individuals',
                    description: 'The coach demonstrates adequate levels of respect towards individuals and appreciates individual circumstances including referee skill, rule understanding and application and any specific needs.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Equal Opportunity',
                description: 'Equal Opportunity',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'The coach demonstrates leadership qualities.',
                    description: 'The coach demonstrates leadership qualities.',
                    pointValues: [0, 5],
                    proLinks: [],
                    required: false
                }]
            }
        ],
    },
    {
        level: 'EURO_5',
        name: 'Coach Euro 5',
        profileType: 'REFEREE_COACH',
        description: 'European referee coach L5',
        requiredPoints: 120,
        requirement: 'POINTS',
        backgroundColor: 'black',
        color: 'white',
        creationDate: new Date(),
        dataStatus: 'NEW',
        id: 'coachEuro5',
        lastUpdate: new Date(),
        version: 10,
        skillSets: [{
                name: '',
                description: 'Competency Assessment Sheet',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                        name: 'Identify strengths and improvements',
                        description: 'The Referee Coach can identify areas of strength and areas of improvement in line with the Level 5 Competency Assessment Sheet.',
                        pointValues: [0, 1, 2, 3, 4, 5],
                        proLinks: [],
                        required: false
                    },
                    {
                        name: 'Complete CAS',
                        description: 'The Referee Coach has completed the Level 5 Referee CAS alone but under supervision by a more experienced Referee Coach and demonstrates reasonable justification for a decision on the upgrade.',
                        pointValues: [0, 5],
                        proLinks: [],
                        required: false
                    }
                ]
            },
            {
                name: 'Coaching Style',
                description: 'Coaching Style',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Combination of style',
                    description: 'The coach can use a solution based approach to coaching, as well as a combination of strength based, solution based and PCRO, depending upon the audience.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Game Awareness',
                description: 'Game Awareness',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Transfer defensive and offensive player objectives',
                    description: 'The coach understands defensive and offensive player objectives and set plays and can transfer this to referees to improve game outcome. The coach can perform this at a technically elite level at a Cat A event.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Coaching Position',
                description: 'Coaching Position',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Mtivate from side-line',
                    description: 'The coach motivates and encourages the referee from the side-line. This must be done without game impact.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Preparation',
                description: 'Preparation',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Prepare feedbacks',
                    description: 'The coach prepares for half-time and full-time sessions.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Briefing Structure',
                description: 'Briefing Structure',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                        name: 'Immediate game impact',
                        description: 'The coach can deliver an expert session and link ideas with current game trends.',
                        pointValues: [0, 1, 2, 3, 4, 5],
                        proLinks: [],
                        required: false
                    },
                    {
                        name: 'Improvement',
                        description: 'The coach can identify areas for referee improvement.',
                        pointValues: [0, 1, 2, 3, 4, 5],
                        proLinks: [],
                        required: false
                    },
                    {
                        name: 'Check for understanding',
                        description: 'The coach can check for understanding.',
                        pointValues: [0, 1, 2, 3, 4, 5],
                        proLinks: [],
                        required: false
                    }
                ]
            },
            {
                name: 'Coaching Teamwork',
                description: 'Coaching Teamwork',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'identify the nuances between referees',
                    description: 'The coach should be able to identify the nuances between each referee and be able to coach toward a collective outcome.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: '5m Management',
                description: '5m Management',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'pin point the 3 elements of 5m management',
                    description: 'The coach should be able to pin point the 3 elements of 5m management and be specific in delivery. 1. Score Line, 2 Drives, 3. General play',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Transfer and Impact',
                description: 'Transfer and Impact',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                        name: 'Fully understanding overload',
                        description: 'The coach fully understands the impact of overload and how the time can impact on referee recovery',
                        pointValues: [0, 5],
                        proLinks: [],
                        required: false
                    },
                    {
                        name: 'Adapt content and method to transfert impact',
                        description: 'The coach has a comprehensive knowledge of transfer and its impact and seeks to understand both the content required and the format/methods by which such information should be presented.',
                        pointValues: [0, 5],
                        proLinks: [],
                        required: false
                    }
                ]
            },
            {
                name: 'Body Language',
                description: 'Body Language',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Modify feedback to referee body language',
                    description: 'The coach can identify changes in body language in individuals or the referee team and is able to modify their sessions accordingly.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Preloading',
                description: 'Preloading',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Preload expectations',
                    description: 'The coach can pre-load referees on game expectations',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Coaching Sheet',
                description: 'Coaching Sheet',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Full coaching sheet post tournament',
                    description: 'The coach can transfer coaching and deliver a full coaching sheet post tournament',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Video analysis',
                description: 'Video analysis',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Dissect performance on video',
                    description: 'The Referee Coach has an advanced ability to dissect the referee performance through video analysis.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Tournament Coaching',
                description: 'Tournament Coaching',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'The coach can deliver consistent coaching throughout the day to an individual and build upon previous sessions.',
                    description: 'The coach can deliver consistent coaching throughout the day to an individual and build upon previous sessions.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Panel and Processes',
                description: 'Panel and Processes',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                        name: 'Expert in panel duties',
                        description: 'The coach is an expert in panel duties and demonstrates a dynamic skillset during a multi-day tournament.',
                        pointValues: [0, 5],
                        proLinks: [],
                        required: false
                    },
                    {
                        name: 'Fully accountable for decisions',
                        description: 'The coach is fully accountable for decisions and can deliver feedback post tournament. The coach can motivate disappointed referees.',
                        pointValues: [0, 5],
                        proLinks: [],
                        required: false
                    }
                ]
            },
            {
                name: 'Appointments',
                description: 'Appointments',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Deliver competent solutions',
                    description: 'The coach can deliver competent solutions at a Cat A event overnight during the event.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Mentoring',
                description: 'Mentoring',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'The coach is a leader in the development of refereeing standards, policy and application.',
                    description: 'The coach is a leader in the development of refereeing standards, policy and application.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Conflict',
                description: 'Conflict',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [
                    {
                        name: 'The coach can identify and mitigate areas of conflict between referees.',
                        description: 'The coach can identify and mitigate areas of conflict between referees.',
                        pointValues: [0, 1, 2, 3, 4, 5],
                        proLinks: [],
                        required: false
                    },
                    {
                        name: 'The coach and can resolve issues with team coaches.',
                        description: 'The coach and can resolve issues with team coaches.',
                        pointValues: [0, 1, 2, 3, 4, 5],
                        proLinks: [],
                        required: false
                    }
                ]
            },
            {
                name: 'Emotional',
                description: 'Emotional',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'The coach demonstrates self-awareness and their own areas for improvement.',
                    description: 'The coach demonstrates self-awareness and their own areas for improvement.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Psychology',
                description: 'Psychology',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [
                    {
                        name: 'The coach can assess the referees state of mind, body language and any other cues to enable them to deliver effective coaching that resonates with the referee and results in an increase in performance of the referee.',
                        description: 'The coach can assess the referees state of mind, body language and any other cues to enable them to deliver effective coaching that resonates with the referee and results in an increase in performance of the referee.',
                        pointValues: [0, 1, 2, 3, 4, 5],
                        proLinks: [],
                        required: false
                    },
                    {
                        name: 'The coach can identify game issues and coach referees on topics which may not be immediately obvious.',
                        description: 'The coach can identify game issues and coach referees on topics which may not be immediately obvious.',
                        pointValues: [0, 1, 2, 3, 4, 5],
                        proLinks: [],
                        required: false
                    }
                ]
            },
            {
                name: 'Respect',
                description: 'Respect',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'Respect towards individuals',
                    description: 'The coach demonstrates adequate levels of respect towards individuals and appreciates individual circumstances including referee skill, rule understanding and application and any specific needs.',
                    pointValues: [0, 1, 2, 3, 4, 5],
                    proLinks: [],
                    required: false
                }]
            },
            {
                name: 'Equal Opportunity',
                description: 'Equal Opportunity',
                required: false,
                requiredPoints: 0,
                requirement: 'POINTS',
                skills: [{
                    name: 'The coach is a leader and seeks out policy change.',
                    description: 'The coach is a leader and seeks out policy change.',
                    pointValues: [0, 5],
                    proLinks: [],
                    required: false
                }]
            }
        ],
    }
];
