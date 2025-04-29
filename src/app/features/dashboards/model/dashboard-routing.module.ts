// src/app/features/dashboard/dashboard-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvestigatorDashboardComponent } from '../components/investigator-dashboard/investigator-dashboard.component';
import { ParticipantDashboardComponent } from '../components/participant-dashboard/participant-dashboard.component';
import { roleGuard } from '../../../core/guards/role.guard';
import { DashboardSelectorComponent } from '../components/dashboard-selector/dashboard-selector.component';

// Composants

// Guards

const routes: Routes = [
  {
    path: '',
    component: DashboardSelectorComponent,
    children: [
      {
        path: '',
        redirectTo: 'investigator',
        pathMatch: 'full'
      },
      {
        path: 'investigator',
        component: InvestigatorDashboardComponent,
        canActivate: [roleGuard],
        data: { 
          roles: ['admin', 'investigator'],
          title: 'Tableau de bord Investigateur'
        }
      },
      {
        path: 'participant',
        component: ParticipantDashboardComponent,
        canActivate: [roleGuard],
        data: { 
          roles: ['participant'],
          title: 'Tableau de bord Participant'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }