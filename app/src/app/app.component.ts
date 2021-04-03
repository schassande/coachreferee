import { MenuController, NavController, Platform } from '@ionic/angular';
import { Component } from '@angular/core';
import { LocalAppSettings } from './model/settings';
import { VersionService } from './service/VersionService';
import { Bookmark, BookmarkService } from './service/BookmarkService';
import { HelpService } from './service/HelpService';
import { AngularFirestore } from '@angular/fire/firestore';
import { AppSettingsService } from './service/AppSettingsService';
import { OfflinesService } from './service/OfflineService';
import { UserService } from './service/UserService';
import { ConnectedUserService } from './service/ConnectedUserService';

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
    private offlinesService: OfflinesService,
    private userService: UserService,
    public connectedUserService: ConnectedUserService,
    private menu: MenuController,
    private firestore: AngularFirestore
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
          this.firestore.firestore.disableNetwork().then(() => console.log('Offline'));
        } else {
          this.firestore.firestore.enableNetwork().then(() => console.log('Online'));
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

  public reloadPage() {
    window.location.reload(true);
  }

  public onToggleForceOffline() {
    this.offlinesService.switchOfflineMode().subscribe((app) => {
      this.appSetttings = app;
      this.menu.close();
    });
  }
  public logout() {
    this.userService.logout();
    this.route('/user/login');
  }
}
