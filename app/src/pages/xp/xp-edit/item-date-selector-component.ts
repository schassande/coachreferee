import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { PopoverController } from "@ionic/angular";
import { DateService } from "src/app/service/DateService";

@Component({
    selector: 'app-item-date-selector',
    template: `
<ion-item button="true" id="open-xpdate-input{{id}}">
    <ion-label position="fixed" style="min-width: 60%;">Date</ion-label>
    <ion-input>{{ dateStr }}</ion-input>
    <ion-popover trigger="open-xpdate-input{{id}}" side="bottom" alignment="end">
        <ng-template>
            <ion-datetime #popoverXpDate presentation="date" first-day-of-week="1" (ionChange)="dateStr = popoverXpDate.value"></ion-datetime>
        </ng-template>
    </ion-popover>
</ion-item>
    `
  })
export class ItemDateSelectorComponent {
    @Input() public idSuffix: number = 0;
    @Input() public dateValue: Date;
    @Output() public dateChangeEvent: EventEmitter<Date> = new EventEmitter<Date>();

    public id:number;

    public constructor(
        private dateService: DateService,
        private popoverController: PopoverController){
        this.id = Math.round(Math.random() * 100000);
    }
    get dateStr(): string {
        return this.dateService.date2string(this.dateValue);
    }

    set dateStr(d: any) {
        // this.dateService.string2date(dateStr, cd.coachingDate)
        this.dateValue = this.dateService.to00h00(new Date(d));
        console.log('Selected date: ', this.dateValue);
        this.dateChangeEvent.emit(this.dateValue);
        this.popoverController.dismiss();
    }
  }  
  