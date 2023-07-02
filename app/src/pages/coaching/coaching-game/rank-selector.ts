import { Component, EventEmitter, Input, Output, OnChanges } from "@angular/core";

@Component({
    selector: 'app-rank-selector',
    template: `
    <div *ngIf="readonly">
        <ion-badge color="primary" style="font-size: 1.5em; padding: 5px 10px; border-radius: 20px; margin-left: 10px;">{{rank === 0 ? '?' : rank}}</ion-badge>
    </div>
    <div *ngIf="!readonly">
        <ion-badge color="{{r === rank ? 'primary' : 'light' }}" style="font-size: 1.5em; padding: 5px 10px; border-radius: 20px; margin-left: 10px;" 
            *ngFor="let r of ranks" (click)="rankSelected(r)">{{r === 0 ? '?' : r}}</ion-badge>
    </div>
        `
  })
export class RankSelectorComponent implements OnChanges {

    @Input() public maxRank: number = 3;
    @Input() public rank: number = 0;
    @Input() public readonly = false;
    @Output()
    public changeEvent: EventEmitter<number> = new EventEmitter<number>();
    ranks: number[] = []

    constructor() {}
    ngOnChanges() {
        this.ranks = [];
        for(let i=0; i<=this.maxRank; i++) this.ranks.push(i);
    }
    rankSelected(r: number) {
        this.rank = r;
        this.changeEvent.emit(r);
    }
}
