// features/dashboards/model/dashboard.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthService } from '../../../core/authentication/services/auth.service';
import { CommonModule } from '@angular/common';
import { DashboardSelectorComponent } from '../components/dashboard-selector/dashboard-selector.component';

// Routes dynamiques qui seront déterminées par le rôle de l'utilisateur
const routes: Routes = [
  {
    path: '',
    component: DashboardSelectorComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DashboardSelectorComponent
  ],
  exports: [RouterModule],
  providers: [AuthService]
})
export class DashboardModule { }