import { Injectable } from '@angular/core';
// Module dependencies
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/Storage-angular';
// Firebase dependencies
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
// other module dependencies
import { MarkdownModule } from 'ngx-markdown';
import { ChartsModule } from 'ng2-charts';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
@Injectable()
export class CustomHammerConfig extends HammerGestureConfig {}

// Application dependencies
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';

// Pages
import { AdminHomeComponent } from './../pages/admin/admin-home/admin-home.component';
import { AssessRefereePage } from '../pages/assessment/assess-referee/assess-referee';
import { AssessmentEditPage } from '../pages/assessment/assessment-edit/assessment-edit';
import { AssessmentListPage } from '../pages/assessment/assessment-list/assessment-list';
import { CoachingActivityPage } from './../pages/admin/coaching-activity/coaching-activity.page';
import { CoachingEditPage } from '../pages/coaching/coaching-edit/coaching-edit';
import { CoachingGamePage } from '../pages/coaching/coaching-game/coaching-game';
import { CoachingImprovmentFeedbackEditPage } from '../pages/coaching/coaching-improvment-feedback-edit/coaching-improvment-feedback-edit';
import { CoachingListPage } from '../pages/coaching/coaching-list/coaching-list';
import { CoachingPositiveFeedbackEditPage } from '../pages/coaching/coaching-positive-feedback-edit/coaching-positive-feedback-edit';
import { CompetitionEditComponent } from '../pages/competition/competition-edit/competition-edit.component';
import { CompetitionCoachesPage } from './../pages/competition/competition-coaches/competition-coaches.page';
import { CompetitionGamesPage } from './../pages/competition/competition-games/competition-games.page';
import { CompetitionHomePage } from './../pages/competition/competition-home/competition-home.page';
import { CompetitionImportComponent } from '../pages/competition/competition-import/competition-import.component';
import { CompetitionListPage } from '../pages/competition/competition-list/competition-list';
import { CompetitionRefereesPage } from './../pages/competition/competition-referees/competition-referees.page';
import { CompetitionRankingBestOf2Page } from './../pages/competition/competition-ranking-best-of2/competition-ranking-best-of2.page';
import { CompetitionRankingListComponent } from './../pages/competition/competition-ranking-list/competition-ranking-list.component';
import { CompetitionRankingNewComponent } from './../pages/competition/competition-ranking-list/competition-ranking-new.component';
import { CompetitionRankingPage } from './../pages/competition/competition-ranking/competition-ranking.page';
import { CompetitionSelectorComponent } from './../pages/widget/competition-selector';
import { CompetitionUpgradesPage } from './../pages/competition/competition-upgrades/competition-upgrades.page';
import { CompetencyComponent } from '../pages/assessment/assess-referee/competency-component';
import { HomePage } from '../pages/home/home';
import { PeriodSelectorComponent } from '../pages/widget/period-selector-component';
import { ProEditPage } from '../pages/pro/pro-edit/pro-edit';
import { ProListPage } from '../pages/pro/pro-list/pro-list';
import { RefereeEditPage } from '../pages/referee/referee-edit/referee-edit';
import { RefereeImportComponent } from '../pages/referee/referee-import/referee-import.component';
import { RefereeListPage } from '../pages/referee/referee-list/referee-list';
import { RefereeSeasonUpgradeComponent } from '../pages/referee/referee-season-upgrade/referee-season-upgrade.component';
import { RefereeSelectPage } from '../pages/referee/referee-select/referee-select';
import { RefereeViewPage } from '../pages/referee/referee-view/referee-view';
import { SettingsPage } from '../pages/settings/settings';
import { SkillEditPage } from '../pages/skill-profile/skill-edit/skill-edit';
import { SkillProfileEditPage } from '../pages/skill-profile/skill-profile-edit/skill-profile-edit';
import { SkillProfileListPage } from '../pages/skill-profile/skill-profile-list/skill-profile-list';
import { SkillSetEditPage } from '../pages/skill-profile/skill-set-edit/skill-set-edit';
import { UserEditPage } from '../pages/user/user-edit/user-edit';
import { UserLoginComponent } from '../pages/user/user-login/user-login.component';
import { UserManagerComponent } from './../pages/admin/user-manager/user-manager.component';
import { XpListComponent } from '../pages/xp/xp-list/xp-list.component';
import { XpEditComponent } from '../pages/xp/xp-edit/xp-edit.component';

// Widgets
import { CameraIconComponent } from '../pages/widget/camera-icon-component';
import { CompetencyPointsComponent } from '../pages/assessment/assess-referee/competency-points-component';
import { HelpWidgetComponent } from './../pages/widget/help-widget-component';
import { SharingComponent } from '../pages/widget/sharing-component';
import { UserSelectorComponent } from '../pages/widget/user-selector-component';
import { UserWaitingValidationPage } from '../pages/user/user-waiting-validation/user-waiting-validation';

// Services
import { AppSettingsService } from './service/AppSettingsService';
import { AssessmentService } from './service/AssessmentService';
import { BookmarkService } from './service/BookmarkService';
import { CoachingService } from './service/CoachingService';
import { CompetitionService } from './service/CompetitionService';
import { CompetitionRefereeUpgradeService } from './service/CompetitionRefereeUpgradeService';
import { CompetitionRefereeRankingService } from './service/CompetitionRefereeRankingService';
import { ConnectedUserService } from './service/ConnectedUserService';
import { DateService } from './service/DateService';
import { EmailService } from './service/EmailService';
import { HelpService } from './service/HelpService';
import { InvitationService } from './service/InvitationService';
import { LocalDatabaseService } from './service/LocalDatabaseService';
import { OfflinesService } from './service/OfflineService';
import { PROService } from './service/PROService';
import { RefereeService } from './service/RefereeService';
import { SkillProfileService } from './service/SkillProfileService';
import { ToolService } from './service/ToolService';
import { UserService } from './service/UserService';
import { UserGroupService } from './service/UserGroupService';
import { VersionService } from './service/VersionService';
import { XpService } from './service/XpService';
import { CompetitionRefereeSelectorComponent } from 'src/pages/widget/competition-referee-selector-component';
import { RefereeSelectorService } from 'src/pages/referee/referee-selector-service';


@NgModule({
  declarations: [AppComponent,
    AdminHomeComponent, UserManagerComponent, RefereeImportComponent, CoachingActivityPage,
    AssessRefereePage, AssessmentEditPage, AssessmentListPage,
    CoachingEditPage, CoachingGamePage, CoachingImprovmentFeedbackEditPage, CoachingListPage, CoachingPositiveFeedbackEditPage,
    CompetitionImportComponent, CompetitionListPage, CompetitionEditComponent,
    CompetitionCoachesPage, CompetitionHomePage, CompetitionRankingPage, CompetitionUpgradesPage, CompetitionRefereesPage,
    CompetitionRankingPage, CompetitionRankingBestOf2Page, CompetitionGamesPage, CompetitionRankingListComponent,
    CompetitionRankingNewComponent, CompetitionRefereeSelectorComponent,
    HomePage, HelpWidgetComponent,
    ProEditPage, ProListPage,
    RefereeListPage, RefereeViewPage, RefereeSelectPage, RefereeEditPage, RefereeSeasonUpgradeComponent,
    SettingsPage,
    SkillEditPage, SkillProfileEditPage, SkillProfileListPage, SkillSetEditPage,
    UserEditPage, UserLoginComponent, UserWaitingValidationPage,
    XpListComponent, XpEditComponent,
    SharingComponent, CompetencyComponent, CompetencyPointsComponent, PeriodSelectorComponent, CompetitionSelectorComponent,
    CameraIconComponent, UserSelectorComponent],
  entryComponents: [AppComponent, HomePage, RefereeSelectPage, CompetitionRefereeSelectorComponent,
    RefereeEditPage, UserSelectorComponent, CompetitionSelectorComponent, HelpWidgetComponent, CompetitionRankingNewComponent],
  imports: [
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence(),
    AngularFireStorageModule,
    AngularFireFunctionsModule,
    BrowserModule,
    ChartsModule,
    FormsModule,
    HttpClientModule,
    MarkdownModule.forRoot({ loader: HttpClient }),
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    AppSettingsService,
    AssessmentService,
    BookmarkService,
    CoachingService,
    CompetitionService,
    CompetitionRefereeUpgradeService,
    CompetitionRefereeRankingService,
    ConnectedUserService,
    DateService,
    EmailService,
    HelpService,
    InvitationService,
    LocalDatabaseService,
    OfflinesService,
    PROService,
    RefereeService,
    RefereeSelectorService,
    SkillProfileService,
    ToolService,
    UserService,
    UserGroupService,
    VersionService,
    XpService,
    { provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
