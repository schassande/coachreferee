import { MenuController, NavController, Platform } from '@ionic/angular';
import { Component } from '@angular/core';
import { LocalAppSettings } from './model/settings';
import { VersionService } from './service/VersionService';
import { Bookmark, BookmarkService } from './service/BookmarkService';
import { HelpService } from './service/HelpService';
import { disableNetwork, enableNetwork, Firestore } from '@angular/fire/firestore';
import { AppSettingsService } from './service/AppSettingsService';
import { UserService } from './service/UserService';
import { ConnectedUserService } from './service/ConnectedUserService';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  /** The application settings store on device */
  appSetttings: LocalAppSettings;

  constructor(
    private navController: NavController,
    private platform: Platform,
    private versionService: VersionService,
    public bookmarkService: BookmarkService,
    public helpService: HelpService,
    public appSettingsService: AppSettingsService,
    private userService: UserService,
    public connectedUserService: ConnectedUserService,
    private menu: MenuController,
    private firestore: Firestore
  ) {
    this.initializeApp();
  }

  private initializeApp() {
    this.platform.ready().then(() => {

      // Migrate local database if required.
      this.versionService.migrate().subscribe();
      this.appSettingsService.get().subscribe((appSetttings) => {
        this.appSetttings = appSetttings;
        if (appSetttings.forceOffline) {
          disableNetwork(this.firestore).then(() => console.log('Offline'));
        } else {
          enableNetwork(this.firestore).then(() => console.log('Online'));
        }
      });
    });
  }
  public handleEntry(entry: Bookmark) {
    if (entry.url) {
      this.route(entry.url);
    } else if (entry.handler) {
      entry.handler();
      this.menu.close();
    }
  }
  public route(url: string = '/home') {
    console.log('route(', url, ')');
    this.navController.navigateRoot(url);
    this.menu.close();
  }

  public logout() {
    this.userService.logout();
    this.route('/user/login');
  }
}
