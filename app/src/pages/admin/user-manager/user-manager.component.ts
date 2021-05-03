import { AlertController, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

import { User, AccountStatus, AppRole, CurrentApplicationName, ApplicationRole } from './../../../app/model/user';
import { ResponseWithData } from './../../../app/service/response';
import { UserService } from './../../../app/service/UserService';
import { mergeMap, map } from 'rxjs/operators';
import { DataRegion } from 'src/app/model/common';
import { ToolService } from 'src/app/service/ToolService';

@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.scss'],
})
export class UserManagerComponent implements OnInit {
  users: User[];
  filteredUsers: User[];
  error;
  stats = {
    total: 0,
    nbActive: 0,
    nbValidationRequired: 0,
    nbDeleted: 0,
    nbLocked: 0,
    noAccount: 0,
    referee: 0,
    activeReferee: 0,
    coach: 0,
    ndr: 0,
    admin: 0,
    perRegion : []
  };
  status: AccountStatus = 'ACTIVE';
  role: AppRole;
  region: DataRegion;

  constructor(
    private alertCtrl: AlertController,
    private navController: NavController,
    private toolService: ToolService,
    private userService: UserService
  ) { }

  ngOnInit() {
    console.log('UserManagerComponent.ngOnInit');
    this.userService.all().subscribe((response: ResponseWithData<User[]>) => {
      this.users = this.sort(response.data.filter(u =>
        u.applications.filter(ar => ar.name === CurrentApplicationName).length > 0
        || u.demandingApplications.filter(ar => ar.name === CurrentApplicationName).length > 0)
        );
      this.error = response.error;
      if (this.users) {
        this.computeStats();
        this.filterUsers();
      }
    });
  }
  onStatusChange() {
    this.filterUsers();
  }
  onRoleChange() {
    this.filterUsers();
  }
  onRegionChange() {
    this.filterUsers();
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
      nbLocked: 0,
      noAccount: 0,
      referee: 0,
      activeReferee: 0,
      coach: 0,
      ndr: 0,
      admin: 0,
      perRegion: []
    };
    this.users.forEach( (user) => {
      stats.total++;
      let regionStat = stats.perRegion.find(rs => rs.region === user.region);
      if (!regionStat) {
        regionStat = { region: user.region, total: 0, referee: 0, activeReferee: 0 };
        stats.perRegion.push(regionStat);
      }
      regionStat.total++;
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
      case 'NO_ACCOUNT':
        stats.noAccount++;
        break;
      }
      if (user.applications.find(ar => ar.name === CurrentApplicationName && ar.role === 'REFEREE')) {
        stats.referee++;
        regionStat.referee++;
        if (user.accountStatus === 'ACTIVE') {
          stats.activeReferee++;
          regionStat.activeReferee++;
        }
      }
      if (user.applications.find(ar => ar.name === CurrentApplicationName && ar.role === 'REFEREE_COACH')) {
        stats.coach++;
      }
      if (user.applications.find(ar => ar.name === CurrentApplicationName && ar.role === 'NDR')) {
        stats.ndr++;
      }
      if (user.applications.find(ar => ar.name === CurrentApplicationName && ar.role === 'ADMIN')) {
        stats.admin++;
      }
    });
    this.stats = stats;
    console.log(this.stats);
  }
  filterUsers() {
    if (this.users && (this.toolService.isValidString(this.status)
                      || this.toolService.isValidString(this.role)
                      || this.toolService.isValidString(this.region)
                      )) {
      this.filteredUsers = this.users.filter(u => {
        let keep = true;
        if (keep && this.toolService.isValidString(this.status)) {
          keep = u.accountStatus === this.status;
        }
        if (keep && this.toolService.isValidString(this.role)) {
          keep = u.applications.filter(ar => ar.name === CurrentApplicationName && ar.role === this.role).length > 0;
        }
        if (keep && this.toolService.isValidString(this.region)) {
          keep = u.region === this.region;
        }
        return keep;
      });
      console.log('filterUsers(): ' + this.users.length + ' => ' + this.filteredUsers.length);
    } else {
      this.filteredUsers = this.users;
      console.log('filterUsers(): no filtering');
    }
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
    this.userService.validateRole(user, 'REFEREE_COACH').pipe(
      map(() => this.computeStats())
    ).subscribe();
  }

  unvalidate(user: User) {
    user.accountStatus = 'DELETED';
    this.userService.unvalidateRole(user, 'REFEREE_COACH').pipe(
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
  filterApplicationRoles(roles: ApplicationRole[]) {
    return roles.filter(ar => ar.name === CurrentApplicationName);
  }
}
