import { AppSettingsService } from './AppSettingsService';
import { Firestore, query, where } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { RemotePersistentDataService } from './RemotePersistentDataService';
import { CoachingTemplate } from './../model/coaching';
import { ToastController } from '@ionic/angular';
import { Observable, mergeMap, of } from 'rxjs';
import { ResponseWithData } from './response';

@Injectable()
export class CoachingTemplateService extends RemotePersistentDataService<CoachingTemplate> {

    constructor(
      appSettingsService: AppSettingsService,
      db: Firestore,
      toastController: ToastController,
    ) {
        super(appSettingsService, db, toastController);
    }

    getLocalStoragePrefix() {
        return 'coaching-template';
    }

    getPriority(): number {
        return 5;
    }
    protected adjustFieldOnLoad(item: CoachingTemplate) {
    }
    public getCoachingTemplateByName(templateName: string): Observable<ResponseWithData<CoachingTemplate>> {
        return this.queryOne(query(this.getBaseQuery(), where('name', '==', templateName)));
    }
    public initialiseDefaultTemplates() {
        this.initialiseTemplate({
            id: '',
            creationDate: new Date(),
            dataStatus: 'NEW',
            lastUpdate: new Date(),
            version: 0,
            name: 'Ranking',
            topics: [
                { name: 'Team Work & Communication', description: '<ul style="text-align: left;"><li>Demonstrates a complete knowledge and understanding of Teamwork for appropriate game outcomes.</li><li>Is always in sync with the on field referee and always prepared for dual changes</li></ul>'},
                { name: 'Game Awareness', description: '<ul style="text-align: left;"><li>Has an understanding of drives relating to field position.</li><li>Understand Attacking styles.<br>Plays Early Advantage</li></ul>'},
                { name: '7m Management', description: '<ul style="text-align: left;"><li>Prioritizes game management for best game outcome.</li><li>Holds a consistent 7m line</li></ul>'},
                { name: 'Score Line', description: '<ul style="text-align: left;"><li>Reads in Tight & Long Ball</li><li>Keeps the I defender on the move</li><li>Off field, adjust for best support position</li></ul>'},
                { name: 'Dual Changes', description: '<ul style="text-align: left;"><li>Reads play to ensure changes are smooth and made with purpose & forethought</li></ul>'}
            ]
        });
        this.initialiseTemplate({
            id: '',
            creationDate: new Date(),
            dataStatus: 'NEW',
            lastUpdate: new Date(),
            version: 0,
            name: 'Coaching',
            topics: [
                { name: 'Team Work', description: '<ul style="text-align: left;"><li>Sets a 7m line reference point from off-field</li><li>Demonstrates a complete knowledge and understanding of the 2x2x2 system for appropriate game outcomes</li><li>Demonstrates a knowledge of drive prioritisation, handles loose players and checks both sides for shooters</li><li>Works with realigning players for the best game outcome and advantage</li></ul>'},
                { name: 'Leadership', description: '<ul style="text-align: left;"><li>Adopts a leadership role and works to enhance overall referee team performance and consistency</li></ul>'},
                { name: 'Scoreline Positioning', description: '<ul style="text-align: left;"><li>Has close proximity to touchdown situations with a clear view of the ball and the touch at the scoreline<br>Reads play in advance in confined and tight areas and is aware of the long ball and works to improve positions to have best line of sight</li></ul>'},
                { name: 'Proactive Communication and Advantage Play', description: '<ul style="text-align: left;"><li>Is able to establish a 7m line quickly through early and definitive communication<br>Eliminates physical play quickly and takes appropriate action when necessary</li><li>Plays early and complete advantage and uses buddies to assist with this</li><li>Clear and accurate signals and explanations given with and for rulings</li></ul>'},
                { name: 'Position in General Play', description: '<ul style="text-align: left;"><li>Uses full field width - stays close to the action at all times and is in position to make accurate and credible decisions</li></ul>'},
                { name: 'Interchanges', description: '<ul><li>Interchanges made with confidence and with the referee being on the 7m line and square before the first touch is made</li><li>Takes initiative with entry to ensure appropriate share of workload</li><li>Is aware of player rotation from the sub box</li></ul>'},
                { name: 'Contribution - Individual', description: '<ul style="text-align: left;"><li>Focused, alert and displays confidence with personal decision making.</li></ul>'},
                { name: 'Rulings', description: '<ul style="text-align: left;"><li>Applies correct and consistent decisions in accordance with the playing rules of Touch; and achieves appropriate game outcomes.</li></ul>'}
            ]
        });

        this.initialiseTemplate({
            id: '',
            creationDate: new Date(),
            dataStatus: 'NEW',
            lastUpdate: new Date(),
            version: 0,
            name: 'TWC24 Ranking',
            topics: [
                { name: 'Teamwork & Communication', description: `<ul style="text-align: left;">
                    <li>Standard: Sets an expected standard early in the game and shows the willingness to play advantage early rather than on the 5th touch.  This also relates to an accepted player behavioural standard</li>
                    <li>Supportive: Indicates that the referee is outwardly supportive of decisions made by their buddies and is positioned accordingly</li>
                    <li>In Sync: All Referees are in sync with the game and each other with no indecisions</li>
                    <li>Early & Effective: Communication is early enough to allow the attack all options with the penalty as a last option.  However, if there is no other option, not concerned with a consequence penalty.</li>
                    <li>Game Influence: This relates to the work rate of the referee and he ability to make the game work for them and allow the players to play</li>
                    <li>Up with Game: Relates to the Referee being in the game and up with play at all times.  This is also relates to the off-field support referee</li>
                    </ul>`},
                { name: 'Awareness & Understanding', description: `<ul style="text-align: left;">
                    <li>Field Position - Drives:Relates to the Referee understanding the game structure and expected drive tempo with relation to field position and what is being set up at the end of it</li>
                    <li>Early Advantage: Relates to the Referee reading ahead of the game and managing the advantage early to the game direction to keep the game on the move.  Is succinct with outcome-based communication and plays advantage when the attacker has their head up </li>
                    <li>Game Flow: Is able to establish an even and consistent game flow</li>
                    <li>Spatial Awareness: Understands surroundings and which players are likely to impact </li>
                    <li>Accurate Count: Keeps the touch count off-field as well as on-field and communicates the count to the entry referee, while departing</li>
                    <li>Subsets: Understands the positional adjustment needed for player rotation and subsets</li>
                    </ul>`},
                { name: '7m Management', description: `<ul style="text-align: left;">
                    <li>Creates 7m: Distance Work ethic is elevated toward impact players to create a consistent 7m distance to allow the attack all options and eliminate penalties against the defence.</li>
                    <li>Specific: Communication is early, direct, specific, effective and outcome based</li>
                    <li>Consistent: Is aware of the 7m being set by buddies and works towards a consistency</li>
                    <li>Drives: Is aware that in direct drives that they may need to referee behind the line for the speed of the game, but also keeps the 7m distance between the attack and defence while in this position</li>
                    <li>Entry: Is up with play on entry</li>
                    <li>Try Line: Is aware of the need to create an early 7m distance at the strike dump to allow the attack to run their play</li>
                    <li>Game Direction: Communicating in front of the game and prioritizing to the defenders who will be the next to impact play – (Open side defenders so that they are onside when the latch/sweepers enter the field)</li>
                    </ul>`
                },
                { name: 'Try Line', description: `<ul style="text-align: left;">
                    <li>Defence Conditioning: Is aware of how the defence is being conditioned and awareness of the pending play against the grain. Understands mismatches in the Mixed game</li>
                    <li>Set Plays: Develops an understanding of team tactics and possible set plays</li>
                    <li>Player Recognition: Understands key players and preferences</li>
                    <li>Shape Recognition: Understands the way the players are shaped, the likely game direction and then the initial read and reaction</li>
                    <li>Adjusts Positioning: Is balanced and ready to come off either foot as the game dictates and puts themselves at the game to where they can see the ball at all times</li>
                    <li>Standoff: Is aware of where the attack is playing the ball in relation to the distance required to realign the defenders on, or from the Try Line and communicates this accordingly</li>
                    </ul>`
                },
                { name: 'Interchanges', description: `<ul style="text-align: left;">
                    <li>Reads game position :Reads where the game is and moves to an entry/departure position to allow the best option for entry/departure referee</li>
                    <li>Adjusts entry Position: Moves to an early change position and enters in control and at, or close to the 7m line and allows for game speed</li>
                    <li>Timing: Timing on entry is key to engage with defenders with advantage and keeps a standard with off-side players and game momentum</li>
                    <li>Eliminates: Penalties Communicates prior to entry to ensure there is less need for penalties and thought is toward game flow</li>
                    <li>Field Exit: Communicates to the entry referee the touch count that is coming. In addition to giving the touch count, the exiting referee is to communicate with the winger, link or middle to get to the 7m offside line of the on-field referee to contribute to 7m management, teamwork and communication</li>
                    <li>Departs for Game: Stays “live” and up with the game after departure and is in position to assist the on-field referee with 7m management and decisions</li>
                    </ul>`
                },
                { name: 'Decision Making', description: `<ul style="text-align: left;">
                    <li>Rule Knowledge: Has a complete understanding of Rules of the game</li>
                    <li>Consistent Application: Applies rules consistently and is instinctive in their understanding of applicable rules</li>
                    <li>Crucial: Is consistent with ruling application in crucial times of the game and under pressure</li>
                    </ul>`
                },
            ]
        });
    }
    private initialiseTemplate(template: CoachingTemplate) {
        this.getCoachingTemplateByName(template.name).pipe(
            mergeMap((rt) => {
                if (rt.data) {
                    console.log('Coaching template "' + template.name + '" already exist: id=' + rt.data.id);
                    rt.data.topics = template.topics;
                    return this.save(rt.data);
                 } else {
                    console.log('Creating the coaching template "' + template.name + '"');
                    return this.save(template);
                 } 
            })
        ).subscribe();
    }  
}
