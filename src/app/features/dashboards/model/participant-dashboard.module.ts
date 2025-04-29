// features/dashboards/model/participant-dashboard.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ParticipantDashboardComponent } from '../components/participant-dashboard/participant-dashboard.component';
import { roleGuard } from '../../../core/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: ParticipantDashboardComponent,
    canActivate: [roleGuard],
    data: { roles: ['admin', 'participant'] }
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ParticipantDashboardModule { }