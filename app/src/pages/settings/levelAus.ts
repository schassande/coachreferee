import { SkillProfile } from '../../app/model/skill';

export const LEVELS_AUS: SkillProfile[] = [
        {
            id: 'AUS1',
            version: 0,
            creationDate: new Date(),
            lastUpdate: new Date(),
            dataStatus: 'NEW',
            name: 'AUS 1',
            backgroundColor: '#ff6600',
            color: 'white',
            description: 'AUS - Referee level 1',
            level: 'AUS_1',
            skillSets: [
                {
                    name: 'Pre game duties',
                    description: 'Description of Pre game duties',
                    requirement: 'MAJORITY_REQUIRED',
                    required: false,
                    skills: [{
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
                            name: 'Conferred with their buddy referee(s)',
                            description: 'Conferred with their buddy referee(s)',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Uniform',
                            description: 'Does the referee have an appropriate, clean and tidy uniform?',
                            required: false,
                            proLinks: []
                        }
                    ]
                },
                {
                    name: 'Signal',
                    description: 'Does the referee correctly demonstrate the following signals during a game, or when asked? Correctly means: clear and correct with crisp delivery, given with authority, correct stance and posture and performed mainly on the run to indicate the mark quickly. Note: if not demonstrated on-field, test the referee off-field after the game.',
                    requirement: 'MAJORITY_REQUIRED',
                    required: false,
                    skills: [{
                            name: 'Start of play',
                            description: 'Signal Start of play',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Ball to ground',
                            description: 'Signal Ball to ground',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Touchdown',
                            description: 'Signal ',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '5th touch',
                            description: 'Signal 5th touch',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '6th touch',
                            description: 'Signal 6th touch',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Half caught',
                            description: 'Signal Half caught',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Penalty sequence',
                            description: 'Signal Penalty sequence',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Penalty – forward pass',
                            description: 'Signal Penalty – forward pass',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Penalty – late pass',
                            description: 'Signal Penalty – late pass',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Finish of game',
                            description: 'Signal Finish of game',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Brief verbal explanation linked to signal to aid player understanding',
                            description: 'Brief verbal explanation linked to signal to aid player understanding',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'WHISTLE - Does the referee have an audible whistle',
                            description: 'WHISTLE - Does the referee have an audible whistle',
                            required: false,
                            proLinks: []
                        }
                    ]
                },
                {
                    name: 'Control, positioning, fitness',
                    description: 'Description of Signal',
                    requirement: 'MAJORITY_REQUIRED',
                    required: false,
                    skills: [{
                            name: 'Keep and mark a consistent 5 metres',
                            description: 'Keep and mark a consistent 5 metres',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Keep eyes on the ball at all times',
                            description: 'Keep eyes on the ball at all times',
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
                            name: 'Consistently control heavy touches',
                            description: 'Consistently control heavy touches',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'FITNESS - Does the referee: Keep up with the game',
                            description: 'FITNESS - Does the referee: Keep up with the game',
                            required: false,
                            proLinks: []
                        }
                    ]
                },
                {
                    name: 'Refereeing system',
                    description: 'Description of Signal',
                    requirement: 'MAJORITY_REQUIRED',
                    required: false,
                    skills: [{
                        name: 'Interchange correctly',
                        description: 'Interchange correctly',
                        required: false,
                        proLinks: []
                    },
                    {
                        name: 'Keep up with play &amp; give support to the on-field referee (when required)',
                        description: 'Keep up with play &amp; give support to the on-field referee (when required)',
                        required: false,
                        proLinks: []
                    }
                    ]
                },
                {
                    name: 'Communications',
                    description: 'Description of Signal',
                    requirement: 'MAJORITY_REQUIRED',
                    required: false,
                    skills: [{
                            name: 'Handle conflict situations with some confidence',
                            description: 'Handle conflict situations with some confidence',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Establish clear & audible communication with players',
                            description: 'Establish clear & audible communication with players',
                            required: false,
                            proLinks: []
                        }
                    ]
                },
                {
                    name: 'Scorecard procedure',
                    description: 'Description of Signal',
                    requirement: 'MAJORITY_REQUIRED',
                    required: false,
                    skills: [{
                            name: 'Ensure the scorecard is correctly completed',
                            description: 'Ensure the scorecard is correctly completed',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Mark the scorecard after touchdowns',
                            description: 'Mark the scorecard after touchdowns',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Check the score with the team captains',
                            description: 'Check the score with the team captains',
                            required: false,
                            proLinks: []
                        }
                    ]
                },
                {
                    name: 'Rulings',
                    description: 'Rulings',
                    requirement: 'MAJORITY_REQUIRED',
                    required: false,
                    skills: [{
                        name: 'Display an adequate knowledge with consistent rulings',
                        description: 'Display an adequate knowledge with consistent rulings',
                        required: false,
                        proLinks: []
                    }]
                }
            ],
            requirement: 'MAJORITY_REQUIRED'
        },









        {
            id: 'AUS1',
            version: 0,
            creationDate: new Date(),
            lastUpdate: new Date(),
            dataStatus: 'NEW',
            name: 'AUS 2',
            description: 'AUS - Referee level 2',
            level: 'AUS_2',
            backgroundColor: '#7030a0',
            color: 'white',
            skillSets: [
                {
                    name: 'Pre game duties',
                    description: 'Description of Pre game duties',
                    requirement: 'MAJORITY_REQUIRED',
                    required: true,
                    skills: [{
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
                            name: 'Conferred with their buddy referee(s)',
                            description: 'Conferred with their buddy referee(s)',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Checked the field and checked the players',
                            description: '',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Have a confident demeanour',
                            description: 'Have a confident demeanour',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Have a correct, clean and tidy uniform',
                            description: 'Have a correct, clean and tidy uniform',
                            required: false,
                            proLinks: []
                        }
                    ]
                },
                {
                    name: 'Signal',
                    description: 'Does the referee correctly demonstrate the following signals during a game, or when asked? Correctly means: clear and correct with crisp delivery, given with authority, correct stance and posture and performed mainly on the run to indicate the mark quickly. Note: if not demonstrated on-field, test the referee off-field after the game.',
                    requirement: 'MAJORITY_REQUIRED',
                    required: false,
                    skills: [
                        {
                            name: 'Play on',
                            description: 'Signal Play on',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Incorrect tap',
                            description: 'Signal Incorrect tap',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Incorrect rollball',
                            description: 'Incorrect rollball',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Offside 5m',
                            description: 'Offside 5m',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Offside 10m',
                            description: 'Offside 10m',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Penalty for obstruction',
                            description: 'Signal Penalty for obstruction',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Penalty for over physical play',
                            description: 'Signal Penalty for over physical play',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Penalty for disputing decisions',
                            description: 'Signal Penalty for disputing decisions',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Player dismissed for a periode of time',
                            description: 'Player dismissed for a periode of time',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Player dismissed for remainder of the game',
                            description: 'Player dismissed for remainder of the game',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Brief verbal explanation linked to signal to aid understanding',
                            description: 'Brief verbal explanation linked to signal to aid understanding',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'WHISTLE - Does the referee have an audible whistle tone and display tone variations',
                            description: 'WHISTLE - Does the referee have an audible whistle tone and display tone variations',
                            required: false,
                            proLinks: []
                        }
                    ]
                },
                {
                    name: 'Control, positioning, fitness',
                    description: 'Control, positioning, fitness',
                    requirement: 'MAJORITY_REQUIRED',
                    required: true,
                    skills: [{
                            name: 'Keep and mark a consistent 5 metres',
                            description: 'Keep and mark a consistent 5 metres',
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'Control the 10 metres (following the tap)',
                            description: 'Control the 10 metres (following the tap)',
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'Keep eyes on the ball &amp; move with the ball to be in the next desired position',
                            description: 'Keep eyes on the ball &amp; move with the ball to be in the next desired position',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Consistently control the rollball (no interference)',
                            description: 'Consistently control the rollball (no interference)',
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'See touches & keep out of way on the score line',
                            description: 'See touches & keep out of way on the score line',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Consistently control heavy touches',
                            description: 'Consistently control heavy touches',
                            required: true,
                            proLinks: []
                        }
                    ]
                },
                {
                    name: 'Fitness',
                    description: 'Description of Signal',
                    requirement: 'MAJORITY_REQUIRED',
                    required: true,
                    skills: [{
                            name: 'Sprint interchanges, stays with play if ball is spun wide',
                            description: 'Sprint interchanges, stays with play if ball is spun wide',
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'Sprint change of possession (i.e. 5 metre to 5 metre)',
                            description: 'Sprint change of possession (i.e. 5 metre to 5 metre)',
                            required: true,
                            proLinks: []
                        }
                    ]
                },
                {
                    name: 'Refereeing system',
                    description: 'Description of Signal',
                    requirement: 'MAJORITY_REQUIRED',
                    required: false,
                    skills: [{
                            name: 'Interchange correctly',
                            description: 'Interchange correctly',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Keep up with play &amp; give support to the on-field referee (when required)',
                            description: 'Keep up with play &amp; give support to the on-field referee (when required)',
                            required: false,
                            proLinks: []
                        }
                    ]
                },
                {
                    name: 'Communications',
                    description: 'Communications',
                    requirement: 'MAJORITY_REQUIRED',
                    required: false,
                    skills: [
                        {
                            name: 'Establish clear &amp audible communication with players',
                            description: 'Establish clear &amp audible communication with players',
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'Use verbal communications on the run to aid game control',
                            description: 'Use verbal communications on the run to aid game control',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Display adequate control at the scoreline',
                            description: 'Display adequate control at the scoreline',
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'Handle conflict situations with confidence',
                            description: 'Handle conflict situations with confidence',
                            required: true,
                            proLinks: []
                        }
                    ]
                },
                {
                    name: 'Rulings',
                    description: 'Description of Signal',
                    requirement: 'MAJORITY_REQUIRED',
                    required: true,
                    skills: [{
                            name: 'Display an adequate knowledge with consistent rulings',
                            description: 'Display an adequate knowledge with consistent rulings',
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'Correctly and consistently rule on late and forward passes',
                            description: 'Correctly and consistently rule on late and forward passes',
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'Ensure the rollball is performed on the mark',
                            description: 'Ensure the rollball is performed on the mark',
                            required: true,
                            proLinks: []
                        }
                    ]
                }
            ],
            requirement: 'MAJORITY_REQUIRED'
        },





        {
            id: 'AUS3',
            version: 0,
            creationDate: new Date(),
            lastUpdate: new Date(),
            dataStatus: 'NEW',
            name: 'AUS 3',
            description: 'AUS - Referee level 3',
            level: 'AUS_3',
            backgroundColor: '#92d050',
            color: 'white',
            skillSets: [
                {
                    name: 'Game Awareness and Positioning',
                    description: 'Game Awareness and Positioning',
                    requirement: 'MAJORITY_REQUIRED',
                    required: true,
                    skills: [{
                            name: 'Demonstrates a good knowledge of attack strategy, and positions accordingly in general play',
                            description: 'Demonstrates a good knowledge of attack strategy, and positions accordingly in general play',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Keeps eyes on the ball and moves with the ball to be in the next desired position',
                            description: 'Keeps eyes on the ball and moves with the ball to be in the next desired position',
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'Is aware of and manages loose players well',
                            description: 'Is aware of and manages loose players well',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Checks both sides for shooter(s), manages and communicates appropriately ',
                            description: 'Checks both sides for shooter(s), manages and communicates appropriately ',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Has a physical presence in the 5m line',
                            description: 'Has a physical presence in the 5m line',
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'Sets the 5m line consistently ',
                            description: 'Sets the 5m line consistently ',
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'Sprints the change of possession (i.e. 5 m to 5 m)',
                            description: 'Sprints the change of possession (i.e. 5 m to 5 m)',
                            required: true,
                            proLinks: []
                        }
                    ]
                },
                {
                    name: 'Game Management',
                    description: 'Game Management',
                    requirement: 'MAJORITY_REQUIRED',
                    required: false,
                    skills: [
                        {
                            name: 'Manages the defensive player who makes the touch to an on-side position well and at the appropriate time',
                            description: 'Manages the defensive player who makes the touch to an on-side position well and at the appropriate time',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Consistently manages/controls the roll ball (no interference)',
                            description: 'Consistently manages/controls the roll ball (no interference)',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Manages the defensive players on the 5m and 10m (following the tap)',
                            description: 'Manages the defensive players on the 5m and 10m (following the tap)',
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'Played some advantage through pro-active/early communication to keep game flowing',
                            description: 'Played some advantage through pro-active/early communication to keep game flowing',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Manages physical play and takes appropriate action as and when necessary',
                            description: 'Manages physical play and takes appropriate action as and when necessary',
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
                            name: 'Clear, concise signals, whistle and explanations given with and for decisions so off-field referees can react quickly and set up the defensive line',
                            description: 'Clear, concise signals, whistle and explanations given with and for decisions so off-field referees can react quickly and set up the defensive line',
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'Is not over officious or over referee the game with pedantic rulings',
                            description: 'Is not over officious or over referee the game with pedantic rulings',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Establishes clear and audible communication with players',
                            description: 'Establishes clear and audible communication with players',
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'Displays an adequate knowledge of the rules and their application to the game',
                            description: 'Displays an adequate knowledge of the rules and their application to the game',
                            required: true,
                            proLinks: []
                        }
                    ]
                },
                {
                    name: 'Team Work and Communication',
                    description: 'Team Work and Communication',
                    requirement: 'MAJORITY_REQUIRED',
                    required: false,
                    skills: [
                        {
                            name: 'Sets a 5m line reference point from off field position consistently ',
                            description: 'Sets a 5m line reference point from off field position consistently ',
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'Provides support to on-field referee',
                            description : 'Provides support to on-field referee',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Builds a rapport with wingers and links to enhance teamwork',
                            description : 'Builds a rapport with wingers and links to enhance teamwork',
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'Communicates with realigning players (defenders) to assist on-field referee with 5m control. ',
                            description : 'Communicates with realigning players (defenders) to assist on-field referee with 5m control. ',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Communicates with the on field referee to keep players moving forward, off the scoreline',
                            description : 'Communicates with the on field referee to keep players moving forward, off the scoreline',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Is supportive and in sync with  referee team decisions ',
                            description : 'Is supportive and in sync with  referee team decisions ',
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'Adopts appropriate off field positions to assist with decision making',
                            description : 'Adopts appropriate off field positions to assist with decision making',
                            required: false,
                            proLinks: []
                        }
                    ]
                },
                {
                    name: 'Referee Systems',
                    description: 'Referee Systems',
                    requirement: 'MAJORITY_REQUIRED',
                    required: false,
                    skills: [
                        {
                            name: 'Interchanges made with confidence ',
                            description: 'Interchanges made with confidence ',
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'Communicates well on field entry',
                            description: 'Communicates well on field entry',
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'Demonstrates appropriate field entry positioning and establishes the 5m line early/quickly',
                            description: 'Demonstrates appropriate field entry positioning and establishes the 5m line early/quickly',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Demonstrates an awareness of the sub box and manages players if required',
                            description: 'Demonstrates an awareness of the sub box and manages players if required',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Exits field at an angle to ensure the oncoming referee can take early control',
                            description: 'Exits field at an angle to ensure the oncoming referee can take early control',
                            required: false,
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
                    required: false,
                    skills: [{
                            name: 'Is close to Touchdown situations and has a clear view of the ball and touches at and behind the scoreline',
                            description: 'Is close to Touchdown situations and has a clear view of the ball and touches at and behind the scoreline',
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'Demonstrates a knowledge of attack strategy, and positions accordingly on scoreline',
                            description: 'Demonstrates a knowledge of attack strategy, and positions accordingly on scoreline',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Responds to the long ball, moves accordingly to maintain sight and good proximity to the ball',
                            description: 'Responds to the long ball, moves accordingly to maintain sight and good proximity to the ball',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Manages defenders within 5m of the scoreline (standoff) well',
                            description: 'Manages defenders within 5m of the scoreline (standoff) well',
                            required: false,
                            proLinks: []
                        }
                    ]
                }
            ],
            requirement: 'ALL_REQUIRED'
        },





        {
            id: 'AUS4',
            version: 0,
            creationDate: new Date(),
            lastUpdate: new Date(),
            dataStatus: 'NEW',
            name: 'AUS 4',
            level: 'AUS_4',
            description: 'AUS - Referee level 4',
            backgroundColor: '#0000ff',
            color: 'white',
            skillSets: [
                {
                    name: 'Game Awareness and Positioning',
                    description: 'Game Awareness and Positioning',
                    requirement: 'MAJORITY_REQUIRED',
                    required: false,
                    skills: [
                        {
                            name: 'Demonstrates a good knowledge of attack strategy, and positions accordingly in general play',
                            description: 'Demonstrates a good knowledge of attack strategy, and positions accordingly in general play',
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'Keeps eyes on the ball and moves with the ball to be in the next desired position',
                            description: 'Keeps eyes on the ball and moves with the ball to be in the next desired position',
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'Is aware of and manages loose players consistently',
                            description: 'Is aware of and manages loose players consistently',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Checks both sides for shooter(s), manages and communicates appropriately ',
                            description: 'Checks both sides for shooter(s), manages and communicates appropriately ',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Has a physical presence in the 5m line',
                            description: 'Has a physical presence in the 5m line',
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'Sets the 5m line consistently ',
                            description: 'Sets the 5m line consistently ',
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
                    name: 'Game Management',
                    description: 'Game Management',
                    requirement: 'MAJORITY_REQUIRED',
                    required: false,
                    skills: [
                        {
                            name: 'Manages the defensive player who makes the touch  to an on-side position well and at the appropriate time',
                            description: 'Manages the defensive player who makes the touch to an on-side position well and at the appropriate time',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Consistently manages/controls the roll ball (no interference)',
                            description: 'Consistently manages/controls the roll ball (no interference)',
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'Manages the defensive players on the 5m and 10m (following the tap), manages off side players in drives, is aware of player prioritisation',
                            description: 'Manages the defensive players on the 5m and 10m (following the tap), manages off side players in drives, is aware of player prioritisation',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Played some advantage through pro-active/early communication to keep game flowing',
                            description: 'Played some advantage through pro-active/early communication to keep game flowing',
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'Manages physical play and takes appropriate action as and when necessary',
                            description: 'Manages physical play and takes appropriate action as and when necessary',
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
                            name: 'Clear, concise signals, whistle and explanations given with and for decisions so off-field referees can react quickly and set up the defensive line',
                            description: 'Clear, concise signals, whistle and explanations given with and for decisions so off-field referees can react quickly and set up the defensive line',
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'Is not over officious or over referee the game with pedantic rulings',
                            description: 'Is not over officious or over referee the game with pedantic rulings',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Establishes clear and audible communication with players',
                            description: 'Establishes clear and audible communication with players',
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'Displays an adequate knowledge of the rules and their application to the game',
                            description: 'Displays an adequate knowledge of the rules and their application to the game',
                            required: true,
                            proLinks: []
                        }
                    ]
                },
                {
                    name: 'Team Work and Communication',
                    description: 'Team Work and Communication',
                    requirement: 'MAJORITY_REQUIRED',
                    required: false,
                    skills: [
                        {
                            name: 'Consistently sets a 5m line reference point from off field position',
                            description: 'Consistently sets a 5m line reference point from off field position',
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'Provides support to on-field referee',
                            description : 'Provides support to on-field referee',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Builds a good rapport with wingers and links to enhance teamwork',
                            description : 'Builds a good rapport with wingers and links to enhance teamwork',
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'Communicates with realigning players (defenders) to assist on-field referee with 5m control. ',
                            description : 'Communicates with realigning players (defenders) to assist on-field referee with 5m control. ',
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'Communicates effectively with on field referee to keep players moving forward, off the scoreline',
                            description : 'Communicates effectively with on field referee to keep players moving forward, off the scoreline',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Is supportive and in sync with referee team decisions, demonstrates appropriate leadership',
                            description : 'Is supportive and in sync with referee team decisions, demonstrates appropriate leadership',
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'Adopts appropriate off field positions to assist with decision making',
                            description : 'Adopts appropriate off field positions to assist with decision making',
                            required: true,
                            proLinks: []
                        }
                    ]
                },
                {
                    name: 'Referee Systems',
                    description: 'Referee Systems',
                    requirement: 'MAJORITY_REQUIRED',
                    required: false,
                    skills: [
                        {
                            name: 'Interchanges made with confidence, shares the game workload, initiates the interchanges',
                            description: 'Interchanges made with confidence, shares the game workload, initiates the interchanges',
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'Communicates effectively on field entry, uses options to eliminate penalties on entry',
                            description: 'Communicates effectively on field entry, uses options to eliminate penalties on entry',
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'Demonstrates good field entry positioning, uses short side if appropriate, establishes the 5m line early/quickly',
                            description: 'Demonstrates good field entry positioning, uses short side if appropriate, establishes the 5m line early/quickly',
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'Aware of player rotation from the sub box and reacts accordingly to eliminate game chase',
                            description: 'Aware of player rotation from the sub box and reacts accordingly to eliminate game chase',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Exits field at an angle to ensure the oncoming referee can take early control',
                            description: 'Exits field at an angle to ensure the oncoming referee can take early control',
                            required: false,
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
                    required: false,
                    skills: [{
                            name: 'Is close to Touchdown situations and has a clear view of the ball and touches at and behind the scoreline, <strong>is aware of set plays and is well positioned for all scoring opportunities</strong>',
                            description: 'Is close to Touchdown situations and has a clear view of the ball and touches at and behind the scoreline, <strong>is aware of set plays and is well positioned for all scoring opportunities</strong>',
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'Demonstrates a good knowledge of attack strategy, and positions accordingly on scoreline',
                            description: 'Demonstrates a knowledge of attack strategy, and positions accordingly on scoreline',
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
                            required: false,
                            proLinks: []
                        }
                    ]
                }
            ],
            requirement: 'ALL_REQUIRED'
        },



        {
            id: 'AUS5',
            version: 0,
            creationDate: new Date(),
            lastUpdate: new Date(),
            dataStatus: 'NEW',
            name: 'AUS 5',
            level: 'AUS_5',
            description: 'AUS - Referee level 5',
            backgroundColor: 'red',
            color: 'white',
            skillSets: [
                {
                    name: 'Game Awareness and Positioning',
                    description: 'Game Awareness and Positioning',
                    requirement: 'MAJORITY_REQUIRED',
                    required: false,
                    skills: [
                        {
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
                    required: false,
                    skills: [
                        {
                            name: 'Manages the defensive player who makes the touch to an on-side position early and allows game to flow',
                            description: 'Manages the defensive player who makes the touch to an on-side position early and allows game to flow',
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
                            name: 'Is supportive and in sync with referee team decisions, demonstrates appropriate leadership ',
                            description: 'Is supportive and in sync with referee team decisions, demonstrates appropriate leadership ',
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
                    required: false,
                    skills: [
                        {
                            name: 'Interchanges made with confidence, shares the game workload, is in a change position and initiates the interchanges',
                            description: 'Interchanges made with confidence, shares the game workload, is in a change position and initiates the interchanges',
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
                    required: false,
                    skills: [
                        {
                            name: 'Is close to Touchdown situations and has a clear view of the ball and touches at and behind the scoreline, <strong>is aware of set plays and is well positioned for all scoring opportunities</strong>',
                            description: 'Is close to Touchdown situations and has a clear view of the ball and touches at and behind the scoreline, <strong>is aware of set plays and is well positioned for all scoring opportunities</strong>',
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
            id: 'AUS6',
            version: 0,
            creationDate: new Date(),
            lastUpdate: new Date(),
            dataStatus: 'NEW',
            name: 'AUS 6',
            level: 'AUS_6',
            description: 'AUS - Referee level 6',
            backgroundColor: 'black',
            color: 'white',
            skillSets: [
                {
                    name: 'Game Awareness and Positioning',
                    description: 'Game Awareness and Positioning',
                    requirement: 'MAJORITY_REQUIRED',
                    required: false,
                    skills: [
                        {
                            name: 'Demonstrates an excellent knowledge of attack strategy, and positions accordingly in general play',
                            description: 'Demonstrates a very good knowledge of attack strategy, and positions accordingly in general play',
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
                    required: false,
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
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'Manages the off side players in drives, is aware of player prioritisation',
                            description: 'Manages the off side players in drives, is aware of player prioritisation',
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
                            name: 'Consistently sets a 5m line reference point from off field position',
                            description: 'Consistently sets a 5m line reference point from off field position',
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'Provides consistent and very effective support to on-field referee',
                            description: 'Provides consistent and very effective support to on-field referee',
                            required: false,
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
                            name: 'Communicates very effectively with on field referee to keep players moving forward, off the scoreline',
                            description: 'Communicates very effectively with on field referee to keep players moving forward, off the scoreline',
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
                            name: 'Adopts excellent off field positions to assist with decision making',
                            description: 'Adopts excellent off field positions to assist with decision making',
                            required: true,
                            proLinks: []
                        }
                    ]
                },
                {
                    name: 'Referee Systems',
                    description: 'Referee Systems',
                    requirement: 'MAJORITY_REQUIRED',
                    required: false,
                    skills: [
                        {
                            name: 'Interchanges made with confidence, shares the game workload, initiates the interchanges ',
                            description: 'Interchanges made with confidence, shares the game workload, initiates the interchanges ',
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'Communicates very effectively on field entry, uses options to eliminate penalties on entry, positively influences player actions',
                            description: 'Communicates very effectively on field entry, uses options to eliminate penalties on entry, positively influences player actions',
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
                    required: false,
                    skills: [
                        {
                            name: 'Is close to Touchdown situations and has a clear view of the ball and touches at and behind the scoreline, <strong>is aware of set plays and is well positioned for all scoring opportunities</strong>',
                            description: 'Is close to Touchdown situations and has a clear view of the ball and touches at and behind the scoreline, <strong>is aware of set plays and is well positioned for all scoring opportunities</strong>',
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'Demonstrates an excellent knowledge of attack strategy, and positions accordingly on scoreline',
                            description: 'Demonstrates an excellent knowledge of attack strategy, and positions accordingly on scoreline',
                            required: true,
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
        }

        ];
