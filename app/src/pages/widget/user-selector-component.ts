import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ConnectedUserService } from '../../app/service/ConnectedUserService';
import { UserService } from '../../app/service/UserService';
import { ResponseWithData } from '../../app/service/response';

import { SharedWith } from './../../app/model/common';
import { User } from './../../app/model/user';

@Component({
    selector: 'user-selector',
    template: `
<ion-content padding>
    <div style="margin-bottom: 20px;">Select an user.</div>
    <ion-list>
        <ion-item *ngFor="let user of users">
            <ion-icon slot="start" *ngIf="user.photo && !user.photo.url" name="person"></ion-icon>
            <ion-avatar slot="start" *ngIf="user.photo && user.photo.url"><img src="{{user.photo.url}}"></ion-avatar>
            <ion-label (click)="userSelected(user)">{{user.firstName}} {{user.lastName}}</ion-label>
        </ion-item>
    </ion-list>
</ion-content>`,
  })
export class UserSelectorComponent implements OnInit {
    users: User[];
    error;

    constructor(
      public userService: UserService,
      public modalCtrl: ModalController,
      public connectedUserService: ConnectedUserService) {}

    ngOnInit() {
      this.loadUser();
    }

    loadUser() {
      this.userService.all().subscribe((response: ResponseWithData<User[]>) => {
        this.users = this.userService.sortUsers(response.data);
        this.error = response.error;
        if (this.users == null || this.users.length === 0) {
            this.modalCtrl.dismiss( { user: null});
        }
      });
    }

    public userSelected(user: User): void {
      const sharedWith: SharedWith = {users : [user], groups: []};
      this.modalCtrl.dismiss(sharedWith);
    }
}
