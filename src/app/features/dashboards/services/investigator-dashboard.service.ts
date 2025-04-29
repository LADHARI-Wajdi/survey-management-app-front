// src/app/features/investigator-dashboard/investigator-dashboard-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../../../core/guards/auth.guard';
import { roleGuard } from '../../../core/guards/role.guard';
import { SurveyDetailComponent } from '../../survey-management/components/survey-detail/survey-detail.component';
import { InvestigatorDashboardComponent } from '../components/investigator-dashboard/investigator-dashboard.component';
import { SurveyManagementModule } from '../../survey-management/survey-management.module';

const routes: Routes = [
  {
    path: '',
    component: InvestigatorDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { 
      title: 'Tableau de bord investigateur',
      roles: ['admin', 'investigator'] 
    },
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      },
      {
        path: 'overview',
        component: SurveyDetailComponent,
        data: { title: 'Vue d\'ensemble' }
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvestigatorDashboardRoutingModule { }