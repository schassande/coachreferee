import { SkillProfile } from '../../app/model/skill';

export const LEVELS_NZ: SkillProfile[] = [
    {
        id: 'NZ1',
        version: 0,
        creationDate: new Date(),
        lastUpdate: new Date(),
        dataStatus: 'NEW',
        name: 'NZ 1',
        level: 'NZ_1',
        backgroundColor: '#00b050',
        color: 'white',
        description: 'NZ - Referee level 1',
        skillSets: [
            {
                name: 'Pre game duties',
                description: 'Description of Pre game duties',
                requirement: 'MAJORITY_REQUIRED',
                required: false,
                skills: [
                    {
                        name: 'Arrived on time for the game',
                        description: 'Arrived on time for the game',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'The scorecard, pen, coin',
                        description: 'The scorecard, pen, coin',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Conferred with fellow referee/s',
                        description: 'Conferred with fellow referee/s',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Inspected the field',
                        description: 'Inspected the field',
                        required: false,
                        proLinks: []
                    }
                ]
            },
            {
                name: 'Signal',
                description: 'SIGNALS – Does the referee correctly demonstrate during a game the following signals (Correctly means - clear and correct with crisp delivery, given with authority, correct stance and posture and mainly performed on the run to indicate the mark quickly)',
                requirement: 'MAJORITY_REQUIRED',
                required: false,
                skills: [{
                        name: 'Play On',
                        description: 'Signal Play On',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Incorrect Tap',
                        description: 'Signal Incorrect Tap',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Incorrect Roll ball',
                        description: 'Signal Incorrect Roll ball',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Offside 5m',
                        description: 'Signal Offside 5m',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Offside 10m',
                        description: 'Signal Offside 10m',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Penalty for Obstruction',
                        description: 'Signal Penalty for Obstruction',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Penalty for Over Physical Play',
                        description: 'Signal Penalty for Over Physical Play',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Penalty for Disputed Decision',
                        description: 'Signal Penalty for Disputed Decision',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Player dismissed for a period of time',
                        description: 'Player dismissed for a period of time',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Player dismissed for the remainder of the game',
                        description: 'Signal Player dismissed for the remainder of the game',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Brief verbal explanation linked to signal ',
                        description: 'Brief verbal explanation linked to signal ',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Correct touchdown procedure',
                        description: 'Correct touchdown procedure',
                        required: false,
                        proLinks: []
                    }
                ]
            },
            {
                name: 'Whistle',
                description: 'Whistle',
                requirement: 'MAJORITY_REQUIRED',
                required: false,
                skills: [{
                        name: 'Have an audible whistle and display some tone variations',
                        description: 'Have an audible whistle and display some tone variations',
                        required: false,
                        proLinks: []
                    }
                ]
            },
            {
                name: 'CONTROL and POSITIONING ',
                description: 'CONTROL and POSITIONING',
                requirement: 'MAJORITY_REQUIRED',
                required: true,
                skills: [
                    {
                        name: 'Control and mark a consistent 5 metres',
                        description: 'Control and mark a consistent 5 metres',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Control the 10 metres (following the tap)',
                        description: 'Control the 10 metres (following the tap)',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Keep eyes on the ball and move with the ball to be in the next desired position ',
                        description: 'Keep eyes on the ball and move with the ball to be in the next desired position ',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Consistently control the rollball (no interference)',
                        description: 'Consistently control the rollball (no interference)',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Be in position to see touches and not interfere with play on the scoreline',
                        description: 'Be in position to see touches and not interfere with play on the scoreline',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Consistently control heavy touches',
                        description: 'Consistently control heavy touches',
                        required: false,
                        proLinks: []
                    }
                ]
            },
            {
                name: 'FITNESS ',
                description: 'FITNESS ',
                requirement: 'MAJORITY_REQUIRED',
                required: true,
                skills: [
                    {
                        name: 'Sprint on interchanges and stay with play if the ball is spun wide',
                        description: 'Sprint on interchanges and stay with play if the ball is spun wide',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Sprint at a change of possession (i.e. 5 metre to 5 metre)',
                        description: 'Sprint at a change of possession (i.e. 5 metre to 5 metre)',
                        required: false,
                        proLinks: []
                    }
                    ]
            },
            {
                name: 'REFEREEING SYSTEMS ',
                description: 'REFEREEING SYSTEMS ',
                requirement: 'MAJORITY_REQUIRED',
                required: false,
                skills: [
                    {
                        name: 'Interchange correctly',
                        description: 'Interchange correctly',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Keep up with play while on the sideline and give support to the on-field referee when required',
                        description: 'Keep up with play while on the sideline and give support to the on-field referee when required',
                        required: false,
                        proLinks: []
                    }
                    ]
            },
            {
                name: 'COMMUNICATIONS ',
                description: 'COMMUNICATIONS ',
                requirement: 'MAJORITY_REQUIRED',
                required: true,
                skills: [
                    {
                        name: 'Establish clear and audible communication with players',
                        description: 'Establish clear and audible communication with players',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Use verbal communication on the run to assist with match control and flow',
                        description: 'Use verbal communication on the run to assist with match control and flow',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Display adequate control at the scoreline',
                        description: 'Display adequate control at the scoreline',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Handle conflict situations with confidence',
                        description: 'Handle conflict situations with confidence',
                        required: false,
                        proLinks: []
                    }
                ]
            },
            {
                name: 'RULINGS',
                description: 'RULINGS ',
                requirement: 'MAJORITY_REQUIRED',
                required: true,
                skills: [
                    {
                        name: 'Display an adequate knowledge with consistent rulings',
                        description: 'Display an adequate knowledge with consistent rulings',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Consistently rule on late and forward passes',
                        description: 'Consistently rule on late and forward passes',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Ensure the rollball is on the mark',
                        description: 'Ensure the rollball is on the mark',
                        required: false,
                        proLinks: []
                    }


                ]
            }
        ],
        requirement: 'MAJORITY_REQUIRED'
    },









    {
        id: 'NZ2',
        version: 0,
        creationDate: new Date(),
        lastUpdate: new Date(),
        dataStatus: 'NEW',
        name: 'NZ 2',
        level: 'NZ_2',
        description: 'NZ - Referee level 2',
        backgroundColor: 'green',
        color: 'white',
        skillSets: [
            {
                name: 'PRESENTATION',
                description: 'PRESENTATION ',
                requirement: 'MAJORITY_REQUIRED',
                required: true,
                skills: [
                    {
                        name: 'Display professionalism - Have a correct clean and tidy uniform',
                        description: 'Display professionalism - Have a correct clean and tidy uniform',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Display fitness – is physically able to keep up with the game at all times',
                        description: 'Display fitness – is physically able to keep up with the game at all times',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Sprint on interchanges and stay with play if the ball is spun wide',
                        description: 'Sprint on interchanges and stay with play if the ball is spun wide',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Sprint at a change of possession (i.e. 5 metre to 5 metre)',
                        description: 'Sprint at a change of possession (i.e. 5 metre to 5 metre)',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Display satisfactory recovery time during the match',
                        description: 'Display satisfactory recovery time during the match',
                        required: false,
                        proLinks: []
                    }
                ]
            },
            {
                name: 'COMMUNICATION – Non Verbal: Does the referee consistently',
                description: 'COMMUNICATION – Non Verbal: Does the referee consistently',
                requirement: 'MAJORITY_REQUIRED',
                required: true,
                skills: [
                    {
                        name: 'Display non confrontational body language',
                        description: 'Display non confrontational body language',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Display signals that are clear and correct with crisp delivery, given with authority, correct stance and posture and mainly performed on the run to indicate the mark ',
                        description: 'Display signals that are clear and correct with crisp delivery, given with authority, correct stance and posture and mainly performed on the run to indicate the mark ',
                        required: false,
                        proLinks: []
                    }
                ]
            },
            {
                name: 'COMMUNICATION – Verbal: Does the referee consistently',
                description: 'COMMUNICATION – Verbal: Does the referee consistently',
                requirement: 'MAJORITY_REQUIRED',
                required: false,
                skills: [
                    {
                        name: 'Use verbal communication that adds value to the control of the match –content /timing ',
                        description: 'Use verbal communication that adds value to the control of the match –content /timing ',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Establish clear and audible communication with players',
                        description: 'Establish clear and audible communication with players',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Use satisfactory conflict resolution methods to reduce/control conflict situations',
                        description: 'Use satisfactory conflict resolution methods to reduce/control conflict situations',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Use brief verbal instructions and explanations linked with signals ',
                        description: 'Use brief verbal instructions and explanations linked with signals ',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Use early nominations to control offside players or flyers',
                        description: 'Use early nominations to control offside players or flyers',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Develop and display a good rapport with players and coaches',
                        description: 'Develop and display a good rapport with players and coaches',
                        required: false,
                        proLinks: []
                    }
                ]
            },
            {
                name: 'CONTROL and POSITIONING  - Does the referee consistently',
                description: 'CONTROL and POSITIONING - Does the referee consistently',
                requirement: 'MAJORITY_REQUIRED',
                required: true,
                skills: [
                    {
                        name: 'Have a whistle technique that assists control – is audible and has fluctuation in tones and variation in sound, and displays authority',
                        description: 'Have a whistle technique that assists control – is audible and has fluctuation in tones and variation in sound, and displays authority',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Set and control 5 metres (flyers, looks both sides of the rollball)',
                        description: 'Set and control 5 metres (flyers, looks both sides of the rollball)',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Control the rollball (the mark and the procedure with no interference)',
                        description: 'Control the rollball (the mark and the procedure with no interference)',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Get to the Touchdown point as the ball is grounded or use best running angle to allow the best view of a Touchdown',
                        description: 'Get to the Touchdown point as the ball is grounded or use best running angle to allow the best view of a Touchdown',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Keep eyes on the ball and moves with the ball to be in the next desired position',
                        description: 'Keep eyes on the ball and moves with the ball to be in the next desired position',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'See touches and select a good position on the scoreline with proximity to the ball',
                        description: 'See touches and select a good position on the scoreline with proximity to the ball',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Select the best position in general play to avoid attack and defensive players while still maintaining proximity to the ball',
                        description: 'Select the best position in general play to avoid attack and defensive players while still maintaining proximity to the ball',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Attempt to use full field width when the ball is spun wide',
                        description: 'Attempt to use full field width when the ball is spun wide',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Have good movement between positions – is attempting to anticipate play',
                        description: 'Have good movement between positions – is attempting to anticipate play',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Control physical play and over-vigorous touches, sledging, and foul play',
                        description: 'Control physical play and over-vigorous touches, sledging, and foul play',
                        required: false,
                        proLinks: []
                    }
                ]
            },
            {
                name: 'REFEREEING SYSTEMS  - Does the referee consistently',
                description: 'REFEREEING SYSTEMS  - Does the referee consistently',
                requirement: 'MAJORITY_REQUIRED',
                required: true,
                skills: [{
                        name: 'Interchange correctly – select the correct off-field position to enter, and exits without obstructing players',
                        description: 'Interchange correctly – select the correct off-field position to enter, and exits without obstructing players',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Keep up with play on entry and is not chasing the game',
                        description: 'Keep up with play on entry and is not chasing the game',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Control play on field entry with effective communication',
                        description: 'Control play on field entry with effective communication',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Keep up with play and provide support to the controlling referee when required',
                        description: 'Keep up with play and provide support to the controlling referee when required',
                        required: false,
                        proLinks: []
                    }
                ]
            },
            {
                name: 'RULINGS  – Does the referee consistently',
                description: 'RULINGS  – Does the referee consistently:',
                requirement: 'MAJORITY_REQUIRED',
                required: true,
                skills: [{
                        name: 'Display a good knowledge of the rules',
                        description: 'Display a good knowledge of the rules',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Display consistent application of the rules',
                        description: 'Display consistent application of the rules',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Display an understanding of the game and their influence on it ',
                        description: 'Display an understanding of the game and their influence on it ',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Display a good knowledge and application of the rules to gain and allow Advantage',
                        description: 'Display a good knowledge and application of the rules to gain and allow Advantage',
                        required: false,
                        proLinks: []
                    }
                ]
            },
            {
                name: 'CONFIDENCE– Does the referee consistently',
                description: 'CONFIDENCE– Does the referee consistently',
                requirement: 'MAJORITY_REQUIRED',
                required: false,
                skills: [
                    {
                        name: 'Handle conflict situations with confidence',
                        description: 'Handle conflict situations with confidence',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Display a confident demeanor',
                        description: 'Display a confident demeanor',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Show confidence and courage to make tough decisions',
                        description: 'Show confidence and courage to make tough decisions',
                        required: true,
                        proLinks: []
                    }
                ]
            }
        ],
        requirement: 'MAJORITY_REQUIRED'
    },







    {
        id: 'NZ3',
        version: 0,
        creationDate: new Date(),
        lastUpdate: new Date(),
        dataStatus: 'NEW',
        name: 'NZ 3',
        level: 'NZ_3',
        description: 'NZ - Referee level 3',
        backgroundColor: 'red',
        color: 'white',
        skillSets: [{
                name: 'Game Awareness and Positioning',
                description: 'Game Awareness and Positioning',
                requirement: 'MAJORITY_REQUIRED',
                required: true,
                skills: [{
                        name: 'Demonstrates a very good knowledge of attack strategy, and positions accordingly in general play',
                        description: 'Demonstrates a very good knowledge of attack strategy, and positions accordingly in general play',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Anticipates the play to be in the next desired position, moves with urgency, uses full field width',
                        description: 'Anticipates the play to be in the next desired position, moves with urgency, uses full field width',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Is aware of and manages loose players consistently and supports buddies calls',
                        description: 'Is aware of and manages loose players consistently and supports buddies calls',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Demonstrates a good knowledge of the player’s roles and the impact on game outcomes',
                        description: 'Demonstrates a good knowledge of the player’s roles and the impact on game outcomes',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Checks both sides for shooter(s), manages appropriately and communicates early',
                        description: 'Checks both sides for shooter(s), manages appropriately and communicates early',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Has a physical presence in the 5m line where game strategy allows',
                        description: 'Has a physical presence in the 5m line where game strategy allows',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Sets the 5m line consistently, utilising appropriate movement techniques and communications',
                        description: 'Sets the 5m line consistently, utilising appropriate movement techniques and communications',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Anticipates the change of possession and sprints the change of possession (i.e. 5 m to 5 m)',
                        description: 'Anticipates the change of possession and sprints the change of possession (i.e. 5 m to 5 m)',
                        required: true,
                        proLinks: []
                    }
                ]
            },
            {
                name: 'Game  Management',
                description: 'Game  Management',
                requirement: 'MAJORITY_REQUIRED',
                required: true,
                skills: [
                    {
                        name: 'Manages the “defensive player who makes the touch” to an on-side position early and allows game to flow',
                        description: 'Manages the “defensive player who makes the touch” to an on-side position early and allows game to flow',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Consistently manages/controls the roll ball (no interference) with forethought for advantage',
                        description: 'Consistently manages/controls the roll ball (no interference) with forethought for advantage',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Manages the defensive players on the 5m and 10m (following the tap)',
                        description: 'Manages the defensive players on the 5m and 10m (following the tap)',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Manages the off side players in drives, is aware of referee prioritising (where referee has to focus and with the buddies recognising that)',
                        description: 'Manages the off side players in drives, is aware of referee prioritising (where referee has to focus and with the buddies recognising that)',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Plays advantage through pro-active/early communication to keep game flowing',
                        description: 'Plays advantage through pro-active/early communication to keep game flowing',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Manages physical play and takes appropriate action as and when necessary, early where possible',
                        description: 'Manages physical play and takes appropriate action as and when necessary, early where possible',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Identifies and manages verbal conflict appropriately and with confidence',
                        description: 'Identifies and manages verbal conflict appropriately and with confidence',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Clear, concise signals, whistle and explanations given with and for decisions so off-field referees can react quickly and set up the defensive line.  Signal and decision given toward the defence',
                        description: 'Clear, concise signals, whistle and explanations given with and for decisions so off-field referees can react quickly and set up the defensive line.  Signal and decision given toward the defence',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Establishes clear and audible communication with players',
                        description: 'Establishes clear and audible communication with players',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Displays a detailed understanding of the rules, their application and impact on the game',
                        description: 'Displays a detailed understanding of the rules, their application and impact on the game',
                        required: true,
                        proLinks: []
                    }
                ]
            },
            {
                name: 'Team Work and Communication',
                description: 'Team Work and Communication',
                requirement: 'MAJORITY_REQUIRED',
                required: true,
                skills: [
                    {
                        name: 'Consistently sets a 5m line reference point from off field position and still maintains a clear view of the on field referee',
                        description: 'Consistently sets a 5m line reference point from off field position and still maintains a clear view of the on field referee',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Provides effective support to on-field referee',
                        description: 'Provides effective support to on-field referee',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Builds a very good rapport with wingers and links to enhance teamwork',
                        description: 'Builds a very good rapport with wingers and links to enhance teamwork',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Communicates with realigning players (defenders) to assist on-field referee with 5m control and advantage ',
                        description: 'Communicates with realigning players (defenders) to assist on-field referee with 5m control and advantage ',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Communicates effectively with on field referee to keep players moving forward, off the scoreline',
                        description: 'Communicates effectively with on field referee to keep players moving forward, off the scoreline',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Is supportive and in sync with referee team decisions, demonstrates appropriate leadership',
                        description: 'Is supportive and in sync with referee team decisions, demonstrates appropriate leadership',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Adopts very good off field positions to assist with decision making',
                        description: 'Adopts very good off field positions to assist with decision making',
                        required: true,
                        proLinks: []
                    }
                ]
            },
            {
                name: 'Referee Systems',
                description: 'Referee Systems',
                requirement: 'MAJORITY_REQUIRED',
                required: true,
                skills: [
                    {
                        name: 'Interchanges made with confidence, shares the game workload, is in a change position and initiates the interchanges ',
                        description: 'Interchanges made with confidence, shares the game workload, is in a change position and initiates the interchanges ',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Communicates very effectively on field entry, uses options to eliminate penalties on entry, positive influence on the game',
                        description: 'Communicates very effectively on field entry, uses options to eliminate penalties on entry, positive influence on the game',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Demonstrates good field entry positioning, uses short side if appropriate, establishes the 5m line early/quickly, square before the first touch is made',
                        description: 'Demonstrates good field entry positioning, uses short side if appropriate, establishes the 5m line early/quickly, square before the first touch is made',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Aware of player substitutions, game strategies at the substitution and responds accordingly',
                        description: 'Aware of player substitutions, game strategies at the substitution and responds accordingly',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Exits field at an angle to ensure the oncoming referee can take early control',
                        description: 'Exits field at an angle to ensure the oncoming referee can take early control',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'On exit maintains game awareness to ensure management of any incident/assist on-field referee',
                        description: 'On exit maintains game awareness to ensure management of any incident/assist on-field referee',
                        required: true,
                        proLinks: []
                    }
                ]
            },
            {
                name: 'Scoreline',
                description: 'Scoreline',
                requirement: 'MAJORITY_REQUIRED',
                required: true,
                skills: [
                    {
                        name: 'Is close to Touchdown situations and has a clear view of the ball and touches at and behind the scoreline, is aware of set plays and is well positioned for all scoring opportunities',
                        description: 'Is close to Touchdown situations and has a clear view of the ball and touches at and behind the scoreline, is aware of set plays and is well positioned for all scoring opportunities',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Demonstrates a very good knowledge of attack strategy, and positions accordingly on scoreline',
                        description: 'Demonstrates a very good knowledge of attack strategy, and positions accordingly on scoreline',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Anticipates the long ball, moves accordingly to maintain sight and good proximity to the ball',
                        description: 'Anticipates the long ball, moves accordingly to maintain sight and good proximity to the ball',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Effectively manages defenders within 5m of the scoreline (standoff)',
                        description: 'Effectively manages defenders within 5m of the scoreline (standoff)',
                        required: true,
                        proLinks: []
                    }
                ]
            }
        ],
        requirement: 'ALL_REQUIRED'
    },









    {
        id: 'NZ4',
        version: 0,
        creationDate: new Date(),
        lastUpdate: new Date(),
        dataStatus: 'NEW',
        name: 'NZ 4',
        level: 'NZ_4',
        description: 'NZ - Referee level 4',
        backgroundColor: 'black',
        color: 'white',
        skillSets: [
            {
                name: 'Game Awareness and Positioning',
                description: 'Game Awareness and Positioning',
                requirement: 'MAJORITY_REQUIRED',
                required: true,
                skills: [
                    {
                        name: 'Demonstrates an excellent knowledge of attack strategy, and positions accordingly in general play',
                        description: 'Demonstrates an excellent knowledge of attack strategy, and positions accordingly in general play',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Consistently anticipates the play to be in the next desired position, moves with urgency, uses full field width',
                        description: 'Consistently anticipates the play to be in the next desired position, moves with urgency, uses full field width',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Is aware of and manages loose players consistently',
                        description: 'Is aware of and manages loose players consistently',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Demonstrates a very good knowledge of the player’s roles and the impact on game outcomes',
                        description: 'Demonstrates a very good knowledge of the player’s roles and the impact on game outcomes',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Consistently checks both sides for shooter(s), manages appropriately and communicates early',
                        description: 'Consistently checks both sides for shooter(s), manages appropriately and communicates early',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Has a consistent physical presence in the 5m line where game strategy allows',
                        description: 'Has a consistent physical presence in the 5m line where game strategy allows',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Sets the 5m line consistently, utilising appropriate movement techniques and communications',
                        description: 'Sets the 5m line consistently, utilising appropriate movement techniques and communications',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Anticipates the change of possession and sprints the change of possession (i.e. 5 m to 5 m)',
                        description: 'Anticipates the change of possession and sprints the change of possession (i.e. 5 m to 5 m)',
                        required: true,
                        proLinks: []
                    }
                ]
            },
            {
                name: 'Game  Management',
                description: 'Game  Management',
                requirement: 'MAJORITY_REQUIRED',
                required: true,
                skills: [
                    {
                        name: 'Manages the defensive player who makes the touch to an on-side position effectively and early',
                        description: 'Manages the defensive player who makes the touch to an on-side position effectively and early',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Is aware of the need to ensure 5m distance between attack and defence, does not accept the roll of the defensive line',
                        description: 'Is aware of the need to ensure 5m distance between attack and defence, does not accept the roll of the defensive line',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Manages the defensive players on the 5m and 10m (following the tap)',
                        description: 'Manages the defensive players on the 5m and 10m (following the tap)',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Manages the off-side players in drives, is aware of player prioritisation',
                        description: 'Manages the off-side players in drives, is aware of player prioritisation',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Plays advantage through pro-active/early communication to keep game flowing',
                        description: 'Plays advantage through pro-active/early communication to keep game flowing',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Plays advantage through pro-active/early/effective communication to keep game flowing',
                        description: 'Plays advantage through pro-active/early/effective communication to keep game flowing',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Manages physical play and takes appropriate action as and when necessary, early where possible',
                        description: 'Manages physical play and takes appropriate action as and when necessary, early where possible',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Identifies and manages verbal conflict appropriately and with confidence',
                        description: 'Identifies and manages verbal conflict appropriately and with confidence',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Clear, concise signals, whistle and explanations given with and for decisions so off-field referees can react quickly and set up the defensive line, clear and audible communication with players',
                        description: 'Clear, concise signals, whistle and explanations given with and for decisions so off-field referees can react quickly and set up the defensive line, clear and audible communication with players',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Effectively manages the pocket defender and keeps player in the game',
                        description: 'Effectively manages the pocket defender and keeps player in the game',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Displays a detailed understanding of the rules, their application and impact on the game',
                        description: 'Displays a detailed understanding of the rules, their application and impact on the game',
                        required: true,
                        proLinks: []
                    }
                ]
            },
            {
                name: 'Team Work and Communication',
                description: 'Team Work and Communication',
                requirement: 'MAJORITY_REQUIRED',
                required: true,
                skills: [
                    {
                        name: 'Consistently sets a 5m line reference point from off-field position',
                        description: 'Consistently sets a 5m line reference point from off-field position',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Provides consistent and very effective support to on-field referee',
                        description: 'Provides consistent and very effective support to on-field referee',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Builds an effective rapport with wingers and links to enhance teamwork',
                        description: 'Builds an effective rapport with wingers and links to enhance teamwork',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Communicates very effectively with realigning players (defenders) to assist on-field referee with 5m control and advantage',
                        description: 'Communicates very effectively with realigning players (defenders) to assist on-field referee with 5m control and advantage',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Communicates very effectively with on-field referee to keep players moving forward, off the Scoreline',
                        description: 'Communicates very effectively with on-field referee to keep players moving forward, off the Scoreline',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Is supportive and in sync with referee team decisions, demonstrates appropriate leadership',
                        description: 'Is supportive and in sync with referee team decisions, demonstrates appropriate leadership',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Adopts excellent off-field positions to assist with decision making',
                        description: 'Adopts excellent off-field positions to assist with decision making',
                        required: true,
                        proLinks: []
                    }
                ]
            },
            {
                name: 'Referee Systems',
                description: 'Referee Systems',
                requirement: 'MAJORITY_REQUIRED',
                required: true,
                skills: [
                    {
                        name: 'Interchanges made with confidence, shares the game workload, initiates the interchanges',
                        description: 'Interchanges made with confidence, shares the game workload, initiates the interchanges',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Communicates very effectively on-field entry, uses options to eliminate penalties on entry, positively influences player actions',
                        description: 'Communicates very effectively on-field entry, uses options to eliminate penalties on entry, positively influences player actions',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Demonstrates good field entry positioning, uses short side if appropriate, establishes the 5m line early/quickly, square before the first touch is made',
                        description: 'Demonstrates good field entry positioning, uses short side if appropriate, establishes the 5m line early/quickly, square before the first touch is made',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Aware of player substitutions, game strategies at the substitution and responds accordingly',
                        description: 'Aware of player substitutions, game strategies at the substitution and responds accordingly',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Exits field at an angle to ensure the oncoming referee can take early control',
                        description: 'Exits field at an angle to ensure the oncoming referee can take early control',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'On exit maintains game awareness to ensure management of any incident/assist on-field referee',
                        description: 'On exit maintains game awareness to ensure management of any incident/assist on-field referee',
                        required: true,
                        proLinks: []
                    }
                ]
            },
            {
                name: 'Scoreline',
                description: 'Scoreline',
                requirement: 'MAJORITY_REQUIRED',
                required: true,
                skills: [
                    {
                        name: 'Is close to Touchdown situations and has a clear view of the ball and touches at and behind the Scoreline, is aware of set plays and is well positioned for all scoring opportunities',
                        description: 'Is close to Touchdown situations and has a clear view of the ball and touches at and behind the Scoreline, is aware of set plays and is well positioned for all scoring opportunities',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Demonstrates an excellent knowledge of attack strategy, and positions accordingly on Scoreline',
                        description: 'Demonstrates an excellent knowledge of attack strategy, and positions accordingly on Scoreline',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Anticipates the long ball, moves accordingly to maintain sight and very good proximity to the ball',
                        description: 'Anticipates the long ball, moves accordingly to maintain sight and very good proximity to the ball',
                        required: true,
                        proLinks: []
                    },
                    {
                        name: 'Effectively manages defenders within 5m of the Scoreline (standoff)',
                        description: 'Effectively manages defenders within 5m of the Scoreline (standoff)',
                        required: true,
                        proLinks: []
                    }
                ]
            }
        ],
        requirement: 'ALL_REQUIRED'
    }

];
