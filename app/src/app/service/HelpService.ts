import { Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HelpWidgetComponent } from './../../pages/widget/help-widget-component';
import { BookmarkService, Bookmark } from './BookmarkService';
import { ModalController } from '@ionic/angular';

@Injectable()
export class HelpService {

    public entry: Bookmark = null;
    private entrySubject = new Subject<Bookmark>();

    constructor(
        private modalController: ModalController) {
    }
    public getHelp(): Observable<Bookmark> {
        return this.entrySubject;
    }
    public noHelp() {
        this.entry = null;
    }

    public setHelp(topic: string) {
        this.entry = {
            id: topic + 'Help',
            label : 'Help',
            iconName: 'help',
            handler: () => {
                this.modalController.create({
                    component: HelpWidgetComponent,
                    componentProps : { topic}}
                    ).then((mod) => mod.present());
            }
        };
        this.entrySubject.next(this.entry);
    }
}
