import { AlertController, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

import { User, AccountStatus } from './../../../app/model/user';
import { ResponseWithData } from './../../../app/service/response';
import { UserService } from './../../../app/service/UserService';
import { flatMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.scss'],
})
export class UserManagerComponent implements OnInit {
  users: User[];
  error;
  stats = {
    total: 0,
    nbActive: 0,
    nbValidationRequired: 0,
    nbDeleted: 0,
    nbLocked: 0
  };

  constructor(
    private alertCtrl: AlertController,
    private navController: NavController,
    private userService: UserService
  ) { }

  ngOnInit() {
    console.log('UserManagerComponent.ngOnInit');
    this.userService.all().subscribe((response: ResponseWithData<User[]>) => {
      this.users = this.sort(response.data);
      this.error = response.error;
      if (this.users) {
        this.computeStats();
      }
    });
  }

  sort(users: User[]): User[] {
    if (!users) {
      return users;
    }
    const status: AccountStatus[] = ['VALIDATION_REQUIRED', 'LOCKED', 'ACTIVE', 'DELETED'];
    return users.sort( (user1: User, user2: User) => {
      let res = 0;
      if (res === 0) {
        res = status.indexOf(user1.accountStatus) - status.indexOf(user2.accountStatus);
      }
      if (res === 0) {
        res = (user1.firstName + user1.lastName).localeCompare((user2.firstName + user2.lastName));
      }
      return res;
    });
  }
  computeStats() {
    const stats = {
      total: 0,
      nbActive: 0,
      nbValidationRequired: 0,
      nbDeleted: 0,
      nbLocked: 0
    };
    this.users.forEach( (user) => {
      stats.total++;
      switch (user.accountStatus) {
      case 'ACTIVE':
        stats.nbActive++;
        break;
      case 'VALIDATION_REQUIRED':
        stats.nbValidationRequired++;
        break;
      case 'DELETED':
        stats.nbDeleted++;
        break;
      case 'LOCKED':
        stats.nbLocked++;
        break;
      }
    });
    this.stats = stats;
  }
  lock(user: User) {
    user.accountStatus = 'LOCKED';
    this.userService.save(user).pipe(
      map(() => {
        this.computeStats();
        this.users = this.sort(this.users);
      })
    ).subscribe();
  }

  unlock(user: User) {
    user.accountStatus = 'ACTIVE';
    this.userService.save(user).pipe(
      map(() => {
        this.computeStats();
        this.users = this.sort(this.users);
      })
    ).subscribe();
    this.computeStats();
  }

  validate(user: User) {
    user.accountStatus = 'ACTIVE';
    this.userService.save(user).pipe(
      flatMap(() => this.userService.sendAccountValidated(user.id)),
      map(() => {
        this.computeStats();
      })
    ).subscribe();
  }

  unvalidate(user: User) {
    user.accountStatus = 'DELETED';
    this.userService.save(user).pipe(
      flatMap(() => this.userService.sendAccountNotValidated(user.id)),
      map(() => {
        this.users = this.sort(this.users);
        this.computeStats();
      })
    ).subscribe();
  }

  delete(user: User) {
    this.alertCtrl.create({
      message: 'Do you really want to delete your account ' + user.shortName  +  '?<br>All data will be removed !!',
      buttons: [
        { text: 'Cancel', role: 'cancel'},
        {
          text: 'Delete',
          handler: () => {
            user.accountStatus = 'DELETED';
            this.users = this.sort(this.users);
            this.computeStats();
            this.userService.deleteAccount(user);
          }
        }
      ]
    }).then( (alert) => alert.present() );
  }
  resetPassword(user: User) {
    this.userService.resetPassword(user.email);
  }
  userSelected(user: User) {
    this.navController.navigateRoot('/user/edit/' + user.id);
  }
  back() {
    this.navController.navigateRoot('/admin');
  }
  onSwipe(event) {
    // console.log('onSwipe', event);
    if (event.direction === 4) {
      this.back();
    }
  }
}
