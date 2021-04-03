import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, Input, Output, forwardRef, EventEmitter } from '@angular/core';

export type Competency = 'YES' | 'NE' | 'NO';

@Component({
    selector: 'competency-comp',
    template: `<div class="competencySegment" *ngIf="!readonly">
                    <span class="competencyButton competencyYes" [ngClass]="{'competencyYesActivated': value == 'YES'}"
                        (click)="changeValue('YES')">
                        <ion-icon name="checkmark"></ion-icon>
                    </span>
                    <span class="competencyButton competencyNE" [ngClass]="{'competencyNEActivated': value == 'NE'}"
                        (click)="changeValue('NE')">
                        <ion-icon name="help"></ion-icon>
                    </span>
                    <span class="competencyButton competencyNo" [ngClass]="{'competencyNoActivated': value == 'NO'}"
                        (click)="changeValue('NO')">
                        <ion-icon name="close"></ion-icon>
                    </span>
                </div>
                <div *ngIf="readonly">
                    <span *ngIf="value == 'YES'"><ion-icon name="checkmark"></ion-icon></span>
                    <span *ngIf="value == 'NE'"><ion-icon name="help"></ion-icon></span>
                    <span *ngIf="value == 'NO'"><ion-icon name="close"></ion-icon></span>
                </div>`,
    providers: [ { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CompetencyComponent), multi: true } ],
    styles: [`
    .competencySegment {
    }
    .competencyButton {
        border-top: 1px solid black;
        border-bottom: 1px solid black;
        padding: 10px 5px 0px 5px;
    }
    .competencyButton ion-icon {
        margin: 0;
        padding: 0;
        font-size: 1.5em;
    }
    .competencyYes {
        border-left: 1px solid black;
        border-radius: 10px 0 0 10px;
    }
    .competencyNE {
        border-left: 1px solid black;
        border-right: 1px solid black;
    }
    .competencyNo {
        border-right: 1px solid black;
        border-radius: 0 10px 10px 0;
    }
    .competencyYesActivated {
        background-color: lightgreen;
    }
    .competencyNEActivated {
        background-color: #488aff;
    }
    .competencyNoActivated {
        background-color: orangered;
    }
    `]
  })
export class CompetencyComponent {

    @Input() public value: Competency;
    @Input() public readonly = false;
    @Output() public change: EventEmitter<Competency> = new EventEmitter<Competency>();

    changeValue(val: Competency) {
        if (!this.readonly) {
            this.value = val;
            this.change.emit(this.value);
        }
    }
}
