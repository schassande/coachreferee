import { SkillProfile } from '../../app/model/skill';

export const LEVELS_EURO: SkillProfile[] = [
        {
            id: 'EURO1',
            version: 0,
            creationDate: new Date(),
            lastUpdate: new Date(),
            dataStatus: 'NEW',
            name: 'EURO 1',
            level: 'EURO_1',
            backgroundColor: 'blue',
            color: 'white',
            description: 'EFT - Referee level1',
            skillSets: [{
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
                            name: 'Does the referee have an appropriate, clean and tidy uniform?',
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
                            name: '6 again',
                            description: 'Signal 6 again',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Penalty',
                            description: 'Signal Penalty',
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
                            name: 'End of play',
                            description: 'Signal End of play',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Brief verbal explanation linked to signal to aid player understanding',
                            description: 'Brief verbal explanation linked to signal to aid player understanding',
                            required: true,
                            proLinks: []
                        }
                    ]
                },
                {
                    name: 'Control, positioning, fitness',
                    description: 'Description of Signal',
                    requirement: 'MAJORITY_REQUIRED',
                    required: true,
                    skills: [{
                            name: 'Set a consistent 5m and attempt to verbally control players',
                            description: 'Set a consistent 5m and attempt to verbally control players',
                            required: true,
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
                            name: 'Make reasonable effort required to keep up with the game?',
                            description: 'Make reasonable effort required to keep up with the game?',
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
                        name: 'Keep up with play while on the sideline and give support to the on-field referee (when required)',
                        description: 'Keep up with play while on the sideline and give support to the on-field referee (when required)',
                        required: false,
                        proLinks: []
                    }]
                },
                {
                    name: 'Communications',
                    description: 'Description of Signal',
                    requirement: 'MAJORITY_REQUIRED',
                    required: true,
                    skills: [{
                            name: 'Have an audible whistle',
                            description: 'Have an audible whistle',
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'Establish audible and clear verbal communication with players',
                            description: 'Establish audible and clear verbal communication with players',
                            required: true,
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
                            name: 'Check the score with team captains at the end of the game',
                            description: 'Check the score with team captains at the end of the game',
                            required: false,
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
                    }]
                }
            ],
            requirement: 'MAJORITY_REQUIRED'
        },









        {
            id: 'EURO2',
            version: 0,
            creationDate: new Date(),
            lastUpdate: new Date(),
            dataStatus: 'NEW',
            name: 'EURO 2',
            level: 'EURO_2',
            description: 'EFT - Referee level 2',
            backgroundColor: 'green',
            color: 'white',
            skillSets: [{
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
                            description: 'Checked the field and checked the players',
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
                    required: true,
                    skills: [{
                            name: 'Level 1 signals delivered in-game? (please note all signals observed)',
                            description: 'Level 1 signals delivered in-game? (please note all signals observed)',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Play on',
                            description: 'Signal Play on',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Incorrect tap – 4 variations – not touched with foot, attacker offside, not on the mark, ball not released',
                            description: 'Signal Incorrect tap – 4 variations – not touched with foot, attacker offside, not on the mark, ball not released',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Incorrect rollball – 3 variations – outside legs, not square, rolled more than 1m',
                            description: 'Incorrect rollball – 3 variations – outside legs, not square, rolled more than 1m',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Penalty – rollball performed past the mark',
                            description: 'Penalty – rollball performed past the mark',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Penalty – offside – 2 variations – at 5m, at 10m',
                            description: 'Penalty – offside – 2 variations – at 5m, at 10m',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Penalty – obstruction',
                            description: 'Signal Penalty – obstruction',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Penalty – physical play',
                            description: 'Signal Penalty – physical play',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Penalty – disputing decisions',
                            description: 'Signal Penalty – disputing decisions',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Penalty – falsely claimed (phantom) touch',
                            description: 'Signal Penalty – falsely claimed (phantom) touch',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Penalty – voluntary rollball',
                            description: 'Signal Penalty – voluntary rollball',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Player replacement option (forced substitution)',
                            description: 'Player replacement option (forced substitution)',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Player dismissed for – 2 variations – period of time (sin bin), remainder of game',
                            description: 'Player dismissed for – 2 variations – period of time (sin bin), remainder of game',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Support referee discreet signals – 4 variations – agreement | forward pass | touch | ball to ground',
                            description: 'Support referee discreet signals – 4 variations – agreement | forward pass | touch | ball to ground',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Brief verbal explanation given together with signal to aid player understanding',
                            description: 'Brief verbal explanation given together with signal to aid player understanding',
                            required: true,
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
                            name: 'Set a consistent 5m and achieve reasonable player control',
                            description: 'nominate and get a response from offside defenders',
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'Indicate 10m at the tap and attempt to control it',
                            description: 'Indicate 10m at the tap and attempt to control it',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Keep eyes on the ball at all times and move with the ball to be in the next desired position',
                            description: 'Keep “eyes on the ball” at all times and move with the ball to be in the next desired position',
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
                            name: 'Position to see touches and keep out of the way on the scoreline',
                            description: 'Position to see touches and keep out of the way on the scoreline',
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
                    name: 'Fitness',
                    description: 'Description of Signal',
                    requirement: 'MAJORITY_REQUIRED',
                    required: true,
                    skills: [{
                            name: 'Stay with play if the ball goes wide',
                            description: 'Stay with play if the ball goes wide',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Get to the touchdown point as the ball is grounded or use best running angle to allow best view of touchdown',
                            description: 'Get to the touchdown point as the ball is grounded or use best running angle to allow best view of touchdown',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Sprint on changes of possession',
                            description: 'Sprint on changes of possession',
                            required: false,
                            proLinks: []
                        }
                    ]
                },
                {
                    name: 'Refereeing system',
                    description: 'Description of Signal',
                    requirement: 'MAJORITY_REQUIRED',
                    required: true,
                    skills: [{
                            name: 'Interchange correctly – 2 situations – in open play, change of possession near sideline',
                            description: 'Interchange correctly – 2 situations – in open play, change of possession near sideline',
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'Keep up with play while on the sideline and give support to the on-field referee (when required)',
                            description: 'Keep up with play while on the sideline and give support to the on-field referee (when required)',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Perform the correct (on-field) touchdown procedure',
                            description: 'Perform the correct (on-field) touchdown procedure',
                            required: false,
                            proLinks: []
                        }
                    ]
                },
                {
                    name: 'Communications',
                    description: 'Communications',
                    requirement: 'MAJORITY_REQUIRED',
                    required: true,
                    skills: [{
                            name: 'Have an audible whistle and display variation in blast length and tone',
                            description: 'Have an audible whistle and display variation in blast length and tone',
                            required: true,
                            proLinks: []
                        },
                        {
                            name: 'Establish audible and clear verbal communication with players',
                            description: 'Establish audible and clear verbal communication with players',
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
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Ensure the rollball is performed on the mark',
                            description: 'Ensure the rollball is performed on the mark',
                            required: false,
                            proLinks: []
                        }
                    ]
                }
            ],
            requirement: 'MAJORITY_REQUIRED'
        },





        {
            id: 'EURO3',
            version: 0,
            creationDate: new Date(),
            lastUpdate: new Date(),
            dataStatus: 'NEW',
            name: 'EURO 3',
            level: 'EURO_3',
            description: 'EFT - Referee level 3',
            backgroundColor: 'yellow',
            color: 'black',
            skillSets: [{
                    name: 'Control consistently',
                    description: 'Control',
                    requirement: 'MAJORITY_REQUIRED',
                    required: true,
                    skills: [{
                            name: '<strong>Whistle technique</strong> aids control (audible, fluctuation in tones, authority)',
                            description: '<strong>Whistle technique</strong> aids control (audible, fluctuation in tones, authority)',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>5 &amp; 10 metres</strong> set & control (<strong>checks both sides of rollball, consistent defensive lines</strong>, identifies <strong>shooters</strong>)',
                            description: '<strong>5 &amp; 10 metres</strong> set & control (<strong>checks both sides of rollball, consistent defensive lines</strong>, identifies <strong>shooters</strong>)',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Change of possession</strong> – 5 metre to 5 metre <strong>urgency</strong> and control',
                            description: '<strong>Change of possession</strong> – 5 metre to 5 metre <strong>urgency</strong> and control',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Rollball<strong> – control (the mark, the method and no interference)',
                            description: '<strong>Rollball<strong> – control (the mark, the method and no interference)',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Scoreline</strong> – most times gets early intervention and <i>good</i> <strong>advantage/control</strong>',
                            description: '<strong>Scoreline</strong> – most times gets early intervention and <i>good</i> <strong>advantage/control</strong>',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Physical play</strong> – acts early to control over-vigorous touches, sledging and foul play',
                            description: '<strong>Physical play</strong> – acts early to control over-vigorous touches, sledging and foul play',
                            required: false,
                            proLinks: []
                        }
                    ]
                },
                {
                    name: 'Positioning consistently',
                    description: 'Positioning consistently',
                    requirement: 'MAJORITY_REQUIRED',
                    required: true,
                    skills: [{
                            name: '<strong>Proximity to play</strong> – keeps eyes on the ball and <strong>moves with the ball</strong> to be in the next appropriate position',
                            description: '<strong>Proximity to play</strong> – keeps eyes on the ball and <strong>moves with the ball</strong> to be in the next appropriate position',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Reads play</strong> – is attempting to identify 2nd phase play and <strong>anticipate</strong> play well, good movement between positions',
                            description: '<strong>Reads play</strong> – is attempting to identify 2nd phase play and <strong>anticipate</strong> play well, good movement between positions',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Field width</strong> – almost always uses full field width (aids interchanges and player control)',
                            description: '<strong>Field width</strong> – almost always uses full field width (aids interchanges and player control)',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Playmakers</strong> – usually <strong>able to identify</strong> and position accordingly for good control',
                            description: '<strong>Playmakers</strong> – usually <strong>able to identify</strong> and position accordingly for good control',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Touchdown proximity</strong> - gets to the touchdown point as the ball is grounded or uses best running angle to allow best view',
                            description: '<strong>Touchdown proximity</strong> - gets to the touchdown point as the ball is grounded or uses best running angle to allow best view',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Fitness</strong> – good, good recovery',
                            description: '<strong>Fitness</strong> – good, good recovery',
                            required: false,
                            proLinks: []
                        }
                    ]
                },
                {
                    name: 'Communication - verbal consistently',
                    description: 'Communication - verbal',
                    requirement: 'MAJORITY_REQUIRED',
                    required: true,
                    skills: [{
                            name: '<strong>Verbal communication – adds value</strong> to the control of the game (<strong>content</strong> and <strong>timing</strong> to <strong>effectively control offside players and/or shooters, early, clear and audible</strong>)',
                            description: '<strong>Verbal communication – adds value</strong> to the control of the game (<strong>content</strong> and <strong>timing</strong> to <strong>effectively control offside players and/or shooters, early, clear and audible</strong>)',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Conflict resolution</strong> – <i>good</i> methods to reduce/control conflict situations',
                            description: '<strong>Conflict resolution</strong> – <i>good</i> methods to reduce/control conflict situations',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Good rapport</strong> – is able to establish with players and coaches',
                            description: '<strong>Good rapport</strong> – is able to establish with players and coaches',
                            required: false,
                            proLinks: []
                        }
                    ]
                },
                {
                    name: 'Communication - non verbal consistently',
                    description: 'Communication - non verbal',
                    requirement: 'MAJORITY_REQUIRED',
                    required: true,
                    skills: [{
                            name: 'Signals – clear and correct, timely and crisp delivery, with authority, correct stance and posture, mainly performed on the run, indicates the mark quickly, brief verbal instructions/explanations linked to signals to aid understanding',
                            description: 'Signals – clear and correct, timely and crisp delivery, with authority, correct stance and posture, mainly performed on the run, indicates the mark quickly, brief verbal instructions/explanations linked to signals to aid understanding',
                            required: false,
                            proLinks: []
                        }
                    ]
                },
                {
                    name: 'Refereeing system consistently',
                    description: 'Refereeing system consistently',
                    requirement: 'MAJORITY_REQUIRED',
                    required: true,
                    skills: [{
                            name: '<strong>Interchanges</strong> – selects the <strong>correct off-field position to enter</strong>, exists without obstructing players, <strong>exit angle is deep</strong> enough to allow incoming referee all positioning opportunities, able to interchange at scoreline if required',
                            description: '<strong>Interchanges</strong> – selects the <strong>correct off-field position to enter</strong>, exists without obstructing players, <strong>exit angle is deep</strong> enough to allow incoming referee all positioning opportunities, able to interchange at scoreline if required',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Field entry</strong> – keeps up with play on entry (<strong>not chasing the game</strong>, sets 5m, body square from entry, uses blind side option if available for early control)',
                            description: '<strong>Field entry</strong> – keeps up with play on entry (<strong>not chasing the game</strong>, sets 5m, body square from entry, uses blind side option if available for early control)',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Field entry communications</strong> – good verbal instructions on entry to control play or set up for ensuing plays',
                            description: '<strong>Field entry communications</strong> – good verbal instructions on entry to control play or set up for ensuing plays',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>2x2x2</strong> – keeps up with play, <strong>provides support</strong> when required without dominating, in line with defensive line, <strong>effective verbal contribution</strong> to control link and wing',
                            description: '<strong>2x2x2</strong> – keeps up with play, <strong>provides support</strong> when required without dominating, in line with defensive line, <strong>effective verbal contribution</strong> to control link and wing',
                            required: false,
                            proLinks: []
                        }
                    ]
                },
                {
                    name: 'Rulings consistently',
                    description: 'Rulings consistently',
                    requirement: 'MAJORITY_REQUIRED',
                    required: true,
                    skills: [{
                            name: '<strong>Knowledge and application</strong> – applies <strong>correct</strong> and <strong>consistent decisions</strong> in accordance with the playing rules of Touch, achieves <strong>appropriate game outcomes</strong>',
                            description: '<strong>Knowledge and application</strong> – applies <strong>correct</strong> and <strong>consistent decisions</strong> in accordance with the playing rules of Touch, achieves <strong>appropriate game outcomes</strong>',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Advantage</strong> – gains/allows good advantage',
                            description: '<strong>Advantage</strong> – gains/allows good advantage',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Referee influence</strong> – sound understanding of their influence on the game (is not over-officious)',
                            description: '<strong>Referee influence</strong> – sound understanding of their influence on the game (is not over-officious)',
                            required: false,
                            proLinks: []
                        }
                    ]
                },
                {
                    name: 'Confidence consistently',
                    description: 'Confidence consistently',
                    requirement: 'MAJORITY_REQUIRED',
                    required: true,
                    skills: [{
                            name: 'Handles conflict situations with confidence, has courage to make tough decisions in pressure situations',
                            description: 'Handles conflict situations with confidence, has courage to make tough decisions in pressure situations',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Displays a very <strong>confident</strong> demeanour – is not arrogant or authoritarian',
                            description: 'Displays a very <strong>confident</strong> demeanour – is not arrogant or authoritarian',
                            required: false,
                            proLinks: []
                        }
                    ]
                }
            ],
            requirement: 'ALL_REQUIRED'
        },




        {
            id: 'EURO4',
            version: 0,
            creationDate: new Date(),
            lastUpdate: new Date(),
            dataStatus: 'NEW',
            name: 'EURO 4',
            level: 'EURO_4',
            description: 'EFT - Referee level 4',
            backgroundColor: 'red',
            color: 'white',
            skillSets: [{
                    name: 'Control consistently',
                    description: 'Control',
                    requirement: 'MAJORITY_REQUIRED',
                    required: true,
                    skills: [{
                            name: '<strong>Whistle technique</strong> aids control (audible, fluctuation in tones, authority)',
                            description: '<strong>Whistle technique</strong> aids control (audible, fluctuation in tones, authority)',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>5 &amp; 10 metres</strong> set & control (<strong>checks both sides of rollball, consistent defensive lines</strong>, identifies <strong>shooters</strong>)',
                            description: '<strong>5 &amp; 10 metres</strong> set & control (<strong>checks both sides of rollball, consistent defensive lines</strong>, identifies <strong>shooters</strong>)',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Change of possession</strong> – 5 metre to 5 metre <strong>urgency</strong> and <strong>control</strong>',
                            description: '<strong>Change of possession</strong> – 5 metre to 5 metre <strong>urgency</strong> and control',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Rollball<strong> – control (the mark, the method and no interference)',
                            description: '<strong>Rollball<strong> – control (the mark, the method and no interference)',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Scoreline</strong> – early intervention allows very good <i>good</i> <strong>advantage/control</strong>',
                            description: '<strong>Scoreline</strong> – early intervention allows very good <i>good</i> <strong>advantage/control</strong>',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Physical play</strong> – acts early to control over-vigorous touches, sledging and foul play',
                            description: '<strong>Physical play</strong> – acts early to control over-vigorous touches, sledging and foul play',
                            required: false,
                            proLinks: []
                        }
                    ]
                },
                {
                    name: 'Positioning consistently',
                    description: 'Positioning consistently',
                    requirement: 'MAJORITY_REQUIRED',
                    required: true,
                    skills: [{
                            name: '<strong>Proximity to play</strong> – keeps “eyes on the ball” and <strong>moves with the ball</strong> to be in the next appropriate position',
                            description: '<strong>Proximity to play</strong> – keeps “eyes on the ball” and <strong>moves with the ball</strong> to be in the next appropriate position',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Reads play</strong> – identifies 2nd phase play and <strong>anticipate</strong> play well, good movement between positions',
                            description: '<strong>Reads play</strong> – identifies 2nd phase play and <strong>anticipate</strong> play well, good movement between positions',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Field width</strong> – almost always uses full field width (aids interchanges and player control)',
                            description: '<strong>Field width</strong> – almost always uses full field width (aids interchanges and player control)',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Playmakers – identifies</strong> and positions accordingly for very good control',
                            description: '<strong>Playmakers – identifies</strong> and positions accordingly for very good control',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Touchdown proximity</strong> - gets to the touchdown point as the ball is grounded or uses best running angle to allow best view',
                            description: '<strong>Touchdown proximity</strong> - gets to the touchdown point as the ball is grounded or uses best running angle to allow best view',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Fitness</strong> – very good, very good recovery',
                            description: '<strong>Fitness</strong> – very good, very good recovery',
                            required: false,
                            proLinks: []
                        }
                    ]
                },
                {
                    name: 'Communication - verbal consistently',
                    description: 'Communication - verbal',
                    requirement: 'MAJORITY_REQUIRED',
                    required: true,
                    skills: [{
                            name: '<strong>Verbal communication – adds value</strong> to the control of the game (<strong>content</strong> and <strong>timing</strong> to <strong>effectively control offside players and/or shooters, early, clear and audible</strong>)',
                            description: '<strong>Verbal communication – adds value</strong> to the control of the game (<strong>content</strong> and <strong>timing</strong> to <strong>effectively control offside players and/or shooters, early, clear and audible</strong>)',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Conflict resolution</strong> – <i>very good</i> methods to reduce/control conflict situations',
                            description: '<strong>Conflict resolution</strong> – <i>very good</i> methods to reduce/control conflict situations',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Good rapport</strong> – quickly establishes with players and coaches',
                            description: '<strong>Good rapport</strong> quickly establishes with players and coaches',
                            required: false,
                            proLinks: []
                        }
                    ]
                },
                {
                    name: 'Communication - non verbal consistently',
                    description: 'Communication - non verbal',
                    requirement: 'MAJORITY_REQUIRED',
                    required: true,
                    skills: [{
                            name: 'Signals – clear and correct, timely and crisp delivery, with authority, correct stance and posture, mainly performed on the run, indicates the mark quickly, brief verbal instructions/explanations linked to signals to aid understanding',
                            description: 'Signals – clear and correct, timely and crisp delivery, with authority, correct stance and posture, mainly performed on the run, indicates the mark quickly, brief verbal instructions/explanations linked to signals to aid understanding',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Body language</strong> – non confrontational',
                            description: '<strong>Body language</strong> – non confrontational',
                            required: false,
                            proLinks: []
                        }
                    ]
                },
                {
                    name: 'Refereeing system consistently',
                    description: 'Refereeing system consistently',
                    requirement: 'MAJORITY_REQUIRED',
                    required: true,
                    skills: [{
                            name: '<strong>Interchanges</strong> – selects the <strong>correct off-field position to enter</strong>, exists without obstructing players, <strong>exit angle is deep</strong> enough to allow incoming referee all positioning opportunities, able to interchange at scoreline if required',
                            description: '<strong>Interchanges</strong> – selects the <strong>correct off-field position to enter</strong>, exists without obstructing players, <strong>exit angle is deep</strong> enough to allow incoming referee all positioning opportunities, able to interchange at scoreline if required',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Field entry</strong> – early initiative and entry, keeps up with play on entry (<strong>not chasing the game</strong>, sets 5m, body square from entry, uses blind side option if available for early control)',
                            description: '<strong>Field entry</strong> – early initiative and entry, keeps up with play on entry (<strong>not chasing the game</strong>, sets 5m, body square from entry, uses blind side option if available for early control)',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Field entry communications</strong> – very good verbal instructions on entry to control play or set up for ensuing plays',
                            description: '<strong>Field entry communications</strong> – very good verbal instructions on entry to control play or set up for ensuing plays',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>2x2x2</strong> – keeps up with play, <strong>provides support</strong> when required without dominating, in line with defensive line, <strong>effective verbal contribution</strong> to control link and wing',
                            description: '<strong>2x2x2</strong> – keeps up with play, <strong>provides support</strong> when required without dominating, in line with defensive line, <strong>effective verbal contribution</strong> to control link and wing',
                            required: false,
                            proLinks: []
                        }
                    ]
                },
                {
                    name: 'Rulings consistently',
                    description: 'Rulings consistently',
                    requirement: 'MAJORITY_REQUIRED',
                    required: true,
                    skills: [{
                            name: '<strong>Knowledge and application</strong> – applies <strong>correct</strong> and <strong>consistent decisions</strong> in accordance with the playing rules of Touch, achieves <strong>appropriate game outcomes</strong>',
                            description: '<strong>Knowledge and application</strong> – applies <strong>correct</strong> and <strong>consistent decisions</strong> in accordance with the playing rules of Touch, achieves <strong>appropriate game outcomes</strong>',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Advantage</strong> – gains/allows very good advantage',
                            description: '<strong>Advantage</strong> – gains/allows very good advantage',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Referee influence</strong> – sound understanding of their influence on the game (is not over-officious)',
                            description: '<strong>Referee influence</strong> – sound understanding of their influence on the game (is not over-officious)',
                            required: false,
                            proLinks: []
                        }
                    ]
                },
                {
                    name: 'Confidence consistently',
                    description: 'Confidence consistently',
                    requirement: 'MAJORITY_REQUIRED',
                    required: true,
                    skills: [{
                            name: 'Handles conflict situations with confidence, has courage to make tough decisions in pressure situations',
                            description: 'Handles conflict situations with confidence, has courage to make tough decisions in pressure situations',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Displays a very <strong>confident</strong> demeanour – is not arrogant or authoritarian',
                            description: 'Displays a very <strong>confident</strong> demeanour – is not arrogant or authoritarian',
                            required: false,
                            proLinks: []
                        }
                    ]
                }
            ],
            requirement: 'ALL_REQUIRED'
        },









        {
            id: 'EURO5',
            version: 0,
            creationDate: new Date(),
            lastUpdate: new Date(),
            dataStatus: 'NEW',
            name: 'EURO 5',
            level: 'EURO_5',
            description: 'EFT - Referee level 5',
            backgroundColor: 'black',
            color: 'white',
            skillSets: [{
                    name: 'Control consistently',
                    description: 'Control',
                    requirement: 'MAJORITY_REQUIRED',
                    required: true,
                    skills: [{
                            name: '<strong>Whistle technique</strong> aids control (audible, fluctuation in tones, authority)',
                            description: '<strong>Whistle technique</strong> aids control (audible, fluctuation in tones, authority)',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>5 &amp; 10 metres</strong> set & control (<strong>checks both sides of rollball, consistent defensive lines</strong>, identifies <strong>shooters</strong>)',
                            description: '<strong>5 &amp; 10 metres</strong> set & control (<strong>checks both sides of rollball, consistent defensive lines</strong>, identifies <strong>shooters</strong>)',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Change of possession</strong> – 5 metre to 5 metre <strong>urgency</strong> and <strong>control</strong>',
                            description: '<strong>Change of possession</strong> – 5 metre to 5 metre <strong>urgency</strong> and control',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Rollball<strong> – control (the mark, the method and no interference)',
                            description: '<strong>Rollball<strong> – control (the mark, the method and no interference)',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Scoreline</strong> – early intervention allows optimum <i>good</i> <strong>advantage/control</strong>',
                            description: '<strong>Scoreline</strong> – early intervention allows optimum <i>good</i> <strong>advantage/control</strong>',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Physical play</strong> – acts early to control over-vigorous touches, sledging and foul play',
                            description: '<strong>Physical play</strong> – acts early to control over-vigorous touches, sledging and foul play',
                            required: false,
                            proLinks: []
                        }
                    ]
                },
                {
                    name: 'Positioning consistently',
                    description: 'Positioning consistently',
                    requirement: 'MAJORITY_REQUIRED',
                    required: true,
                    skills: [{
                            name: '<strong>Proximity to play</strong> – keeps “eyes on the ball” and <strong>moves with the ball</strong> to be in the next appropriate position, balanced body movement for maximum reaction to play',
                            description: '<strong>Proximity to play</strong> – keeps “eyes on the ball” and <strong>moves with the ball</strong> to be in the next appropriate position, balanced body movement for maximum reaction to play',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Reads play</strong> – identifies 2nd phase play and <strong>anticipate</strong> play extremely well, excellent movement between positions',
                            description: '<strong>Reads play</strong> – identifies 2nd phase play and <strong>anticipate</strong> play extremely well, excellent movement between positions',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Field width</strong> – almost always uses full field width (aids interchanges and player control)',
                            description: '<strong>Field width</strong> – almost always uses full field width (aids interchanges and player control)',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Playmakers – identifies</strong> and positions accordingly for optimum control',
                            description: '<strong>Playmakers – identifies</strong> and positions accordingly for optimum control',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Touchdown proximity</strong> - gets to the touchdown point as the ball is grounded or uses best running angle to allow best view',
                            description: '<strong>Touchdown proximity</strong> - gets to the touchdown point as the ball is grounded or uses best running angle to allow best view',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Fitness</strong> – outstanding, excellent recovery',
                            description: '<strong>Fitness</strong> – outstanding, excellent recovery',
                            required: false,
                            proLinks: []
                        }
                    ]
                },
                {
                    name: 'Communication - verbal consistently',
                    description: 'Communication - verbal',
                    requirement: 'MAJORITY_REQUIRED',
                    required: true,
                    skills: [{
                            name: '<strong>Verbal communication – adds value</strong> to the control of the game (<strong>content</strong> and <strong>timing</strong> to <strong>effectively control offside players and/or shooters, early, clear and audible</strong>)',
                            description: '<strong>Verbal communication – adds value</strong> to the control of the game (<strong>content</strong> and <strong>timing</strong> to <strong>effectively control offside players and/or shooters, early, clear and audible</strong>)',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Conflict resolution</strong> – <i>excellent</i> methods to reduce/control conflict situations',
                            description: '<strong>Conflict resolution</strong> – <i>excellent</i> methods to reduce/control conflict situations',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Good rapport</strong> – quickly establishes with players and coaches',
                            description: '<strong>Good rapport</strong> quickly establishes with players and coaches',
                            required: false,
                            proLinks: []
                        }
                    ]
                },
                {
                    name: 'Communication - non verbal consistently',
                    description: 'Communication - non verbal',
                    requirement: 'MAJORITY_REQUIRED',
                    required: true,
                    skills: [{
                            name: 'Signals – clear and correct, timely and crisp delivery, with authority, correct stance and posture, mainly performed on the run, indicates the mark quickly, brief verbal instructions/explanations linked to signals to aid understanding',
                            description: 'Signals – clear and correct, timely and crisp delivery, with authority, correct stance and posture, mainly performed on the run, indicates the mark quickly, brief verbal instructions/explanations linked to signals to aid understanding',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Body language</strong> – non confrontational',
                            description: '<strong>Body language</strong> – non confrontational',
                            required: false,
                            proLinks: []
                        }
                    ]
                },
                {
                    name: 'Refereeing system consistently',
                    description: 'Refereeing system consistently',
                    requirement: 'MAJORITY_REQUIRED',
                    required: true,
                    skills: [{
                            name: '<strong>Interchanges</strong> – selects the <strong>correct off-field position to enter</strong>, exists without obstructing players, <strong>exit angle is deep</strong> enough to allow incoming referee all positioning opportunities, able to interchange at scoreline if required',
                            description: '<strong>Interchanges</strong> – selects the <strong>correct off-field position to enter</strong>, exists without obstructing players, <strong>exit angle is deep</strong> enough to allow incoming referee all positioning opportunities, able to interchange at scoreline if required',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Field entry</strong> – early initiative and entry, keeps up with play on entry (<strong>not chasing the game</strong>, sets 5m, body square from entry, uses blind side option if available for early control)',
                            description: '<strong>Field entry</strong> – early initiative and entry, keeps up with play on entry (<strong>not chasing the game</strong>, sets 5m, body square from entry, uses blind side option if available for early control)',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Field entry communications</strong> – excellent verbal instructions on entry to control play or set up for ensuing plays',
                            description: '<strong>Field entry communications</strong> – excellent verbal instructions on entry to control play or set up for ensuing plays',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>2x2x2</strong> – keeps up with play, <strong>provides support</strong> when required without dominating, in line with defensive line, <strong>effective verbal contribution</strong> to control link and wing',
                            description: '<strong>2x2x2</strong> – keeps up with play, <strong>provides support</strong> when required without dominating, in line with defensive line, <strong>effective verbal contribution</strong> to control link and wing',
                            required: false,
                            proLinks: []
                        }
                    ]
                },
                {
                    name: 'Rulings consistently',
                    description: 'Rulings consistently',
                    requirement: 'MAJORITY_REQUIRED',
                    required: true,
                    skills: [{
                            name: '<strong>Knowledge and application</strong> – applies <strong>correct</strong> and <strong>consistent decisions</strong> in accordance with the playing rules of Touch, achieves <strong>appropriate game outcomes</strong>',
                            description: '<strong>Knowledge and application</strong> – applies <strong>correct</strong> and <strong>consistent decisions</strong> in accordance with the playing rules of Touch, achieves <strong>appropriate game outcomes</strong>',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Advantage</strong> – gains/allows maximum advantage',
                            description: '<strong>Advantage</strong> – gains/allows maximum advantage',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: '<strong>Referee influence</strong> – sound understanding of their influence on the game (is not over-officious)',
                            description: '<strong>Referee influence</strong> – sound understanding of their influence on the game (is not over-officious)',
                            required: false,
                            proLinks: []
                        }
                    ]
                },
                {
                    name: 'Confidence consistently',
                    description: 'Confidence consistently',
                    requirement: 'MAJORITY_REQUIRED',
                    required: true,
                    skills: [{
                            name: 'Handles conflict situations with confidence, has courage to make tough decisions in pressure situations',
                            description: 'Handles conflict situations with confidence, has courage to make tough decisions in pressure situations',
                            required: false,
                            proLinks: []
                        },
                        {
                            name: 'Displays a very <strong>confident</strong> demeanour – is not arrogant or authoritarian',
                            description: 'Displays a very <strong>confident</strong> demeanour – is not arrogant or authoritarian',
                            required: false,
                            proLinks: []
                        }
                    ]
                }
            ],
            requirement: 'ALL_REQUIRED'
        }

        ];
