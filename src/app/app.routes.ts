import { Routes } from '@angular/router';

import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { InvestigatorLayoutComponent } from './layouts/investigator-layout/investigator-layout.component';

import { LoginComponent } from './core/authentication/login/login.component';
import { RegisterComponent } from './core/authentication/register/register.component';
import { ForgotPasswordComponent } from './core/authentication/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './core/authentication/reset-password/reset-password.component';

import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';

import { SurveyParticipantViewComponent } from './features/survey-taking/components/survey-participant-view/survey-participant-view.component';

import { authGuard } from './core/guards/auth.guard';

import { AccessDeniedComponent } from './shared/components/access-denied/access-denied.component';
import { roleGuard } from './core/guards/role.guard';
import { InvestigatorDashboardComponent } from './features/dashboards/components/investigator-dashboard/investigator-dashboard.component';
import { ParticipantDashboardComponent } from './features/dashboards/components/participant-dashboard/participant-dashboard.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';

export const AppRoutingModule: Routes = [
  { 
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboards/model/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path: 'question-bank',
        loadChildren: () => import('./features/question-bank/question-bank.module').then(
          (m) => m.QuestionBankModule
        ),
      },
    ]
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
      },
    ],
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: AdminDashboardComponent,
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./admin/components/user-management/user-management.module').then((m) => m.UserManagementModule),
      },
      {
        path: 'surveys',
        loadChildren: () => import('./features/survey-management/survey-management.module').then(
          (m) => m.SurveyManagementModule
        ),
        data: { title: 'Gestion des enquêtes' }
      },
      {
        path: 'distribution',
        loadChildren: () => import('./features/distribution/distribution.module').then(
          (m) => m.DistributionModule
        ),
        data: { title: 'Distribution' }
      },
      {
        path: 'analytics',
        loadChildren: () => import('./features/analytics/analytics.module').then(
          (m) => m.AnalyticsModule
        ),
        data: { title: 'Statistiques globales' }
      },
    ],
  },
  {
    path: 'investigator',
    component: InvestigatorLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin', 'investigator'] },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () => 
          import('./features/dashboards/model/investigator-dashboard.module').then(m => m.InvestigatorDashboardModule),
      },
      {
        path: 'surveys',
        loadChildren: () => import('./features/survey-management/survey-management.module').then(
          (m) => m.SurveyManagementModule
        ),
        data: { title: 'Mes enquêtes' }
      },
      {
        path: 'distribution',
        loadChildren: () => import('./features/distribution/distribution.module').then(
          (m) => m.DistributionModule
        ),
        data: { title: 'Distribution' }
      },
      {
        path: 'analytics',
        loadChildren: () => import('./features/analytics/analytics.module').then(
          (m) => m.AnalyticsModule
        ),
        data: { title: 'Statistiques' }
      },
    ],
  },
  {
    path: 'participant',
    component: ParticipantDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin', 'participant'] },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () => 
          import('./features/dashboards/model/participant-dashboard.module').then(m => m.ParticipantDashboardModule),
      },
    ],
  },
  {
    path: 'take-survey/:id',
    component: SurveyParticipantViewComponent,
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent,
  },
{
  path: '**',
  component: NotFoundComponent,
}

];