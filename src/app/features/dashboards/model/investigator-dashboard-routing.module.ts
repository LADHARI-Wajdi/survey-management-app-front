// src/app/features/investigator-dashboard/investigator-dashboard-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvestigatorDashboardComponent } from '../components/investigator-dashboard/investigator-dashboard.component';
import { authGuard } from '../../../core/guards/auth.guard';
import { SurveyDetailComponent } from '../../survey-management/components/survey-detail/survey-detail.component';
import { SurveyCompletionComponent } from '../../survey-taking/components/survey-completion/survey-completion.component';
import { roleGuard } from '../../../core/guards/role.guard';

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
      {
        path: 'management',
        component: SurveyCompletionComponent,
        data: { title: 'Gestion des enquêtes' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvestigatorDashboardRoutingModule { }