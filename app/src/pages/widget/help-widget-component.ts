import { ModalController } from '@ionic/angular';
import { Component, Input, ViewEncapsulation } from '@angular/core';


@Component({
    template: `
        <ion-header>
            <ion-toolbar>
                <span slot="start" style="margin-left: 10px;"><img src="assets/imgs/logo.png" height="30" /></span>
                <ion-buttons slot="end">
                    <ion-button (click)="onBack()">
                        <ion-icon name="close"></ion-icon>
                    </ion-button>
                </ion-buttons>
                <ion-title style="text-align: center;">Help</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content style="padding: 10px;">
            <div class="help-content" style="padding: 10px;">
                <markdown [src]="path"></markdown>
            </div>
        <ion-content>`,
    encapsulation: ViewEncapsulation.None,
    styleUrls: [ 'help-widget-component.scss' ]
})
export class HelpWidgetComponent {

    @Input() topic: string;

    constructor(
        private modalController: ModalController
    ) {
    }
    get path() {
        return `assets/help/${this.topic}.md`;
    }

    onBack() {
        this.modalController.dismiss();
    }
}
