import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Composants
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

// Guard
import { RoleGuard } from '../core/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: AdminDashboardComponent,
    data: { 
      title: 'Tableau de bord administrateur',
      roles: ['admin']
    }
  },
  {
    path: 'users',
    loadChildren: () => import('./components/user-management/user-management.module').then(m => m.UserManagementModule),
    canActivate: [RoleGuard],
    data: { 
      title: 'Gestion des utilisateurs',
      roles: ['admin']
    }
  },
  {
    path: 'surveys',
    loadChildren: () => import('../features/survey-management/survey-management.module').then(m => m.SurveyManagementModule),
    canActivate: [RoleGuard],
    data: { 
      title: 'Gestion des enquêtes',
      roles: ['admin']
    }
  },
  {
    path: 'analytics',
    loadChildren: () => import('../features/analytics/analytics.module').then(m => m.AnalyticsModule),
    canActivate: [RoleGuard],
    data: { 
      title: 'Statistiques globales',
      roles: ['admin']
    }
  },
  {
    path: 'settings',
    loadChildren: () => import('./components/user-management/user-management.module').then(m => m.UserManagementModule),
    canActivate: [RoleGuard],
    data: { 
      title: 'Paramètres du système',
      roles: ['admin']
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }