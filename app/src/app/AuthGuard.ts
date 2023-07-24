import { Observable, map } from 'rxjs';
import { UserService } from './service/UserService';
import { ConnectedUserService } from './service/ConnectedUserService';
import { Injectable } from '@angular/core';

import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {

  constructor(
    private connectedUserService: ConnectedUserService,
    private userService: UserService,
    private router: Router
    ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean|Observable<boolean|UrlTree> {
    const connected: boolean = this.connectedUserService.getCurrentUser() != null;
    if (connected) {
      return true;
    }
    return this.userService.autoLogin().pipe(
      map(() => {
        if (this.connectedUserService.isConnected()) {
          return true;
        } else {
          return this.router.parseUrl('/user/login');
        }
      })
    );
  }
}
