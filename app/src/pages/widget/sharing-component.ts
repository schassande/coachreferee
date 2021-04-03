import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Component, Input, forwardRef } from '@angular/core';
import { Sharing } from '../../app/model/privacy';

@Component({
    selector: 'sharing-comp',
    template: ` <div class="sharingSegment" *ngIf="!readonly">
                    <span class="sharingButton sharingYes" [ngClass]="{'sharingYesActivated': value == 'YES'}"
                        (click)="changeValue('YES')">
                        <ion-icon name="checkmark"></ion-icon>
                    </span>
                    <span class="sharingButton sharingNE" [ngClass]="{'sharingNEActivated': value == 'LIMITED'}"
                        (click)="changeValue('LIMITED')">
                        <ion-icon name="help"></ion-icon>
                    </span>
                    <span class="sharingButton sharingNo" [ngClass]="{'sharingNoActivated': value == 'NO'}"
                        (click)="changeValue('NO')">
                        <ion-icon name="close"></ion-icon>
                    </span>
                </div>
                <div *ngIf="readonly">
                    <span *ngIf="value == 'YES'"><ion-icon name="checkmark"></ion-icon></span>
                    <span *ngIf="value == 'LIMITED'"><ion-icon name="help"></ion-icon></span>
                    <span *ngIf="value == 'NO'"><ion-icon name="close"></ion-icon></span>
                </div>`,
    providers: [ { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SharingComponent), multi: true } ],
    styles: [`
    .sharingSegment {
    }
    .sharingButton {
        border-top: 1px solid black;
        border-bottom: 1px solid black;
        padding: 10px 5px 0px 5px;
    }
    .sharingButton ion-icon {
        margin: 0;
        padding: 0;
        font-size: 1.5em;
    }
    .sharingYes {
        border-left: 1px solid black;
        border-radius: 10px 0 0 10px;
    }
    .sharingNE {
        border-left: 1px solid black;
        border-right: 1px solid black;
    }
    .sharingNo {
        border-right: 1px solid black;
        border-radius: 0 10px 10px 0;
    }
    .sharingYesActivated {
        background-color: lightgreen;
    }
    .sharingNEActivated {
        background-color: #488aff;
    }
    .sharingNoActivated {
        background-color: orangered;
    }
    `]
  })
export class SharingComponent implements ControlValueAccessor {

    @Input()
    public name: string;
    @Input('value')
    public val: Sharing;
    @Input()
    public readonly = false;

    // Both onChange and onTouched are functions. Set default function doing NOP
    private onChange: any = () => { };
    private onTouched: any = () => { };

    get value(): Sharing {
        return this.val;
    }

    set value(val: Sharing) {
        this.val = val;
        this.onChange(val);
        this.onTouched();
    }

    changeValue(val: Sharing) {
        this.value = val;
    }

    // We implement this method to keep a reference to the onChange
    // callback function passed by the forms API
    registerOnChange(fn) {
        this.onChange = fn;
    }

    // We implement this method to keep a reference to the onTouched
    // callback function passed by the forms API
    registerOnTouched(fn) {
        this.onTouched = fn;
    }

    // This is a basic setter that the forms API is going to use
    writeValue(value) {
        if (value) {
            this.value = value;
        }
    }
}
