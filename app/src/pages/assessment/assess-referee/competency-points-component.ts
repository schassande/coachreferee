import { AlertController } from '@ionic/angular';
import { AlertInput } from '@ionic/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, Input, Output, forwardRef, EventEmitter } from '@angular/core';

export type Competency = 'YES' | 'NE' | 'NO';

@Component({
    selector: 'competency-points-comp',
    template: `<span class="competencyField" (click)="onClick()">{{value}} {{ value > 1 ? 'pts' : 'pt'}}</span>`,
    providers: [ { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CompetencyPointsComponent), multi: true } ],
    styles: [`
    .competencyField:hover {
        cursor: pointer;
    }
    `]
  })
export class CompetencyPointsComponent {

    @Input() public value: number;
    @Input() public pointsValues: number[];
    @Input() public description: string;
    @Input() public readonly = false;
    @Output() public change: EventEmitter<number> = new EventEmitter<number>();

    public constructor(private alertCtrl: AlertController) {
    }

    public changeValue(val: number) {
        if (!this.readonly) {
            this.value = val;
            this.change.emit(this.value);
        }
    }

    public onClick() {
        if (this.readonly) {
            return;
        }
        const inputs: AlertInput[] = this.pointsValues.map((point) => {
            return { type: 'radio', label: '' + point, value: point, checked: point === this.value } as AlertInput;
        });
        this.alertCtrl.create({
            message: this.description,
            inputs,
            buttons: [
                { text: 'Cancel', role: 'cancel'},
                { text: 'Ok', handler: (data: number) => this.changeValue(data) }
                ]
        }).then((alert) => alert.present());
    }
}
