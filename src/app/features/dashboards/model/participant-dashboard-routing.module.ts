// src/app/features/participant-dashboard/participant-dashboard-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParticipantDashboardComponent } from '../components/participant-dashboard/participant-dashboard.component';
import { authGuard } from '../../../core/guards/auth.guard';


const routes: Routes = [
  {
    path: '',
    component: ParticipantDashboardComponent,
    canActivate: [authGuard],
    data: { title: 'Tableau de bord participant' },
    children: [
      {
        path: '',
        redirectTo: 'available',
        pathMatch: 'full'
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParticipantDashboardRoutingModule { }