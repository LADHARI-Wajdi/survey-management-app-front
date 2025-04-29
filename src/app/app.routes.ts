import { Routes } from '@angular/router';

// Layouts
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

// Auth Components
import { LoginComponent } from './core/authentication/login/login.component';
import { RegisterComponent } from './core/authentication/register/register.component';
import { ForgotPasswordComponent } from './core/authentication/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './core/authentication/reset-password/reset-password.component';

// Admin Components
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';

// Feature Components
import { SurveyParticipantViewComponent } from './features/survey-taking/components/survey-participant-view/survey-participant-view.component';

// Guards
import { authGuard } from './core/guards/auth.guard';

// Access Denied Component
import { AccessDeniedComponent } from './shared/components/access-denied/access-denied.component';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
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
        path: 'surveys',
        loadChildren: () => import('./features/survey-management/survey-management.module').then(
          (m) => m.SurveyManagementModule
        ),
      },
      {
        path: 'question-bank',
        loadChildren: () => import('./features/question-bank/question-bank.module').then(
          (m) => m.QuestionBankModule
        ),
      },
      {
        path: 'analytics',
        loadChildren: () => import('./features/analytics/analytics.module').then(
          (m) => m.AnalyticsModule
        ),
        canActivate: [roleGuard],
        data: { roles: ['admin', 'investigator'] }
      },
      {
        path: 'distribution',
        loadChildren: () => import('./features/distribution/distribution.module').then(
          (m) => m.DistributionModule
        ),
        canActivate: [roleGuard],
        data: { roles: ['admin', 'investigator'] }
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
    data: { roles: ['admin'] },
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
    ],
  },
  {
    path: 'investigator',
    component: MainLayoutComponent,
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
    ],
  },
  {
    path: 'participant',
    component: MainLayoutComponent,
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
    redirectTo: '/dashboard',
  },
];