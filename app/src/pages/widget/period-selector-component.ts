import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Component, Input, forwardRef } from '@angular/core';

@Component({
    selector: 'period-selector-comp',
    template: ` <div *ngIf="!readonly">
                    <span class="periodButton periodButtonFirst" [ngClass]="{'buttonActivated': value == 1}"
                        (click)="changeValue(1)">1
                    </span>
                    <span class="periodButton periodButtonLast" [ngClass]="{'buttonActivated': value == 2}"
                        (click)="changeValue(2)">2
                    </span>
                </div>
                <div *ngIf="readonly">{{value}}</div>`,
    providers: [ { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => PeriodSelectorComponent), multi: true } ],
    styles: [`
    .periodButton {
        border-top: 1px solid black;
        border-bottom: 1px solid black;
        padding: 10px 5px 0px 5px;
        font-size: 1.5em;
    }
    .periodButtonFirst {
        border-left: 1px solid black;
        border-radius: 10px 0 0 10px;
    }
    .periodButtonMiddle {
        border-left: 1px solid black;
        border-right: 1px solid black;
    }
    .periodButtonLast {
        border-right: 1px solid black;
        border-radius: 0 10px 10px 0;
    }
    .periodActivated {
        background-color: #488aff;
    }
    `]
  })
export class PeriodSelectorComponent implements ControlValueAccessor {

    @Input()
    public name: string;
    @Input('value')
    public val: number;
    @Input()
    public readonly = false;

    // Both onChange and onTouched are functions. Set default function doing NOP
    private onChange: any = () => { };
    private onTouched: any = () => { };

    get value(): number {
        return this.val;
    }

    set value(val: number) {
        this.val = val;
        this.onChange(val);
        this.onTouched();
    }

    changeValue(val: number) {
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
