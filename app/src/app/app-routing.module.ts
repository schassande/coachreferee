import { CoachingImprovmentFeedbackEditPage } from './../pages/coaching/coaching-improvment-feedback-edit/coaching-improvment-feedback-edit';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './AuthGuard';
import { AdminGuard } from './AdminGuard';
import { AdminHomeComponent } from 'src/pages/admin/admin-home/admin-home.component';
import { UserManagerComponent } from 'src/pages/admin/user-manager/user-manager.component';
import { CoachingActivityPage } from 'src/pages/admin/coaching-activity/coaching-activity.page';
import { AssessmentListPage } from 'src/pages/assessment/assessment-list/assessment-list';
import { AssessmentEditPage } from 'src/pages/assessment/assessment-edit/assessment-edit';
import { AssessRefereePage } from 'src/pages/assessment/assess-referee/assess-referee';
import { CoachingListPage } from 'src/pages/coaching/coaching-list/coaching-list';
import { CoachingEditPage } from 'src/pages/coaching/coaching-edit/coaching-edit';
import { CoachingGamePage } from 'src/pages/coaching/coaching-game/coaching-game';
import { CoachingPositiveFeedbackEditPage } from 'src/pages/coaching/coaching-positive-feedback-edit/coaching-positive-feedback-edit';
import { CompetitionListPage } from 'src/pages/competition/competition-list/competition-list';
import { CompetitionImportComponent } from 'src/pages/competition/competition-import/competition-import.component';
import { CompetitionHomePage } from 'src/pages/competition/competition-home/competition-home.page';
import { CompetitionEditComponent } from 'src/pages/competition/competition-edit/competition-edit.component';
import { CompetitionCoachesPage } from 'src/pages/competition/competition-coaches/competition-coaches.page';
import { CompetitionGamesPage } from 'src/pages/competition/competition-games/competition-games.page';
import { CompetitionRankingListComponent } from 'src/pages/competition/competition-ranking-list/competition-ranking-list.component';
import { CompetitionRankingPage } from 'src/pages/competition/competition-ranking/competition-ranking.page';
import { CompetitionRefereesPage } from 'src/pages/competition/competition-referees/competition-referees.page';
import { CompetitionUpgradesPage } from 'src/pages/competition/competition-upgrades/competition-upgrades.page';
import { HomePage } from 'src/pages/home/home';
import { ProEditPage } from 'src/pages/pro/pro-edit/pro-edit';
import { ProListPage } from 'src/pages/pro/pro-list/pro-list';
import { RefereeListPage } from 'src/pages/referee/referee-list/referee-list';
import { RefereeViewPage } from 'src/pages/referee/referee-view/referee-view';
import { RefereeImportComponent } from 'src/pages/referee/referee-import/referee-import.component';
import { RefereeSeasonUpgradeComponent } from 'src/pages/referee/referee-season-upgrade/referee-season-upgrade.component';
import { SettingsPage } from 'src/pages/settings/settings';
import { SkillProfileListPage } from 'src/pages/skill-profile/skill-profile-list/skill-profile-list';
import { SkillProfileEditPage } from 'src/pages/skill-profile/skill-profile-edit/skill-profile-edit';
import { SkillSetEditPage } from 'src/pages/skill-profile/skill-set-edit/skill-set-edit';
import { SkillEditPage } from 'src/pages/skill-profile/skill-edit/skill-edit';
import { UserLoginComponent } from 'src/pages/user/user-login/user-login.component';
import { UserEditPage } from 'src/pages/user/user-edit/user-edit';
import { UserWaitingValidationPage } from 'src/pages/user/user-waiting-validation/user-waiting-validation';
import { XpListComponent } from 'src/pages/xp/xp-list/xp-list.component';
import { XpEditComponent } from 'src/pages/xp/xp-edit/xp-edit.component';

const routes: Routes = [
  { path: 'admin', component: AdminHomeComponent, canActivate: [AdminGuard] },
  { path: 'admin/user-manager', component: UserManagerComponent, canActivate: [AdminGuard] },
  { path: 'admin/coaching-activity', component: CoachingActivityPage, canActivate: [AdminGuard] },

  { path: 'assessment/list', component: AssessmentListPage, canActivate: [AuthGuard] },
  { path: 'assessment/create', component: AssessmentEditPage, canActivate: [AuthGuard] },
  { path: 'assessment/edit/:id', component: AssessmentEditPage, canActivate: [AuthGuard] },
  { path: 'assessment/assess/:id', component: AssessRefereePage, canActivate: [AuthGuard] },

  { path: 'coaching/list', component: CoachingListPage, canActivate: [AuthGuard] },
  { path: 'coaching/create', component: CoachingEditPage, canActivate: [AuthGuard] },
  { path: 'coaching/edit/:id', component: CoachingEditPage, canActivate: [AuthGuard] },
  { path: 'coaching/coach/:id', component: CoachingGamePage, canActivate: [AuthGuard] },
  { path: 'coaching/coach/:id/referee/:refereeIdx/negativeFeedback/:feedbackIdx',
        component: CoachingImprovmentFeedbackEditPage, canActivate: [AuthGuard] },
  { path: 'coaching/coach/:id/referee/:refereeIdx/positiveFeedback/:feedbackIdx',
        component: CoachingPositiveFeedbackEditPage, canActivate: [AuthGuard] },

  { path: 'competition/list', component: CompetitionListPage, canActivate: [AuthGuard] },
  { path: 'competition/import', component: CompetitionImportComponent, canActivate: [AuthGuard] },
  { path: 'competition/:id/home', component: CompetitionHomePage, canActivate: [AuthGuard] },
  { path: 'competition/:id/edit', component: CompetitionEditComponent, canActivate: [AuthGuard] },
  { path: 'competition/:id/coaches', component: CompetitionCoachesPage, canActivate: [AuthGuard] },
  { path: 'competition/:id/games', component: CompetitionGamesPage, canActivate: [AuthGuard] },
  { path: 'competition/:id/ranking', component: CompetitionRankingListComponent, canActivate: [AuthGuard] },
  { path: 'competition/:id/ranking/:listId', component: CompetitionRankingPage, canActivate: [AuthGuard] },
  { path: 'competition/:id/referees', component: CompetitionRefereesPage, canActivate: [AuthGuard] },
  { path: 'competition/:id/upgrades', component: CompetitionUpgradesPage, canActivate: [AuthGuard] },

  { path: 'home', component: HomePage, canActivate: [AuthGuard]},

  { path: 'pro/edit/:id', component: ProEditPage, canActivate: [AuthGuard] },
  { path: 'pro/list', component: ProListPage, canActivate: [AuthGuard] },

  { path: 'referee/list', component: RefereeListPage, canActivate: [AuthGuard] },
  { path: 'referee/view/:id', component: RefereeViewPage, canActivate: [AuthGuard] },
  { path: 'referee/import', component: RefereeImportComponent, canActivate: [AuthGuard] },
  { path: 'referee/upgrades', component: RefereeSeasonUpgradeComponent, canActivate: [AuthGuard] },
  // MODAL { path: 'referee/select', component: RefereeSelectPage, canActivate: [AuthGuard] },
  // MODAL { path: 'referee/edit/:id', component: RefereeEditPage, canActivate: [AuthGuard] },

  { path: 'settings', component: SettingsPage, canActivate: [AuthGuard]},

  { path: 'skillprofile/list', component: SkillProfileListPage, canActivate: [AuthGuard] },
  { path: 'skillprofile/create', component: SkillProfileEditPage, canActivate: [AuthGuard] },
  { path: 'skillprofile/:skillProfileid', component: SkillProfileEditPage, canActivate: [AuthGuard] },
  { path: 'skillprofile/:skillProfileid/skillset/:skillSetIdx', component: SkillSetEditPage, canActivate: [AuthGuard] },
  { path: 'skillprofile/:skillProfileid/skillset/:skillSetIdx/skill/:skillIdx', component: SkillEditPage, canActivate: [AuthGuard] },

  { path: 'user/login', component: UserLoginComponent},
  { path: 'user/create', component: UserEditPage},
  { path: 'user/waiting-validation', component: UserWaitingValidationPage},
  { path: 'user/edit/:id', component: UserEditPage, canActivate: [AuthGuard] },

  { path: 'xp/list', component: XpListComponent, canActivate: [AuthGuard]},
  { path: 'xp/edit/:id', component: XpEditComponent, canActivate: [AuthGuard]},
  { path: 'xp/create', component: XpEditComponent, canActivate: [AuthGuard]},

  { path: '', redirectTo: '/home', pathMatch: 'full' },

];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
