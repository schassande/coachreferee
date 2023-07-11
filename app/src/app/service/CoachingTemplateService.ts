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
