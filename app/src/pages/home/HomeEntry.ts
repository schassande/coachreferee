import { Component, Input, OnInit } from '@angular/core';
import { ConnectedUserService } from 'src/app/service/ConnectedUserService';

@Component({
    selector: 'app-home-entry',
    template: `
    <div style="display: inline-block; width: 50%; padding: 5px 10px; text-align: center;">
        <ion-button routerLink="{{link}}" shape="round" color="light" expand="block" router-direction="forward" style="height: 50px;">
            <span *ngIf="icon"><mat-icon>{{icon}}</mat-icon>&nbsp;</span>{{name}}
        </ion-button>
    </div>
`
})
export class HomeEntry implements OnInit {

  @Input() link: string;
  @Input() name: string;
  @Input() icon: string;
  isAdmin = false;

  constructor(
    private connectedUserService: ConnectedUserService
  ) {}

  public ngOnInit() {
      this.isAdmin = this.connectedUserService.isAdmin();
  }
}
