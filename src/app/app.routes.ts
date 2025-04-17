import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Layouts
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

// Guards

// Auth Components (for direct routing)
import { LoginComponent } from './core/authentication/login/login.component';
import { RegisterComponent } from './core/authentication/register/register.component';
import { ForgotPasswordComponent } from './core/authentication/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './core/authentication/reset-password/reset-password.component';

// Main Components
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { SurveyParticipantViewComponent } from './features/survey-taking/components/survey-participant-view/survey-participant-view.component';
import { authGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

const newLocal = './features/dashboard/dashboard.module';
export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import(newLocal).then(m => m.DashboardModule),
      },
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
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
    canActivate: [authGuard, RoleGuard],
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
          import(
            './admin/components/user-management/user-management.module'
          ).then((m) => m.UserManagementModule),
      },
    ],
  },
  {
    path: 'surveys',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/survey-management/survey-management.module').then(
        (m) => m.SurveyManagementModule
      ),
  },
  {
    path: 'question-bank',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/question-bank/question-bank.module').then(
        (m) => m.QuestionBankModule
      ),
  },
  {
    path: 'analytics',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/analytics/analytics.module').then(
        (m) => m.AnalyticsModule
      ),
  },
  {
    path: 'distribution',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/distribution/distribution.module').then(
        (m) => m.DistributionModule
      ),
  },
  {
    path: 'take-survey/:id',
    component: SurveyParticipantViewComponent,
  },
  {
    path: '**',
    redirectTo: '/dashboard',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
