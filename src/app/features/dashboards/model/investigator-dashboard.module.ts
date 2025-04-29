// src/app/features/investigator-dashboard/investigator-dashboard.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InvestigatorDashboardRoutingModule } from './investigator-dashboard-routing.module';
import { InvestigatorDashboardComponent } from '../components/investigator-dashboard/investigator-dashboard.component';
import { SharedModule } from '../../../shared/shared.module';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    InvestigatorDashboardRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    SharedModule
  ],
  providers: [
    InvestigatorDashboardModule,
  ],
  exports: [

  ]
})
export class InvestigatorDashboardModule { }